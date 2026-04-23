import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

interface ReducedMotionContextType {
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
}

const ReducedMotionContext = createContext<ReducedMotionContextType>({
  reducedMotion: false,
  toggleReducedMotion: () => {},
});

export const useReducedMotion = () => useContext(ReducedMotionContext);

export const ReducedMotionProvider = ({ children }: { children: ReactNode }) => {
  const [reducedMotion, setReducedMotion] = useState(() => {
    const stored = localStorage.getItem("readmeai_reduced_motion");
    if (stored !== null) return stored === "true";
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    localStorage.setItem("readmeai_reduced_motion", String(reducedMotion));
    if (reducedMotion) {
      document.documentElement.classList.add("reduce-motion");
    } else {
      document.documentElement.classList.remove("reduce-motion");
    }
  }, [reducedMotion]);

  const toggleReducedMotion = useCallback(() => {
    setReducedMotion((prev) => !prev);
  }, []);

  return (
    <ReducedMotionContext.Provider value={{ reducedMotion, toggleReducedMotion }}>
      {children}
    </ReducedMotionContext.Provider>
  );
};
