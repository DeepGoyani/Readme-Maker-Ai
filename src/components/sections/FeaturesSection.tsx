import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/motion/AnimationPrimitives";
import { ClayCard } from "@/components/clay/ClayComponents";
import { motion } from "framer-motion";
import { GitBranch, Brain, FileText, Download, Sparkles, Globe } from "lucide-react";

const features = [
  {
    icon: GitBranch,
    title: "GitHub Integration",
    description: "Connect any public or private repository. We analyze your codebase structure, dependencies, and configuration files.",
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description: "Powered by Google Gemini, our AI understands your tech stack, architecture patterns, and project purpose.",
  },
  {
    icon: FileText,
    title: "Smart Generation",
    description: "Get a beautifully formatted README with badges, installation steps, API docs, and contribution guidelines.",
  },
  {
    icon: Download,
    title: "One-Click Export",
    description: "Download as Markdown, copy to clipboard, or push directly to your repository with a single click.",
  },
  {
    icon: Sparkles,
    title: "Custom Templates",
    description: "Choose from professional templates or create your own. Every README is tailored to your project type.",
  },
  {
    icon: Globe,
    title: "Multi-Language",
    description: "Generate READMEs in multiple languages. Support for 20+ programming languages and frameworks.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-32 relative">
      <div className="container mx-auto px-6">
        <ScrollReveal className="text-center mb-20">
          <p className="text-sm font-medium text-primary mb-3 tracking-widest uppercase">Features</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-5">
            Everything you need for
            <br />
            <span className="gradient-text-accent">perfect documentation</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            From analysis to export, our AI handles the entire README creation workflow.
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.12}>
          {features.map((feature, i) => (
            <StaggerItem key={feature.title}>
              <ClayCard className="h-full group">
                <motion.div
                  className="clay-card-sm w-12 h-12 flex items-center justify-center mb-5"
                  whileHover={{ rotate: 8, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <feature.icon className="w-6 h-6 text-primary" />
                </motion.div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </ClayCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default FeaturesSection;
