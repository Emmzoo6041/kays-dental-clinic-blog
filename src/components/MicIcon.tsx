// Branded microphone illustration — used in place of Dr Esther's avatar
// on the header AND the big hero doctor card.
export function MicIcon({ size = 44, accent = "#2E7D42", glow = "#E6B800", className = "" }: {
  size?: number;
  accent?: string;
  glow?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-label="Conversations with a Dentist"
      role="img"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="micHalo" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor={glow} stopOpacity="0.35" />
          <stop offset="70%" stopColor={glow} stopOpacity="0.05" />
          <stop offset="100%" stopColor={glow} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="micBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor="#1E5C2E" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="30" r="30" fill="url(#micHalo)" />
      <rect x="22" y="10" width="20" height="30" rx="10" fill="url(#micBody)" />
      <rect x="25.5" y="13.5" width="3" height="23" rx="1.5" fill="#FFFFFF" opacity="0.22" />
      <path d="M16 30 a16 16 0 0 0 32 0" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" />
      <rect x="30.5" y="46" width="3" height="8" rx="1.5" fill={accent} />
      <rect x="22" y="53" width="20" height="3.5" rx="1.75" fill={accent} />
      <circle cx="32" cy="22" r="2.4" fill={glow} />
    </svg>
  );
}
