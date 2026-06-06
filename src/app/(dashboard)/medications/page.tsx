"use client";

import { Database, SearchX } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { VirtuosoGrid } from "react-virtuoso";
import { PageHeader } from "@/components/layout/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { MedicationCard } from "@/features/medications/components/medication-card";
import { MedicationDetailsDrawerDialog } from "@/features/medications/components/medication-details-drawer-dialog";
import { MedicationsGridSkeleton } from "@/features/medications/components/medications-skeleton";
import { useMedicationsQuery } from "@/features/medications/queries/use-medications-query";
import type { ProductWithMedication } from "@/features/medications/types";

function MedicationsContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? undefined;

  const { data, isPending, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useMedicationsQuery(search);

  const products = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithMedication | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleCardClick = (product: ProductWithMedication) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <PageHeader
        icon={<Database size={20} strokeWidth={2.5} />}
        title="Base de Medicamentos"
        filter={
          <SearchInput placeholder="Buscar por produto ou substância..." />
        }
      />

      {isPending ? (
        <MedicationsGridSkeleton />
      ) : products.length > 0 ? (
        <VirtuosoGrid
          className="animate-in fade-in duration-500"
          data={products}
          useWindowScroll
          endReached={() => {
            if (!isFetchingNextPage && hasNextPage) {
              void fetchNextPage();
            }
          }}
          itemContent={(_, product) => (
            <MedicationCard
              key={product.id}
              product={product}
              onClick={handleCardClick}
            />
          )}
          components={{
            List: ({ children, ...props }) => (
              <div
                {...props}
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2"
              >
                {children}
              </div>
            ),
            Footer: () =>
              isFetchingNextPage ? <MedicationsGridSkeleton /> : null,
          }}
        />
      ) : (
        <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-[var(--lc-neutral-200)] bg-[var(--lc-neutral-50)] px-6 py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-[var(--lc-neutral-300)] shadow-sm">
            <SearchX size={32} />
          </div>
          <h3 className="mb-2 text-[18px] font-bold text-[var(--lc-neutral-900)]">
            Nenhum medicamento encontrado
          </h3>
          <p className="max-w-[400px] text-[var(--lc-neutral-500)]">
            Não encontramos resultados para "{search}". Tente buscar por termos
            mais amplos ou verifique a ortografia.
          </p>
        </div>
      )}

      <MedicationDetailsDrawerDialog
        product={selectedProduct}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </div>
  );
}

export default function MedicationsPage() {
  return (
    <Suspense fallback={<MedicationsGridSkeleton />}>
      <MedicationsContent />
    </Suspense>
  );
}
