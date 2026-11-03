/**
 * Small line illustrations for the ViewMedica library — one per topic.
 * Drawn on a 120×90 canvas: white teeth, ink outlines, a terracotta accent for problems
 * and a cool blue-grey for treatments, on a soft tile colour.
 */
import type { ReactNode } from "react";

const INK = "#1E211F";
const TOOTH = "#FFFFFF";
const MARK = "#B4705A";
const GUM = "#E6C3B9";
const COOL = "#7F97A3";
const COOL_FILL = "#D5E0E6";
const METAL = "#8E9599";

const MOLAR =
  "M-22 -19C-22 -31 -10 -35 0 -29C10 -35 22 -31 22 -19C22 -7 18 1 16 11C14 23 12 35 7 35C3 35 3 21 0 15C-3 21 -3 35 -7 35C-12 35 -14 23 -16 11C-18 1 -22 -7 -22 -19Z";
const INCISOR = "M-12 -30C-12 -35 12 -35 12 -30L12 -4C12 8 6 32 0 32C-6 32 -12 8 -12 -4Z";

function Molar({ x = 60, y = 47, s = 1, r = 0, fill = TOOTH, children }: { x?: number; y?: number; s?: number; r?: number; fill?: string; children?: ReactNode }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d={MOLAR} fill={fill} />
      {children}
    </g>
  );
}

const Gum = ({ top = 56, dip = 6 }: { top?: number; dip?: number }) => (
  <path d={`M-4 96L-4 ${top}L14 ${top}Q36 ${top - dip} 46 ${top}Q60 ${top + dip + 2} 74 ${top}Q84 ${top - dip} 106 ${top}L124 ${top}L124 96Z`} fill={GUM} />
);

const Sparkle = ({ x, y, s = 1, c = INK }: { x: number; y: number; s?: number; c?: string }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 -6C0.8 -1.5 1.5 -0.8 6 0C1.5 0.8 0.8 1.5 0 6C-0.8 1.5 -1.5 0.8 -6 0C-1.5 -0.8 -0.8 -1.5 0 -6Z" fill={c} stroke="none" />
);

const Drop = ({ x, y, s = 1, fill = MARK, stroke = "none" }: { x: number; y: number; s?: number; fill?: string; stroke?: string }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 -12C0 -12 -8 -1 -8 4A8 8 0 0 0 8 4C8 -1 0 -12 0 -12Z" fill={fill} stroke={stroke} />
);

const LIPS = "M28 46Q44 32 60 40Q76 32 92 46Q78 66 60 64Q42 66 28 46Z";

