import { ScrollReveal, MagneticHover } from "@/components/motion/AnimationPrimitives";
import { ClayButton } from "@/components/clay/ClayComponents";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="floating-blob w-[600px] h-[600px] bg-primary/15 -bottom-40 left-1/2 -translate-x-1/2 animate-pulse-soft" />

      <div className="container mx-auto px-6 relative z-10">
        <ScrollReveal>
          <div className="clay-card max-w-3xl mx-auto text-center p-12 sm:p-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Ready to create your
              <br />
              <span className="gradient-text">perfect README?</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              Join thousands of developers who save hours on documentation with AI.
            </p>
            <MagneticHover strength={0.15}>
              <Link to="/dashboard">
                <ClayButton size="lg" className="inline-flex items-center gap-2">
                  Start Generating
                  <ArrowRight className="w-5 h-5" />
                </ClayButton>
              </Link>
            </MagneticHover>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CTASection;
