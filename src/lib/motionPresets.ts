import type { Transition, Variants } from 'motion/react';

export const EASE_ARCHITECTURAL: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const VIEWPORT_ONCE = {
  once: true,
  amount: 'some' as const,
};

export const ROUTE_TRANSITION: Transition = {
  duration: 0.26,
  ease: EASE_ARCHITECTURAL,
};

export const fadeUpItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.48,
      ease: EASE_ARCHITECTURAL,
    },
  },
};

export function createStaggerContainerVariants(
  staggerChildren = 0.07,
  delayChildren = 0.04
): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };
}
