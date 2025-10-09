import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular"
}

function Skeleton({ className, variant = "rectangular", ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-shimmer bg-gradient-to-r from-dark-surface via-dark-hover to-dark-surface bg-[length:200%_100%]",
        variant === "circular" && "rounded-full",
        variant === "text" && "rounded-md h-4",
        variant === "rectangular" && "rounded-lg",
        className
      )}
      {...props}
    />
  )
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

export { Skeleton, SkeletonCard, SkeletonTable, SkeletonText }
