import { m } from "framer-motion";
import { Navigation } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";
import { about } from "@/content/content";
import { EASE_OUT, inView, riseIn, stagger } from "@/lib/motion";
import { scrollToId } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { CityMap } from "@/components/art/CityMap";

export function AboutSection() {
  const photo = siteConfig.images.about;

  return (
    <section id="sobre" aria-labelledby="sobre-titulo" className="section-y relative overflow-hidden">
      {/* Luz ambiente */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "radial-gradient(50% 40% at 85% 45%, rgb(242 34 131 / 0.10), transparent 70%)" }}
      />

      <div className="container-site grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
        {/* Texto */}
        <div className="lg:col-span-6 lg:pr-6 xl:pr-12">
          <SectionHeading id="sobre-titulo" tag={about.tag} title={about.title} />

          <m.div
            className="mt-10 flex max-w-[60ch] flex-col gap-5 text-[1.0625rem] leading-[1.75] text-muted"
            variants={stagger(0.1, 0.15)}
            initial="hidden"
            whileInView="show"
            viewport={inView}
          >
            {about.paragraphs.map((p, i) => (
              <m.p key={i} variants={riseIn} className={i === about.paragraphs.length - 1 ? "text-white" : undefined}>
                {p}
              </m.p>
            ))}
            <m.div variants={riseIn} className="mt-4">
              <ButtonLink
                href="#como-jogar"
                variant="ghost"
                arrow="next"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("como-jogar");
                }}
              >
                Ver como entrar
              </ButtonLink>
            </m.div>
          </m.div>
        </div>

        {/* Mapa / imagem */}
        <div className="relative mx-auto w-full max-w-[560px] lg:col-span-6 lg:mr-0">
          <m.figure
            className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-md)] border border-line bg-surface shadow-[var(--shadow-panel)]"
            initial={{ clipPath: "inset(12% 0% 12% 0% round 10px)", opacity: 0 }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0% round 10px)", opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, ease: EASE_OUT }}
          >
            {photo ? (
              <img src={photo} alt="Cena da cidade na Cidadela Roleplay" loading="lazy" className="size-full object-cover" />
            ) : (
              <CityMap className="size-full" />
            )}

            {/* HUD do mapa */}
            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-5">
              <span className="flex items-center gap-2 rounded-full border border-line-strong bg-background/70 px-3 py-1.5 text-[0.6875rem] font-bold tracking-[0.2em] text-white uppercase backdrop-blur-md">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-70" />
                  <span className="relative inline-flex size-2 rounded-full bg-primary" />
                </span>
                GPS
              </span>
              <span className="grid size-9 place-items-center rounded-full border border-line-strong bg-background/70 text-[0.6875rem] font-bold text-white backdrop-blur-md" aria-hidden>
                N
              </span>
            </div>
            <figcaption className="sr-only">{about.mapCaption}</figcaption>
          </m.figure>

          {/* Objetivo em estilo legenda de missão, sobreposto ao mapa */}
          <m.div
            aria-hidden
            className="absolute -bottom-6 left-4 flex max-w-[calc(100%-2rem)] items-center gap-3 rounded-[var(--radius-sm)] border border-line-strong bg-background/90 px-5 py-4 shadow-[var(--shadow-panel)] backdrop-blur-md lg:-left-10"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9, delay: 0.5, ease: EASE_OUT }}
          >
            <Navigation className="size-5 flex-none rotate-45 fill-primary text-primary" />
            <p className="display text-[1.5rem] leading-none sm:text-[1.75rem]">
              Vá até a <span className="text-primary">Cidadela</span>.
            </p>
          </m.div>
        </div>
      </div>
    </section>
  );
}
