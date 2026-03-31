import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function fetchFileContent(
  repoFullName: string,
  filePath: string,
  branch: string,
  githubToken: string,
): Promise<string> {
  const resp = await fetch(
    `https://api.github.com/repos/${repoFullName}/contents/${filePath}?ref=${branch}`,
    {
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: "application/vnd.github.v3.raw",
      },
    },
  );
  if (!resp.ok) return `[Could not fetch ${filePath}: ${resp.status}]`;
  return await resp.text();
}

async function createDocsPR(
  docsRepo: string,
  branch: string,
  files: Record<string, string>,
  prTitle: string,
  prBody: string,
  githubToken: string,
): Promise<string | null> {
  const headers = {
    Authorization: `token ${githubToken}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };

  // Get default branch ref
  const repoResp = await fetch(`https://api.github.com/repos/${docsRepo}`, { headers });
  if (!repoResp.ok) {
    console.error("Failed to get docs repo:", await repoResp.text());
    return null;
  }
  const repoData = await repoResp.json();
  const defaultBranch = repoData.default_branch;

  // Get latest commit SHA
  const refResp = await fetch(
    `https://api.github.com/repos/${docsRepo}/git/ref/heads/${defaultBranch}`,
    { headers },
  );
  if (!refResp.ok) {
    console.error("Failed to get ref:", await refResp.text());
    return null;
  }
  const refData = await refResp.json();
  const baseSha = refData.object.sha;

  // Create new branch
  const branchName = `autodocs/${Date.now()}`;
  const createBranchResp = await fetch(
    `https://api.github.com/repos/${docsRepo}/git/refs`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha: baseSha }),
    },
  );
  if (!createBranchResp.ok) {
    console.error("Failed to create branch:", await createBranchResp.text());
    return null;
  }

  // Create/update files on the new branch
  for (const [path, content] of Object.entries(files)) {
    // Check if file exists
    const existingResp = await fetch(
      `https://api.github.com/repos/${docsRepo}/contents/${path}?ref=${branchName}`,
      { headers },
    );
    const body: Record<string, string> = {
      message: `docs: update ${path}`,
      content: btoa(unescape(encodeURIComponent(content))),
      branch: branchName,
    };
    if (existingResp.ok) {
      const existing = await existingResp.json();
      body.sha = existing.sha;
    } else {
      await existingResp.text(); // consume body
    }

    const updateResp = await fetch(
      `https://api.github.com/repos/${docsRepo}/contents/${path}`,
      { method: "PUT", headers, body: JSON.stringify(body) },
    );
    if (!updateResp.ok) {
      console.error(`Failed to update ${path}:`, await updateResp.text());
    } else {
      await updateResp.text(); // consume body
    }
  }

  // Create PR
  const prResp = await fetch(`https://api.github.com/repos/${docsRepo}/pulls`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      title: prTitle,
      body: prBody,
      head: branchName,
      base: defaultBranch,
    }),
  });
  if (!prResp.ok) {
    console.error("Failed to create PR:", await prResp.text());
    return null;
  }
  const prData = await prResp.json();
  return prData.html_url;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const { generation_id } = await req.json();
    if (!generation_id) {
      return new Response(JSON.stringify({ error: "Missing generation_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get generation record
    const { data: gen, error: genErr } = await supabase
      .from("doc_generations")
      .select("*, repos(*)")
      .eq("id", generation_id)
      .single();

    if (genErr || !gen) {
      return new Response(JSON.stringify({ error: "Generation not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Update status to processing
    await supabase
      .from("doc_generations")
      .update({ status: "processing" })
      .eq("id", generation_id);

    // Get user's GitHub token
    const { data: profile } = await supabase
      .from("profiles")
      .select("github_token")
      .eq("user_id", gen.user_id)
      .single();

    if (!profile?.github_token) {
      await supabase
        .from("doc_generations")
        .update({ status: "failed", error_message: "No GitHub token configured" })
        .eq("id", generation_id);
      return new Response(JSON.stringify({ error: "No GitHub token" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const repo = gen.repos;
    const changedFiles = gen.changed_files as string[];

    // Fetch file contents from GitHub
    const fileContents: Record<string, string> = {};
    for (const file of changedFiles.slice(0, 20)) {
      // Limit to 20 files
      fileContents[file] = await fetchFileContent(
        repo.repo_full_name,
        file,
        repo.default_branch,
        profile.github_token,
      );
    }

    // Build prompt for AI
    const filesSummary = Object.entries(fileContents)
      .map(([path, content]) => `### ${path}\n\`\`\`\n${content.slice(0, 3000)}\n\`\`\``)
      .join("\n\n");

    const aiPrompt = `You are a technical documentation generator. Analyze these changed source code files and generate/update API documentation in Markdown format.

For each file, produce documentation that:
1. Describes what the module/file does and WHY it exists
2. Documents all exported functions/classes with their signatures, parameters, return types
3. Includes usage examples where helpful
4. Notes any important side effects, error handling, or edge cases

Changed files from repository ${repo.repo_full_name}:

${filesSummary}

Return a JSON object where keys are documentation file paths (e.g., "docs/auth.md") and values are the full Markdown content for that doc file. Group related files into single doc pages. Use descriptive filenames.

Return ONLY valid JSON, no other text.`;

    // Call Lovable AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      await supabase
        .from("doc_generations")
        .update({ status: "failed", error_message: "AI not configured" })
        .eq("id", generation_id);
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a technical documentation generator. Always respond with valid JSON only." },
          { role: "user", content: aiPrompt },
        ],
      }),
    });

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      console.error("AI error:", aiResp.status, errText);
      const errorMsg = aiResp.status === 429 ? "AI rate limited, try again later" :
                       aiResp.status === 402 ? "AI credits exhausted" :
                       `AI error: ${aiResp.status}`;
      await supabase
        .from("doc_generations")
        .update({ status: "failed", error_message: errorMsg })
        .eq("id", generation_id);
      return new Response(JSON.stringify({ error: errorMsg }), {
        status: aiResp.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResp.json();
    const aiContent = aiData.choices?.[0]?.message?.content || "";

    // Parse AI response - extract JSON from response
    let docFiles: Record<string, string>;
    try {
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in AI response");
      docFiles = JSON.parse(jsonMatch[0]);
    } catch (parseErr) {
      console.error("Failed to parse AI response:", parseErr);
      await supabase
        .from("doc_generations")
        .update({
          status: "failed",
          error_message: "Failed to parse AI-generated docs",
          generated_docs: { raw: aiContent },
        })
        .eq("id", generation_id);
      return new Response(JSON.stringify({ error: "Failed to parse AI response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create PR in docs repo
    const prTitle = gen.pr_number
      ? `docs: Auto-update from PR #${gen.pr_number}`
      : `docs: Auto-update from ${gen.commit_sha?.slice(0, 7) || "latest"}`;
    const prBody = `## AutoDocs Update\n\nThis PR was automatically generated by AutoDocs.\n\n**Source:** ${repo.repo_full_name}\n**Changed files:** ${changedFiles.length}\n**Updated docs:** ${Object.keys(docFiles).join(", ")}\n\n---\n_Review and merge to update your documentation._`;

    const prUrl = await createDocsPR(
      repo.docs_repo_full_name,
      repo.default_branch,
      docFiles,
      prTitle,
      prBody,
      profile.github_token,
    );

    // Update generation record
    await supabase
      .from("doc_generations")
      .update({
        status: prUrl ? "completed" : "failed",
        generated_docs: docFiles,
        docs_pr_url: prUrl,
        error_message: prUrl ? null : "Failed to create docs PR",
      })
      .eq("id", generation_id);

    return new Response(
      JSON.stringify({ success: true, pr_url: prUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("Generate docs error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
