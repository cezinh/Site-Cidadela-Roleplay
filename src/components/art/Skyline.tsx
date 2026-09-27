import { memo, useMemo } from "react";

/** Gerador pseudoaleatório determinístico (mesmo desenho em todo render/servidor). */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Building = { x: number; w: number; h: number; antenna: number; windows: Array<[number, number, boolean]> };

const W = 1600;
const H = 420;

function buildCity(seed: number, minH: number, maxH: number, density: number): Building[] {
  const rand = mulberry32(seed);
  const out: Building[] = [];
  let x = -20;
  while (x < W + 20) {
    const w = 26 + rand() * 64;
    // Prédios mais altos concentrados no "centro financeiro" (à direita, atrás do personagem).
    const center = Math.exp(-Math.pow((x - W * 0.68) / (W * 0.22), 2));
    const h = minH + (maxH - minH) * (0.25 + 0.75 * rand()) * (0.45 + 0.55 * center);
    const windows: Building["windows"] = [];
    for (let wy = H - h + 14; wy < H - 10; wy += 11) {
      for (let wx = x + 6; wx < x + w - 6; wx += 9) {
        if (rand() < density) windows.push([wx, wy, rand() < 0.22]);
      }
    }
    out.push({ x, w, h, antenna: rand() < 0.18 ? 10 + rand() * 34 : 0, windows });
    x += w + (rand() < 0.2 ? 4 + rand() * 10 : 0);
  }
  return out;
}

/**
 * Silhueta de cidade à noite: duas camadas de prédios com janelas acesas (algumas em rosa).
 * Puramente decorativa.
 */
export const Skyline = memo(function Skyline({ className }: { className?: string }) {
  const far = useMemo(() => buildCity(7, 90, 300, 0.05), []);
  const near = useMemo(() => buildCity(21, 40, 190, 0.09), []);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" className={className} aria-hidden focusable="false">
      <defs>
        <linearGradient id="sky-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0c0a10" />
          <stop offset="1" stopColor="#050407" />
        </linearGradient>
      </defs>

      {/* Camada distante */}
      <g fill="url(#sky-far)">
        {far.map((b, i) => (
          <g key={`f${i}`}>
            <rect x={b.x} y={H - b.h} width={b.w} height={b.h} />
            {b.antenna > 0 && <rect x={b.x + b.w / 2 - 1} y={H - b.h - b.antenna} width={2} height={b.antenna} />}
          </g>
        ))}
      </g>
      <g>
        {far.flatMap((b, i) =>
          b.windows.map(([x, y, pink], j) => (
            <rect key={`fw${i}-${j}`} x={x} y={y} width={3} height={4} fill={pink ? "#f22283" : "#fefeff"} opacity={pink ? 0.55 : 0.18} />
          )),
        )}
        {far
          .filter((b) => b.antenna > 0)
          .map((b, i) => (
            <circle key={`fa${i}`} cx={b.x + b.w / 2} cy={H - b.h - b.antenna} r={2.2} fill="#fe217b" opacity={0.9} />
          ))}
      </g>

      {/* Camada próxima */}
      <g fill="#020203">
        {near.map((b, i) => (
          <rect key={`n${i}`} x={b.x} y={H - b.h} width={b.w} height={b.h} />
        ))}
      </g>
      <g>
        {near.flatMap((b, i) =>
          b.windows.map(([x, y, pink], j) => (
            <rect key={`nw${i}-${j}`} x={x} y={y} width={3} height={4} fill={pink ? "#f22283" : "#fefeff"} opacity={pink ? 0.5 : 0.1} />
          )),
        )}
      </g>
    </svg>
  );
});
