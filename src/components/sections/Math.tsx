import SectionHeading from "./SectionHeading";

export default function Math() {
  return (
    <section
      id="math"
      aria-labelledby="math-heading"
      className="border-t border-border py-20"
    >
      <SectionHeading id="math-heading" index="05" title="Math & Research" />

      <p className="max-w-2xl text-[15px] leading-relaxed text-foreground/85">
        I spend time outside of coursework digging into the Collatz conjecture: ergodic theory,
        2-adic dynamics, symbolic dynamics, analytic number theory. Also into exam-level math prep,
        LaTeX styling for problem sets, and Monte Carlo simulations for modeling how I'm tracking
        academically.
      </p>
    </section>
  );
}