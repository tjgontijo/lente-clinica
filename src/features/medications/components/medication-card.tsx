import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { MedicationWithClass } from "../types";
import { Pill, Info } from "lucide-react";

interface MedicationCardProps {
	medication: MedicationWithClass;
	className?: string;
}

export function MedicationCard({ medication, className }: MedicationCardProps) {
	return (
		<Card
			className={`flex flex-col h-full bg-white border-[var(--lc-neutral-150)] shadow-sm hover:shadow-md transition-shadow duration-300 p-6 rounded-[16px] ${className}`}
		>
			<div className="flex items-start justify-between gap-4 mb-4">
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 rounded-lg bg-[var(--lc-teal-50)] flex items-center justify-center text-[var(--lc-teal-600)]">
							<Pill size={18} />
						</div>
						<h3 className="text-[18px] font-bold text-[var(--lc-neutral-900)] tracking-tight">
							{medication.name}
						</h3>
					</div>
					<div className="flex flex-wrap gap-1.5 mt-1">
						{medication.genericName && (
							<span className="text-[12px] text-[var(--lc-neutral-500)] font-medium">
								{medication.genericName}
							</span>
						)}
						{medication.commercialNames &&
							medication.commercialNames.length > 0 && (
								<>
									<span className="text-[12px] text-[var(--lc-neutral-300)]">
										•
									</span>
									<span className="text-[12px] text-[var(--lc-neutral-400)] italic">
										{medication.commercialNames.join(", ")}
									</span>
								</>
							)}
					</div>
				</div>
				<Badge className="bg-[var(--lc-teal-100)] text-[var(--lc-teal-700)] border-[var(--lc-teal-200)] hover:bg-[var(--lc-teal-100)] text-[11px] font-bold py-0.5 rounded-full">
					{medication.class.name}
				</Badge>
			</div>

			<div className="flex-1 flex flex-col gap-4">
				{medication.description && (
					<div className="bg-[var(--lc-neutral-50)] p-3.5 rounded-[12px] border border-[var(--lc-neutral-100)]">
						<div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--lc-neutral-400)] mb-1.5">
							<Info size={12} />
							Mecanismo e Uso
						</div>
						<p className="text-[14px] text-[var(--lc-neutral-700)] leading-relaxed">
							{medication.description}
						</p>
					</div>
				)}

				{medication.ethicalCare && (
					<div className="bg-[var(--lc-amber-50)] p-3.5 rounded-[12px] border border-[var(--lc-amber-100)]">
						<div className="text-[10px] font-bold uppercase tracking-widest text-[var(--lc-amber-700)] mb-1.5">
							Cuidado Ético e Manejo
						</div>
						<p className="text-[13px] text-[var(--lc-amber-900)] leading-relaxed font-medium">
							{medication.ethicalCare}
						</p>
					</div>
				)}
			</div>
		</Card>
	);
}
