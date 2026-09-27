import { siteConfig } from "@/config/siteConfig";

/** Junta classes ignorando valores falsos. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Um link está "configurado" quando não está vazio e não é um placeholder (SEU-...). */
export function isConfigured(value: string | undefined | null): value is string {
  return !!value && value.trim() !== "" && !/SEU-/i.test(value);
}

/** Um link deve aparecer no site quando não está vazio (placeholders aparecem durante o desenvolvimento). */
export function isVisible(value: string | undefined | null): value is string {
  return !!value && value.trim() !== "";
}

const numberFormat = new Intl.NumberFormat("pt-BR");
export const formatNumber = (n: number) => numberFormat.format(Math.round(n));

/** Endereço exibido no F8. */
export function serverAddress() {
  return siteConfig.server.ip.trim() || siteConfig.server.ipPlaceholder;
}

export function connectCommand() {
  return `connect ${serverAddress()}`;
}

/** Extrai o código de um convite do Discord (discord.gg/xxx ou discord.com/invite/xxx). */
export function discordInviteCode(url: string) {
  if (!isConfigured(url)) return null;
  const match = url.match(/(?:discord\.gg|discord(?:app)?\.com\/invite)\/([\w-]+)/i);
  return match?.[1] ?? null;
}

/** Posição do elemento na página sem considerar transforms (animações de entrada não deslocam o destino). */
function layoutTop(el: HTMLElement) {
  let y = 0;
  let node: HTMLElement | null = el;
  while (node) {
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return y;
}

/** Distância entre a navbar e o início do conteúdo da seção depois de navegar até ela. */
const LANDING_GAP = 36;

/** Posição de rolagem que enquadra a seção: o conteúdo (depois do respiro superior) fica logo abaixo da navbar. */
export function sectionScrollTop(el: HTMLElement) {
  const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 76;
  const padTop = parseFloat(getComputedStyle(el).paddingTop) || 0;
  const target = layoutTop(el) + padTop - LANDING_GAP - navH;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return Math.min(Math.max(0, target), max);
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = id === "inicio" ? 0 : sectionScrollTop(el);
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  history.replaceState(null, "", id === "inicio" ? window.location.pathname : `#${id}`);
}

/** Props padrão para links externos. */
export const external = { target: "_blank", rel: "noopener noreferrer" } as const;
