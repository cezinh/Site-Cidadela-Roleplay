import type { IconType } from "react-icons";
import {
  SiDiscord,
  SiEpicgames,
  SiFivem,
  SiInstagram,
  SiRockstargames,
  SiSteam,
  SiTiktok,
  SiWhatsapp,
  SiYoutube,
} from "react-icons/si";

/** Logos de marcas (Simple Icons). Ícones de interface usam Lucide. */
const brands = {
  discord: SiDiscord,
  whatsapp: SiWhatsapp,
  instagram: SiInstagram,
  tiktok: SiTiktok,
  youtube: SiYoutube,
  steam: SiSteam,
  epic: SiEpicgames,
  rockstar: SiRockstargames,
  fivem: SiFivem,
} satisfies Record<string, IconType>;

export type Brand = keyof typeof brands;

export function BrandIcon({ name, className }: { name: Brand; className?: string }) {
  const Icon = brands[name];
  return <Icon className={className} aria-hidden focusable={false} />;
}