const ART: Record<string, ReactNode> = {
  decay: (
    <Molar s={1.05}>
      <circle cx="-8" cy="-22" r="5" fill={MARK} stroke="none" />
      <circle cx="7" cy="-14" r="2.8" fill={MARK} stroke="none" />
      <circle cx="-3" cy="-9" r="1.6" fill={MARK} stroke="none" />
    </Molar>
  ),
  gingivitis: (
    <>
      <Molar y={44} />
      <Gum top={56} />
      {[44, 60, 76].map((x) => <circle key={x} cx={x} cy={x === 60 ? 64 : 59} r="1.8" fill={MARK} stroke="none" />)}
    </>
  ),
  gumDisease: (
    <>
      <Molar y={42} />
      <path d="M8 54H112" strokeDasharray="3 4" stroke={MARK} strokeWidth="1.6" />
      <Gum top={66} dip={4} />
      <path d="M50 66v-8M70 66v-8" stroke={MARK} strokeWidth="1.8" />
    </>
  ),
  breath: (
    <>
      <path d={LIPS} fill={TOOTH} />
      <path d="M34 46Q60 54 86 46" />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${86 + i * 8} ${36 - i * 2}q4 -4 0 -8q-4 -4 0 -8`} stroke={MARK} fill="none" />
      ))}
    </>
  ),
  bottle: (
    <>
      <path d="M38 27Q43 9 48 27" fill={GUM} />
      <rect x="34" y="27" width="18" height="7" rx="2" fill={COOL_FILL} />
      <rect x="31" y="34" width="24" height="46" rx="8" fill={TOOTH} />
      <path d="M31 50h8M31 58h6M31 66h8" stroke={COOL} />
      <path d="M31 62Q43 58 55 62V72a8 8 0 0 1 -8 8H39a8 8 0 0 1 -8 -8Z" fill={COOL_FILL} stroke="none" />
      <rect x="31" y="34" width="24" height="46" rx="8" fill="none" />
      <Molar x={84} y={52} s={0.62}>
        <circle cx="-6" cy="-20" r="5" fill={MARK} stroke="none" />
      </Molar>
    </>
  ),
  sensitive: (
    <>
      <Molar>
        <path d="M2 -30L-6 -14H2L-4 0" stroke={MARK} strokeWidth="2.6" fill="none" />
      </Molar>
      <path d="M22 26l-7 3M20 36h-8M22 46l-7 -3" stroke={COOL} />
      <path d="M98 26l7 3M100 36h8M98 46l7 -3" stroke={COOL} />
    </>
  ),
  tartar: (
    <>
      <Molar y={42} />
      <path d="M39 50q3 -5 6 0q3 -5 6 0q3 -5 6 0q3 -5 6 0q3 -5 6 0q3 -5 6 0q3 -5 4 1L80 56H40Z" fill="#CDB98E" />
      <Gum top={57} dip={4} />
    </>
  ),
  thumb: (
    <>
      <rect x="44" y="18" width="32" height="76" rx="16" fill={TOOTH} />
      <rect x="50" y="24" width="20" height="20" rx="9" fill={GUM} />
      <path d="M50 62q10 4 20 0M52 70q8 3 16 0" />
      <path d="M30 30q-6 8 0 16M90 30q6 8 0 16" stroke={MARK} />
    </>
  ),
  sores: (
    <>
      <path d={LIPS} fill={GUM} />
      <path d="M34 46Q60 50 86 46" />
      <circle cx="66" cy="56" r="4.5" fill={TOOTH} stroke={MARK} strokeWidth="2" />
      <circle cx="66" cy="56" r="1.4" fill={MARK} stroke="none" />
    </>
  ),
  bleeding: (
    <>
      <Molar x={54} y={42} />
      <Gum top={56} />
      <Drop x={92} y={36} />
      <Drop x={72} y={64} s={0.45} />
    </>
  ),
  brush: (
    <>
      <g transform="rotate(-24 60 50)">
        <rect x="44" y="52" width="58" height="8" rx="4" fill={TOOTH} />
        <rect x="16" y="50" width="30" height="11" rx="4" fill={TOOTH} />
        {Array.from({ length: 7 }).map((_, i) => (
          <path key={i} d={`M${20 + i * 3.7} 49V37`} stroke={COOL} strokeWidth="2.2" />
        ))}
      </g>
      <circle cx="78" cy="26" r="3.5" fill="none" stroke={COOL} />
      <circle cx="88" cy="18" r="2.2" fill="none" stroke={COOL} />
      <circle cx="70" cy="16" r="1.8" fill="none" stroke={COOL} />
    </>
  ),
  floss: (
    <>
      <Molar x={42} y={50} s={0.72} r={-4} />
      <Molar x={78} y={50} s={0.72} r={4} />
      <path d="M48 8C58 18 62 30 60 44C58 56 62 62 70 70" stroke={COOL} strokeWidth="2.4" fill="none" />
    </>
  ),
  care: (
    <>
      <Molar x={56} />
      <Sparkle x={88} y={22} s={1.2} c={COOL} />
      <Sparkle x={26} y={30} s={0.8} c={COOL} />
      <circle cx="84" cy="66" r="10" fill={COOL} stroke="none" />
      <path d="M79 66l3.5 3.5L89 62" stroke={TOOTH} strokeWidth="2.4" fill="none" />
    </>
  ),
  fluoride: (
    <>
      <Drop x={60} y={46} s={3} fill={COOL_FILL} stroke={INK} />
      <text x="60" y="64" textAnchor="middle" fontSize="26" fontStyle="italic" fontWeight="700" fill={INK} stroke="none" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>F</text>
      <Sparkle x={90} y={24} s={0.9} c={COOL} />
    </>
  ),
  implant: (
    <>
      <rect x="-4" y="52" width="128" height="44" fill={GUM} stroke="none" />
      <path d="M-4 52H124" />
      <path d="M40 34C40 20 50 16 60 22C70 16 80 20 80 34C80 40 76 44 72 44H48C44 44 40 40 40 34Z" fill={TOOTH} />
      <rect x="53" y="44" width="14" height="8" rx="2" fill={COOL_FILL} />
      <path d="M52 52H68L65 84H55Z" fill={METAL} />
      {[58, 64, 70, 76].map((y) => <path key={y} d={`M53 ${y + 1}L67 ${y - 3}`} stroke={TOOTH} strokeWidth="1.6" />)}
    </>
  ),
  filling: (
    <Molar s={1.05}>
      <path d="M-10 -26C-6 -30 6 -30 10 -24C12 -18 6 -12 0 -13C-8 -13 -14 -20 -10 -26Z" fill={COOL_FILL} stroke={COOL} strokeWidth="2" />
    </Molar>
  ),
  crown: (
    <>
      <g transform="translate(60 58) scale(0.95)">
        <path d="M-15 -8C-15 -14 15 -14 15 -8C15 2 13 8 11 16C9 26 8 32 5 32C2 32 2 22 0 18C-2 22 -2 32 -5 32C-8 32 -9 26 -11 16C-13 8 -15 2 -15 -8Z" fill={TOOTH} />
      </g>
      <path d="M40 30C40 14 50 10 60 16C70 10 80 14 80 30C80 36 77 40 73 40H47C43 40 40 36 40 30Z" fill={COOL_FILL} />
      <path d="M60 42v4" stroke={COOL} strokeDasharray="2 3" />
      <Sparkle x={90} y={20} s={0.9} c={COOL} />
    </>
  ),
  veneer: (
    <>
      <g transform="translate(64 47)"><path d={INCISOR} fill={TOOTH} /></g>
      <g transform="translate(50 47)"><path d={INCISOR} fill={COOL_FILL} fillOpacity="0.55" stroke={COOL} strokeDasharray="3 3" /></g>
      <path d="M30 47h8m-3 -3l3 3l-3 3" stroke={COOL} fill="none" />
    </>
  ),
  sealant: (
    <>
      <Molar y={52} s={0.92} />
      <path d="M60 10L80 16V30C80 40 70 46 60 50C50 46 40 40 40 30V16Z" fill={COOL_FILL} fillOpacity="0.85" stroke={COOL} />
      <path d="M53 29l5 5l9 -10" stroke={COOL} strokeWidth="2.4" fill="none" />
    </>
  ),
  scaling: (
    <>
      <Molar x={54} y={42} />
      <Gum top={56} />
      <path d="M104 8L76 46" stroke={METAL} strokeWidth="3.2" />
      <path d="M76 46q-4 6 -10 4" stroke={METAL} strokeWidth="2.2" fill="none" />
      <circle cx="70" cy="58" r="1.6" fill="#CDB98E" stroke="none" />
      <circle cx="66" cy="64" r="1.2" fill="#CDB98E" stroke="none" />
    </>
  ),
  dentures: (
    <>
      <path d="M18 28H102V40Q96 46 90 40Q84 46 78 40Q72 46 66 40Q60 46 54 40Q48 46 42 40Q36 46 30 40Q24 46 18 40Z" fill={GUM} />
      {[24, 36, 48, 60, 72, 84].map((x, i) => (
        <rect key={x} x={x - 4 + (i === 0 ? -2 : 0)} y="40" width={i === 0 || i === 5 ? 12 : 12} height={i === 2 || i === 3 ? 26 : 22} rx="4" fill={TOOTH} />
      ))}
      <rect x="92" y="40" width="10" height="20" rx="4" fill={TOOTH} />
    </>
  ),
  rootCanal: (
    <Molar s={1.08}>
      <path d="M-8 -20C-8 -26 8 -26 8 -20C8 -14 4 -10 0 -10C-4 -10 -8 -14 -8 -20Z" fill={MARK} fillOpacity="0.35" stroke={MARK} strokeWidth="1.8" />
      <path d="M-5 -11C-8 4 -9 18 -8 30M5 -11C8 4 9 18 8 30" stroke={MARK} strokeWidth="2.4" fill="none" />
    </Molar>
  ),
  wisdom: (
    <>
      <Molar x={44} y={50} s={0.72} />
      <Molar x={84} y={56} s={0.66} r={38} />
      <path d="M70 26q-6 -6 -12 -2m0 0l1 -5m-1 5l5 1" stroke={MARK} fill="none" />
    </>
  ),
  braces: (
    <>
      {[26, 44, 62, 80].map((x) => <rect key={x} x={x} y="26" width="16" height="38" rx="6" fill={TOOTH} />)}
      <path d="M20 46H102" stroke={METAL} strokeWidth="2.2" />
      {[34, 52, 70, 88].map((x) => <rect key={x} x={x - 4} y="42" width="8" height="8" rx="1.5" fill={METAL} stroke={INK} strokeWidth="1.4" />)}
    </>
  ),
  aligner: (
    <>
      {[30, 46, 62, 78].map((x) => <rect key={x} x={x} y="30" width="14" height="34" rx="6" fill={TOOTH} />)}
      <rect x="24" y="24" width="74" height="46" rx="14" fill={COOL_FILL} fillOpacity="0.35" stroke={COOL} strokeDasharray="4 3" />
      <Sparkle x={104} y={20} s={0.8} c={COOL} />
    </>
  ),
  whitening: (
    <>
      <g transform="translate(60 47) scale(1.05)">
        <clipPath id="half-whitening"><rect x="-30" y="-40" width="30" height="80" /></clipPath>
        <path d={MOLAR} fill={TOOTH} />
        <path d={MOLAR} fill="#E3D5B4" stroke="none" clipPath="url(#half-whitening)" />
        <path d={MOLAR} fill="none" />
      </g>
      <Sparkle x={88} y={22} s={1.3} c={COOL} />
      <Sparkle x={96} y={42} s={0.7} c={COOL} />
    </>
  ),
  anxiety: (
    <>
      <Molar x={56}>
        <path d="M-10 -20q3 -3 6 0M4 -20q3 -3 6 0" fill="none" />
        <path d="M-7 -10q7 6 14 0" fill="none" />
      </Molar>
      <path transform="translate(92 26)" d="M0 6C-8 0 -9 -6 -5 -8C-2 -9 0 -6 0 -4C0 -6 2 -9 5 -8C9 -6 8 0 0 6Z" fill={MARK} stroke="none" />
      <path d="M22 66q8 -6 16 0M18 74q12 -8 24 0" stroke={COOL} fill="none" />
    </>
  ),
};

const TILES: Record<string, string[]> = {
  conditions: ["#EFE9E1", "#EDE6E3", "#ECE8DF"],
  care: ["#E6EBE7", "#E5E9EC", "#EAEBE4"],
};

export function TopicArt({ art, group, index = 0, className = "" }: { art: string; group: string; index?: number; className?: string }) {
  const tiles = TILES[group] ?? TILES.care;
  return (
    <svg viewBox="0 0 120 90" className={className} role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <rect width="120" height="90" fill={tiles[index % tiles.length]} />
      <g fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {ART[art] ?? ART.care}
      </g>
    </svg>
  );
}
