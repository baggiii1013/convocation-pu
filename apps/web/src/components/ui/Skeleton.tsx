"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SkeletonProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragStart' | 'onDragEnd'> {
  variant?: "text" | "circular" | "rectangular"
  animation?: "pulse" | "wave" | "shimmer"
}

function Skeleton({ className, variant = "rectangular", animation = "shimmer", ...props }: SkeletonProps) {
  const baseClasses = cn(
    variant === "circular" && "rounded-full",
    variant === "text" && "rounded-md h-4",
    variant === "rectangular" && "rounded-lg",
  );

  if (animation === "wave") {
    return (
      <motion.div
        className={cn(
          "bg-gray-200 dark:bg-gray-800",
          baseClasses,
          className
        )}
        animate={{
          backgroundPosition: ["200% 0", "-200% 0"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
          backgroundSize: "200% 100%",
        }}
      />
    );
  }

  if (animation === "pulse") {
    return (
      <div
        className={cn(
          "animate-pulse bg-gray-200 dark:bg-gray-800",
          baseClasses,
          className
        )}
        {...props}
      />
    );
  }

  // Default shimmer animation
  return (
    <div
      className={cn(
        "animate-shimmer bg-gradient-to-r from-dark-surface via-dark-hover to-dark-surface bg-[length:200%_100%]",
        baseClasses,
        className
      )}
      {...props}
    />
  );
}

// Pre-built skeleton layouts
function SkeletonCard() {
  return (
    <div className="p-6 space-y-4 bg-dark-card border border-dark-border rounded-xl">
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" className="h-12 w-12" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="h-4 w-3/4" />
          <Skeleton variant="text" className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton variant="rectangular" className="h-32 w-full" />
      <div className="space-y-2">
        <Skeleton variant="text" className="h-3 w-full" />
        <Skeleton variant="text" className="h-3 w-5/6" />
        <Skeleton variant="text" className="h-3 w-4/6" />
      </div>
    </div>
  )
}

function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <Skeleton variant="rectangular" className="h-12 w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} variant="rectangular" className="h-16 w-full" />
      ))}
    </div>
  )
}

function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={cn(
            "h-4",
            i === lines - 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  )
}

export { Skeleton, SkeletonCard, SkeletonTable, SkeletonText };

