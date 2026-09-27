import { Check, Copy, Terminal } from "lucide-react";
import { useClipboard } from "@/hooks/useClipboard";
import { cn, connectCommand } from "@/lib/utils";

/** Comando `connect IP` do F8 com botão de copiar. */
export function ConnectField({ className, compact }: { className?: string; compact?: boolean }) {
  const { copy, copied, failed } = useClipboard();
  const command = connectCommand();

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p className="text-[0.75rem] font-semibold uppercase tracking-[0.22em] text-subtle">Conexão direta (F8)</p>
      <div
        className={cn(
          "flex items-stretch overflow-hidden rounded-[var(--radius-sm)] border border-line-strong bg-background/70",
          compact ? "min-h-11" : "min-h-[52px]",
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3 px-4 py-2.5">
          <Terminal className="size-4 flex-none text-primary" aria-hidden />
          {/* Quebra de linha (de preferência depois de "connect") em vez de cortar o endereço */}
          <code className="min-w-0 font-mono text-[0.875rem] leading-snug text-white/90 [overflow-wrap:anywhere]">{command}</code>
        </div>
        <button
          type="button"
          onClick={() => copy(command)}
          className={cn(
            "flex flex-none items-center gap-2 border-l border-line-strong px-4 text-[0.75rem] font-bold uppercase tracking-[0.14em] transition-colors duration-300",
            copied ? "bg-primary text-white" : "text-white hover:bg-primary/15 hover:text-white",
          )}
          aria-label={copied ? "IP copiado" : "Copiar comando de conexão"}
        >
          {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
          <span className={cn(compact ? "sr-only" : "max-sm:sr-only")}>{copied ? "Copiado!" : failed ? "Tente de novo" : "Copiar IP"}</span>
        </button>
      </div>
      <span className="sr-only" aria-live="polite">
        {copied ? "Comando copiado para a área de transferência" : ""}
      </span>
    </div>
  );
}
