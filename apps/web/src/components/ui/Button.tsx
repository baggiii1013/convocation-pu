import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base styles - District.in inspired
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-98 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-primary hover:shadow-glow-md hover:scale-102 active:scale-98",
        primary:
          "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-primary hover:shadow-glow-md hover:scale-102 active:scale-98",
        secondary:
          "bg-dark-surface text-white border border-dark-border hover:bg-dark-hover hover:border-primary-500/30 hover:scale-102",
        outline:
          "border-2 border-primary-500 text-primary-500 bg-transparent hover:bg-primary-500 hover:text-white hover:shadow-primary",
        ghost:
          "text-primary-500 bg-transparent hover:bg-primary-500/10 hover:scale-102",
        danger:
          "bg-gradient-to-r from-accent-red to-red-600 text-white shadow-lg shadow-red-500/20 hover:shadow-glow-md hover:scale-102",
        success:
          "bg-gradient-to-r from-accent-green to-green-600 text-white shadow-lg shadow-green-500/20 hover:shadow-glow-md hover:scale-102",
        link: "text-primary-500 underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5 text-base",
        lg: "h-14 px-8 text-lg",
        xl: "h-16 px-10 text-xl",
        icon: "h-10 w-10",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!loading && leftIcon && <span className="inline-flex">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="inline-flex">{rightIcon}</span>}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
