import { useEffect } from "react";
import { AnimatePresence, m } from "framer-motion";
import { X } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";
import { EASE_OUT } from "@/lib/motion";
import { ConnectField } from "@/components/ui/ConnectField";
import { ButtonLink } from "@/components/ui/Button";
import { BrandIcon } from "@/components/ui/BrandIcon";

/** Aviso exibido quando o link fivem:// não abriu o FiveM. */
export function PlayFallback({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <m.aside
          role="status"
          aria-label="Ajuda para conectar"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          className="fixed inset-x-4 bottom-20 z-[70] mx-auto max-w-md rounded-[var(--radius-md)] border border-line-strong bg-surface/95 p-6 shadow-[var(--shadow-panel)] backdrop-blur-xl sm:inset-x-auto sm:right-6 sm:bottom-24"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Fechar ajuda"
          >
            <X className="size-4" aria-hidden />
          </button>
          <p className="display pr-8 text-3xl">O FiveM não abriu?</p>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
            Instale o FiveM e tente de novo. Se ele já estiver aberto, aperte <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-sans text-white">F8</kbd> e cole o comando abaixo.
          </p>
          <ConnectField className="mt-5" compact />
          <ButtonLink
            href={siteConfig.links.fivem}
            isExternal
            variant="ghost"
            size="sm"
            block
            className="mt-4"
            icon={<BrandIcon name="fivem" className="size-4" />}
            arrow="external"
          >
            Baixar FiveM
          </ButtonLink>
        </m.aside>
      )}
    </AnimatePresence>
  );
}
