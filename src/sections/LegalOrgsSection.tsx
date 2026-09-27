import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { AnimatePresence, m, useInView, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";
import { legalOrgs, type OrgKey, type PoliceUnit } from "@/content/content";
import { useSpotlight } from "@/hooks/useSpotlight";
import { EASE_OUT, inView, riseIn, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { Picture } from "@/components/ui/Picture";
import { UnitEmblem } from "@/components/art/UnitEmblem";

const police: PoliceUnit[] = [legalOrgs.police, ...legalOrgs.units];
const applyLink = siteConfig.links.discord;

function StatusBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-primary/50 bg-background/80 px-3 py-1.5 text-[0.6875rem] font-bold tracking-[0.18em] text-white uppercase backdrop-blur-md",
        className,
      )}
    >
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-70" />
        <span className="relative inline-flex size-2 rounded-full bg-primary" />
      </span>
      {legalOrgs.status}
    </span>
  );
}

function Poster({ image, alt, eager }: { image: string; alt: string; eager?: boolean }) {
  return (
    <Picture
      name={image}
      widths={[640, 1000]}
      sizes="(min-width: 1024px) 440px, 90vw"
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      width={2000}
      height={2500}
      className="size-full object-cover"
    />
  );
}

/** Tempo de cada unidade na troca automática, e a pausa maior depois de um clique. */
const AUTOPLAY_MS = 5000;
const AFTER_CLICK_MS = 10000;

