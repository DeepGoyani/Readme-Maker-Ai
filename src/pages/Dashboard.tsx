import { useState, useCallback, memo, startTransition, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { reposAPI, authAPI } from "@/services/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ClayCard, ClayInset } from "@/components/clay/ClayComponents";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/motion/AnimationPrimitives";
import { Search, Star, GitFork, Code, Loader2, AlertCircle, User, FileText, Download, Copy } from "lucide-react";

interface Repo {
  id: number;
  name: string;
  fullName: string;
  description: string;
  language: string | null;
  stars: number;
  forks: number;
  private: boolean;
}

const langColors: Record<string, string> = {
  TypeScript: "bg-blue-400",
  JavaScript: "bg-yellow-400",
  Python: "bg-green-400",
  Go: "bg-cyan-400",
  Rust: "bg-orange-400",
  Java: "bg-red-400",
  "C++": "bg-purple-400",
  Ruby: "bg-pink-400",
  PHP: "bg-indigo-400",
  Dart: "bg-sky-400",
  Swift: "bg-orange-300",
  Kotlin: "bg-purple-300",
};

const RepoCard = memo(({ repo, isNavigating }: { repo: Repo; isNavigating: boolean }) => {
  const navigate = useNavigate();
  const [hovering, setHovering] = useState(false);

  const handleClick = () => {
    if (isNavigating) return;
    startTransition(() => {
      navigate(`/generate/${encodeURIComponent(repo.fullName)}`);
    });
  };

  return (
    <motion.div
      onHoverStart={() => setHovering(true)}
      onHoverEnd={() => setHovering(false)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.18 }}
    >
      <ClayCard className="cursor-pointer group" hover={false}>
        <button onClick={handleClick} className="w-full text-left" disabled={isNavigating}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-primary" />
              <h3 className="font-display font-semibold text-foreground text-sm">{repo.name}</h3>
              {repo.private && <span className="text-xs bg-muted px-2 py-0.5 rounded">Private</span>}
            </div>
            <div className={`w-2.5 h-2.5 rounded-full ${langColors[repo.language || ''] || "bg-muted-foreground"}`} />
          </div>
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed line-clamp-2">
            {repo.description || "No description"}
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Star className="w-3 h-3" />{repo.stars}</span>
            <span className="flex items-center gap-1"><GitFork className="w-3 h-3" />{repo.forks}</span>
            {repo.language && <span>{repo.language}</span>}
          </div>
        </button>
      </ClayCard>
    </motion.div>
  );
});
RepoCard.displayName = "RepoCard";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [profileReadme, setProfileReadme] = useState<string | null>(null);
  const [isGeneratingProfile, setIsGeneratingProfile] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await reposAPI.getAll();
        setRepos(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch repositories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepos();
  }, []);

  const handleGenerateProfileReadme = async () => {
    try {
      setIsGeneratingProfile(true);
      const response = await authAPI.getProfileReadme();
      setProfileReadme(response.readme);
      setShowProfileModal(true);
    } catch (err: any) {
      setError(err.message || "Failed to generate profile README");
    } finally {
      setIsGeneratingProfile(false);
    }
  };

  const handleCopyReadme = () => {
    if (profileReadme) {
      navigator.clipboard.writeText(profileReadme);
    }
  };

  const handleDownloadReadme = () => {
    if (profileReadme) {
      const blob = new Blob([profileReadme], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'README.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const filteredReposList = repos.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-6 pt-24 pb-16">
        <ScrollReveal>
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
                  Welcome, {user?.username || "Developer"}
                </h1>
                <p className="text-muted-foreground">Select a repository to generate its README</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleGenerateProfileReadme}
                disabled={isGeneratingProfile}
                className="clay-button px-6 py-3 font-display font-semibold text-base flex items-center gap-2 disabled:opacity-70"
              >
                {isGeneratingProfile ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <User className="w-4 h-4" />
                )}
                {isGeneratingProfile ? "Generating..." : "Generate Profile README"}
              </motion.button>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="clay-card-sm flex items-center gap-3 px-5 py-3 max-w-md mb-8">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground text-sm"
              aria-label="Search repositories"
            />
          </div>
        </ScrollReveal>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="text-destructive mb-2">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" staggerDelay={0.08}>
              {filteredReposList.map((repo) => (
                <StaggerItem key={repo.id}>
                  <RepoCard repo={repo} isNavigating={false} />
                </StaggerItem>
              ))}
            </StaggerContainer>

            {filteredReposList.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground">
                  {searchQuery ? `No repositories found matching "${searchQuery}"` : "No repositories found"}
                </p>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />

      {/* Profile README Modal */}
      <AnimatePresence>
        {showProfileModal && profileReadme && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowProfileModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-background rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden clay-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Your Professional Profile README
                </h2>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <pre className="bg-muted rounded-lg p-4 text-sm text-foreground whitespace-pre-wrap font-mono">
                  {profileReadme}
                </pre>
              </div>
              
              <div className="p-6 border-t border-border flex items-center justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleCopyReadme}
                  className="clay-button px-4 py-2 font-display font-semibold text-sm flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleDownloadReadme}
                  className="clay-button px-4 py-2 font-display font-semibold text-sm flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
