import React from "react";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "default" | "green" | "yellow" | "red" | "outline";
  className?: string;
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = "default", className = "" }) => {
  const base = "inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full";

  const map = {
    default: "bg-slate-700 text-slate-200",
    green: "bg-green-600 text-green-100",
    yellow: "bg-yellow-600 text-yellow-100",
    red: "bg-red-600 text-red-100",
    outline: "bg-transparent border border-slate-700 text-slate-200",
  } as const;

  return <span className={`${base} ${map[variant]} ${className}`}>{children}</span>;
};

export default Badge;
