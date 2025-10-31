// src/components/ui/card.tsx
import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-stone-900 border border-stone-700 rounded-lg shadow ${className}`}
        {...props} // This spreads onClick, onMouseEnter, etc.
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export const CardHeader: React.FC<{ className?: string; children?: React.ReactNode }> = ({ children, className = "" }) => (
  <div className={`flex items-center gap-3 p-4 border-b border-stone-700 ${className}`}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ className?: string; children?: React.ReactNode }> = ({ children, className = "" }) => (
  <h3 className={`text-slate-100 font-bold ${className}`}>{children}</h3>
);

export const CardContent: React.FC<{ className?: string; children?: React.ReactNode }> = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

export const CardDescription: React.FC<{ className?: string; children?: React.ReactNode }> = ({ children, className = "" }) => (
  <p className={`text-sm text-gray-400 ${className}`}>{children}</p>
);

export default Card;