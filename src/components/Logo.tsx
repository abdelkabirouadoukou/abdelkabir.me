/**
 * The "ak" mark: a geometric lowercase a + k. The k's ascender ends in a ball,
 * the peak of the hailstone. Strokes and ball use currentColor so the mark
 * inherits the nav's difference-blend colour; the standalone coloured versions
 * live in design-system/abdelkabir/brand/ and public/favicon.svg.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="8 12 84 74" fill="none" aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="31" cy="62" r="15.5" />
        <path d="M46.5 46.5V77.5" />
        <path d="M63 27V77.5" />
        <path d="M82 48 63 63 83 77.5" />
      </g>
      <circle cx="63" cy="24" r="8" fill="currentColor" />
    </svg>
  );
}
