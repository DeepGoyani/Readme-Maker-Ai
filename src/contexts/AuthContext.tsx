import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { authAPI } from "@/services/api";

const GITHUB_CLIENT_ID = (import.meta as any).env?.VITE_GITHUB_CLIENT_ID || 'your_github_client_id';

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: () => void;
  signOut: () => Promise<void>;
  handleGitHubCallback: (code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await authAPI.getMe();
        setUser(userData);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

  const signIn = useCallback(() => {
    const redirectUri = `${window.location.origin}/login`;
    const scope = 'read:user repo';
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
    window.location.href = githubAuthUrl;
  }, []);

  const handleGitHubCallback = useCallback(async (code: string) => {
    setIsLoading(true);
    try {
      const response = await authAPI.githubCallback(code);
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut, handleGitHubCallback }}>
      {children}
    </AuthContext.Provider>
  );
};
