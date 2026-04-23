import { useState, useCallback, memo, startTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ClayCard, ClayInset } from "@/components/clay/ClayComponents";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/motion/AnimationPrimitives";
import { Search, Star, GitFork, Code, Loader2 } from "lucide-react";

const mockRepos = [
  { id: "next-commerce", name: "next-commerce", lang: "TypeScript", stars: 1240, forks: 320, desc: "Full-stack e-commerce platform" },
  { id: "ai-chatbot", name: "ai-chatbot", lang: "Python", stars: 890, forks: 155, desc: "Conversational AI with RAG pipeline" },
  { id: "design-system", name: "design-system", lang: "TypeScript", stars: 560, forks: 90, desc: "React component library with Storybook" },
  { id: "api-gateway", name: "api-gateway", lang: "Go", stars: 2100, forks: 430, desc: "High-performance API gateway & rate limiter" },
  { id: "ml-pipeline", name: "ml-pipeline", lang: "Python", stars: 340, forks: 70, desc: "End-to-end ML training & deployment" },
  { id: "mobile-app", name: "mobile-app", lang: "Dart", stars: 780, forks: 200, desc: "Cross-platform mobile app with Flutter" },
];

const langColors: Record<string, string> = {
  TypeScript: "bg-blue-400",
  Python: "bg-yellow-400",
  Go: "bg-cyan-400",
  Dart: "bg-sky-400",
};

const RepoCard = memo(({ repo, isNavigating }: { repo: typeof mockRepos[0]; isNavigating: boolean }) => {
  const navigate = useNavigate();
  const [hovering, setHovering] = useState(false);

  const handleClick = () => {
    if (isNavigating) return;
    startTransition(() => {
      navigate(`/dashboard/${repo.id}`);
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
            </div>
            <div className={`w-2.5 h-2.5 rounded-full ${langColors[repo.lang] || "bg-muted-foreground"}`} />
          </div>
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{repo.desc}</p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Star className="w-3 h-3" />{repo.stars}</span>
            <span className="flex items-center gap-1"><GitFork className="w-3 h-3" />{repo.forks}</span>
          </div>
        </button>
      </ClayCard>
    </motion.div>
  );
});
RepoCard.displayName = "RepoCard";

const Dashboard = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isNavigating] = useState(false);

  const filteredRepos = mockRepos.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-6 pt-24 pb-16">
        <ScrollReveal>
          <div className="mb-10">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Welcome, {user?.name?.split(" ")[0] || "Developer"}
            </h1>
            <p className="text-muted-foreground">Select a repository to generate its README</p>
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

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" staggerDelay={0.08}>
          {filteredRepos.map((repo) => (
            <StaggerItem key={repo.id}>
              <RepoCard repo={repo} isNavigating={isNavigating} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {filteredRepos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No repositories found matching "{searchQuery}"</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
