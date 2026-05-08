import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ChecklistItemProps {
	label: string;
	checked: boolean;
	severity?: "NORMAL" | "AMBER" | "RED";
	onToggle: () => void;
	className?: string;
}

export function ChecklistItem({
	label,
	checked,
	severity = "NORMAL",
	onToggle,
	className,
}: ChecklistItemProps) {
	const isAmber = severity === "AMBER";
	const isRed = severity === "RED";

	return (
		<label
			className={cn(
				"group flex items-center gap-3 px-3.5 py-2.5 bg-white border border-[var(--lc-border-default)] rounded-[var(--lc-radius-md)] transition-all cursor-pointer hover:bg-[var(--lc-neutral-50)]",
				checked && "bg-[var(--lc-teal-50)] border-[var(--lc-teal-200)]",
				checked && isAmber && "bg-[var(--lc-amber-50)] border-[var(--lc-amber-300)]",
				checked && isRed && "bg-[var(--lc-red-50)] border-[var(--lc-red-300)]",
				className,
			)}
		>
			<input
				type="checkbox"
				className="sr-only"
				checked={checked}
				onChange={onToggle}
			/>

			<div
				className={cn(
					"flex items-center justify-center w-5 h-5 rounded-[5px] border-1.5 border-[var(--lc-neutral-300)] bg-white transition-colors shrink-0",
					checked && "bg-[var(--lc-teal-600)] border-[var(--lc-teal-600)]",
					!checked && isAmber && "border-[var(--lc-amber-400)]",
					!checked && isRed && "border-[var(--lc-red-400)]",
					checked && isAmber && "bg-[var(--lc-amber-500)] border-[var(--lc-amber-500)]",
					checked && isRed && "bg-[var(--lc-red-600)] border-[var(--lc-red-600)]",
				)}
			>
				{checked && <Check className="text-white w-3.5 h-3.5" strokeWidth={3} />}
			</div>

			<span
				className={cn(
					"flex-1 text-[var(--lc-text-base)] text-[var(--lc-neutral-800)] leading-snug transition-colors",
					checked && "text-[var(--lc-teal-900)]",
					checked && isAmber && "text-[var(--lc-amber-900)] font-medium",
					checked && isRed && "text-[var(--lc-red-900)] font-medium",
				)}
			>
				{label}
			</span>

			{checked && (
				<div
					className={cn(
						"text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-[4px] border",
						!isAmber &&
							!isRed &&
							"bg-[var(--lc-teal-100)] text-[var(--lc-teal-800)] border-[var(--lc-teal-200)]",
						isAmber &&
							"bg-[var(--lc-amber-100)] text-[var(--lc-amber-800)] border-[var(--lc-amber-200)]",
						isRed && "bg-[var(--lc-red-100)] text-[var(--lc-red-800)] border-[var(--lc-red-200)]",
					)}
				>
					{isRed ? "Urgência" : isAmber ? "Atenção" : "OK"}
				</div>
			)}
		</label>
	);
}
