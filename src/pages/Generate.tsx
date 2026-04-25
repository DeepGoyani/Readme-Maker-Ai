import { useState, useCallback, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { generateAPI } from "@/services/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ClayCard, ClayInset } from "@/components/clay/ClayComponents";
import { ScrollReveal } from "@/components/motion/AnimationPrimitives";
import {
  ArrowLeft, Copy, Download, Check, Loader2, RefreshCw, Eye, Code2, Sparkles, AlertCircle
} from "lucide-react";

type TabType = "raw" | "preview";
type TemplateType = "modern" | "minimal" | "detailed" | "premium";

const Generate = () => {
  const { repo } = useParams<{ repo: string }>();
  const decodedRepo = repo ? decodeURIComponent(repo) : "";
  const [activeTab, setActiveTab] = useState<TabType>("raw");
  const [template, setTemplate] = useState<TemplateType>("modern");
  const [markdown, setMarkdown] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadPulse, setDownloadPulse] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const regenerateGuard = useRef(false);

  const [owner, repoName] = decodedRepo.split("/");

  useEffect(() => {
    if (owner && repoName) {
      handleGenerate();
    }
  }, [owner, repoName, decodedRepo]);

  const handleGenerate = async () => {
    if (!owner || !repoName) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await generateAPI.generate({
        owner,
        repo: repoName,
        template
      });
      setMarkdown(result.content);
    } catch (err: any) {
      setError(err.message || "Failed to generate README");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = useCallback(async () => {
    if (!markdown) return;
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
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
    if (!markdown) return;
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
    if (regenerateGuard.current || !owner || !repoName) return;
    regenerateGuard.current = true;
    setIsRegenerating(true);
    setError(null);

    try {
      const result = await generateAPI.generate({
        owner,
        repo: repoName,
        template
      });
      setMarkdown(result.content);
      contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setError(err.message || "Failed to regenerate README");
    } finally {
      setIsRegenerating(false);
      regenerateGuard.current = false;
    }
  }, [owner, repoName, template]);

  const handleTemplateChange = (newTemplate: TemplateType) => {
    setTemplate(newTemplate);
    handleRegenerate();
  };

  const renderPreview = (content: string) => {
    const lines = content.split("\n");
    const elements: JSX.Element[] = [];
    let i = 0;
    
    while (i < lines.length) {
      const line = lines[i];
      
      // Handle HTML divs - convert to centered content
      if (line.includes("<div align=\"center\">")) {
        elements.push(<div key={i} className="text-center my-6"></div>);
        i++;
        continue;
      }
      if (line.includes("</div>")) {
        // Skip closing div as it's handled above
        i++;
        continue;
      }
      
      // Handle main title with emoji
      if (line.startsWith("# 🚀")) {
        elements.push(<h1 key={i} className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{line.slice(3)}</h1>);
        i++;
        continue;
      }
      
      // Handle regular headings
      if (line.startsWith("# ")) {
        elements.push(<h1 key={i} className="text-3xl font-bold mb-4 text-foreground">{line.slice(2)}</h1>);
        i++;
        continue;
      }
      if (line.startsWith("## ")) {
        elements.push(<h2 key={i} className="text-2xl font-semibold mt-8 mb-4 text-primary">{line.slice(3)}</h2>);
        i++;
        continue;
      }
      if (line.startsWith("### ")) {
        elements.push(<h3 key={i} className="text-xl font-semibold mt-6 mb-3 text-foreground">{line.slice(4)}</h3>);
        i++;
        continue;
      }
      
      // Handle badges/links
      if (line.includes("[![") && line.includes("style=for-the-badge")) {
        elements.push(<div key={i} className="flex justify-center gap-2 my-4 flex-wrap">{line}</div>);
        i++;
        continue;
      }
      
      // Handle blockquotes
      if (line.startsWith("> ")) {
        elements.push(<blockquote key={i} className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20 pl-6 py-3 my-4 italic text-lg">{line.slice(2)}</blockquote>);
        i++;
        continue;
      }
      
      // Handle tables
      if (line.startsWith("|") && line.includes("---")) {
        // Skip table separator
        i++;
        continue;
      }
      if (line.startsWith("|")) {
        const tableData = line.split("|").filter(cell => cell.trim());
        elements.push(
          <div key={i} className="grid grid-cols-3 gap-4 my-4">
            {tableData.map((cell, idx) => (
              <div key={idx} className="p-3 bg-muted rounded-lg text-sm">{cell.trim()}</div>
            ))}
          </div>
        );
        i++;
        continue;
      }
      
      // Handle code blocks
      if (line.startsWith("```")) {
        const codeLines = [];
        i++;
        while (i < lines.length && !lines[i].startsWith("```")) {
          codeLines.push(lines[i]);
          i++;
        }
        elements.push(
          <pre key={i} className="bg-gray-900 text-green-400 p-4 rounded-lg my-4 overflow-x-auto">
            <code>{codeLines.join("\n")}</code>
          </pre>
        );
        i++;
        continue;
      }
      
      // Handle images
      if (line.startsWith("![")) {
        elements.push(<div key={i} className="my-4">{line}</div>);
        i++;
        continue;
      }
      
      // Handle lists
      if (line.startsWith("- ") || line.startsWith("* ")) {
        elements.push(<li key={i} className="ml-6 mb-2 text-foreground">{line.slice(2)}</li>);
        i++;
        continue;
      }
      
      // Handle numbered lists
      if (line.match(/^\d+\./)) {
        elements.push(<li key={i} className="ml-6 mb-2 text-foreground">{line}</li>);
        i++;
        continue;
      }
      
      // Handle horizontal rules
      if (line.startsWith("---")) {
        elements.push(<hr key={i} className="my-8 border-t-2 border-border" />);
        i++;
        continue;
      }
      
      // Handle bold text
      if (line.includes("**")) {
        const boldText = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        elements.push(<p key={i} className="my-2 text-foreground" dangerouslySetInnerHTML={{ __html: boldText }} />);
        i++;
        continue;
      }
      
      // Handle links
      if (line.includes("[") && line.includes("](")) {
        elements.push(<p key={i} className="my-2 text-foreground">{line}</p>);
        i++;
        continue;
      }
      
      // Handle empty lines
      if (line.trim() === "") {
        elements.push(<br key={i} />);
        i++;
        continue;
      }
      
      // Regular text
      if (line.trim()) {
        elements.push(<p key={i} className="my-2 text-foreground">{line}</p>);
      }
      
      i++;
    }
    
    return <>{elements}</>;
  };

  if (!owner || !repoName) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-6 pt-24 pb-16">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h1 className="text-xl font-bold text-foreground mb-2">Invalid Repository</h1>
            <p className="text-muted-foreground mb-4">Please select a valid repository</p>
            <Link to="/dashboard" className="text-primary hover:underline">Back to Dashboard</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-6 pt-24 pb-16 max-w-4xl">
        <ScrollReveal>
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2">
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
              </Link>
              <h1 className="font-display text-2xl font-bold text-foreground">
                {decodedRepo}/README.md
              </h1>
              <p className="text-sm text-muted-foreground">AI-powered README generation</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Template selector */}
              <div className="clay-card-sm inline-flex p-1 gap-1 mr-2">
                {[
                  { key: "modern" as TemplateType, label: "Modern" },
                  { key: "minimal" as TemplateType, label: "Minimal" },
                  { key: "detailed" as TemplateType, label: "Detailed" },
                  { key: "premium" as TemplateType, label: "👑 Premium" },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => handleTemplateChange(key)}
                    disabled={isGenerating || isRegenerating}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                      template === key
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Copy */}
              <motion.button
                whileHover={{ scale: isGenerating ? 1 : 1.05 }}
                whileTap={{ scale: isGenerating ? 1 : 0.95 }}
                onClick={handleCopy}
                disabled={isGenerating || !markdown}
                className={`clay-card-sm px-4 py-2 text-sm font-medium inline-flex items-center gap-2 transition-colors ${
                  copied ? "text-green-600" : "text-foreground"
                } disabled:opacity-50`}
                aria-label="Copy markdown"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy"}
              </motion.button>

              {/* Download */}
              <motion.button
                whileHover={{ scale: isGenerating ? 1 : 1.05 }}
                whileTap={{ scale: isGenerating ? 1 : 0.95 }}
                animate={downloadPulse ? { scale: [1, 1.1, 1] } : {}}
                onClick={handleDownload}
                disabled={isGenerating || !markdown}
                className="clay-card-sm px-4 py-2 text-sm font-medium text-foreground inline-flex items-center gap-2 disabled:opacity-50"
                aria-label="Download markdown"
              >
                <Download className="w-4 h-4" /> Download
              </motion.button>

              {/* Regenerate */}
              <motion.button
                whileHover={{ scale: (isRegenerating || isGenerating) ? 1 : 1.05 }}
                whileTap={{ scale: (isRegenerating || isGenerating) ? 1 : 0.95 }}
                onClick={handleRegenerate}
                disabled={isRegenerating || isGenerating}
                className="clay-button px-4 py-2 text-sm font-display font-semibold inline-flex items-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
                aria-label="Regenerate README"
              >
                {isRegenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
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

        {/* Error message */}
        {error && (
          <ScrollReveal delay={0.15}>
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          </ScrollReveal>
        )}

        {/* Content area */}
        <ScrollReveal delay={0.2}>
          <ClayCard hover={false}>
            <div ref={contentRef} className="max-h-[600px] overflow-auto">
              <ClayInset className="min-h-[400px]">
                <AnimatePresence mode="wait">
                  {isGenerating || isRegenerating ? (
                    <motion.div
                      key="generating"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-[400px]"
                    >
                      <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                      <p className="text-muted-foreground">AI is generating your README...</p>
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
                      {markdown || "Click 'Regenerate' to create a README"}
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
                      {markdown ? renderPreview(markdown) : <p className="text-muted-foreground">Click 'Regenerate' to create a README</p>}
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
