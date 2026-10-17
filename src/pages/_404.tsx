export default function NotFound() {
  return (
    <main className="lost">
      {/* x's shell has a fixed <title>; fix the tab title for this page */}
      <script dangerouslySetInnerHTML={{ __html: 'document.title="404 — not in this orbit · Abdelkabir Ouadoukou"' }} />
      <p className="eyebrow">n = 404 · not in this orbit</p>
      <b aria-hidden="true">404</b>
      <h2>
        This number never <em>reaches</em> 1.
      </h2>
      <div className="actions">
        <a className="btn pri" href="/" data-no-nav>Back to 27 →</a>
      </div>
    </main>
  );
}
