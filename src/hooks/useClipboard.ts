import { useCallback, useEffect, useRef, useState } from "react";

async function writeText(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Permissão negada (iframe, navegador restrito): tenta o método antigo abaixo.
    }
  }
  // Fallback para contextos sem Clipboard API (http, navegadores antigos, permissão negada).
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  const ok = document.execCommand("copy");
  area.remove();
  if (!ok) throw new Error("copy failed");
}

/** Copia um texto e mantém `copied = true` por alguns segundos. */
export function useClipboard(resetMs = 2200) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text: string) => {
      window.clearTimeout(timer.current);
      try {
        await writeText(text);
        setFailed(false);
        setCopied(true);
      } catch {
        setCopied(false);
        setFailed(true);
      }
      timer.current = window.setTimeout(() => {
        setCopied(false);
        setFailed(false);
      }, resetMs);
    },
    [resetMs],
  );

  return { copy, copied, failed };
}
