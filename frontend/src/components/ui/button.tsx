import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}) => {
  const base = "inline-flex items-center justify-center font-semibold rounded-md transition-colors";
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-3 text-base",
  } as const;
  const variants = {
    primary: "bg-green-600 text-black hover:bg-green-500",
    secondary: "bg-stone-700 text-slate-200 hover:bg-stone-600",
    outline: "bg-transparent border border-stone-700 text-slate-200 hover:bg-stone-800",
  } as const;

  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
};

export default Button;
