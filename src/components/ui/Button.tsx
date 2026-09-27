import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { cn, external } from "@/lib/utils";

type Variant = "primary" | "ghost";
type Size = "md" | "sm";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  /** Ícone à esquerda do texto. */
  icon?: ReactNode;
  /** Seta à direita: "next" (ação na página) ou "external" (abre outro site). */
  arrow?: "next" | "external" | false;
  children: ReactNode;
  className?: string;
};

function classes({ variant = "primary", size = "md", block, className }: CommonProps) {
  return cn("btn", variant === "primary" ? "btn-primary" : "btn-ghost", size === "sm" && "btn-sm", block && "btn-block", className);
}

function Inner({ icon, arrow, children }: Pick<CommonProps, "icon" | "arrow" | "children">) {
  return (
    <>
      {icon}
      <span>{children}</span>
      {arrow === "next" && <ChevronRight className="btn-arrow size-4 -mr-1" strokeWidth={2.5} aria-hidden />}
      {arrow === "external" && <ArrowUpRight className="btn-arrow size-4 -mr-1" strokeWidth={2.5} aria-hidden />}
    </>
  );
}

export function Button({
  variant,
  size,
  block,
  icon,
  arrow = false,
  children,
  className,
  type = "button",
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={classes({ variant, size, block, className, children })} {...rest}>
      <Inner icon={icon} arrow={arrow}>
        {children}
      </Inner>
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  block,
  icon,
  arrow = false,
  children,
  className,
  href,
  isExternal,
  ...rest
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { isExternal?: boolean }) {
  return (
    <a
      href={href}
      className={classes({ variant, size, block, className, children })}
      {...(isExternal ? external : {})}
      {...rest}
    >
      <Inner icon={icon} arrow={arrow}>
        {children}
      </Inner>
      {isExternal && <span className="sr-only"> (abre em nova aba)</span>}
    </a>
  );
}
