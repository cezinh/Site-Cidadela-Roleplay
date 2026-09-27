import { useEffect, useState } from "react";

const MAX_WAIT_MS = 2500;

function decode(src: string) {
  const img = new Image();
  img.src = src;
  return img.decode().catch(() => undefined);
}

/**
 * Espera fontes + imagens principais do Hero, esconde a tela de carregamento (#boot, no index.html)
 * e libera a animação de entrada. Nunca segura o usuário além do necessário (teto de 2,5s).
 */
export function useBootReady(heroImages: string[]) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const assets = Promise.all([document.fonts?.ready, ...heroImages.map(decode)]);
    const timeout = new Promise((resolve) => setTimeout(resolve, MAX_WAIT_MS));

    Promise.race([assets, timeout]).then(() => {
      if (cancelled) return;
      const boot = document.getElementById("boot");
      boot?.classList.add("is-done");
      window.setTimeout(() => boot?.remove(), 700);
      setReady(true);
    });

    return () => {
      cancelled = true;
    };
    // As imagens do Hero são fixas durante a vida da página.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ready;
}
