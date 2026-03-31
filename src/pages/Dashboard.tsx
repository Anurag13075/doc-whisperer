import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Plus, Copy, ExternalLink, Loader2, LogOut, GitBranch, FileText, Settings, Trash2 } from "lucide-react";

interface Repo {
  id: string;
  repo_full_name: string;
  docs_repo_full_name: string;
  default_branch: string;
  webhook_secret: string;
  is_active: boolean;
  created_at: string;
}

interface DocGeneration {
  id: string;
  repo_id: string;
  pr_number: number | null;
  commit_sha: string | null;
  status: string;
  docs_pr_url: string | null;
  error_message: string | null;
  created_at: string;
  changed_files: string[];
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [generations, setGenerations] = useState<DocGeneration[]>([]);
  const [githubToken, setGithubToken] = useState("");
  const [hasToken, setHasToken] = useState(false);
  const [showAddRepo, setShowAddRepo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [newRepo, setNewRepo] = useState({ repo: "", docsRepo: "", branch: "main" });
  const [loading, setLoading] = useState(true);

  const WEBHOOK_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/github-webhook`;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [reposRes, profileRes] = await Promise.all([
      supabase.from("repos").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("github_token").eq("user_id", user!.id).single(),
    ]);

    if (reposRes.data) setRepos(reposRes.data as Repo[]);
    if (profileRes.data?.github_token) setHasToken(true);

    if (reposRes.data && reposRes.data.length > 0) {
      const repoIds = reposRes.data.map((r: Repo) => r.id);
      const { data: gens } = await supabase
        .from("doc_generations")
        .select("*")
        .in("repo_id", repoIds)
        .order("created_at", { ascending: false })
        .limit(50);
      if (gens) setGenerations(gens as DocGeneration[]);
    }
    setLoading(false);
  };

  const saveGithubToken = async () => {
    const { error } = await supabase
      .from("profiles")
      .update({ github_token: githubToken })
      .eq("user_id", user!.id);
    if (error) {
      toast.error("Failed to save token");
    } else {
      setHasToken(true);
      setGithubToken("");
      toast.success("GitHub token saved!");
    }
  };

  const addRepo = async () => {
    if (!newRepo.repo || !newRepo.docsRepo) {
      toast.error("Fill in both repo fields");
      return;
    }
    const { error } = await supabase.from("repos").insert({
      user_id: user!.id,
      repo_full_name: newRepo.repo,
      docs_repo_full_name: newRepo.docsRepo,
      default_branch: newRepo.branch || "main",
    });
    if (error) {
      toast.error("Failed to add repo");
    } else {
      toast.success("Repository added!");
      setShowAddRepo(false);
      setNewRepo({ repo: "", docsRepo: "", branch: "main" });
      loadData();
    }
  };

  const deleteRepo = async (id: string) => {
    const { error } = await supabase.from("repos").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else loadData();
  };

  const copyWebhookUrl = (repo: Repo) => {
    const url = `${WEBHOOK_BASE}?repo_id=${repo.id}&secret=${repo.webhook_secret}`;
    navigator.clipboard.writeText(url);
    toast.success("Webhook URL copied!");
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-primary";
      case "failed": return "text-destructive";
      case "processing": return "text-accent-foreground";
      default: return "text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto flex items-center justify-between h-16 px-6">
          <h1 className="font-heading font-bold text-lg">
            auto<span className="text-primary">docs</span>
          </h1>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); }}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Settings panel */}
        {showSettings && (
          <div className="mb-8 rounded-xl border border-border bg-card p-6">
            <h2 className="font-heading font-semibold mb-4">Settings</h2>
            <div className="space-y-3">
              <Label>GitHub Personal Access Token</Label>
              <p className="text-xs text-muted-foreground">
                Needs <code className="text-primary">repo</code> scope. {hasToken && "✓ Token saved"}
              </p>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder={hasToken ? "••••••••" : "ghp_..."}
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                />
                <Button variant="hero" size="sm" onClick={saveGithubToken} disabled={!githubToken}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* No token warning */}
        {!hasToken && (
          <div className="mb-8 rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
            <p className="text-sm text-foreground mb-3">
              You need to add your GitHub token before adding repos.
            </p>
            <Button variant="heroOutline" size="sm" onClick={() => setShowSettings(true)}>
              <Settings className="w-4 h-4 mr-2" /> Add GitHub Token
            </Button>
          </div>
        )}

        {/* Repos */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl font-bold">Repositories</h2>
          <Button variant="hero" size="sm" onClick={() => setShowAddRepo(true)} disabled={!hasToken}>
            <Plus className="w-4 h-4 mr-1" /> Add Repo
          </Button>
        </div>

        {showAddRepo && (
          <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-6 space-y-4">
            <div>
              <Label>Source Repository</Label>
              <Input
                placeholder="owner/repo"
                value={newRepo.repo}
                onChange={(e) => setNewRepo({ ...newRepo, repo: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Docs Repository</Label>
              <Input
                placeholder="owner/docs-repo"
                value={newRepo.docsRepo}
                onChange={(e) => setNewRepo({ ...newRepo, docsRepo: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Default Branch</Label>
              <Input
                placeholder="main"
                value={newRepo.branch}
                onChange={(e) => setNewRepo({ ...newRepo, branch: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="hero" size="sm" onClick={addRepo}>Add Repository</Button>
              <Button variant="ghost" size="sm" onClick={() => setShowAddRepo(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {repos.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <GitBranch className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No repositories added yet.</p>
          </div>
        ) : (
          <div className="space-y-4 mb-12">
            {repos.map((repo) => (
              <div key={repo.id} className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-heading font-semibold">{repo.repo_full_name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Docs → {repo.docs_repo_full_name} · {repo.default_branch}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => copyWebhookUrl(repo)} title="Copy webhook URL">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteRepo(repo.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                {/* GitHub Action snippet */}
                <details className="mt-4">
                  <summary className="text-xs text-primary cursor-pointer font-mono">
                    View GitHub Action setup
                  </summary>
                  <pre className="code-block mt-2 text-xs overflow-x-auto">
{`# .github/workflows/autodocs.yml
name: AutoDocs
on:
  push:
    branches: [${repo.default_branch}]

jobs:
  autodocs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2
      - name: Get changed files
        id: changed
        run: |
          FILES=$(git diff --name-only HEAD~1 HEAD | jq -R -s -c 'split("\\n") | map(select(. != ""))')
          echo "files=$FILES" >> $GITHUB_OUTPUT
      - name: Trigger AutoDocs
        run: |
          curl -X POST "${WEBHOOK_BASE}?repo_id=${repo.id}&secret=${repo.webhook_secret}" \\
            -H "Content-Type: application/json" \\
            -d '{"changed_files": '\${{ steps.changed.outputs.files }}', "commit_sha": "\${{ github.sha }}"}'`}
                  </pre>
                </details>
              </div>
            ))}
          </div>
        )}

        {/* Generations */}
        {generations.length > 0 && (
          <>
            <h2 className="font-heading text-xl font-bold mb-6">Recent Generations</h2>
            <div className="space-y-3">
              {generations.map((gen) => {
                const repo = repos.find((r) => r.id === gen.repo_id);
                return (
                  <div key={gen.id} className="rounded-lg border border-border bg-card p-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-mono">
                          {repo?.repo_full_name || "Unknown"}
                        </span>
                        <span className={`text-xs font-mono ${statusColor(gen.status)}`}>
                          {gen.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {gen.pr_number ? `PR #${gen.pr_number}` : gen.commit_sha?.slice(0, 7) || ""} ·{" "}
                        {gen.changed_files?.length || 0} files ·{" "}
                        {new Date(gen.created_at).toLocaleDateString()}
                      </p>
                      {gen.error_message && (
                        <p className="text-xs text-destructive mt-1">{gen.error_message}</p>
                      )}
                    </div>
                    {gen.docs_pr_url && (
                      <a href={gen.docs_pr_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4 mr-1" /> View PR
                        </Button>
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
