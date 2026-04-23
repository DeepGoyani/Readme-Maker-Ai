import { useState, startTransition } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { StaggerText, ScrollReveal, MagneticHover, ParallaxLayer } from "@/components/motion/AnimationPrimitives";
import { ClayButton, ClayBadge } from "@/components/clay/ClayComponents";
import { ArrowRight, Sparkles, Zap, Shield, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleCTA = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    startTransition(() => {
      navigate(user ? "/dashboard" : "/login");
    });
    // Reset after navigation
    setTimeout(() => setIsNavigating(false), 1000);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="floating-blob w-[500px] h-[500px] bg-primary/20 top-20 -left-40 animate-blob-move" />
      <div className="floating-blob w-[400px] h-[400px] bg-secondary/20 bottom-20 right-0 animate-blob-move" style={{ animationDelay: "-7s" }} />
      <div className="floating-blob w-[300px] h-[300px] bg-accent/15 top-1/2 left-1/3 animate-blob-move" style={{ animationDelay: "-14s" }} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 inline-block"
          >
            <ClayBadge className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              AI-Powered README Generation
            </ClayBadge>
          </motion.div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 text-foreground">
            <StaggerText text="Beautiful READMEs" />
            <br />
            <span className="gradient-text">
              <StaggerText text="in seconds" delay={0.4} />
            </span>
          </h1>

          <ScrollReveal delay={0.6}>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Connect your GitHub repository, let AI analyze your codebase,
              and generate a stunning, comprehensive README — automatically.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.8}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <MagneticHover strength={0.2}>
                <motion.button
                  whileHover={isNavigating ? {} : { scale: 1.02 }}
                  whileTap={isNavigating ? {} : { scale: 0.96 }}
                  onClick={handleCTA}
                  disabled={isNavigating}
                  className="clay-button px-8 py-4 text-lg font-display font-semibold flex items-center gap-2 disabled:opacity-70"
                >
                  {isNavigating ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Loading...</>
                  ) : (
                    <><ArrowRight className="w-5 h-5" /> Generate My README</>
                  )}
                </motion.button>
              </MagneticHover>

              <MagneticHover strength={0.2}>
                <a
                  href="#features"
                  className="clay-card px-8 py-4 text-base font-display font-semibold text-foreground flex items-center gap-2"
                >
                  See How It Works
                </a>
              </MagneticHover>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={1}>
            <div className="flex flex-wrap items-center justify-center gap-8 mt-16">
              {[
                { icon: Zap, label: "Lightning Fast", value: "<30s" },
                { icon: Shield, label: "Secure & Private", value: "100%" },
                { icon: Sparkles, label: "AI Accuracy", value: "98%" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  className="clay-card-sm px-5 py-3 flex items-center gap-3"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <stat.icon className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <p className="font-display font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>

        <ParallaxLayer speed={-0.05}>
          <ScrollReveal delay={1.2}>
            <div className="clay-card max-w-3xl mx-auto mt-20 p-1 overflow-hidden">
              <div className="clay-inset p-6 font-mono text-sm text-muted-foreground leading-relaxed">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <div className="w-3 h-3 rounded-full bg-secondary" />
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="ml-2 text-xs">README.md — Preview</span>
                </div>
                <p className="text-foreground font-display text-base font-semibold mb-2"># My Awesome Project</p>
                <p className="mb-2">A modern full-stack application built with React and Node.js</p>
                <p className="text-primary font-semibold mb-1">## ✨ Features</p>
                <p>- 🚀 Lightning-fast performance</p>
                <p>- 🔐 Enterprise-grade security</p>
                <p>- 📱 Fully responsive design</p>
              </div>
            </div>
          </ScrollReveal>
        </ParallaxLayer>
      </div>
    </section>
  );
};

export default HeroSection;
