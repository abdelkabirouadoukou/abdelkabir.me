import { techStack } from "../../data/portfolio";
import SectionHeading from "./SectionHeading";

export default function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="border-t border-border py-20"
    >
      <SectionHeading id="skills-heading" index="04" title="Skills" />

      <div className="grid gap-8 sm:grid-cols-2">
        {techStack.map((group) => (
          <div key={group.label}>
            <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
              {group.label}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground/85">
              {group.items.join(" · ")}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}