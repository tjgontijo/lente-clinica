import { Metadata } from "next";
import { CommunicationsDashboard } from "@/features/communications/components/communications-dashboard";

export const metadata: Metadata = {
  title: "Kit de Comunicação Clínica | Lente Clínica",
  description: "Modelos e templates para comunicação ágil e ética com psiquiatras.",
};

export default function CommunicationsPage() {
  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CommunicationsDashboard />
    </div>
  );
}
