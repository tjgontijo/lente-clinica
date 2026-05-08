"use client";

import { useParams, useRouter } from "next/navigation";
import { useCaseDetailsQuery } from "@/features/cases/queries/use-case-details-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
	ChevronLeft,
	Pill,
	History,
	Plus,
	AlertCircle,
	Calendar,
	Phone,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SessionTimeline } from "@/features/cases/components/session-timeline";

export default function CaseDetailsPage() {
	const params = useParams();
	const router = useRouter();
	const caseId = params.id as string;

	const { data: pCase, isPending, error } = useCaseDetailsQuery(caseId);

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center py-24 text-center">
				<AlertCircle size={48} className="text-red-500 mb-4" />
				<h3 className="text-[20px] font-bold text-[var(--lc-neutral-900)] mb-2">
					Erro ao carregar caso
				</h3>
				<p className="text-[var(--lc-neutral-500)] mb-6">
					{error instanceof Error ? error.message : "Ocorreu um erro inesperado."}
				</p>
				<Button onClick={() => router.push("/cases")}>Voltar para Lista</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-8 pb-20">
			{/* Breadcrumb / Back */}
			<button
				type="button"
				onClick={() => router.push("/cases")}
				className="flex items-center gap-2 text-[var(--lc-neutral-500)] hover:text-[var(--lc-teal-600)] transition-colors w-fit group"
			>
				<ChevronLeft
					size={18}
					className="group-hover:-translate-x-0.5 transition-transform"
				/>
				<span className="text-[14px] font-medium">Voltar para pacientes</span>
			</button>

			{/* Hero Section */}
			<div className="flex flex-col gap-6">
				{isPending ? (
					<div className="space-y-4">
						<Skeleton className="h-10 w-48 rounded-md" />
						<div className="flex gap-4">
							<Skeleton className="h-5 w-32 rounded-md" />
							<Skeleton className="h-5 w-32 rounded-md" />
						</div>
					</div>
				) : (
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-1">
							<h1 className="text-[36px] font-bold text-[var(--lc-neutral-900)] tracking-tight">
								Caso {pCase?.firstName}
							</h1>
							<div className="flex flex-wrap gap-4 mt-1">
								{pCase?.phoneSuffix && (
									<div className="flex items-center gap-1.5 text-[var(--lc-neutral-500)] text-[14px]">
										<Phone size={14} className="text-[var(--lc-neutral-300)]" />
										Final: <span className="font-mono font-bold">{pCase.phoneSuffix}</span>
									</div>
								)}
								{pCase?.birthYear && (
									<div className="flex items-center gap-1.5 text-[var(--lc-neutral-500)] text-[14px]">
										<Calendar size={14} className="text-[var(--lc-neutral-300)]" />
										Nasc: <span className="font-medium">{pCase.birthYear}</span>
									</div>
								)}
							</div>
						</div>
					</div>
				)}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Main Content: Timeline */}
				<div className="lg:col-span-2 flex flex-col gap-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2 text-[var(--lc-neutral-800)]">
							<History size={20} className="text-[var(--lc-teal-600)]" />
							<h2 className="text-[20px] font-bold">Linha do Tempo</h2>
						</div>
						<Button
							variant="outline"
							className="rounded-full border-[var(--lc-teal-200)] text-[var(--lc-teal-700)] hover:bg-[var(--lc-teal-50)] font-bold gap-2"
						>
							<Plus size={18} />
							Nova Sessão
						</Button>
					</div>

					<Card className="p-8 rounded-[32px] border-[var(--lc-neutral-150)] bg-white min-h-[400px]">
						{isPending ? (
							<div className="space-y-8">
								{[1, 2, 3].map((i) => (
									<div key={i} className="flex gap-4">
										<Skeleton className="w-px h-12 bg-[var(--lc-neutral-100)]" />
										<div className="flex-1 space-y-2">
											<Skeleton className="h-4 w-32" />
											<Skeleton className="h-20 w-full" />
										</div>
									</div>
								))}
							</div>
						) : (
							<SessionTimeline sessions={pCase?.sessions ?? []} />
						)}
					</Card>
				</div>

				{/* Sidebar: Medications */}
				<div className="flex flex-col gap-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2 text-[var(--lc-neutral-800)]">
							<Pill size={20} className="text-[var(--lc-amber-600)]" />
							<h2 className="text-[20px] font-bold">Medicações</h2>
						</div>
						<Button
							size="sm"
							variant="ghost"
							className="text-[var(--lc-teal-600)] hover:text-[var(--lc-teal-700)] font-bold px-2 h-8"
						>
							Gerenciar
						</Button>
					</div>

					<Card className="p-6 rounded-[24px] border-[var(--lc-neutral-150)] bg-white">
						<div className="flex flex-col gap-3">
							{isPending ? (
								<div className="space-y-3">
									<Skeleton className="h-12 w-full rounded-xl" />
									<Skeleton className="h-12 w-full rounded-xl" />
								</div>
							) : pCase?.medications && pCase.medications.length > 0 ? (
								pCase.medications.map((pm) => (
									<div
										key={pm.medicationId}
										className="flex items-center justify-between p-3.5 rounded-[16px] bg-[var(--lc-neutral-50)] border border-[var(--lc-neutral-100)] group hover:border-[var(--lc-amber-200)] transition-colors"
									>
										<div className="flex flex-col gap-0.5">
											<span className="text-[15px] font-bold text-[var(--lc-neutral-900)]">
												{pm.medication.name}
											</span>
											<span className="text-[12px] text-[var(--lc-neutral-500)]">
												{pm.medication.class.name}
											</span>
										</div>
										{pm.isCurrent && (
											<Badge className="bg-[var(--lc-teal-50)] text-[var(--lc-teal-700)] border-none shadow-none text-[10px] uppercase font-bold tracking-wider">
												Ativa
											</Badge>
										)}
									</div>
								))
							) : (
								<div className="text-center py-8">
									<div className="w-12 h-12 rounded-full bg-[var(--lc-neutral-50)] flex items-center justify-center text-[var(--lc-neutral-300)] mx-auto mb-3">
										<Pill size={24} />
									</div>
									<p className="text-[13px] text-[var(--lc-neutral-500)] max-w-[180px] mx-auto">
										Nenhuma medicação registrada para este caso.
									</p>
									<Button
										variant="link"
										className="text-[var(--lc-teal-600)] font-bold text-[13px] mt-1"
									>
										+ Adicionar
									</Button>
								</div>
							)}
						</div>
					</Card>

					{/* Alert Card */}
					<div className="p-6 rounded-[24px] bg-(--lc-amber-50)/10 border border-(--lc-amber-100)/50 mt-2">
						<div className="flex items-start gap-3">
							<AlertCircle size={20} className="text-[var(--lc-amber-600)] mt-0.5" />
							<div className="flex flex-col gap-1">
								<span className="text-[14px] font-bold text-[var(--lc-amber-900)]">
									Observação Clínica
								</span>
								<p className="text-[13px] text-(--lc-amber-800)/80 leading-relaxed">
									Lembre-se de revisar os sinais de alerta das medicações ativas a
									cada nova sessão.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
