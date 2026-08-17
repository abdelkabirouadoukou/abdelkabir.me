import SectionHeading from "./SectionHeading";

export default function LinuxSecurity() {
  return (
    <section
      id="linux-security"
      aria-labelledby="linux-security-heading"
      className="border-t border-border py-20"
    >
      <SectionHeading id="linux-security-heading" index="06" title="Linux & Security" />

      <p className="max-w-2xl text-[15px] leading-relaxed text-foreground/85">
        Comfortable on Linux day to day: shell scripting, systemd, basic server hardening, that
        kind of thing. I've also been getting into network security and privacy tooling.
        Understanding how systems get probed and broken helps me build ones that don't. Nothing
        formal yet, just hands-on curiosity that feeds back into how I write and secure my own
        projects.
      </p>
    </section>
  );
}