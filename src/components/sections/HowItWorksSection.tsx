import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/motion/AnimationPrimitives";
import { ClayCard } from "@/components/clay/ClayComponents";
import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Connect Repository",
    description: "Paste your GitHub URL or sign in to browse your repos. We support public and private repositories.",
  },
  {
    step: "02",
    title: "AI Analyzes Code",
    description: "Our AI scans your file structure, dependencies, config files, and code patterns to understand your project.",
  },
  {
    step: "03",
    title: "Generate & Customize",
    description: "Get a professional README in seconds. Edit sections, change templates, and fine-tune the content.",
  },
  {
    step: "04",
    title: "Export Anywhere",
    description: "Download the markdown, copy to clipboard, or commit directly to your repo with one click.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-32 relative">
      <div className="floating-blob w-[400px] h-[400px] bg-accent/10 top-0 right-0 animate-blob-move" style={{ animationDelay: "-5s" }} />

      <div className="container mx-auto px-6 relative z-10">
        <ScrollReveal className="text-center mb-20">
          <p className="text-sm font-medium text-primary mb-3 tracking-widest uppercase">How It Works</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-5">
            Four simple steps to
            <br />
            <span className="gradient-text-warm">documentation bliss</span>
          </h2>
        </ScrollReveal>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.15}>
          {steps.map((step, i) => (
            <StaggerItem key={step.step}>
              <ClayCard className="h-full text-center relative overflow-hidden">
                <motion.span
                  className="font-display text-7xl font-bold text-primary/10 absolute -top-2 -right-1"
                  whileHover={{ scale: 1.2, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {step.step}
                </motion.span>
                <div className="relative z-10">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-3 mt-8">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </ClayCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default HowItWorksSection;
