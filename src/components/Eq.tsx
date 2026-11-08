import type { ReactNode } from "react";

/**
 * Display equation. Native MathML Core: no JS, no CDN (the site CSP forbids third-party
 * scripts), selectable, screen-reader friendly and crisp at any zoom. Numbering is a CSS
 * counter (.eq-no), so reordering equations never leaves a stale number behind.
 */
export function Eq({ children, label }: { children: ReactNode; label: string }) {
  return (
    <figure className="eq">
      <div className="eq-body" role="group" aria-label={label} tabIndex={0}>
        <math display="block">{children}</math>
      </div>
      <span className="eq-no" aria-hidden="true" />
      <figcaption className="eq-cap">{label}</figcaption>
    </figure>
  );
}

/** Inline math wrapper. */
export const V = ({ children }: { children: ReactNode }) => (
  <math>
    <mrow>{children}</mrow>
  </math>
);

/** Inline single identifier: <I c="b" /> */
export const I = ({ c }: { c: string }) => (
  <math>
    <mi>{c}</mi>
  </math>
);

/** δ̂, the paired estimate. Use inside <math>. */
export const Delta = () => (
  <mover accent="true">
    <mi>δ</mi>
    <mo>^</mo>
  </mover>
);

/** (b − c) used in several places. Use inside <math>. */
export const BmC = () => (
  <mrow>
    <mi>b</mi>
    <mo>−</mo>
    <mi>c</mi>
  </mrow>
);

/** |x| (cardinality / absolute value) with fixed-size bars. Use inside <math>. */
export const Abs = ({ children }: { children: ReactNode }) => (
  <mrow>
    <mo stretchy="false">|</mo>
    {children}
    <mo stretchy="false">|</mo>
  </mrow>
);
