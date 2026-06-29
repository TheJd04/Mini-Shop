// A small seal/monogram mark — fits the "heirloom" idea of something
// stamped, kept, and passed down, rather than a generic letter badge.
export default function HeirloomMark({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="12.5" stroke="var(--color-ink)" strokeWidth="1.4" />
      <circle cx="14" cy="14" r="9" fill="var(--color-ink)" />
      <path
        d="M10.5 9.5V18.5M10.5 13.5H17M17 9.5V18.5"
        stroke="var(--color-paper)"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
