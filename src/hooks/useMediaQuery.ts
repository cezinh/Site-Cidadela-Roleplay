import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Mouse/trackpad de verdade (efeitos de cursor e parallax só rodam aqui). */
export const useFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)");
