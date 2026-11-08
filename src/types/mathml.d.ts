import type { HTMLAttributes } from "react";

/** MathML Core elements used by the case-study equations (TSX has no built-in typings for them). */
type MathProps = HTMLAttributes<HTMLElement> & {
  display?: "block" | "inline";
  mathvariant?: "normal";
  accent?: "true" | "false";
  stretchy?: "true" | "false";
  fence?: "true" | "false";
  separator?: "true" | "false";
  form?: "prefix" | "infix" | "postfix";
  columnalign?: string;
  rowspacing?: string;
  columnspacing?: string;
  width?: string;
};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      math: MathProps;
      mrow: MathProps;
      mi: MathProps;
      mn: MathProps;
      mo: MathProps;
      mtext: MathProps;
      mfrac: MathProps;
      msqrt: MathProps;
      msub: MathProps;
      msup: MathProps;
      msubsup: MathProps;
      mover: MathProps;
      munder: MathProps;
      munderover: MathProps;
      mspace: MathProps;
      mtable: MathProps;
      mtr: MathProps;
      mtd: MathProps;
    }
  }
}
