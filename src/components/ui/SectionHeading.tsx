import type { ReactNode } from "react";
import { m } from "framer-motion";
import { cn } from "@/lib/utils";
import { inView, riseIn, stagger } from "@/lib/motion";

type Props = {
  tag: string;
  title: ReactNode;
  intro?: ReactNode;
  /**
   * left: tudo empilhado à esquerda. center: centralizado.
   * split: título à esquerda e texto de apoio à direita (desktop) — economiza altura.
   */
  align?: "left" | "center" | "split";
  /** id do título, para aria-labelledby da seção. */
  id?: string;
  className?: string;
  titleClassName?: string;
  introClassName?: string;
};

/** Cabeçalho padrão de seção: tag #, título display e texto de apoio. */
export function SectionHeading({ tag, title, intro, align = "left", id, className, titleClassName, introClassName }: Props) {
  if (align === "split") {
    return (
      <m.div
        className={cn("grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10", className)}
        variants={stagger(0.09)}
        initial="hidden"
        whileInView="show"
        viewport={inView}
      >
        <div className="flex flex-col gap-5 lg:col-span-7">
          <m.p variants={riseIn} className="tag">
            {tag}
          </m.p>
          <m.h2 variants={riseIn} id={id} className={cn("display h2", titleClassName)}>
            {title}
          </m.h2>
        </div>
        {intro && (
          <m.p variants={riseIn} className="lead max-w-[52ch] lg:col-span-5 lg:pb-1">
            {intro}
          </m.p>
        )}
      </m.div>
    );
  }

  return (
    <m.div
      className={cn("flex flex-col gap-5", align === "center" && "items-center text-center", className)}
      variants={stagger(0.09)}
      initial="hidden"
      whileInView="show"
      viewport={inView}
    >
      <m.p variants={riseIn} className="tag">
        {tag}
      </m.p>
      <m.h2 variants={riseIn} id={id} className={cn("display h2", titleClassName)}>
        {title}
      </m.h2>
      {intro && (
        <m.p variants={riseIn} className={cn("lead max-w-[58ch]", align === "center" && "mx-auto", introClassName)}>
          {intro}
        </m.p>
      )}
    </m.div>
  );
}
