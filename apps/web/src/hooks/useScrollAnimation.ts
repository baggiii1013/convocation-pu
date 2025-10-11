"use client";

import { useInView } from "framer-motion";
import { useEffect, useRef } from "react";

export function useScrollAnimation(options = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true, // Only trigger once
    amount: 0.3, // Trigger when 30% of element is visible
    ...options,
  });

  return { ref, isInView };
}
