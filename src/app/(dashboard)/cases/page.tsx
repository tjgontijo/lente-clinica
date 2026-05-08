"use client";

import { useCasesQuery } from "@/features/cases/queries/use-cases-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Users, Phone, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogTrigger,
} from "@/components/ui/dialog";
import { CreateCaseForm } from "@/features/cases/forms/create-case-form";

export default function CasesPage() {
	const { data: cases, isPending } = useCasesQuery();
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	return (
		<div className="flex flex-col gap-8 pb-12">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
				<div className="flex flex-col gap-1.5">
					<div className="flex items-center gap-2 text-[var(--lc-teal-600)] mb-1">
						<Users size={20} strokeWidth={2.5} />
						<span className="text-[13px] font-bold uppercase tracking-wider">
							Gestão de Pacientes
						</span>
					</div>
					<h1 className="text-[32px] font-bold text-[var(--lc-neutral-900)] tracking-tight">
						Meus Casos
					</h1>
					<p className="text-[var(--lc-neutral-500)] max-w-[600px] leading-relaxed">
						Visualize e gerencie o histórico clínico e medicações de seus
						pacientes de forma anônima e segura.
					</p>
				</div>

				<Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
					<DialogTrigger asChild>
						<Button className="h-12 px-6 rounded-full bg-[var(--lc-teal-600)] hover:bg-[var(--lc-teal-700)] text-white gap-2 font-bold shadow-lg shadow-teal-600/10 transition-all hover:scale-[1.02] active:scale-[0.98]">
							<Plus size={20} strokeWidth={3} />
							Novo Paciente
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-[450px] rounded-[32px] border-none p-8">
						<CreateCaseForm onSuccess={() => setIsCreateModalOpen(false)} />
					</DialogContent>
				</Dialog>
			</div>

			{/* List */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{isPending ? (
					Array.from({ length: 6 }).map((_, i) => (
						<Skeleton
							// biome-ignore lint/suspicious/noArrayIndexKey: skeleton items are stable
							key={i}
							className="h-[180px] w-full rounded-[24px] bg-white border border-[var(--lc-neutral-100)]"
						/>
					))
				) : cases && cases.length > 0 ? (
					cases.map((pCase) => (
						<Link
							key={pCase.id}
							href={`/cases/${pCase.id}`}
							className="group focus:outline-none"
						>
							<Card className="p-6 h-full border-[var(--lc-neutral-150)] hover:border-[var(--lc-teal-200)] hover:shadow-md transition-all duration-300 rounded-[24px] flex flex-col gap-4 relative overflow-hidden bg-white">
								<div className="flex items-center justify-between mb-1">
									<div className="w-12 h-12 rounded-2xl bg-[var(--lc-neutral-50)] group-hover:bg-[var(--lc-teal-50)] flex items-center justify-center text-[var(--lc-neutral-400)] group-hover:text-[var(--lc-teal-600)] transition-colors">
										<Users size={24} />
									</div>
									<div className="text-[var(--lc-neutral-300)] group-hover:text-[var(--lc-teal-300)] transition-colors">
										<ArrowRight size={20} />
									</div>
								</div>

								<div>
									<h3 className="text-[20px] font-bold text-[var(--lc-neutral-900)] mb-3">
										{pCase.firstName}
									</h3>

									<div className="flex flex-col gap-2">
										{pCase.phoneSuffix && (
											<div className="flex items-center gap-2 text-[var(--lc-neutral-500)] text-[14px]">
												<Phone size={14} className="text-[var(--lc-neutral-300)]" />
												Final do telefone:{" "}
												<span className="font-mono font-bold text-[var(--lc-neutral-700)]">
													{pCase.phoneSuffix}
												</span>
											</div>
										)}
										{pCase.birthYear && (
											<div className="flex items-center gap-2 text-[var(--lc-neutral-500)] text-[14px]">
												<Calendar size={14} className="text-[var(--lc-neutral-300)]" />
												Ano nasc:{" "}
												<span className="font-medium text-[var(--lc-neutral-700)]">
													{pCase.birthYear}
												</span>
											</div>
										)}
									</div>
								</div>

								{/* Decorative gradient */}
								<div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[var(--lc-teal-50)]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
							</Card>
						</Link>
					))
				) : (
					<div className="col-span-full py-20 bg-[var(--lc-neutral-50)] border-2 border-dashed border-[var(--lc-neutral-200)] rounded-[32px] flex flex-col items-center justify-center text-center px-6">
						<div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-[var(--lc-neutral-200)] mb-6 shadow-sm">
							<Users size={40} />
						</div>
						<h3 className="text-[22px] font-bold text-[var(--lc-neutral-900)] mb-2">
							Nenhum paciente cadastrado
						</h3>
						<p className="text-[var(--lc-neutral-500)] max-w-[400px] mb-8">
							Comece criando seu primeiro caso para gerenciar medicações e o
							histórico clínico.
						</p>
						<Button
							onClick={() => setIsCreateModalOpen(true)}
							className="h-12 px-8 rounded-full bg-[var(--lc-teal-600)] hover:bg-[var(--lc-teal-700)] text-white gap-2 font-bold"
						>
							<Plus size={20} strokeWidth={3} />
							Criar Primeiro Caso
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
