import React from "react";
import { cn } from "../../lib/utils";

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:opacity-50 disabled:pointer-events-none ring-offset-white";
    
    const variants = {
      default: "bg-green-600 text-white hover:bg-green-700 shadow-sm",
      outline: "border border-slate-300 hover:bg-slate-50 text-slate-700",
      ghost: "hover:bg-slate-100 text-slate-700 hover:text-slate-900",
      link: "underline-offset-4 hover:underline text-green-600",
      danger: "bg-red-500 text-white hover:bg-red-600",
    };

    const sizes = {
      default: "h-10 py-2 px-4",
      sm: "h-9 px-3 rounded-md text-sm",
      lg: "h-11 px-8 rounded-md text-lg",
      icon: "h-10 w-10",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
