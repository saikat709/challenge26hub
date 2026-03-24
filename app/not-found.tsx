import Link from "next/link";
import "./not-found.css";

export default function NotFound() {
  return (
    <main className="nf-page">
      <div className="nf-ambient nf-ambient-a" aria-hidden />
      <div className="nf-ambient nf-ambient-b" aria-hidden />

      <section className="nf-shell">
        <header className="nf-meta">
          <span className="nf-pill">404</span>
          <span className="nf-meta-text">Lost in the grid</span>
        </header>

        <div className="nf-body">
          <div className="nf-copy">
            <h1 className="nf-title">Page not found</h1>
            <p className="nf-subtitle">
              The page you are looking for is not available. Try one of the quick links below or head back to the
              homepage.
            </p>
            <div className="nf-actions">
              <Link href="/" className="nf-btn nf-btn-primary">
                Go home
              </Link>
              <Link href="/businesses" className="nf-btn nf-btn-ghost">
                View businesses
              </Link>
              <Link href="/ideas" className="nf-btn nf-btn-ghost subtle">
                Explore ideas
              </Link>
            </div>
          </div>

          <div className="nf-card-grid">
            <article className="nf-card">
              <p className="nf-card-label">Status</p>
              <p className="nf-card-title">Off the map</p>
              <p className="nf-card-sub">We could not locate this route.</p>
            </article>
            <article className="nf-card accent">
              <p className="nf-card-label">Next steps</p>
              <p className="nf-card-title">Browse listings</p>
              <p className="nf-card-sub">Discover businesses and ideas nearby.</p>
            </article>
            <article className="nf-card span">
              <p className="nf-card-sub">
                Having trouble? <Link className="nf-link" href="/login">Sign in</Link> to pick up where you left off.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
