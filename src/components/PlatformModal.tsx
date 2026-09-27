import { useEffect, useId, useRef } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";
import { external } from "@/lib/utils";
import { EASE_OUT } from "@/lib/motion";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { BrandIcon, type Brand } from "@/components/ui/BrandIcon";

type Platform = { brand: Brand; name: string; description: string; href: string };

const platforms: Platform[] = [
  { brand: "steam", name: "Steam", description: "GTA V na Steam. Compre e instale com a sua conta de sempre.", href: siteConfig.links.gtaSteam },
  { brand: "epic", name: "Epic Games", description: "GTA V na Epic Games Store, pelo launcher da Epic.", href: siteConfig.links.gtaEpic },
  { brand: "rockstar", name: "Rockstar Games", description: "Direto da fonte, pelo Rockstar Games Launcher.", href: siteConfig.links.gtaRockstar },
];

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

type Props = { open: boolean; onClose: () => void };

export default function PlatformModal({ open, onClose }: Props) {
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    const t = window.setTimeout(() => closeRef.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      returnFocus.current?.focus?.();
    };
  }, [open, onClose]);

  // Mantém o foco do teclado dentro do modal.
  const trapFocus = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab" || !panelRef.current) return;
    const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <m.div
          className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
          transition={{ duration: 0.35 }}
        >
          {/* Fundo: clique fecha */}
          <div className="absolute inset-0 bg-background/75 backdrop-blur-md" onClick={onClose} aria-hidden />

          <m.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            onKeyDown={trapFocus}
            className="relative w-full max-w-[880px] overflow-hidden rounded-t-[var(--radius-lg)] border border-line-strong bg-surface shadow-[var(--shadow-panel),var(--glow-lg)] sm:rounded-[var(--radius-lg)]"
            initial={{ opacity: 0, y: 40, scale: 0.97, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 24, scale: 0.98, transition: { duration: 0.25 } }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
          >
            {/* Luz rosa no topo + textura */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-90"
              style={{ background: "radial-gradient(60% 100% at 50% 0%, rgb(242 34 131 / 0.28), transparent 70%)" }}
            />
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-10 grid size-11 place-items-center rounded-full border border-line text-muted transition-all duration-300 hover:rotate-90 hover:border-primary/60 hover:text-white"
              aria-label="Fechar"
            >
              <X className="size-5" aria-hidden />
            </button>

            <div className="relative px-6 pt-10 pb-8 sm:px-10 sm:pt-12 sm:pb-10">
              <p className="tag">GTA V original</p>
              <h2 id={titleId} className="display mt-4 text-[clamp(2.5rem,6vw,4rem)]">
                Escolha sua plataforma
              </h2>
              <p id={descId} className="mt-3 text-muted">
                Onde você deseja adquirir o GTA V?
              </p>

              <ul className="mt-8 grid gap-3 sm:grid-cols-3 sm:gap-4">
                {platforms.map((p, i) => (
                  <m.li
                    key={p.brand}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.12 + i * 0.07, ease: EASE_OUT }}
                  >
                    <a
                      href={p.href}
                      {...external}
                      className="group relative flex h-full items-center gap-4 overflow-hidden rounded-[var(--radius-md)] border border-line bg-white/[0.02] p-4 transition-all duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-primary/60 hover:bg-primary/[0.06] hover:shadow-[var(--glow-md)] sm:flex-col sm:items-start sm:gap-6 sm:p-6"
                    >
                      <span className="grid size-12 flex-none place-items-center rounded-[var(--radius-sm)] bg-white/[0.06] text-white transition-all duration-500 group-hover:scale-110 group-hover:bg-primary sm:size-14">
                        <BrandIcon name={p.brand} className="size-6 sm:size-7" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="display block text-[1.75rem] leading-none">{p.name}</span>
                        <span className="mt-2 block text-sm leading-snug text-muted">{p.description}</span>
                      </span>
                      <ArrowUpRight
                        className="size-5 flex-none text-subtle transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary sm:absolute sm:top-6 sm:right-6"
                        aria-hidden
                      />
                      <span className="sr-only"> (abre a loja em nova aba)</span>
                    </a>
                  </m.li>
                ))}
              </ul>

              <p className="mt-6 text-sm text-subtle">
                Depois de instalar o GTA V, siga para o passo 02: instalar o FiveM.
              </p>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
