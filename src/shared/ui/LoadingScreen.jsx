// Keep the initial document fallback in index.html consistent with this screen.
// The document uses the same classes before React can mount.
export function LoadingScreen() {
  return (
    <main className="loading-screen" aria-busy="true">
      <div role="status" aria-live="polite" aria-atomic="true">
        <p className="loading-brand">Apollo Rigor</p>
        <div className="loading-track" aria-hidden="true">
          <span className="loading-thread" />
        </div>
        <p className="loading-message">Carregando página…</p>
      </div>
    </main>
  );
}
