import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border font-semibold transition-all duration-200",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary-500 text-white shadow-sm shadow-primary-500/20",
        secondary:
          "border-transparent bg-dark-surface text-white",
        outline:
          "border-primary-500 text-primary-500 bg-transparent",
        success:
          "border-transparent bg-accent-green text-white shadow-sm shadow-green-500/20",
        warning:
          "border-transparent bg-accent-orange text-white shadow-sm shadow-orange-500/20",
        error:
          "border-transparent bg-accent-red text-white shadow-sm shadow-red-500/20",
        info:
          "border-transparent bg-accent-blue text-white shadow-sm shadow-blue-500/20",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-sm",
        lg: "px-3 py-1.5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
