import React from "react";

export const Card: React.FC<{ className?: string; children?: React.ReactNode }> = ({ children, className = "" }) => {
  return (
    <div className={`bg-stone-900 border border-stone-700 rounded-lg shadow ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ className?: string; children?: React.ReactNode }> = ({ children, className = "" }) => (
  <div className={`flex items-center gap-3 p-4 border-b border-stone-700 ${className}`}>{children}</div>
);

export const CardTitle: React.FC<{ className?: string; children?: React.ReactNode }> = ({ children, className = "" }) => (
  <h3 className={`text-slate-100 font-bold ${className}`}>{children}</h3>
);

export const CardContent: React.FC<{ className?: string; children?: React.ReactNode }> = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

export default Card;
