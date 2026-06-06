import { Metadata } from "next";
import { ChecklistDashboard } from "@/features/checklists/components/checklist-dashboard";

export const metadata: Metadata = {
  title: "Sinais de Atenção | Lente Clínica",
  description: "Checklist de Sinais Psiquiátricos, Medicamentosos e Clínicos.",
};

export default function ChecklistsPage() {
  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ChecklistDashboard />
    </div>
  );
}
