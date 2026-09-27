import { m } from "framer-motion";
import { siteConfig } from "@/config/siteConfig";
import { community } from "@/content/content";
import { useDiscordInvite } from "@/hooks/useDiscordInvite";
import { useSpotlight } from "@/hooks/useSpotlight";
import { EASE_OUT } from "@/lib/motion";
import { cn, formatNumber, isVisible } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { BrandIcon } from "@/components/ui/BrandIcon";

const discordTopics = ["Allowlist", "Anúncios", "Suporte", "Eventos"];

function DiscordCard({ wide }: { wide: boolean }) {
  const counts = useDiscordInvite();
  const onPointerMove = useSpotlight<HTMLElement>();

  return (
    <m.article
      onPointerMove={onPointerMove}
      className={cn(
        "community-card spotlight group relative isolate flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-line-strong p-8 sm:p-10",
        wide ? "min-h-[340px] lg:col-span-12 lg:p-12" : "min-h-[420px] lg:col-span-7",
      )}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease: EASE_OUT }}
    >
      <div
        aria-hidden
        className="community-texture absolute inset-0 -z-10"
        style={siteConfig.images.community ? { backgroundImage: `url("${siteConfig.images.community}")` } : undefined}
      />
      <BrandIcon
        name="discord"
        className="pointer-events-none absolute -right-10 -bottom-14 -z-10 size-72 text-white/[0.05] transition-all duration-1000 ease-[var(--ease-out-expo)] group-hover:-rotate-6 group-hover:text-primary/15 sm:size-96"
      />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <span className="grid size-16 place-items-center rounded-[var(--radius-md)] bg-white text-background shadow-[0_20px_40px_-20px_rgb(0_0_0/0.8)] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105">
          <BrandIcon name="discord" className="size-8" />
        </span>
        {counts && (
          <dl className="flex gap-6 text-right">
            <div>
              <dt className="text-[0.6875rem] font-semibold tracking-[0.2em] text-subtle uppercase">Membros</dt>
              <dd className="display tabular text-[2rem] leading-none">{formatNumber(counts.members)}</dd>
            </div>
            <div>
              <dt className="flex items-center justify-end gap-1.5 text-[0.6875rem] font-semibold tracking-[0.2em] text-subtle uppercase">
                <span className="size-1.5 rounded-full bg-whatsapp" aria-hidden />
                Online
              </dt>
              <dd className="display tabular text-[2rem] leading-none">{formatNumber(counts.online)}</dd>
            </div>
          </dl>
        )}
      </div>

      <div className={cn("relative z-10 mt-auto", wide ? "pt-10" : "pt-16")}>
        <h3 className="display text-[clamp(2.5rem,1.8rem+2.6vw,4.25rem)]">{community.discord.title}</h3>
        <p className="mt-4 max-w-[46ch] text-muted">{community.discord.text}</p>
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="No Discord você encontra">
          {discordTopics.map((t) => (
            <li key={t} className="rounded-full border border-line-strong bg-background/40 px-3 py-1 text-[0.8125rem] font-medium text-white/80 backdrop-blur-sm">
              {t}
            </li>
          ))}
        </ul>
        <ButtonLink
          href={siteConfig.links.discord}
          isExternal
          className="mt-8"
          icon={<BrandIcon name="discord" className="size-5" />}
          arrow="external"
        >
          {community.discord.cta}
        </ButtonLink>
      </div>
    </m.article>
  );
}

function WhatsAppCard() {
  const onPointerMove = useSpotlight<HTMLElement>();

  return (
    <m.article
      onPointerMove={onPointerMove}
      className="panel spotlight group relative isolate flex min-h-[420px] flex-col overflow-hidden rounded-[var(--radius-lg)] p-8 sm:p-10 lg:col-span-5"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, delay: 0.12, ease: EASE_OUT }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-60 transition-opacity duration-700 group-hover:opacity-100"
        style={{ background: "radial-gradient(70% 60% at 100% 0%, rgb(37 211 102 / 0.08), transparent 70%)" }}
      />
      <span className="relative z-10 grid size-16 place-items-center rounded-[var(--radius-md)] border border-line-strong bg-background/60 text-whatsapp transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105">
        <BrandIcon name="whatsapp" className="size-8" />
      </span>

      <div className="relative z-10 mt-auto pt-16">
        <h3 className="display text-[clamp(2.25rem,1.8rem+1.8vw,3.25rem)]">{community.whatsapp.title}</h3>
        <p className="mt-4 max-w-[40ch] text-muted">{community.whatsapp.text}</p>
        <ButtonLink
          href={siteConfig.links.whatsapp}
          isExternal
          variant="ghost"
          className="mt-8"
          icon={<BrandIcon name="whatsapp" className="size-5 text-whatsapp" />}
          arrow="external"
        >
          {community.whatsapp.cta}
        </ButtonLink>
      </div>
    </m.article>
  );
}

export function CommunitySection() {
  const hasWhatsApp = isVisible(siteConfig.links.whatsapp);

  return (
    <section id="comunidade" aria-labelledby="comunidade-titulo" className="section-y relative">
      <div className="container-site">
        <SectionHeading id="comunidade-titulo" tag={community.tag} title={community.title} intro={community.intro} align="split" titleClassName="max-w-[13ch]" />

        <div className="mt-10 grid gap-4 lg:mt-12 lg:grid-cols-12">
          <DiscordCard wide={!hasWhatsApp} />
          {hasWhatsApp && <WhatsAppCard />}
        </div>
      </div>
    </section>
  );
}
