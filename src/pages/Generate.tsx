import { useState, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ClayCard, ClayInset } from "@/components/clay/ClayComponents";
import { ScrollReveal } from "@/components/motion/AnimationPrimitives";
import {
  ArrowLeft, Copy, Download, Check, Loader2, RefreshCw, FileText, Eye, Code2
} from "lucide-react";

const generateReadme = (repo: string) => `# ${repo}

> A modern, production-ready application

![Build](https://img.shields.io/badge/build-passing-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![Version](https://img.shields.io/badge/version-2.1.0-purple)

## ✨ Features

- 🚀 Lightning-fast performance with optimized builds
- 🔐 Enterprise-grade security with JWT authentication
- 📱 Fully responsive across all devices
- 🧪 Comprehensive test coverage (95%+)
- 📖 Auto-generated API documentation

## 🛠 Tech Stack

| Category | Technologies |
|----------|-------------|
| Frontend | React, TypeScript, Tailwind CSS |
| Backend  | Node.js, Express, PostgreSQL |
| DevOps   | Docker, GitHub Actions, AWS |

## 🚀 Quick Start

\`\`\`bash
git clone https://github.com/user/${repo}.git
cd ${repo}
npm install
npm run dev
\`\`\`

## 📄 License

MIT © ${new Date().getFullYear()}
`;

type TabType = "raw" | "preview";

const Generate = () => {
  const { repo } = useParams<{ repo: string }>();
  const [activeTab, setActiveTab] = useState<TabType>("raw");
  const [markdown, setMarkdown] = useState(() => generateReadme(repo || "project"));
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [downloadPulse, setDownloadPulse] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const regenerateGuard = useRef(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = markdown;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }, [markdown]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    a.click();
    URL.revokeObjectURL(url);
    setDownloadPulse(true);
    setTimeout(() => setDownloadPulse(false), 1000);
  }, [markdown]);

  const handleRegenerate = useCallback(async () => {
    if (regenerateGuard.current) return;
    regenerateGuard.current = true;
    setIsRegenerating(true);

    await new Promise((r) => setTimeout(r, 2000));
    setMarkdown(generateReadme(repo || "project"));
    setIsRegenerating(false);
    regenerateGuard.current = false;

    // Scroll to top smoothly
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [repo]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-6 pt-24 pb-16 max-w-4xl">
        <ScrollReveal>
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <Link to={`/dashboard/${repo}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2">
                <ArrowLeft className="w-4 h-4" /> Back to {repo}
              </Link>
              <h1 className="font-display text-2xl font-bold text-foreground">
                {repo}/README.md
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {/* Copy */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className={`clay-card-sm px-4 py-2 text-sm font-medium inline-flex items-center gap-2 transition-colors ${
                  copied ? "text-green-600" : "text-foreground"
                }`}
                aria-label="Copy markdown"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy"}
              </motion.button>

              {/* Download */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={downloadPulse ? { scale: [1, 1.1, 1] } : {}}
                onClick={handleDownload}
                className="clay-card-sm px-4 py-2 text-sm font-medium text-foreground inline-flex items-center gap-2"
                aria-label="Download markdown"
              >
                <Download className="w-4 h-4" /> Download
              </motion.button>

              {/* Regenerate */}
              <motion.button
                whileHover={{ scale: isRegenerating ? 1 : 1.05 }}
                whileTap={{ scale: isRegenerating ? 1 : 0.95 }}
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="clay-button px-4 py-2 text-sm font-display font-semibold inline-flex items-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
                aria-label="Regenerate README"
              >
                {isRegenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                {isRegenerating ? "Regenerating..." : "Regenerate"}
              </motion.button>
            </div>
          </div>
        </ScrollReveal>

        {/* Tab toggle */}
        <ScrollReveal delay={0.1}>
          <div className="clay-card-sm inline-flex p-1 mb-6 gap-1">
            {[
              { key: "raw" as TabType, label: "Raw", icon: Code2 },
              { key: "preview" as TabType, label: "Preview", icon: Eye },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Content area */}
        <ScrollReveal delay={0.15}>
          <ClayCard hover={false}>
            <div ref={contentRef} className="max-h-[600px] overflow-auto">
              <ClayInset className="min-h-[400px]">
                <AnimatePresence mode="wait">
                  {isRegenerating ? (
                    <motion.div
                      key="regenerating"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center h-[400px]"
                    >
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </motion.div>
                  ) : activeTab === "raw" ? (
                    <motion.pre
                      key="raw"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-mono text-foreground whitespace-pre-wrap leading-relaxed"
                    >
                      {markdown}
                    </motion.pre>
                  ) : (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="prose prose-sm max-w-none text-foreground"
                    >
                      {/* Simple rendered preview */}
                      {markdown.split("\n").map((line, i) => {
                        if (line.startsWith("# ")) return <h1 key={i} className="font-display text-2xl font-bold mb-3">{line.slice(2)}</h1>;
                        if (line.startsWith("## ")) return <h2 key={i} className="font-display text-lg font-semibold mt-6 mb-2 text-primary">{line.slice(3)}</h2>;
                        if (line.startsWith("> ")) return <blockquote key={i} className="border-l-4 border-primary/30 pl-4 text-muted-foreground italic my-2">{line.slice(2)}</blockquote>;
                        if (line.startsWith("- ")) return <li key={i} className="ml-4 text-sm">{line.slice(2)}</li>;
                        if (line.startsWith("|")) return <p key={i} className="font-mono text-xs text-muted-foreground">{line}</p>;
                        if (line.startsWith("```")) return null;
                        if (line.startsWith("![")) return <p key={i} className="text-xs text-muted-foreground">{line}</p>;
                        if (line.trim() === "") return <br key={i} />;
                        return <p key={i} className="text-sm">{line}</p>;
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </ClayInset>
            </div>
          </ClayCard>
        </ScrollReveal>
      </main>
      <Footer />
    </div>
  );
};

export default Generate;
