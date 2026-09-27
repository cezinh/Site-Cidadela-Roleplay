import { memo } from "react";
import { m, useReducedMotion } from "framer-motion";
import { EASE_IN_OUT } from "@/lib/motion";

/*
 * Mapa ilustrado da cidade, no estilo do mapa do GTA: ruas, avenidas, orla,
 * e a rota do GPS em rosa até o destino. Coordenadas no viewBox 560x700.
 */

// Rota: trecho da via expressa -> avenida central -> avenida transversal -> avenida leste -> destino.
const ROUTE = "M62.4 607.7 C144.6 567.5 225.9 507.5 303.4 470 L309.2 275.2 L465.1 281.4 L467.4 140";
const START = { x: 62.4, y: 607.7 };
const END = { x: 467.4, y: 140 };

const HIGHWAY = "M-20 640 C90 610 200 520 303.4 470 C380 430 470 390 580 360";
const AVENUES = ["M-20 262 L580 286", "M318 -20 L296 720", "M470 -20 L458 720", "M-20 96 L580 70", "M120 -20 L150 720"];
const COAST = "M330 720 C360 640 420 600 470 560 C520 520 540 480 580 452 L580 720 Z";

type Props = { className?: string; play?: boolean };

export const CityMap = memo(function CityMap({ className, play = true }: Props) {
  const reduce = useReducedMotion();
  const draw = !reduce && play;

  return (
    <svg viewBox="0 0 560 700" className={className} role="img" aria-label="Mapa ilustrado da cidade com uma rota de GPS até o destino">
      <defs>
        <pattern id="map-grid" width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M28 0H0V28" fill="none" stroke="rgb(254 254 255 / 0.035)" strokeWidth="1" />
        </pattern>
        <pattern id="map-streets-w" width="36" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(-6)">
          <rect width="36" height="30" fill="#0b0b10" />
          <rect x="3" y="3" width="30" height="24" rx="1.5" fill="#101017" />
        </pattern>
        <pattern id="map-streets-e" width="42" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(11)">
          <rect width="42" height="26" fill="#0b0b10" />
          <rect x="3" y="3" width="36" height="20" rx="1.5" fill="#111118" />
        </pattern>
        <pattern id="map-water" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="8" height="8" fill="#040407" />
          <line x1="0" y1="0" x2="0" y2="8" stroke="rgb(242 34 131 / 0.08)" strokeWidth="1.2" />
        </pattern>
        <pattern id="map-park" width="7" height="7" patternUnits="userSpaceOnUse">
          <rect width="7" height="7" fill="#0a0c0c" />
          <circle cx="3.5" cy="3.5" r="0.9" fill="rgb(254 254 255 / 0.09)" />
        </pattern>
        <clipPath id="map-west">
          <path d="M-20 -20 H307 L300 470 C200 520 90 610 -20 640 Z" />
        </clipPath>
        <clipPath id="map-east">
          <path d="M309 -20 H600 V360 C470 390 380 430 303.4 470 Z" />
        </clipPath>
        <clipPath id="map-south">
          <path d="M-20 640 C90 610 200 520 303.4 470 C380 430 470 390 600 360 V720 H-20 Z" />
        </clipPath>
        <filter id="map-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <radialGradient id="map-vignette" cx="50%" cy="45%" r="75%">
          <stop offset="55%" stopColor="#020203" stopOpacity="0" />
          <stop offset="100%" stopColor="#020203" stopOpacity="0.85" />
        </radialGradient>
      </defs>

      <rect width="560" height="700" fill="#070709" />

      {/* Quarteirões */}
      <rect width="560" height="700" fill="url(#map-streets-w)" clipPath="url(#map-west)" />
      <rect width="560" height="700" fill="url(#map-streets-e)" clipPath="url(#map-east)" />
      <rect width="560" height="700" fill="url(#map-streets-w)" clipPath="url(#map-south)" opacity="0.8" />

      {/* Parques */}
      <path d="M160 120 h110 a10 10 0 0 1 10 10 v96 a10 10 0 0 1 -10 10 h-110 a10 10 0 0 1 -10 -10 v-96 a10 10 0 0 1 10 -10z" fill="url(#map-park)" />
      <path d="M352 480 q40 -20 70 6 q20 30 -10 52 q-40 18 -62 -12 q-14 -26 2 -46z" fill="url(#map-park)" />

      {/* Orla */}
      <path d={COAST} fill="url(#map-water)" />
      <path d={COAST} fill="none" stroke="rgb(254 254 255 / 0.12)" strokeWidth="1.5" />

      <rect width="560" height="700" fill="url(#map-grid)" />

      {/* Avenidas e via expressa */}
      <g fill="none" strokeLinecap="round">
        {AVENUES.map((d) => (
          <path key={d} d={d} stroke="#1b1b24" strokeWidth="9" />
        ))}
        <path d={HIGHWAY} stroke="#23232e" strokeWidth="13" />
        <path d={HIGHWAY} stroke="rgb(254 254 255 / 0.06)" strokeWidth="1" strokeDasharray="8 10" />
      </g>

      {/* Rota do GPS */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <m.path
          d={ROUTE}
          stroke="#f22283"
          strokeWidth="12"
          opacity="0.55"
          filter="url(#map-glow)"
          initial={{ pathLength: draw ? 0 : 1 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 2.4, delay: 0.4, ease: EASE_IN_OUT }}
        />
        <m.path
          d={ROUTE}
          stroke="#fe217b"
          strokeWidth="5"
          initial={{ pathLength: draw ? 0 : 1 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 2.4, delay: 0.4, ease: EASE_IN_OUT }}
        />
      </g>

      {/* Jogador (seta branca, como no radar do jogo) */}
      <g transform={`translate(${START.x} ${START.y})`}>
        <circle r="18" fill="none" stroke="rgb(254 254 255 / 0.5)" strokeWidth="1.5" className="map-pulse" />
        <g transform="rotate(58)">
          <path d="M0 -11 L8 9 L0 4.5 L-8 9 Z" fill="#fefeff" stroke="#020203" strokeWidth="1.5" strokeLinejoin="round" />
        </g>
      </g>

      {/* Destino */}
      <m.g
        initial={{ opacity: draw ? 0 : 1, scale: draw ? 0.4 : 1 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, delay: draw ? 2.6 : 0, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <circle cx={END.x} cy={END.y} r="22" fill="none" stroke="#f22283" strokeWidth="1.5" className="map-pulse" />
        <circle cx={END.x} cy={END.y} r="7" fill="#f22283" stroke="#fefeff" strokeWidth="2.5" />
      </m.g>

      <rect width="560" height="700" fill="url(#map-vignette)" />
    </svg>
  );
});
