import { Info, Pill } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { MedicationWithClass } from "../types";
import { getHumanClassInfo } from "../utils/atc-mapping";

interface MedicationCardProps {
  medication: MedicationWithClass;
  className?: string;
  onClick?: (medication: MedicationWithClass) => void;
}

const colorVariants: Record<string, string> = {
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
  violet: "bg-violet-50 text-violet-700 border-violet-200",
  purple: "bg-purple-50 text-purple-700 border-purple-200",
  fuchsia: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  pink: "bg-pink-50 text-pink-700 border-pink-200",
  rose: "bg-rose-50 text-rose-700 border-rose-200",
  red: "bg-red-50 text-red-700 border-red-200",
  orange: "bg-orange-50 text-orange-700 border-orange-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  green: "bg-green-50 text-green-700 border-green-200",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  teal: "bg-teal-50 text-teal-700 border-teal-200",
  cyan: "bg-cyan-50 text-cyan-700 border-cyan-200",
  sky: "bg-sky-50 text-sky-700 border-sky-200",
  slate: "bg-slate-50 text-slate-700 border-slate-200",
  zinc: "bg-zinc-50 text-zinc-700 border-zinc-200",
};

export function MedicationCard({
  medication,
  className,
  onClick,
}: MedicationCardProps) {
  const { label, color } = getHumanClassInfo(
    medication.class.name,
    medication.class.description,
  );

  const colorClass = colorVariants[color] || colorVariants.slate;

  return (
    <Card
      onClick={() => onClick?.(medication)}
      className={`flex flex-col h-full bg-white border-[var(--lc-neutral-150)] shadow-sm hover:shadow-md transition-all duration-300 p-6 rounded-[16px] cursor-pointer active:scale-[0.98] ${className}`}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--lc-teal-50)] flex items-center justify-center text-[var(--lc-teal-600)] shrink-0">
              <Pill size={18} />
            </div>
            <h3 className="text-[18px] font-bold text-[var(--lc-neutral-900)] tracking-tight line-clamp-2">
              {medication.name}
            </h3>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {medication.products && medication.products.length > 0 && (
              <span className="text-[12px] text-[var(--lc-neutral-400)] italic line-clamp-1">
                {medication.products
                  .map((product) => product.productName)
                  .join(", ")}
              </span>
            )}
          </div>
        </div>
        <Badge
          variant="outline"
          title={label}
          className={`${colorClass} hover:${colorClass} text-[10px] font-bold py-0.5 px-2.5 rounded-full shrink-0 transition-none max-w-[150px] truncate`}
        >
          {label}
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
      </div>
    </Card>
  );
}
