import { siteConfig } from "@/config/siteConfig";
import type { Brand } from "@/components/ui/BrandIcon";
import { isVisible } from "@/lib/utils";

export type SocialLink = { brand: Brand; label: string; href: string };

/** Redes sociais configuradas (as vazias no siteConfig não aparecem). */
export const socialLinks: SocialLink[] = (
  [
    { brand: "instagram", label: "Instagram", href: siteConfig.links.instagram },
    { brand: "tiktok", label: "TikTok", href: siteConfig.links.tiktok },
    { brand: "youtube", label: "YouTube", href: siteConfig.links.youtube },
  ] satisfies SocialLink[]
).filter((s) => isVisible(s.href));

/** Ícones do canto do Hero: redes sociais + Discord. */
export const heroLinks: SocialLink[] = [
  ...socialLinks,
  ...(isVisible(siteConfig.links.discord) ? [{ brand: "discord", label: "Discord", href: siteConfig.links.discord } satisfies SocialLink] : []),
];

/** Canais da comunidade configurados. */
export const communityLinks: SocialLink[] = (
  [
    { brand: "discord", label: "Discord", href: siteConfig.links.discord },
    { brand: "whatsapp", label: "WhatsApp", href: siteConfig.links.whatsapp },
  ] satisfies SocialLink[]
).filter((s) => isVisible(s.href));
