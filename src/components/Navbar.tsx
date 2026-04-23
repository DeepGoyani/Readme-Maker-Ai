import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MagneticHover } from "@/components/motion/AnimationPrimitives";
import { FileText, Github, Settings, LogOut, User } from "lucide-react";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-border/50"
      style={{ background: "hsl(var(--background) / 0.8)" }}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="clay-card-sm p-2 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <span className="font-display font-bold text-lg text-foreground">
            ReadMe<span className="gradient-text">AI</span>
          </span>
        </Link>

        {!user ? (
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-8">
              {["Features", "How it Works"].map((item) => (
                <MagneticHover key={item} strength={0.15}>
                  <a
                    href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300"
                  >
                    {item}
                  </a>
                </MagneticHover>
              ))}
            </div>
            <MagneticHover strength={0.15}>
              <Link to="/login" className="clay-button px-5 py-2.5 text-sm font-display font-semibold">
                Get Started
              </Link>
            </MagneticHover>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <MagneticHover strength={0.15}>
              <Link
                to="/dashboard"
                className="clay-card-sm px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                <span className="hidden sm:inline">Repos</span>
              </Link>
            </MagneticHover>
            <MagneticHover strength={0.15}>
              <Link
                to="/settings"
                className="clay-card-sm p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Settings"
              >
                <Settings className="w-4 h-4" />
              </Link>
            </MagneticHover>
            <div className="clay-card-sm p-0.5">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
            </div>
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
