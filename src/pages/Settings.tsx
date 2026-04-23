import { startTransition } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useReducedMotion } from "@/contexts/ReducedMotionContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ClayCard, ClayInset } from "@/components/clay/ClayComponents";
import { ScrollReveal } from "@/components/motion/AnimationPrimitives";
import { LogOut, Loader2, Accessibility, User } from "lucide-react";

const Settings = () => {
  const { user, isLoading, signOut } = useAuth();
  const { reducedMotion, toggleReducedMotion } = useReducedMotion();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    startTransition(() => {
      navigate("/", { replace: true });
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-6 pt-24 pb-16 max-w-2xl">
        <ScrollReveal>
          <h1 className="font-display text-3xl font-bold text-foreground mb-8">Settings</h1>
        </ScrollReveal>

        {/* Profile */}
        <ScrollReveal delay={0.1}>
          <ClayCard hover={false} className="mb-6">
            <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Profile
            </h2>
            <ClayInset className="flex items-center gap-4">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-display font-semibold text-foreground">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </ClayInset>
          </ClayCard>
        </ScrollReveal>

        {/* Reduced Motion */}
        <ScrollReveal delay={0.15}>
          <ClayCard hover={false} className="mb-6">
            <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Accessibility className="w-5 h-5 text-primary" /> Accessibility
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground text-sm">Reduced Motion</p>
                <p className="text-xs text-muted-foreground">Disable animations for accessibility</p>
              </div>
              <button
                onClick={toggleReducedMotion}
                role="switch"
                aria-checked={reducedMotion}
                className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
                  reducedMotion ? "bg-primary" : "bg-muted"
                }`}
              >
                <motion.div
                  className="absolute top-0.5 w-6 h-6 rounded-full bg-primary-foreground shadow-sm"
                  animate={{ left: reducedMotion ? "1.375rem" : "0.125rem" }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </ClayCard>
        </ScrollReveal>

        {/* Logout */}
        <ScrollReveal delay={0.2}>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            disabled={isLoading}
            className="clay-card w-full p-4 text-left flex items-center gap-3 text-destructive hover:text-destructive/80 transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <LogOut className="w-5 h-5" />
            )}
            <span className="font-display font-semibold">
              {isLoading ? "Signing out..." : "Sign Out"}
            </span>
          </motion.button>
        </ScrollReveal>
      </main>
      <Footer />
    </div>
  );
};

export default Settings;
