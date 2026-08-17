export default function SectionHeading({
  id,
  index,
  title,
}: {
  id: string;
  index: string;
  title: string;
}) {
  return (
    <div className="mb-8">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">{index}</p>
      <h2 id={id} className="mt-3 font-mono text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}