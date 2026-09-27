import { m } from "framer-motion";
import { siteConfig } from "@/config/siteConfig";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { CountUp } from "@/components/ui/CountUp";

export function StatsSection() {
  const stats = siteConfig.stats;

  return (
    <section aria-label="A Cidadela em números" className="relative">
      <div className="container-site">
        <div className="relative overflow-hidden border-y border-line">
          {/* Linha de luz rosa no topo */}
          <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(60% 120% at 50% 0%, rgb(242 34 131 / 0.10), transparent 70%)" }}
          />

          <dl className="relative grid grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <m.div
                key={stat.label}
                className={cn(
                  "flex flex-col gap-3 px-4 py-10 sm:px-8 sm:py-14 lg:py-16",
                  i % 2 === 1 && "border-l border-line",
                  i >= 2 && "border-t border-line lg:border-t-0",
                  i === 2 && "lg:border-l",
                )}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.9, delay: i * 0.08, ease: EASE_OUT }}
              >
                <dt className="order-2 text-[0.75rem] font-semibold tracking-[0.2em] text-subtle uppercase sm:text-[0.8125rem]">
                  {stat.label}
                </dt>
                <dd className="display tabular order-1 text-[clamp(3rem,1.6rem+5vw,6.5rem)] leading-[0.85]">
                  <CountUp value={stat.value} duration={i === 0 ? 2.4 : 1.8} />
                  {stat.suffix && <span className="text-primary">{stat.suffix}</span>}
                </dd>
              </m.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
