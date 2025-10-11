"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";

export interface AnimatedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
}

const AnimatedInput = React.forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ className, label, error, success, helperText, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(!!e.target.value);
      props.onBlur?.(e);
    };

    return (
      <div className="relative w-full">
        {/* Input Container */}
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              "peer w-full rounded-lg border-2 bg-transparent px-4 py-3 text-base transition-all duration-300 outline-none",
              "placeholder-transparent",
              // Default state
              "border-gray-300 dark:border-gray-700",
              // Focus state
              "focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20",
              // Error state
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              // Success state
              success && "border-green-500 focus:border-green-500 focus:ring-green-500/20",
              // Disabled state
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-800",
              className
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={label || props.placeholder}
            {...props}
          />

          {/* Floating Label */}
          {label && (
            <motion.label
              initial={false}
              animate={{
                y: isFocused || hasValue || props.value ? -28 : 0,
                scale: isFocused || hasValue || props.value ? 0.85 : 1,
                x: isFocused || hasValue || props.value ? -4 : 0,
              }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
              className={cn(
                "absolute left-4 top-3 origin-left cursor-text select-none transition-colors duration-200",
                "text-gray-600 dark:text-gray-400",
                isFocused && "text-primary-500",
                error && "text-red-500",
                success && "text-green-500",
                "pointer-events-none"
              )}
            >
              {label}
            </motion.label>
          )}

          {/* Focus Glow Effect */}
          <AnimatePresence>
            {isFocused && !error && !success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 -z-10 rounded-lg bg-primary-500/5 blur-sm"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Helper Text / Error / Success Message */}
        <AnimatePresence mode="wait">
          {(error || success || helperText) && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-1 overflow-hidden"
            >
              <p
                className={cn(
                  "text-sm",
                  error && "text-red-500",
                  success && "text-green-500",
                  !error && !success && "text-gray-600 dark:text-gray-400"
                )}
              >
                {error || success || helperText}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

AnimatedInput.displayName = "AnimatedInput";

export { AnimatedInput };
