"use client";

import { Database, SearchX } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { PageHeader } from "@/components/layout/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { MedicationCard } from "@/features/medications/components/medication-card";
import { MedicationsGridSkeleton } from "@/features/medications/components/medications-skeleton";
import { useMedicationsQuery } from "@/features/medications/queries/use-medications-query";

function MedicationsContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? undefined;

  const { data: medications, isPending } = useMedicationsQuery(search);

  return (
    <div className="flex flex-col gap-8 pb-12">
      <PageHeader
        icon={<Database size={20} strokeWidth={2.5} />}
        title="Base de Medicamentos"
        filter={
          <SearchInput placeholder="Buscar por substância ou produto..." />
        }
      />

      {isPending ? (
        <MedicationsGridSkeleton />
      ) : medications && medications.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 animate-in fade-in duration-500 md:grid-cols-2 lg:grid-cols-3">
          {medications.map((medication) => (
            <MedicationCard key={medication.id} medication={medication} />
          ))}
        </div>
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
