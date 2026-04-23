import { useState, startTransition, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Github, Loader2 } from "lucide-react";

const Login = () => {
  const { user, isLoading: authLoading, signIn, handleGitHubCallback } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/dashboard";
  const [error, setError] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle GitHub OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const errorParam = params.get('error');

    if (errorParam) {
      setError(`GitHub authentication error: ${errorParam}`);
      return;
    }

    if (code && !isProcessing && !user) {
      setIsProcessing(true);
      handleGitHubCallback(code)
        .then(() => {
          startTransition(() => {
            navigate('/dashboard', { replace: true });
          });
        })
        .catch((err: Error) => {
          setError(err.message || "Authentication failed. Please try again.");
          setShaking(true);
          setTimeout(() => setShaking(false), 600);
          setIsProcessing(false);
        });
    }
  }, [location, handleGitHubCallback, navigate, user, isProcessing]);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSignIn = () => {
    if (authLoading || isProcessing) return;
    setError(null);
    signIn();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4">
      {/* Background blobs */}
      <div className="floating-blob w-[500px] h-[500px] bg-primary/15 -top-40 -left-40 animate-blob-move" />
      <div className="floating-blob w-[400px] h-[400px] bg-accent/10 bottom-0 right-0 animate-blob-move" style={{ animationDelay: "-10s" }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`clay-card p-10 w-full max-w-md relative z-10 text-center ${shaking ? "animate-shake" : ""}`}
      >
        <div className="clay-card-sm w-16 h-16 mx-auto flex items-center justify-center mb-6">
          <Github className="w-8 h-8 text-foreground" />
        </div>

        <h1 className="font-display text-2xl font-bold text-foreground mb-2">Welcome Back</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Sign in with your GitHub account to continue
        </p>

        <motion.button
          whileHover={{ scale: (authLoading || isProcessing) ? 1 : 1.02 }}
          whileTap={{ scale: (authLoading || isProcessing) ? 1 : 0.96 }}
          onClick={handleSignIn}
          disabled={authLoading || isProcessing}
          className="clay-button w-full py-3.5 font-display font-semibold text-base flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
        >
          {authLoading || isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Github className="w-5 h-5" />
              Continue with GitHub
            </>
          )}
        </motion.button>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-destructive text-sm mt-4"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <p className="text-xs text-muted-foreground mt-6">
          By signing in, you agree to our Terms of Service
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
