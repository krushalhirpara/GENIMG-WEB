import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "glass" | "outline" | "tryNow" | "pillNavbar";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-gradient-to-r from-purple-600 via-blue-500 to-orange-500 hover:from-purple-500 hover:via-blue-400 hover:to-orange-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] border-transparent",
      secondary: "bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40",
      glass: "glass hover:bg-white/10 text-white transition-all duration-300",
      outline: "bg-transparent border border-white/20 hover:border-purple-500/50 hover:bg-purple-500/10 text-white",
      tryNow: "bg-[#111] border border-white/10 text-gray-200 hover:text-white hover:scale-[1.03] hover:border-transparent hover:shadow-[0_0_20px_rgba(108,75,255,0.3)] relative overflow-hidden group/btn",
      pillNavbar: "bg-gradient-to-r from-[#8b5cf6] via-[#ec4899] to-[#3b82f6] text-white rounded-full px-6 py-2.5 font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-all",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-5 py-2.5 text-base",
      lg: "px-8 py-4 text-lg font-medium",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none font-medium",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {variant === "tryNow" && (
          <span className="absolute inset-0 bg-gradient-to-r from-[#6C4BFF] via-[#3B82F6] to-[#FF7A18] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 -z-10" />
        )}
        <span className="relative z-10">{props.children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
