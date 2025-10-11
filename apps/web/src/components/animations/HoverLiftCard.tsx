"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface HoverLiftCardProps {
  children: ReactNode;
  liftAmount?: number;
  className?: string;
}

export function HoverLiftCard({
  liftAmount = -8,
  children,
  className,
}: HoverLiftCardProps) {
  return (
    <motion.div
      whileHover={{
        y: liftAmount,
        scale: 1.02,
        boxShadow: "0 20px 25px rgba(109, 73, 253, 0.15)",
      }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1] as const,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
