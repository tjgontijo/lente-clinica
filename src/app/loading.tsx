import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  const skeletonCards = ["card-a", "card-b", "card-c", "card-d"];

  return (
    <div className="flex flex-col gap-8">
      <section className="space-y-3">
        <Skeleton className="h-8 w-52 bg-[var(--lc-neutral-200)]" />
        <Skeleton className="h-4 w-80 max-w-full bg-[var(--lc-neutral-200)]" />
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {skeletonCards.map((cardId) => (
          <div
            key={cardId}
            className="rounded-[var(--lc-radius-md)] border border-[var(--lc-neutral-200)] bg-white p-5 shadow-[var(--lc-shadow-1)]"
          >
            <div className="space-y-3">
              <Skeleton className="h-5 w-36 bg-[var(--lc-neutral-200)]" />
              <Skeleton className="h-4 w-full bg-[var(--lc-neutral-200)]" />
              <Skeleton className="h-4 w-[85%] bg-[var(--lc-neutral-200)]" />
              <Skeleton className="h-10 w-28 rounded-[var(--lc-radius-full)] bg-[var(--lc-neutral-200)]" />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
