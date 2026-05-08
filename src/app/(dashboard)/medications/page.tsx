"use client";

import { useSearchParams } from "next/navigation";
import { useMedicationsQuery } from "@/features/medications/queries/use-medications-query";
import { MedicationCard } from "@/features/medications/components/medication-card";
import { MedicationsGridSkeleton } from "@/features/medications/components/medications-skeleton";
import { SearchInput } from "@/components/ui/search-input";
import { Database, SearchX } from "lucide-react";

import { Suspense } from "react";

function MedicationsContent() {
	const searchParams = useSearchParams();
	const search = searchParams.get("search") ?? undefined;

	const { data: medications, isPending } = useMedicationsQuery(search);

	return (
		<div className="flex flex-col gap-8 pb-12">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
				<div className="flex flex-col gap-1.5">
					<div className="flex items-center gap-2 text-[var(--lc-teal-600)] mb-1">
						<Database size={20} strokeWidth={2.5} />
						<span className="text-[13px] font-bold uppercase tracking-wider">
							Base de Conhecimento
						</span>
					</div>
					<h1 className="text-[32px] font-bold text-[var(--lc-neutral-900)] tracking-tight">
						Psicofarmacologia
					</h1>
					<p className="text-[var(--lc-neutral-500)] max-w-[600px] leading-relaxed">
						Consulte mecanismos de ação, cuidados éticos e sinais de alerta
						para o manejo clínico seguro.
					</p>
				</div>

				<div className="w-full md:w-[320px]">
					<SearchInput placeholder="Buscar por nome ou genérico..." />
				</div>
			</div>

			{/* Content */}
			{isPending ? (
				<MedicationsGridSkeleton />
			) : medications && medications.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
					{medications.map((medication) => (
						<MedicationCard key={medication.id} medication={medication} />
					))}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center py-24 bg-[var(--lc-neutral-50)] rounded-[24px] border border-dashed border-[var(--lc-neutral-200)] text-center px-6">
					<div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[var(--lc-neutral-300)] mb-4 shadow-sm">
						<SearchX size={32} />
					</div>
					<h3 className="text-[18px] font-bold text-[var(--lc-neutral-900)] mb-2">
						Nenhum medicamento encontrado
					</h3>
					<p className="text-[var(--lc-neutral-500)] max-w-[400px]">
						Não encontramos resultados para "{search}". Tente buscar por termos
						mais genéricos ou verifique a ortografia.
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
