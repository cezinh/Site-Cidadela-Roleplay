import type { Transition, Variants } from "framer-motion";

/** Curva padrão do site: saída longa e suave. */
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_IN_OUT: [number, number, number, number] = [0.76, 0, 0.24, 1];

export const baseTransition: Transition = { duration: 0.9, ease: EASE_OUT };

/** Entrada: sobe, aparece e ganha foco. */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: baseTransition },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1, ease: EASE_OUT } },
};

export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

/** Viewport padrão das revelações por scroll. */
export const inView = { once: true, amount: 0.25 } as const;
