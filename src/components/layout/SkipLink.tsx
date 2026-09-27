/** Atalho para quem navega por teclado pular direto para o conteúdo. */
export function SkipLink() {
  return (
    <a
      href="#conteudo"
      className="fixed top-3 left-3 z-[100] -translate-y-24 rounded-[var(--radius-xs)] bg-primary px-4 py-3 text-sm font-bold tracking-wider text-white uppercase transition-transform focus:translate-y-0"
    >
      Pular para o conteúdo
    </a>
  );
}
