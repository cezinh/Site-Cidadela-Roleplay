import { useCallback, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { AnimatePresence, m, useReducedMotionConfig } from "framer-motion";
import type { PanInfo } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Crown } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";
import { creators, type CreatorRole } from "@/content/content";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { Picture } from "@/components/ui/Picture";

const roles = creators.roles;
const DEFAULT_INDEX = Math.max(0, roles.findIndex((r) => r.featured));

/** Arte padrão (quando não há imagem configurada), no mesmo estilo dos banners "Seja nosso...". */
function CreatorFallback({ role }: { role: CreatorRole }) {
  const Icon = role.icon;
  return (
    <div className="creator-fallback relative flex size-full flex-col items-center justify-center overflow-hidden">
      <p className="-rotate-6 font-sans text-[clamp(1rem,3vw,2rem)] font-bold text-primary italic">Seja nosso</p>
      <p className="display -mt-1 -rotate-3 text-[clamp(2.5rem,9vw,6rem)] leading-none text-white">{role.title}</p>
      <Icon className="mt-4 size-[22%] text-white drop-shadow-[0_0_30px_rgb(242_34_131/0.8)]" strokeWidth={1.2} aria-hidden />
      <span className="absolute inset-x-0 bottom-0 h-[1.6%] bg-primary" />
    </div>
  );
}

function CreatorArt({ role, eager }: { role: CreatorRole; eager?: boolean }) {
  const image = siteConfig.images.creators[role.key];
  if (!image) return <CreatorFallback role={role} />;
  return (
    <Picture
      name={image}
      widths={[640, 1280]}
      sizes="(min-width: 1024px) 760px, 86vw"
      alt={`Seja nosso ${role.title.toLowerCase()}: arte do programa de criadores da Cidadela`}
      loading={eager ? "eager" : "lazy"}
      width={1920}
      height={1080}
      className="size-full object-cover"
    />
  );
}

