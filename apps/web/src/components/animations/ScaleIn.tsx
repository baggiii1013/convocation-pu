"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";

interface ScaleInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function ScaleIn({
  children,
  delay = 0,
  duration = 0.5,
  className,
}: ScaleInProps) {
  const { ref, isInView } = useScrollAnimation();

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        scale: 0.8,
      }}
      animate={
        isInView
          ? {
              opacity: 1,
              scale: 1,
            }
          : {}
      }
      transition={{
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1] as const,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
