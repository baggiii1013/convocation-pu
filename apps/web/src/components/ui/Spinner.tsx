"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "white" | "current";
  className?: string;
}

const sizeClasses = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-3",
  lg: "w-12 h-12 border-4",
  xl: "w-16 h-16 border-4",
};

const variantClasses = {
  primary: "border-primary-500 border-t-transparent",
  white: "border-white border-t-transparent",
  current: "border-current border-t-transparent",
};

export function Spinner({ size = "md", variant = "primary", className }: SpinnerProps) {
  return (
    <motion.div
      className={cn(
        "rounded-full",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      animate={{ rotate: 360 }}
      transition={{
        duration: 0.8,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

// Dots Spinner
interface DotsSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function DotsSpinner({ size = "md", className }: DotsSpinnerProps) {
  const dotSize = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  return (
    <div className={cn("flex gap-2", className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn(
            "rounded-full bg-primary-500",
            dotSize[size]
          )}
          animate={{
            y: ["0%", "-50%", "0%"],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}

// Pulse Spinner
export function PulseSpinner({ size = "md", className }: SpinnerProps) {
  return (
    <motion.div
      className={cn(
        "rounded-full bg-primary-500",
        sizeClasses[size],
        className
      )}
      animate={{
        scale: [1, 1.5, 1],
        opacity: [1, 0.3, 1],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}
