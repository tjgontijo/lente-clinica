import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface MedicationCardProps {
  name: string;
  genericName: string;
  brandNames: string;
  className?: string;
  whatItDoes: string[];
  attentionSignals: string[];
  dosage?: string;
  onAdd?: () => void;
}

export function MedicationCard({
  name,
  genericName,
  brandNames,
  className,
  whatItDoes,
  attentionSignals,
  dosage,
  onAdd,
}: MedicationCardProps) {
  return (
    <Card className={`lc-card max-w-[420px] p-6 ${className}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-[var(--lc-text-lg)] font-[var(--lc-weight-bold)] text-[var(--lc-neutral-950)] tracking-tight">
            {name}
          </h3>
          <span className="text-[var(--lc-text-xs)] text-[var(--lc-neutral-500)] font-mono">
            {genericName} · {brandNames}
          </span>
        </div>
        <Badge
          variant="secondary"
          className="bg-[var(--lc-teal-100)] text-[var(--lc-teal-800)] border-[var(--lc-teal-200)] text-[10px] font-bold"
        >
          ISRS
        </Badge>
      </div>

      <div className="mt-4">
        <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--lc-neutral-400)] mb-2">
          O que faz
        </div>
        <ul className="flex flex-col gap-1.5">
          {whatItDoes.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-[var(--lc-text-sm)] text-[var(--lc-neutral-700)] leading-snug"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--lc-teal-400)] mt-1.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="h-px bg-[var(--lc-neutral-100)] my-4" />

      <div>
        <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--lc-neutral-400)] mb-2">
          Sinais de atenção na sessão
        </div>
        <ul className="flex flex-col gap-1.5">
          {attentionSignals.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-[var(--lc-text-sm)] text-[var(--lc-neutral-700)] leading-snug"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--lc-amber-400)] mt-1.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between mt-5 pt-1">
        {dosage && (
          <div className="text-[12px] text-[var(--lc-neutral-600)] font-mono bg-[var(--lc-neutral-100)] px-2 py-1 rounded-md">
            {dosage}
          </div>
        )}
        <Button
          size="sm"
          onClick={onAdd}
          className="h-8.5 rounded-full bg-[var(--lc-teal-600)] hover:bg-[var(--lc-teal-700)] text-white text-xs font-semibold px-4 flex items-center gap-1.5 border-none"
        >
          <Plus size={14} strokeWidth={2.5} />
          Adicionar
        </Button>
      </div>
    </Card>
  );
}
