/**
 * Framer Motion Animation Configuration
 * Optimized for performance and mobile responsiveness
 */

import { Variants } from "framer-motion";

// Check if user prefers reduced motion
export const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Standard transition timings (using Framer Motion easing values)
export const transitions = {
  fast: { duration: 0.3 },
  normal: { duration: 0.5 },
  slow: { duration: 0.8 },
};

// Fade in variants
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitions.normal,
  },
};

// Slide in from left
export const slideInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.normal,
  },
};

// Slide in from right
export const slideInRightVariants: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.normal,
  },
};

// Scale up
export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.normal,
  },
};

// Stagger children
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Lazy loading viewport config
export const lazyViewportConfig = {
  once: true,
  amount: 0.2 as const,
  margin: "0px 0px -100px 0px",
};
