import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "cidadela:modo-economico";

function readSaved() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * Modo econômico: desliga os efeitos mais pesados (granulado, desfoques, parallax, falha do logo,
 * luzes girando e animações de entrada) para ganhar FPS em PCs mais fracos.
 * Marca <html data-economy="on"> para o CSS e fica salvo no navegador da pessoa.
 */
export function useEconomyMode() {
  const [on, setOn] = useState(readSaved);

  useEffect(() => {
    document.documentElement.dataset.economy = on ? "on" : "off";
    try {
      window.localStorage.setItem(STORAGE_KEY, on ? "1" : "0");
    } catch {
      // Sem acesso ao armazenamento (aba anônima, bloqueio): o modo vale só nesta visita.
    }
  }, [on]);

  const toggle = useCallback(() => setOn((v) => !v), []);

  return [on, toggle] as const;
}
