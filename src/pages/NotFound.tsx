import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="clay-card p-12 text-center max-w-md"
      >
        <h1 className="font-display text-6xl font-bold gradient-text mb-4">404</h1>
        <p className="text-lg text-muted-foreground mb-6">Page not found</p>
        <Link to="/" className="clay-button px-6 py-3 font-display font-semibold inline-block">
          Return Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
