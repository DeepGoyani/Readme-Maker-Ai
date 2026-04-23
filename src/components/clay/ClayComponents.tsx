import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const ClayCard = ({
  children,
  className = "",
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) => (
  <div className={cn("clay-card p-6", hover ? "" : "hover:transform-none hover:shadow-none", className)}>
    {children}
  </div>
);

export const ClayCardSmall = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={cn("clay-card-sm p-4", className)}>
    {children}
  </div>
);

export const ClayInset = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={cn("clay-inset p-4", className)}>
    {children}
  </div>
);

export const ClayButton = ({
  children,
  className = "",
  onClick,
  size = "default",
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  size?: "default" | "lg" | "sm";
}) => {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    default: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={cn("clay-button font-display font-semibold tracking-wide", sizeClasses[size], className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const ClayBadge = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <span className={cn("clay-card-sm px-3 py-1 text-xs font-medium text-muted-foreground inline-block", className)}>
    {children}
  </span>
);
