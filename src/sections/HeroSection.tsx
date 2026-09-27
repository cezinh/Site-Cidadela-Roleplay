import { useRef } from "react";
import type { PointerEvent } from "react";
import { m, useMotionValue, useReducedMotionConfig, useScroll, useSpring, useTransform } from "framer-motion";
import { Heart, Play } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";
import { hero } from "@/content/content";
import { useUI } from "@/context/UIContext";
import { useFinePointer, useMediaQuery } from "@/hooks/useMediaQuery";
import { EASE_OUT } from "@/lib/motion";
import { external, scrollToId } from "@/lib/utils";
import { heroLinks } from "@/lib/social";
import { Button, ButtonLink } from "@/components/ui/Button";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { Picture } from "@/components/ui/Picture";
import { Skyline } from "@/components/art/Skyline";

/** Entrada do Hero: sobe, aparece e ganha foco. Só anima depois do carregamento (`ready`). */
const enter = (ready: boolean, delay: number, from: Record<string, number | string> = { y: 24 }) => ({
  initial: { opacity: 0, filter: "blur(10px)", ...from },
  animate: ready ? { opacity: 1, filter: "blur(0px)", y: 0, x: 0, scale: 1 } : undefined,
  transition: { duration: 1.1, delay, ease: EASE_OUT },
});

