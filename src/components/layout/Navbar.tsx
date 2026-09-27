import { useEffect, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Menu, Play, X } from "lucide-react";
import { navLinks } from "@/content/content";
import { siteConfig } from "@/config/siteConfig";
import { useUI } from "@/context/UIContext";
import { useScrolled } from "@/hooks/useScrolled";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { cn, external, scrollToId } from "@/lib/utils";
import { EASE_OUT } from "@/lib/motion";
// No menu mobile os ícones incluem o Discord (mesma lista do Hero)
import { heroLinks as socialLinks } from "@/lib/social";
import { Button } from "@/components/ui/Button";
import { BrandIcon } from "@/components/ui/BrandIcon";

const sectionIds = navLinks.map((l) => l.id);

export function Navbar({ ready }: { ready: boolean }) {
  const scrolled = useScrolled(24);
  const active = useActiveSection(sectionIds);
  const { play } = useUI();
  const [open, setOpen] = useState(false);

  useLockBodyScroll(open);

  // Fecha o menu mobile com ESC e ao voltar para desktop.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const mql = window.matchMedia("(min-width: 1280px)");
    const onChange = () => mql.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mql.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("keydown", onKey);
      mql.removeEventListener("change", onChange);
    };
  }, [open]);

  const go = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(id);
  };

  return (
    <m.header
      className="fixed inset-x-0 top-0 z-50"
      initial={{ opacity: 0, y: -16 }}
      animate={ready ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.9, delay: 0.9, ease: EASE_OUT }}
    >
      {/* Fundo que aparece ao rolar */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 border-b transition-all duration-500",
          scrolled || open
            ? "border-line bg-background/72 backdrop-blur-xl backdrop-saturate-150"
            : "border-transparent bg-transparent",
        )}
      />

      <nav aria-label="Principal" className="container-site relative flex h-[var(--nav-h)] items-center justify-between gap-6">
        <a href="#inicio" onClick={go("inicio")} className="relative z-10 flex-none" aria-label={`${siteConfig.name} — início`}>
          {/* Logo com "falha" de sinal a cada 5s (camadas rosa/ciano usam o próprio logo como máscara) */}
          <span
            className={cn(
              "logo-glitch block transition-all duration-500",
              ready && "is-live",
              scrolled ? "w-[74px]" : "w-[84px] sm:w-[92px]",
            )}
            style={{ "--logo": "url(/images/logo-marca-240.webp)", "--glitch-amp": 2.6 } as CSSProperties}
          >
            <img
              src="/images/logo-marca-240.webp"
              srcSet="/images/logo-marca-240.webp 1x, /images/logo-marca-480.webp 2x"
              alt=""
              width={240}
              height={151}
              className="relative block h-auto w-full"
            />
          </span>
        </a>

        <ul className="hidden items-center xl:flex 2xl:gap-1">
          {navLinks.map((link) => (
            <li key={link.id} className={cn(!link.compact && "hidden 2xl:block")}>
              <a
                href={`#${link.id}`}
                onClick={go(link.id)}
                aria-current={active === link.id ? "true" : undefined}
                className={cn(
                  "link-underline px-3 py-2 text-[0.8125rem] font-semibold tracking-[0.14em] uppercase transition-colors duration-300",
                  active === link.id ? "text-white" : "text-white/64 hover:text-white",
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="relative z-10 flex items-center gap-2">
          <Button size="sm" onClick={play} icon={<Play className="size-3.5 fill-current" aria-hidden />} className="max-[380px]:px-4">
            Jogar agora
          </Button>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-[var(--radius-xs)] border border-line-strong text-white transition-colors hover:border-primary/60 xl:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </nav>

      {/* Menu mobile em tela cheia */}
      <AnimatePresence>
        {open && (
          <m.div
            id="menu-mobile"
            className="fixed inset-0 top-[var(--nav-h)] z-40 flex flex-col overflow-y-auto bg-background/96 backdrop-blur-2xl xl:hidden"
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(80% 50% at 100% 100%, rgb(242 34 131 / 0.18), transparent 70%)" }}
            />
            <ul className="container-site relative flex flex-col pt-6">
              {navLinks.map((link, i) => (
                <m.li
                  key={link.id}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.08 + i * 0.05, ease: EASE_OUT }}
                  className="border-b border-line"
                >
                  <a
                    href={`#${link.id}`}
                    onClick={go(link.id)}
                    aria-current={active === link.id ? "true" : undefined}
                    className={cn(
                      "display flex items-center justify-between py-3 text-[clamp(2.125rem,9vw,3rem)] transition-colors",
                      active === link.id ? "text-primary" : "text-white active:text-primary",
                    )}
                  >
                    {link.label}
                  </a>
                </m.li>
              ))}
            </ul>

            <m.div
              className="container-site relative mt-auto flex flex-col gap-6 pt-10 pb-[max(2rem,env(safe-area-inset-bottom))]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: EASE_OUT }}
            >
              <Button block onClick={() => { setOpen(false); play(); }} icon={<Play className="size-4 fill-current" aria-hidden />}>
                Jogar agora
              </Button>
              {socialLinks.length > 0 && (
                <ul className="flex items-center justify-center gap-2">
                  {socialLinks.map((s) => (
                    <li key={s.brand}>
                      <a
                        href={s.href}
                        {...external}
                        aria-label={s.label}
                        className="grid size-12 place-items-center rounded-full border border-line text-white/80 transition-colors hover:border-primary hover:text-white"
                      >
                        <BrandIcon name={s.brand} className="size-5" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </m.header>
  );
}
