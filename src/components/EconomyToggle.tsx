import { m } from "framer-motion";
import { Leaf } from "lucide-react";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useScrolled } from "@/hooks/useScrolled";

type Props = { on: boolean; onToggle: () => void; ready: boolean };

/** Botão flutuante (canto inferior direito) que liga/desliga o modo econômico. */
export function EconomyToggle({ on, onToggle, ready }: Props) {
  // No celular o Hero tem os botões lá embaixo: a folha só aparece depois de rolar um pouco.
  const phone = useMediaQuery("(max-width: 767px)");
  const pastHero = useScrolled(520);
  const visible = ready && (!phone || pastHero);

  const label = on ? "Modo econômico ativo. Clique para voltar aos efeitos" : "Ativar modo econômico (economiza FPS)";

  return (
    <m.div
      className={cn("group fixed right-4 bottom-4 z-[65] flex items-center gap-3 sm:right-6 sm:bottom-6", !visible && "pointer-events-none")}
      initial={{ opacity: 0, y: 16 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.6, delay: phone ? 0 : 1.4, ease: EASE_OUT }}
      aria-hidden={!visible}
    >
      {/* O texto só aparece com o mouse em cima (ou navegando pelo teclado) */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none translate-x-2 rounded-full border border-line-strong bg-surface/95 px-4 py-2.5 text-[0.8125rem] font-semibold whitespace-nowrap text-white opacity-0 shadow-[var(--shadow-panel)] transition-all duration-500 ease-[var(--ease-out-expo)]",
          "max-sm:max-w-[calc(100vw-6rem)] max-sm:truncate",
          "group-hover:translate-x-0 group-hover:opacity-100 group-has-[:focus-visible]:translate-x-0 group-has-[:focus-visible]:opacity-100",
        )}
      >
        {label}
      </span>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={on}
        tabIndex={visible ? 0 : -1}
        aria-label={on ? "Desativar modo econômico" : "Ativar modo econômico (economiza FPS)"}
        className={cn(
          "grid size-12 flex-none place-items-center rounded-full border transition-all duration-300 hover:scale-105 active:scale-95",
          on
            ? "border-primary bg-primary text-white shadow-[var(--glow-md)]"
            : "border-primary/50 bg-background/90 text-primary shadow-[0_0_24px_-6px_rgb(242_34_131/0.6)] hover:border-primary",
        )}
      >
        <Leaf className="size-5" aria-hidden />
      </button>
    </m.div>
  );
}
