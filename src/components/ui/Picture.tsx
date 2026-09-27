import type { ImgHTMLAttributes } from "react";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> & {
  /** Nome base gerado pelo script de assets (ex.: "personagem" -> /images/personagem-640.webp). */
  name: string;
  widths: number[];
  sizes: string;
  /** Existe versão AVIF desse asset? */
  avif?: boolean;
  alt: string;
};

const set = (name: string, widths: number[], ext: string) => widths.map((w) => `/images/${name}-${w}.${ext} ${w}w`).join(", ");

/** <picture> com AVIF + WebP responsivos, gerados por `npm run assets`. */
export function Picture({ name, widths, sizes, avif = true, alt, loading = "lazy", decoding = "async", ...img }: Props) {
  const largest = widths[widths.length - 1];
  return (
    <picture>
      {avif && <source type="image/avif" srcSet={set(name, widths, "avif")} sizes={sizes} />}
      <source type="image/webp" srcSet={set(name, widths, "webp")} sizes={sizes} />
      <img src={`/images/${name}-${largest}.webp`} alt={alt} loading={loading} decoding={decoding} {...img} />
    </picture>
  );
}
