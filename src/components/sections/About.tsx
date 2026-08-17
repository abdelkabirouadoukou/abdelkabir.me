import { THEXJS_REPO } from "../../data/portfolio";
import SectionHeading from "./SectionHeading";

export default function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="border-t border-border py-20">
      <SectionHeading id="about-heading" index="01" title="About" />

      <p className="max-w-2xl text-[15px] leading-relaxed text-foreground/85">
        I'm a student in Marrakesh, and outside of coursework I design and ship software on my own.
        Micro-SaaS, educational platforms, open-source tools, whatever I'm curious about that
        month.
      </p>

      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-foreground/85">
        I'm drawn to privacy and network-security tooling, and to math I can actually sit with and
        work through rather than skim. I'd rather build something from scratch and understand every
        layer of it than stitch frameworks together, which is basically why{" "}
        <a
          href={THEXJS_REPO}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          @thexjs
        </a>{" "}
        exists. It's my own full-stack framework, and I run it in production on my own projects.
      </p>
    </section>
  );
}