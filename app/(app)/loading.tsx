export default function AppLoading() {
  return (
    <div className="app-content" aria-busy="true" aria-label="Loading">
      <div className="loading-skeleton loading-skeleton--title" />
      <div className="loading-skeleton loading-skeleton--line" />
      <div className="loading-skeleton loading-skeleton--panel" />
      <div className="loading-skeleton-list">
        {Array.from({ length: 5 }).map((_, index) => (
          <div className="loading-skeleton loading-skeleton--row" key={index} />
        ))}
      </div>
    </div>
  );
}
