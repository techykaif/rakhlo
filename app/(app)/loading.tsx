import { tw } from "@/components/ui/styles";
export default function AppLoading() {
  return (
    <div className={tw("app-content")} aria-busy="true" aria-label="Loading">
      <div className={tw("loading-skeleton loading-skeleton--title")} />
      <div className={tw("loading-skeleton loading-skeleton--line")} />
      <div className={tw("loading-skeleton loading-skeleton--panel")} />
      <div className={tw("loading-skeleton-list")}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div className={tw("loading-skeleton loading-skeleton--row")} key={index} />
        ))}
      </div>
    </div>
  );
}
