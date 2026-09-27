import { m } from "framer-motion";
import { ScrollText } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";
import { rules } from "@/content/content";
import { EASE_OUT } from "@/lib/motion";
import { ButtonLink } from "@/components/ui/Button";

export function RulesSection() {
  return (
    <section id="regras" aria-labelledby="regras-titulo" className="relative pb-[var(--section-y)]">
      <div className="container-site">
        <m.div
          className="rules-band group relative isolate grid items-center gap-10 overflow-hidden rounded-[var(--radius-lg)] border border-line-strong p-8 sm:p-12 md:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr_auto] lg:gap-14 lg:p-14"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease: EASE_OUT }}
        >
          {/* Selo de classificação, colado como adesivo */}
          <img
            src="/images/selo-classificacao-320.webp"
            srcSet="/images/selo-classificacao-160.webp 160w, /images/selo-classificacao-320.webp 320w"
            sizes="140px"
            alt="Selo de classificação: conteúdo classificado pela Cidadela"
            width={320}
            height={446}
            loading="lazy"
            className="w-[108px] -rotate-6 drop-shadow-[0_20px_30px_rgb(0_0_0/0.7)] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:rotate-0 sm:w-[132px]"
          />

          <div>
            <p className="tag">{rules.tag}</p>
            <h2 id="regras-titulo" className="display mt-5 text-[clamp(2.75rem,1.6rem+3.6vw,5rem)]">
              {rules.title}
            </h2>
            <p className="mt-4 max-w-[56ch] text-muted">{rules.text}</p>
          </div>

          <ButtonLink
            href={siteConfig.links.rules}
            isExternal
            icon={<ScrollText className="size-4" aria-hidden />}
            arrow="external"
            className="md:col-span-2 md:justify-self-start lg:col-span-1 lg:justify-self-end"
          >
            {rules.cta}
          </ButtonLink>
        </m.div>
      </div>
    </section>
  );
}
