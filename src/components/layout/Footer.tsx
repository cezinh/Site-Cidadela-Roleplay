import type { MouseEvent, ReactNode } from "react";
import { m } from "framer-motion";
import { Mail, Play } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";
import { footer, navLinks } from "@/content/content";
import { useUI } from "@/context/UIContext";
import { EASE_OUT } from "@/lib/motion";
import { external, isVisible, scrollToId } from "@/lib/utils";
import { communityLinks, heroLinks, socialLinks } from "@/lib/social";
import { Button, ButtonLink } from "@/components/ui/Button";
import { BrandIcon } from "@/components/ui/BrandIcon";

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-[0.75rem] font-bold tracking-[0.24em] text-subtle uppercase">{title}</h3>
      <ul className="mt-5 flex flex-col gap-3">{children}</ul>
    </div>
  );
}

const linkClass = "link-underline text-[0.9375rem] text-white/75 transition-colors duration-300 hover:text-white";

export function Footer() {
  const { play } = useUI();
  const year = new Date().getFullYear();

  const go = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToId(id);
  };

  return (
    <footer id="contato" className="relative overflow-hidden border-t border-line">
      {/* Chamada final */}
      <div className="footer-cta relative isolate">
        <div className="container-site flex flex-col items-start gap-10 py-20 sm:py-28 lg:flex-row lg:items-end lg:justify-between">
          <m.p
            className="display max-w-[12ch] text-[clamp(3.25rem,1.6rem+6vw,8rem)]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.1, ease: EASE_OUT }}
          >
            Sua história começa agora.
          </m.p>
          <m.div
            className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, delay: 0.15, ease: EASE_OUT }}
          >
            <Button onClick={play} icon={<Play className="size-4 fill-current" aria-hidden />}>
              Jogar agora
            </Button>
            <ButtonLink href={siteConfig.links.discord} isExternal variant="ghost" icon={<BrandIcon name="discord" className="size-5" />}>
              Entrar no Discord
            </ButtonLink>
          </m.div>
        </div>
      </div>

      <div className="container-site">
        <div className="grid gap-12 border-t border-line py-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Marca */}
          <div className="md:col-span-2 lg:col-span-4">
            <img src="/images/logo-marca-480.webp" alt={siteConfig.name} width={480} height={303} loading="lazy" className="w-[150px]" />
            <p className="mt-6 max-w-[38ch] text-[0.9375rem] leading-relaxed text-muted">{footer.description}</p>
            {heroLinks.length > 0 && (
              <ul className="mt-8 flex gap-2" aria-label="Redes sociais e Discord">
                {heroLinks.map((s) => (
                  <li key={s.brand}>
                    <a
                      href={s.href}
                      {...external}
                      aria-label={s.label}
                      className="grid size-11 place-items-center rounded-full border border-line-strong text-white/75 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-white"
                    >
                      <BrandIcon name={s.brand} className="size-[18px]" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-[repeat(3,minmax(0,1fr))_auto] md:col-span-2 lg:col-span-8 lg:pl-10">
            <Column title="Links">
              {navLinks.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} onClick={go(l.id)} className={linkClass}>
                    {l.label}
                  </a>
                </li>
              ))}
            </Column>

            <Column title="Comunidade">
              {communityLinks.map((c) => (
                <li key={c.brand}>
                  <a href={c.href} {...external} className={linkClass}>
                    {c.label}
                  </a>
                </li>
              ))}
              {isVisible(siteConfig.links.rules) && (
                <li>
                  <a href={siteConfig.links.rules} {...external} className={linkClass}>
                    Regras
                  </a>
                </li>
              )}
            </Column>

            <Column title="Redes sociais">
              {socialLinks.map((s) => (
                <li key={s.brand}>
                  <a href={s.href} {...external} className={linkClass}>
                    {s.label}
                  </a>
                </li>
              ))}
            </Column>

            <Column title="Contato">
              {isVisible(siteConfig.contact.email) && (
                <li>
                  <a href={`mailto:${siteConfig.contact.email}`} className={`${linkClass} inline-flex items-center gap-2 [overflow-wrap:anywhere] sm:whitespace-nowrap`}>
                    <Mail className="size-4 flex-none text-primary" aria-hidden />
                    {siteConfig.contact.email}
                  </a>
                </li>
              )}
              {isVisible(siteConfig.contact.cnpj) && <li className="text-[0.875rem] text-subtle">CNPJ: {siteConfig.contact.cnpj}</li>}
            </Column>
          </div>
        </div>

        <div className="flex flex-col gap-6 border-t border-line py-8 text-[0.8125rem] text-subtle md:flex-row md:items-center md:justify-between">
          {/* Selo de classificação + linha, como na capa de um jogo */}
          <div className="flex items-center gap-5">
            <img
              src="/images/selo-classificacao-160.webp"
              srcSet="/images/selo-classificacao-160.webp 1x, /images/selo-classificacao-320.webp 2x"
              alt="Selo de classificação: conteúdo classificado pela Cidadela"
              width={160}
              height={223}
              loading="lazy"
              className="h-auto w-[52px] flex-none"
            />
            <span aria-hidden className="w-px self-stretch bg-line-strong" />
            <div className="flex flex-col gap-2">
              <p>
                © {year} {siteConfig.name}. Todos os direitos reservados.
              </p>
              <p className="max-w-[80ch] text-white/32">{footer.disclaimer}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
