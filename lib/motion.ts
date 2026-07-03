import type { Transition, Variants } from "framer-motion";

/** Shared luxury easing curve (matches Tailwind `ease-luxury`) */
export const luxuryEase = [0.22, 1, 0.36, 1] as const;

export const luxuryTransition: Transition = {
  duration: 0.6,
  ease: luxuryEase,
};

export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: luxuryEase },
  },
};

export const fadeUpContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.14, delayChildren: 0.2 },
  },
};
