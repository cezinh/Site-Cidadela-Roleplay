import { memo, useId } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  acronym: string;
  name: string;
  icon: LucideIcon;
  className?: string;
  /** Brasão real recortado do pôster (nome base em /images). Sem ele, o brasão é desenhado em SVG. */
  image?: string;
};

const C = 120; // centro do viewBox 240x240

function starPath(cx: number, cy: number, r: number) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.45;
    pts.push(`${(cx + rr * Math.cos(a)).toFixed(2)},${(cy + rr * Math.sin(a)).toFixed(2)}`);
  }
  return `M${pts.join("L")}Z`;
}

// Estrelas no arco direito, como nos brasões oficiais.
const STARS = Array.from({ length: 7 }, (_, i) => {
  const a = ((-54 + i * 18) * Math.PI) / 180;
  return starPath(C + 101 * Math.cos(a), C + 101 * Math.sin(a), 4.2);
});

/** Brasão das unidades policiais da Cidadela. */
export const UnitEmblem = memo(function UnitEmblem({ acronym, name, icon: Icon, className, image }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const top = `em-top-${uid}`;
  const bottom = `em-bottom-${uid}`;
  const label = `Brasão ${acronym}, ${name}`;

  if (image) {
    return (
      <picture className={cn("block", className)}>
        <source type="image/webp" srcSet={`/images/${image}-emblema-320.webp 320w, /images/${image}-emblema-640.webp 640w`} sizes="320px" />
        <img src={`/images/${image}-emblema-640.webp`} alt={label} loading="lazy" className="size-full object-contain" />
      </picture>
    );
  }

  const nameSize = Math.min(15, 290 / (name.length * 0.66));

  return (
    <svg viewBox="0 0 240 240" className={className} role="img" aria-label={label}>
      <defs>
        <path id={top} d={`M ${C - 92} ${C} A 92 92 0 0 1 ${C + 92} ${C}`} />
        <path id={bottom} d={`M ${C - 104} ${C} A 104 104 0 0 0 ${C + 104} ${C}`} />
        <radialGradient id={`em-bg-${uid}`} cx="50%" cy="40%" r="65%">
          <stop offset="0" stopColor="#1a1a20" />
          <stop offset="1" stopColor="#050507" />
        </radialGradient>
      </defs>

      <circle cx={C} cy={C} r="117" fill={`url(#em-bg-${uid})`} stroke="#e6e6ea" strokeWidth="3" />
      <circle cx={C} cy={C} r="80" fill="none" stroke="rgb(254 254 255 / 0.55)" strokeWidth="2" />
      <path d={`M ${C - 88} ${C - 40} A 96 96 0 0 1 ${C - 62} ${C - 72}`} fill="none" stroke="rgb(254 254 255 / 0.55)" strokeWidth="2" strokeLinecap="round" />

      <text fill="#fefeff" fontFamily="var(--font-display)" fontWeight="800" fontSize="22" letterSpacing="3">
        <textPath href={`#${top}`} startOffset="50%" textAnchor="middle">
          CIDADELA
        </textPath>
      </text>
      <text fill="rgb(254 254 255 / 0.85)" fontFamily="var(--font-display)" fontWeight="800" fontSize={nameSize} letterSpacing="1.5">
        <textPath href={`#${bottom}`} startOffset="50%" textAnchor="middle" dominantBaseline="hanging">
          {name.toUpperCase()}
        </textPath>
      </text>
      <text
        x={C - 99}
        y={C}
        fill="#fefeff"
        fontFamily="var(--font-display)"
        fontWeight="800"
        fontSize="17"
        letterSpacing="1.5"
        textAnchor="middle"
        dominantBaseline="middle"
        transform={`rotate(-90 ${C - 99} ${C})`}
      >
        {acronym}
      </text>

      <g fill="#fefeff">
        {STARS.map((d) => (
          <path key={d} d={d} />
        ))}
        <path d={starPath(C, C + 64, 6)} />
      </g>

      <Icon x={C - 38} y={C - 44} width={76} height={76} color="#fefeff" strokeWidth={1.4} aria-hidden />
    </svg>
  );
});
