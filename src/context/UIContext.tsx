import { createContext, lazy, Suspense, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/siteConfig";
import { scrollToId } from "@/lib/utils";
import { PlayFallback } from "@/components/PlayFallback";

const loadPlatformModal = () => import("@/components/PlatformModal");
const PlatformModal = lazy(loadPlatformModal);

type UIContextValue = {
  /** Abre o modal "Escolha sua plataforma" (compra do GTA V). */
  openPlatforms: () => void;
  /** Pré-carrega o modal (chamar no hover/foco do botão). */
  preloadPlatforms: () => void;
  /** Botão JOGAR AGORA: abre o FiveM direto no servidor, com fallback. */
  play: () => void;
};

const UIContext = createContext<UIContextValue | null>(null);

/** Tempo para o navegador trocar para o FiveM antes de mostrarmos a ajuda. */
const FIVEM_HANDOFF_MS = 1800;

export function UIProvider({ children }: { children: ReactNode }) {
  const [platformsLoaded, setPlatformsLoaded] = useState(false);
  const [platformsOpen, setPlatformsOpen] = useState(false);
  const [fallbackOpen, setFallbackOpen] = useState(false);
  const handoff = useRef<number | undefined>(undefined);

  const openPlatforms = useCallback(() => {
    setPlatformsLoaded(true);
    setPlatformsOpen(true);
  }, []);

  const preloadPlatforms = useCallback(() => {
    void loadPlatformModal();
  }, []);

  const play = useCallback(() => {
    // Por enquanto: JOGAR AGORA leva ao Discord oficial (allowlist).
    if (siteConfig.server.playAction === "discord") {
      window.open(siteConfig.links.discord, "_blank", "noopener,noreferrer");
      return;
    }

    const ip = siteConfig.server.ip.trim();
    if (!ip) {
      // Sem IP público configurado: leva o jogador para o passo a passo de conexão.
      scrollToId("conectar");
      return;
    }

    // Se o protocolo fivem:// abrir o FiveM, a janela perde o foco. Se não perder, mostramos a ajuda.
    let handedOff = false;
    const onBlur = () => {
      handedOff = true;
    };
    window.addEventListener("blur", onBlur, { once: true });
    window.location.href = `fivem://connect/${encodeURI(ip)}`;

    window.clearTimeout(handoff.current);
    handoff.current = window.setTimeout(() => {
      window.removeEventListener("blur", onBlur);
      if (!handedOff) setFallbackOpen(true);
    }, FIVEM_HANDOFF_MS);
  }, []);

  const value = useMemo(() => ({ openPlatforms, preloadPlatforms, play }), [openPlatforms, preloadPlatforms, play]);

  return (
    <UIContext.Provider value={value}>
      {children}
      {platformsLoaded && (
        <Suspense fallback={null}>
          <PlatformModal open={platformsOpen} onClose={() => setPlatformsOpen(false)} />
        </Suspense>
      )}
      <PlayFallback open={fallbackOpen} onClose={() => setFallbackOpen(false)} />
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI precisa estar dentro de <UIProvider>");
  return ctx;
}
