import { useState, useCallback, startTransition } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ClayCard, ClayInset } from "@/components/clay/ClayComponents";
import { ScrollReveal } from "@/components/motion/AnimationPrimitives";
import { ArrowLeft, Code, Star, GitFork, Loader2, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const repoData: Record<string, any> = {
  "next-commerce": { name: "next-commerce", lang: "TypeScript", stars: 1240, forks: 320, desc: "Full-stack e-commerce platform", files: 142, size: "4.2 MB" },
  "ai-chatbot": { name: "ai-chatbot", lang: "Python", stars: 890, forks: 155, desc: "Conversational AI with RAG pipeline", files: 87, size: "2.1 MB" },
  "design-system": { name: "design-system", lang: "TypeScript", stars: 560, forks: 90, desc: "React component library with Storybook", files: 234, size: "6.8 MB" },
  "api-gateway": { name: "api-gateway", lang: "Go", stars: 2100, forks: 430, desc: "High-performance API gateway & rate limiter", files: 56, size: "1.4 MB" },
  "ml-pipeline": { name: "ml-pipeline", lang: "Python", stars: 340, forks: 70, desc: "End-to-end ML training & deployment", files: 95, size: "3.7 MB" },
  "mobile-app": { name: "mobile-app", lang: "Dart", stars: 780, forks: 200, desc: "Cross-platform mobile app with Flutter", files: 178, size: "5.1 MB" },
};

type AnalyzeState = "idle" | "loading" | "success" | "error";

const RepoDetail = () => {
  const { repo } = useParams<{ repo: string }>();
  const navigate = useNavigate();
  const data = repo ? repoData[repo] : null;
  const [analyzeState, setAnalyzeState] = useState<AnalyzeState>("idle");
  const [progress, setProgress] = useState(0);
  const [analyzeCallInFlight, setAnalyzeCallInFlight] = useState(false);

  const handleAnalyze = useCallback(async () => {
    if (analyzeCallInFlight) return; // prevent duplicate
    setAnalyzeCallInFlight(true);
    setAnalyzeState("loading");
    setProgress(0);

    // Simulate progressive analysis
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) { clearInterval(interval); return 95; }
        return prev + Math.random() * 15;
      });
    }, 300);

    try {
      await new Promise((r) => setTimeout(r, 2500));
      clearInterval(interval);
      setProgress(100);
      setAnalyzeState("success");

      // Navigate to generate after short success state
      setTimeout(() => {
        startTransition(() => {
          navigate(`/generate/${repo}`);
        });
      }, 800);
    } catch {
      clearInterval(interval);
      setAnalyzeState("error");
      setAnalyzeCallInFlight(false);
    }
  }, [repo, navigate, analyzeCallInFlight]);

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 pt-24 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-4">Repository not found</h1>
          <Link to="/dashboard" className="text-primary hover:underline">← Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-6 pt-24 pb-16 max-w-3xl">
        <ScrollReveal>
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Repositories
          </Link>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <ClayCard hover={false} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="clay-card-sm p-2.5">
                <Code className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">{data.name}</h1>
                <p className="text-sm text-muted-foreground">{data.desc}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              {[
                { label: "Language", value: data.lang },
                { label: "Stars", value: data.stars.toLocaleString() },
                { label: "Files", value: data.files },
                { label: "Size", value: data.size },
              ].map((stat) => (
                <ClayInset key={stat.label} className="text-center">
                  <p className="font-display font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </ClayInset>
              ))}
            </div>
          </ClayCard>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <ClayCard hover={false} className="text-center">
            <h2 className="font-display text-lg font-semibold text-foreground mb-2">Ready to Analyze</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Our AI will scan the codebase and detect the tech stack, architecture, and project structure.
            </p>

            {/* Progress bar during loading */}
            <AnimatePresence>
              {analyzeState === "loading" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <Progress value={progress} className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground">Analyzing {Math.round(progress)}% complete...</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Analyze button with all states */}
            <motion.button
              whileHover={analyzeState === "idle" ? { scale: 1.02 } : {}}
              whileTap={analyzeState === "idle" ? { scale: 0.96 } : {}}
              onClick={handleAnalyze}
              disabled={analyzeState !== "idle" && analyzeState !== "error"}
              className={`clay-button px-8 py-3.5 font-display font-semibold text-base inline-flex items-center gap-2 
                ${analyzeState === "loading" ? "opacity-70 pointer-events-none" : ""}
                ${analyzeState === "success" ? "!bg-green-500" : ""}
                ${analyzeState === "error" ? "animate-shake" : ""}
              `}
              aria-label="Analyze repository"
            >
              {analyzeState === "idle" && (
                <><Sparkles className="w-5 h-5" /> Analyze & Generate</>
              )}
              {analyzeState === "loading" && (
                <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</>
              )}
              {analyzeState === "success" && (
                <><CheckCircle2 className="w-5 h-5" /> Done!</>
              )}
              {analyzeState === "error" && (
                <><AlertCircle className="w-5 h-5" /> Retry Analysis</>
              )}
            </motion.button>

            <AnimatePresence>
              {analyzeState === "error" && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-destructive text-sm mt-4"
                >
                  Analysis failed. Please try again.
                </motion.p>
              )}
            </AnimatePresence>
          </ClayCard>
        </ScrollReveal>
      </main>
      <Footer />
    </div>
  );
};

export default RepoDetail;