export function HeroSection({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { play } = useUI();
  // true com "reduzir movimento" do sistema OU com o modo econômico ligado (sem parallax)
  const reduce = useReducedMotionConfig();
  const finePointer = useFinePointer();
  // No mobile o Hero é mais alto que a tela, então o conteúdo não pode sumir ao rolar.
  const desktop = useMediaQuery("(min-width: 1024px)");
  const moveContent = desktop && !reduce;

  // Parallax de scroll: camadas se movem em velocidades diferentes enquanto o Hero sai da tela.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "22%"]);
  const charY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "12%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", moveContent ? "-18%" : "0%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, moveContent ? 0 : 1]);

  // Parallax de cursor (só desktop): o personagem e o fundo reagem levemente ao mouse.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 20, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 60, damping: 20, mass: 0.6 });
  const charX = useTransform(sx, (v) => v * -14);
  const charYp = useTransform(sy, (v) => v * -8);
  const texX = useTransform(sx, (v) => v * 22);
  const texY = useTransform(sy, (v) => v * 14);
  const glowX = useTransform(sx, (v) => `${v * 3}%`);

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (!finePointer || reduce || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    py.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  };

  const heroPhoto = siteConfig.images.hero;
  const heroLogo = siteConfig.heroLogoWithTagline ? "logo-cidadela" : "logo-marca";

  return (
    <section
      id="inicio"
      ref={ref}
      onPointerMove={onPointerMove}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden lg:min-h-[max(100svh,600px)]"
    >
      {/* ---------------- FUNDO ---------------- */}
      <m.div aria-hidden className="absolute inset-0 -z-10" style={{ y: bgY }}>
        <m.div
          className="absolute inset-[-4%]"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={ready ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 1.8, ease: EASE_OUT }}
        >
          <m.div className="absolute inset-0" style={{ x: texX, y: texY }}>
            {heroPhoto ? (
              <img src={heroPhoto} alt="" className="size-full object-cover opacity-70" fetchPriority="high" />
            ) : (
              <picture>
                <source type="image/avif" srcSet="/images/textura-960.avif 960w, /images/textura-1920.avif 1920w" sizes="100vw" />
                <img
                  src="/images/textura-1920.webp"
                  srcSet="/images/textura-960.webp 960w, /images/textura-1920.webp 1920w"
                  sizes="100vw"
                  alt=""
                  fetchPriority="high"
                  className="hero-texture size-full object-cover"
                />
              </picture>
            )}
          </m.div>
        </m.div>

        {/* Luz rosa atrás do personagem */}
        <m.div
          className="absolute inset-0"
          style={{
            x: glowX,
            background:
              "radial-gradient(42% 58% at 72% 58%, rgb(242 34 131 / 0.34), transparent 70%), radial-gradient(30% 30% at 78% 30%, rgb(254 33 123 / 0.14), transparent 70%)",
          }}
        />

        {/* Cidade no horizonte */}
        <Skyline className="absolute inset-x-0 bottom-0 h-[46%] w-full opacity-95 lg:h-[52%]" />

        {/* Escurecimento para leitura do texto + vinheta */}
        <div className="hero-shade absolute inset-0" />
      </m.div>

      {/* ---------------- PERSONAGEM ---------------- */}
      <m.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[calc(var(--nav-h)-8px)] -z-[5] flex justify-end lg:top-auto lg:bottom-0"
        style={{ y: charY }}
      >
        <div className="container-site relative flex justify-end">
          <m.div
            style={{ x: charX, y: charYp }}
            initial={{ opacity: 0, x: 80, filter: "blur(14px)" }}
            animate={ready ? { opacity: 1, x: 0, filter: "blur(0px)" } : undefined}
            transition={{ duration: 1.5, delay: 0.15, ease: EASE_OUT }}
            className="relative isolate -mr-[16vw] w-[min(100vw,520px)] sm:-mr-[6vw] lg:mr-[-2vw] lg:w-[min(46vw,calc(94svh*0.709),720px)]"
          >
            <div className="hero-character relative">
              <Picture
                name="personagem"
                widths={[640, 1000, 1400]}
                sizes="(min-width: 1024px) 44vw, 92vw"
                alt=""
                loading="eager"
                fetchPriority="high"
                width={1384}
                height={1952}
                className="h-auto w-full"
              />
            </div>
          </m.div>
        </div>
      </m.div>

      {/* Sombra na frente do personagem (mobile/tablet), para o texto ficar legível por cima dele */}
      <div aria-hidden className="hero-shade-front pointer-events-none absolute inset-0 -z-[4] lg:hidden" />

      {/* ---------------- CONTEÚDO ---------------- */}
      <m.div
        className="container-site relative flex flex-1 flex-col justify-start pt-[calc(var(--nav-h)+max(22svh,150px))] pb-12 sm:pt-[calc(var(--nav-h)+30svh)] lg:justify-center lg:pt-[var(--nav-h)] lg:pb-[max(2rem,6svh)]"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {/* No desktop, tamanhos acompanham a altura da tela: tudo cabe na primeira dobra. */}
        <div className="max-w-[640px] lg:max-w-[760px]">
          <m.p className="tag mb-[3svh] max-lg:hidden [@media(max-height:820px)]:hidden" {...enter(ready, 0.35)}>
            {hero.tag}
          </m.p>

          <m.div
            className="-ml-[2%] w-[min(420px,76vw)] lg:w-[min(480px,32vw,calc(29svh*1.585))] [@media(min-width:1024px)_and_(max-height:780px)]:w-[calc(23svh*1.585)]"
            {...enter(ready, 0.45, { scale: 0.92 })}
          >
            <img
              src={`/images/${heroLogo}-640.webp`}
              srcSet={`/images/${heroLogo}-640.webp 640w, /images/${heroLogo}-1200.webp 1200w`}
              sizes="(min-width: 1024px) 480px, 80vw"
              alt={siteConfig.name}
              width={640}
              height={404}
              fetchPriority="high"
              className="hero-logo relative block h-auto w-full"
            />
          </m.div>

          <h1
            id="hero-title"
            className="display mt-6 text-[clamp(2.6rem,1.1rem+4.2vw,5rem)] lg:mt-[2.6svh] lg:text-[clamp(2.75rem,min(1rem+3vw,7.6svh),4.75rem)] lg:whitespace-nowrap"
          >
            <span className="sr-only">{siteConfig.name}: </span>
            {hero.titleLines.map((line, i) => (
              <span key={line} className="-mt-[0.14em] block overflow-hidden pt-[0.14em] pb-[0.04em]">
                <m.span
                  className="block"
                  initial={{ y: "105%" }}
                  animate={ready ? { y: "0%" } : undefined}
                  transition={{ duration: 1.1, delay: 0.7 + i * 0.1, ease: EASE_OUT }}
                >
                  {line}
                </m.span>
              </span>
            ))}
          </h1>

          <m.p
            className="lead mt-5 max-w-[44ch] lg:mt-[2.2svh] lg:max-w-[52ch] [@media(min-width:1024px)_and_(max-height:780px)]:text-base"
            {...enter(ready, 0.95)}
          >
            {hero.description}
          </m.p>

          <m.div
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:mt-[3.4svh]"
            {...enter(ready, 1.08)}
          >
            <Button onClick={play} icon={<Play className="size-4 fill-current" aria-hidden />} className="sm:min-w-[210px]">
              Jogar agora
            </Button>
            <ButtonLink
              href="#sobre"
              variant="ghost"
              arrow="next"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("sobre");
              }}
            >
              Conhecer a cidade
            </ButtonLink>
          </m.div>
        </div>
      </m.div>

      {/* ---------------- RODAPÉ DO HERO ---------------- */}
      <m.div
        className="container-site relative hidden items-end justify-between pb-8 md:flex [@media(max-height:780px)]:pb-4"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : undefined}
        transition={{ duration: 1.2, delay: 1.3, ease: EASE_OUT }}
      >
        <div className="flex items-center gap-4">
          <img src="/images/selo-classificacao-160.webp" alt="Selo de classificação Cidadela" width={160} height={223} className="h-auto w-[46px]" />
          <p className="text-[0.75rem] leading-snug font-semibold tracking-[0.18em] text-white/55 uppercase">
            A cidade feita
            <br />
            <span className="inline-flex items-center gap-1.5">
              para você
              <Heart className="size-3.5 fill-primary text-primary" aria-label="com carinho" />
            </span>
          </p>
        </div>

        {heroLinks.length > 0 && (
          // Centralizados no rodapé do Hero (o canto direito fica livre para o botão do modo econômico)
          <ul className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-3 [@media(max-height:780px)]:bottom-4">
            {heroLinks.map((s, i) => (
              <li key={s.brand}>
                <a
                  href={s.href}
                  {...external}
                  aria-label={s.label}
                  className="spark-orbit grid size-11 place-items-center rounded-full border border-line-strong bg-white/[0.03] text-white/80 transition-all duration-300 hover:border-primary/60 hover:bg-primary/10 hover:text-primary"
                >
                  {/* Luz correndo pela borda; os ícones alternam o sentido do giro */}
                  <span aria-hidden className={i % 2 === 1 ? "spark spark--reverse" : "spark"} />
                  <BrandIcon name={s.brand} className="size-[18px]" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </m.div>
    </section>
  );
}
