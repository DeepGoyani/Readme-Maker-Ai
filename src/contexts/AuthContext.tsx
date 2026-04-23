import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
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
      const stored = localStorage.getItem("readmeai_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const signIn = useCallback(async () => {
    setIsLoading(true);
    // Simulate OAuth flow
    await new Promise((r) => setTimeout(r, 1500));
    const mockUser: User = {
      id: "u_1",
      name: "Alex Developer",
      email: "alex@dev.io",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    };
    setUser(mockUser);
    localStorage.setItem("readmeai_user", JSON.stringify(mockUser));
    setIsLoading(false);
  }, []);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setUser(null);
    localStorage.removeItem("readmeai_user");
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
