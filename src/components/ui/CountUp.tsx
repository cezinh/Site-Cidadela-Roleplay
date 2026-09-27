import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { formatNumber } from "@/lib/utils";

type Props = { value: number; duration?: number; className?: string };

/**
 * Número que conta de 0 até `value` quando entra na tela.
 * Atualiza o texto direto no DOM (sem re-render a cada frame);
 * leitores de tela recebem o valor final.
 */
export function CountUp({ value, duration = 2, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !seen) return;
    if (reduce) {
      el.textContent = formatNumber(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = formatNumber(v);
      },
    });
    return () => controls.stop();
  }, [seen, value, duration, reduce]);

  return (
    <span className={className}>
      <span ref={ref} aria-hidden>
        0
      </span>
      <span className="sr-only">{formatNumber(value)}</span>
    </span>
  );
}