/** Polícia: pôster da unidade selecionada + brasões. As unidades trocam sozinhas enquanto a seção está na tela. */
function PoliceBlock() {
  const [selected, setSelected] = useState<OrgKey>("rpm");
  const [delay, setDelay] = useState(AUTOPLAY_MS);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  // Só pausa quando o bloco sai da tela por completo (ou durante navegação por teclado).
  const visible = useInView(blockRef, { amount: 0 });
  const reduce = useReducedMotion();
  const unit = police.find((u) => u.key === selected) ?? police[0];
  const index = police.indexOf(unit);

  const autoplay = !reduce;
  const running = autoplay && visible && !keyboardFocus;

  const choose = (i: number, manual: boolean) => {
    setSelected(police[(i + police.length) % police.length].key);
    setDelay(manual ? AFTER_CLICK_MS : AUTOPLAY_MS);
  };

  // No celular a fileira de brasões rola na horizontal: mantém a unidade ativa à vista.
  useEffect(() => {
    const list = listRef.current;
    const tab = tabs.current[index];
    if (!list || !tab || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({ left: tab.offsetLeft - list.clientWidth / 2 + tab.clientWidth / 2, behavior: reduce ? "auto" : "smooth" });
  }, [index, reduce]);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const map: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: police.length - 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    const next = (map[e.key] + police.length) % police.length;
    choose(next, true);
    tabs.current[next]?.focus();
  };

  const tab = (u: PoliceUnit, i: number, main?: boolean) => {
    const active = u.key === selected;
    return (
      <button
        key={u.key}
        ref={(el) => {
          tabs.current[i] = el;
        }}
        role="tab"
        id={`${baseId}-tab-${u.key}`}
        aria-selected={active}
        aria-controls={`${baseId}-panel`}
        aria-label={`${u.acronym}, ${u.name}`}
        tabIndex={active ? 0 : -1}
        onClick={() => choose(i, true)}
        onKeyDown={onKey}
        className={cn(
          "group flex flex-none snap-start flex-col items-center gap-2 rounded-[var(--radius-md)] p-2 transition-colors duration-300",
          active ? "bg-primary/10" : "hover:bg-white/[0.03]",
        )}
      >
        <span
          className={cn(
            "block rounded-full transition-all duration-500 ease-[var(--ease-out-expo)]",
            main ? "size-24 lg:size-20 xl:size-24" : "size-[72px] lg:size-16 xl:size-[76px]",
            active
              ? "scale-105 shadow-[0_0_0_2px_var(--color-primary),0_14px_40px_-10px_rgb(242_34_131/0.7)]"
              : "opacity-70 grayscale group-hover:-translate-y-1 group-hover:opacity-100 group-hover:grayscale-0",
          )}
        >
          <UnitEmblem acronym={u.acronym} name={u.name} icon={u.icon} image={siteConfig.images.orgs[u.key] || undefined} className="size-full" />
        </span>
        <span className={cn("display text-[1.125rem] leading-none", active ? "text-white" : "text-white/60")}>{u.acronym}</span>
        {main && <span className="-mt-1 text-[0.625rem] font-bold tracking-[0.2em] text-primary uppercase">Principal</span>}
        {/* Tempo até a próxima unidade: quando a barra enche, a troca acontece */}
        {autoplay && (
          <span aria-hidden className="relative h-[2px] w-10 overflow-hidden rounded-full bg-white/10">
            {active && (
              <span
                key={`${selected}-${delay}`}
                className="org-progress absolute inset-0 origin-left bg-primary"
                style={{ animationDuration: `${delay}ms`, animationPlayState: running ? "running" : "paused" }}
                onAnimationEnd={() => choose(index + 1, false)}
              />
            )}
          </span>
        )}
      </button>
    );
  };

  return (
    <div
      ref={blockRef}
      className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12"
      onFocus={(e) => setKeyboardFocus(e.target.matches(":focus-visible"))}
      onBlur={() => setKeyboardFocus(false)}
    >
      {/* Pôsteres empilhados: só o da unidade ativa aparece (troca sem piscar, todos já carregados) */}
      <m.div
        className="org-stage relative mx-auto aspect-[4/5] w-full max-w-[440px] overflow-hidden rounded-[var(--radius-lg)] border border-line-strong shadow-[var(--shadow-panel),var(--glow-lg)] lg:col-span-5 lg:mx-0"
        initial={{ opacity: 0, y: 40, clipPath: "inset(8% 0% 8% 0% round 16px)" }}
        whileInView={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0% round 16px)" }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.1, ease: EASE_OUT }}
      >
        {police.map((u) => {
          const poster = siteConfig.images.orgs[u.key];
          const active = u.key === unit.key;
          return (
            <div
              key={u.key}
              aria-hidden={!active}
              className={cn(
                "absolute inset-0 transition-[opacity,transform] duration-[900ms] ease-[var(--ease-out-expo)]",
                active ? "scale-100 opacity-100" : "scale-[1.05] opacity-0",
              )}
            >
              {poster ? (
                <Poster image={poster} alt={`${u.acronym} disponível: ${u.name} da Cidadela`} eager={u.key === "rpm"} />
              ) : (
                <div className="grid size-full place-items-center p-10">
                  <UnitEmblem acronym={u.acronym} name={u.name} icon={u.icon} className="w-full max-w-[320px]" />
                </div>
              )}
            </div>
          );
        })}
      </m.div>

      {/* Detalhes + seletor de unidades */}
      <div className="flex min-w-0 flex-col lg:col-span-7 lg:py-4">
        <div
          id={`${baseId}-panel`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${unit.key}`}
          aria-live={running ? "off" : "polite"}
          className="min-h-[250px] sm:min-h-[210px]"
        >
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={unit.key}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
            >
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-[0.75rem] font-bold tracking-[0.22em] text-subtle uppercase">
                  {unit.key === "rpm" ? "Polícia da Cidadela" : "Unidade da RPM"}
                </p>
                <StatusBadge />
              </div>
              <h3 className="display mt-4 text-[clamp(3.5rem,2rem+4vw,5.25rem)] leading-[0.9]">{unit.acronym}</h3>
              <p className="display mt-2 text-[clamp(1.375rem,1.1rem+1vw,2rem)] text-primary">{unit.name}</p>
              <p className="mt-5 max-w-[52ch] text-muted">{unit.description}</p>
            </m.div>
          </AnimatePresence>
        </div>

        <ButtonLink href={applyLink} isExternal className="mt-6 self-start" icon={<BrandIcon name="discord" className="size-5" />} arrow="external">
          {legalOrgs.cta}
        </ButtonLink>

        <div className="mt-8 border-t border-line pt-6">
          <p className="text-[0.75rem] font-bold tracking-[0.22em] text-subtle uppercase">{legalOrgs.unitsLabel}</p>
          <div
            ref={listRef}
            role="tablist"
            aria-label="Polícia e unidades especializadas"
            className="no-scrollbar relative -mx-2 mt-5 flex snap-x items-start gap-1 overflow-x-auto pb-2"
          >
            {tab(police[0], 0, true)}
            <span aria-hidden className="mx-1 mt-12 h-px w-5 flex-none bg-line-strong" />
            {police.slice(1).map((u, i) => tab(u, i + 1))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Hospital e Mecânica: faixa de destaque com o pôster grande, alternando o lado. */
function ServiceFeature({ service, index }: { service: (typeof legalOrgs.services)[number]; index: number }) {
  const onPointerMove = useSpotlight<HTMLElement>();
  const poster = siteConfig.images.orgs[service.key];
  const Icon = service.icon;
  const flip = index % 2 === 1;

  return (
    <m.article
      onPointerMove={onPointerMove}
      className="service-feature spotlight group relative isolate grid items-center gap-10 overflow-hidden rounded-[var(--radius-lg)] border border-line p-5 sm:p-8 lg:grid-cols-12 lg:gap-14 lg:p-10"
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.1, ease: EASE_OUT }}
    >
      {/* Palavra gigante ao fundo */}
      <span
        aria-hidden
        className={cn(
          "display pointer-events-none absolute -bottom-[0.18em] -z-10 text-[clamp(7rem,18vw,17rem)] leading-none text-white/[0.03] transition-colors duration-700 group-hover:text-primary/[0.07]",
          flip ? "-left-[0.04em]" : "-right-[0.04em]",
        )}
      >
        {service.title}
      </span>

      {/* Pôster */}
      <div className={cn("relative mx-auto w-full max-w-[420px] lg:col-span-5 lg:max-w-none", flip && "lg:order-2")}>
        <div
          className={cn(
            "service-poster relative aspect-[4/5] overflow-hidden rounded-[var(--radius-md)] border border-line-strong shadow-[var(--shadow-panel),var(--glow-lg)]",
            flip ? "lg:rotate-[1.5deg]" : "lg:-rotate-[1.5deg]",
          )}
        >
          {poster ? (
            <Poster image={poster} alt={`${service.title} disponível na Cidadela`} />
          ) : (
            <div className="grid size-full place-items-center bg-surface-2">
              <Icon className="size-24 text-primary" strokeWidth={1} aria-hidden />
            </div>
          )}
        </div>
        <StatusBadge className="absolute top-4 left-4 shadow-[var(--glow-sm)]" />
      </div>

      {/* Texto */}
      <div className={cn("relative lg:col-span-7", flip && "lg:order-1")}>
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-[var(--radius-sm)] bg-primary text-white shadow-[var(--glow-sm)]">
            <Icon className="size-5" aria-hidden />
          </span>
          <span className="text-[0.75rem] font-bold tracking-[0.22em] text-subtle uppercase">{service.subtitle}</span>
        </div>
        <h4 className="display mt-6 text-[clamp(3.25rem,2rem+4.4vw,6rem)] leading-[0.9]">{service.title}</h4>
        <p className="mt-5 max-w-[50ch] text-muted">{service.description}</p>
        <ul className="mt-7 flex flex-col gap-3">
          {service.bullets.map((b) => (
            <li key={b} className="flex items-center gap-3 text-[0.9375rem] text-white/85">
              <span className="grid size-5 flex-none place-items-center rounded-full bg-primary/15 text-primary">
                <Check className="size-3" strokeWidth={3} aria-hidden />
              </span>
              {b}
            </li>
          ))}
        </ul>
        <ButtonLink href={applyLink} isExternal className="mt-9" icon={<BrandIcon name="discord" className="size-5" />} arrow="external">
          {legalOrgs.cta}
        </ButtonLink>
      </div>
    </m.article>
  );
}

export function LegalOrgsSection() {
  return (
    <section id="organizacoes" aria-labelledby="organizacoes-titulo" className="section-y relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "radial-gradient(40% 35% at 20% 35%, rgb(242 34 131 / 0.10), transparent 70%)" }}
      />
      <div className="container-site">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <m.div variants={stagger(0.09)} initial="hidden" whileInView="show" viewport={inView} className="flex flex-col gap-6 lg:col-span-7">
            <m.p variants={riseIn} className="tag">
              {legalOrgs.tag}
            </m.p>
            <m.h2 variants={riseIn} id="organizacoes-titulo" className="display h2 max-w-[16ch]">
              {legalOrgs.title}
            </m.h2>
          </m.div>
          <m.p
            className="lead lg:col-span-5 lg:pb-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE_OUT }}
          >
            {legalOrgs.intro}
          </m.p>
        </div>

        <div className="mt-10 lg:mt-12">
          <PoliceBlock />
        </div>

        {/* Saúde e serviços */}
        <div className="mt-28 lg:mt-36">
          <m.div
            className="grid gap-6 lg:grid-cols-12 lg:items-end"
            variants={stagger(0.09)}
            initial="hidden"
            whileInView="show"
            viewport={inView}
          >
            <div className="flex flex-col gap-5 lg:col-span-7">
              <m.p variants={riseIn} className="tag">
                {legalOrgs.servicesIntro.tag}
              </m.p>
              <m.h3 variants={riseIn} className="display text-[clamp(2.5rem,1.4rem+3.8vw,5rem)]">
                {legalOrgs.servicesIntro.title}
              </m.h3>
            </div>
            <m.p variants={riseIn} className="lead lg:col-span-5 lg:pb-1">
              {legalOrgs.servicesIntro.text}
            </m.p>
          </m.div>

          <div className="mt-12 flex flex-col gap-5 lg:mt-16 lg:gap-6">
            {legalOrgs.services.map((s, i) => (
              <ServiceFeature key={s.key} service={s} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
