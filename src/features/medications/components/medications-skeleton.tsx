import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MedicationCardSkeleton() {
  return (
    <Card className="flex flex-col h-full bg-white border-[var(--lc-neutral-150)] p-6 rounded-[16px]">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="h-6 w-3/4 rounded-md" />
          </div>
          <Skeleton className="h-4 w-1/2 mt-1 rounded-md" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>

      <div className="flex-1 flex flex-col gap-4 mt-2">
        <div className="bg-[var(--lc-neutral-50)] p-3.5 rounded-[12px] border border-[var(--lc-neutral-100)]">
          <Skeleton className="h-3 w-20 mb-2 rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        <div className="bg-[var(--lc-amber-50)] p-3.5 rounded-[12px] border border-[var(--lc-neutral-100)]">
          <Skeleton className="h-3 w-28 mb-2 rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </Card>
  );
}

export function MedicationsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items are stable
        <MedicationCardSkeleton key={i} />
      ))}
    </div>
  );
}
