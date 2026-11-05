// Small line icons for call / WhatsApp links (currentColor).
export function PhoneIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M5.5 3.5h3l1.5 4-2 1.3a11 11 0 0 0 7.2 7.2l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 3.5 5.7a2 2 0 0 1 2-2.2z" />
    </svg>
  );
}

export function ChatIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M4.5 19.5l1.2-3.6A8 8 0 1 1 8.6 19z" />
      <path d="M9.2 9.3c.3 1.9 1.6 3.4 3.6 4.1l1-1 1.6.7-.4 1.5c-3 .2-6.2-2.6-6.4-5.6l1.5-.5.8 1.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}
