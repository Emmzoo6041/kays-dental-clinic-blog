import { useId } from "react";

// Modern broadcast-style microphone (the brand mark). Line art in currentColor,
// so it can sit on a dark tile (white mic) or a light background (ink mic).
export function MicIcon({ size = 44, className = "" }: {
  size?: number;
  /** @deprecated kept for backwards compatibility */
  accent?: string;
  /** @deprecated kept for backwards compatibility */
  glow?: string;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      aria-label="Conversations with a Dentist"
      role="img"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <clipPath id={`grille-${id}`}>
          <path d="M11.5 12.2V8.5a4.5 4.5 0 0 1 9 0v3.7z" />
        </clipPath>
        <pattern id={`mesh-${id}`} width="2.2" height="2.2" patternUnits="userSpaceOnUse">
          <circle cx="1.1" cy="1.1" r="0.55" fill="currentColor" stroke="none" />
        </pattern>
      </defs>
      {/* grille mesh */}
      <rect x="11" y="3.5" width="10" height="9" fill={`url(#mesh-${id})`} stroke="none" clipPath={`url(#grille-${id})`} opacity="0.9" />
      {/* capsule body */}
      <rect x="11.5" y="4" width="9" height="15" rx="4.5" />
      {/* band */}
      <path d="M11.5 12.6h9" />
      {/* yoke with pivot knobs */}
      <path d="M7.5 12.5v1.8a8.5 8.5 0 0 0 17 0v-1.8" />
      <circle cx="7.5" cy="11.3" r="1.2" />
      <circle cx="24.5" cy="11.3" r="1.2" />
      {/* stand */}
      <path d="M16 22.8v4.2" />
      <path d="M11 28.2h10" strokeWidth={2.2} />
    </svg>
  );
}
