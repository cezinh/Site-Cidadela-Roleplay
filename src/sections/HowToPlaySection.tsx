import type { ReactNode } from "react";
import { m } from "framer-motion";
import { Play, ShoppingCart } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";
import { howToPlay } from "@/content/content";
import { useUI } from "@/context/UIContext";
import { useSpotlight } from "@/hooks/useSpotlight";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button, ButtonLink } from "@/components/ui/Button";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { ConnectField } from "@/components/ui/ConnectField";

function StepNode({ n, active }: { n: number; active?: boolean }) {
  return (
    <span
      className={cn(
        "display relative grid size-14 flex-none place-items-center rounded-full border text-[1.625rem] leading-none",
        active ? "border-primary bg-primary text-white shadow-[var(--glow-md)]" : "border-line-strong bg-background text-white",
      )}
      aria-hidden
    >
      {String(n).padStart(2, "0")}
    </span>
  );
}

type StepProps = { n: number; title: string; text: string; action: ReactNode };

/**
 * Trilha dos passos 01 → 02 → 03 (desktop), acima dos cards.
 * Cada célula tem o mesmo recuo do card (p-8), então o número fica alinhado ao conteúdo do card logo abaixo,
 * e a linha vai exatamente da borda de um círculo até a borda do próximo, sem cruzar os cards.
 */
function StepRoute() {
  return (
    <div aria-hidden className="mt-10 hidden grid-cols-3 gap-4 lg:mt-12 lg:grid">
      {[1, 2, 3].map((n) => (
        <div key={n} className="flex items-center px-8">
          <StepNode n={n} />
          {n < 3 && (
            // flex-1 vai até o fim do recuo desta célula; -mr cobre recuo direito (2rem) + espaço entre cards (1rem) + recuo esquerdo do próximo (2rem)
            <span className="route-line relative -mr-20 h-px flex-1">
              <m.span
                className="absolute inset-0 origin-left bg-primary shadow-[0_0_10px_rgb(242_34_131/0.8)]"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 1 }}
                transition={{ duration: 1.1, delay: 0.3 + n * 0.35, ease: EASE_OUT }}
              />
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function StepCard({ n, title, text, action }: StepProps) {
  const onPointerMove = useSpotlight<HTMLLIElement>();

  return (
    <m.li
      onPointerMove={onPointerMove}
      className="panel spotlight relative flex flex-col p-7 sm:p-8"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, delay: (n - 1) * 0.1, ease: EASE_OUT }}
    >
      {/* No celular o número fica dentro do card; no desktop ele está na trilha acima */}
      <div className="relative z-10 flex items-center lg:hidden">
        <StepNode n={n} />
      </div>
      <h3 className="display relative z-10 mt-6 text-[2rem] sm:text-[2.25rem] lg:mt-0">{title}</h3>
      <p className="relative z-10 mt-3 text-[0.9375rem] leading-relaxed text-muted">{text}</p>
      <div className="relative z-10 mt-auto pt-6">{action}</div>
    </m.li>
  );
}

export function HowToPlaySection() {
  const { openPlatforms, preloadPlatforms, play } = useUI();
  const { steps } = howToPlay;

  return (
    <section id="como-jogar" aria-labelledby="como-jogar-titulo" className="section-y relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(40% 30% at 10% 20%, rgb(242 34 131 / 0.08), transparent 70%), radial-gradient(50% 40% at 90% 90%, rgb(242 34 131 / 0.10), transparent 70%)",
        }}
      />

      <div className="container-site">
        <SectionHeading id="como-jogar-titulo" tag={howToPlay.tag} title={howToPlay.title} intro={howToPlay.intro} align="split" titleClassName="max-w-[14ch]" />

        <StepRoute />

        <ol className="mt-10 grid gap-4 lg:mt-5 lg:grid-cols-3">
          <StepCard
            n={1}
            title={steps.gta.title}
            text={steps.gta.text}
            action={
              <Button
                variant="ghost"
                block
                onClick={openPlatforms}
                onPointerEnter={preloadPlatforms}
                onFocus={preloadPlatforms}
                icon={<ShoppingCart className="size-4" aria-hidden />}
                aria-haspopup="dialog"
              >
                {steps.gta.cta}
              </Button>
            }
          />
          <StepCard
            n={2}
            title={steps.fivem.title}
            text={steps.fivem.text}
            action={
              <ButtonLink href={siteConfig.links.fivem} isExternal variant="ghost" block icon={<BrandIcon name="fivem" className="size-4" />} arrow="external">
                {steps.fivem.cta}
              </ButtonLink>
            }
          />
          <StepCard
            n={3}
            title={steps.discord.title}
            text={steps.discord.text}
            action={
              <ButtonLink href={siteConfig.links.discord} isExternal variant="ghost" block icon={<BrandIcon name="discord" className="size-4" />} arrow="external">
                {steps.discord.cta}
              </ButtonLink>
            }
          />

          {/* Passo 4: o destino */}
          <m.li
            id="conectar"
            className="connect-panel relative overflow-hidden rounded-[var(--radius-md)] border border-primary/40 p-7 sm:p-10 lg:col-span-3 lg:px-10 lg:py-8"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE_OUT }}
          >
            <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_minmax(0,460px)] lg:gap-16">
              <div>
                <div className="flex items-center gap-4">
                  <StepNode n={4} active />
                  <span className="text-[0.75rem] font-bold tracking-[0.24em] text-primary uppercase">Destino final</span>
                </div>
                <h3 className="display mt-6 text-[clamp(2.5rem,1.8rem+2.4vw,3.5rem)]">{steps.connect.title}</h3>
                <p className="mt-4 max-w-[52ch] text-muted">{steps.connect.text}</p>
              </div>
              <div className="flex flex-col gap-5">
                <Button block onClick={play} icon={<Play className="size-4 fill-current" aria-hidden />}>
                  {steps.connect.cta}
                </Button>
                <ConnectField />
              </div>
            </div>
          </m.li>
        </ol>
      </div>
    </section>
  );
}
