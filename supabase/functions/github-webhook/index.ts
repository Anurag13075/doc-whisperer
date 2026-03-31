import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const repoId = url.searchParams.get("repo_id");
    const webhookSecret = url.searchParams.get("secret");

    if (!repoId || !webhookSecret) {
      return new Response(JSON.stringify({ error: "Missing repo_id or secret" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Validate webhook secret
    const { data: repo, error: repoError } = await supabase
      .from("repos")
      .select("*")
      .eq("id", repoId)
      .eq("webhook_secret", webhookSecret)
      .eq("is_active", true)
      .single();

    if (repoError || !repo) {
      return new Response(JSON.stringify({ error: "Invalid repo or secret" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { changed_files, pr_number, commit_sha } = body;

    if (!changed_files || !Array.isArray(changed_files) || changed_files.length === 0) {
      return new Response(JSON.stringify({ error: "No changed_files provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create a doc generation record
    const { data: generation, error: genError } = await supabase
      .from("doc_generations")
      .insert({
        repo_id: repoId,
        user_id: repo.user_id,
        pr_number: pr_number || null,
        commit_sha: commit_sha || null,
        status: "pending",
        changed_files,
      })
      .select()
      .single();

    if (genError) {
      console.error("Failed to create generation:", genError);
      return new Response(JSON.stringify({ error: "Failed to create generation record" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Trigger the generate-docs function asynchronously
    const generateUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/generate-docs`;
    fetch(generateUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
      },
      body: JSON.stringify({ generation_id: generation.id }),
    }).catch((err) => console.error("Failed to trigger generate-docs:", err));

    return new Response(
      JSON.stringify({ success: true, generation_id: generation.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("Webhook error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