export function CreatorsSection() {
  const [active, setActive] = useState(DEFAULT_INDEX);
  // Sem giro 3D dos cards com "reduzir movimento" ou modo econômico
  const reduce = useReducedMotionConfig();
  const desktop = useMediaQuery("(min-width: 768px)");
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const role = roles[active];
  const applyLink = siteConfig.links.creatorsApply || siteConfig.links.discord;

  const go = useCallback((i: number) => setActive(((i % roles.length) + roles.length) % roles.length), []);

  // Teclado nas abas: setas trocam o papel, Home/End vão às pontas.
  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const map: Record<string, number> = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: roles.length - 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    const next = ((map[e.key] % roles.length) + roles.length) % roles.length;
    go(next);
    tabsRef.current[next]?.focus();
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -50 || info.velocity.x < -400) go(active + 1);
    else if (info.offset.x > 50 || info.velocity.x > 400) go(active - 1);
  };

  // Posição relativa ao ativo, com volta (3 itens: sempre um de cada lado).
  const relative = (i: number) => {
    const n = roles.length;
    let r = (i - active + n) % n;
    if (r > n / 2) r -= n;
    return r;
  };

  return (
    <section id="criadores" aria-labelledby="criadores-titulo" className="section-y relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "radial-gradient(45% 40% at 50% 55%, rgb(242 34 131 / 0.16), transparent 70%)" }}
      />

      <div className="container-site">
        <SectionHeading id="criadores-titulo" tag={creators.tag} title={creators.title} intro={creators.intro} align="center" titleClassName="max-w-[16ch] lg:max-w-none" introClassName="lg:max-w-none" />

        {/* Abas */}
        <div role="tablist" aria-label="Escolha um papel" className="mx-auto mt-7 flex w-fit gap-1 rounded-full border border-line-strong bg-surface/80 p-1 backdrop-blur-md">
          {roles.map((r, i) => (
            <button
              key={r.key}
              ref={(el) => {
                tabsRef.current[i] = el;
              }}
              role="tab"
              id={`${baseId}-tab-${r.key}`}
              aria-selected={i === active}
              aria-controls={`${baseId}-panel`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => go(i)}
              onKeyDown={onTabKey}
              className={cn(
                "relative flex items-center gap-2 rounded-full px-4 py-2.5 text-[0.75rem] font-bold tracking-[0.14em] uppercase transition-colors duration-300 sm:px-6 sm:text-[0.8125rem]",
                i === active ? "text-white" : "text-white/60 hover:text-white",
              )}
            >
              {i === active && (
                <m.span
                  className="absolute inset-0 -z-10 rounded-full bg-primary shadow-[var(--glow-sm)]"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, ease: EASE_OUT }}
                />
              )}
              <Crown className="size-3.5" aria-hidden />
              {r.title}
            </button>
          ))}
        </div>

        {/* Palco em perspectiva */}
        <m.div
          className="relative mx-auto mt-8 w-[82%] max-w-[640px] touch-pan-y select-none [perspective:1600px] md:w-[54%]"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={onDragEnd}
        >
          <div className="aspect-video" />
          {roles.map((r, i) => {
            const rel = relative(i);
            const isActive = rel === 0;
            const offset = desktop ? 64 : 76;
            return (
              <m.button
                key={r.key}
                type="button"
                tabIndex={-1}
                aria-hidden={!isActive}
                onClick={() => !isActive && go(i)}
                className={cn(
                  "creator-card absolute inset-0 overflow-hidden rounded-[var(--radius-md)] border bg-surface text-left",
                  isActive ? "cursor-default border-primary/50" : "cursor-pointer border-line",
                )}
                style={{ zIndex: isActive ? 3 : 1, transformStyle: "preserve-3d" }}
                initial={false}
                animate={{
                  x: `${rel * offset}%`,
                  scale: isActive ? 1 : 0.74,
                  rotateY: reduce ? 0 : rel * -22,
                  opacity: isActive ? 1 : 0.55,
                  filter: isActive ? "brightness(1)" : "brightness(0.55)",
                }}
                transition={{ duration: 0.8, ease: EASE_OUT }}
              >
                <CreatorArt role={r} eager={r.featured} />
                <span
                  aria-hidden
                  className="absolute top-3 left-3 grid size-9 place-items-center rounded-full bg-primary text-white shadow-[var(--glow-sm)] sm:top-4 sm:left-4"
                >
                  <Crown className="size-4" />
                </span>
                {isActive && <span aria-hidden className="creator-shine pointer-events-none absolute inset-0" />}
              </m.button>
            );
          })}

          {/* Setas */}
          <button
            type="button"
            onClick={() => go(active - 1)}
            aria-label="Papel anterior"
            className="absolute top-1/2 -left-4 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-line-strong bg-background/80 text-white backdrop-blur-md transition-colors hover:border-primary hover:bg-primary sm:-left-6"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => go(active + 1)}
            aria-label="Próximo papel"
            className="absolute top-1/2 -right-4 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-line-strong bg-background/80 text-white backdrop-blur-md transition-colors hover:border-primary hover:bg-primary sm:-right-6"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </m.div>

        {/* Detalhes do papel ativo */}
        <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-tab-${role.key}`} className="mx-auto mt-8 max-w-[960px] sm:mt-10">
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={role.key}
              className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end md:gap-12"
              initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
            >
              <div>
                <h3 className="display text-[clamp(2.5rem,1.8rem+2vw,3.25rem)]">
                  <span className="mr-3 font-sans text-[0.45em] font-bold tracking-normal text-primary normal-case italic">Seja nosso</span>
                  {role.title}
                </h3>
                <p className="mt-4 max-w-[56ch] text-muted">{role.description}</p>
                <ul className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6">
                  {role.tasks.map((t) => (
                    <li key={t} className="flex items-center gap-2.5 text-[0.9375rem] text-white/85">
                      <span className="grid size-5 flex-none place-items-center rounded-full bg-primary/15 text-primary">
                        <Check className="size-3" strokeWidth={3} aria-hidden />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-3 md:items-end">
                <ButtonLink href={applyLink} isExternal icon={<BrandIcon name="discord" className="size-5" />} arrow="external">
                  {role.cta}
                </ButtonLink>
                <p className="text-[0.8125rem] text-subtle">{creators.applyNote}</p>
              </div>
            </m.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
