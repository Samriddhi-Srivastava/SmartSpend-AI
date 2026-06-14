"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Fades + rises its children into view on scroll.
 * Use `delay` to stagger sibling reveals.
 */
export default function Reveal({ children, delay = 0, y = 26, className = "" }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
