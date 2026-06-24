import type { Metadata } from "next";
import { Suspense } from "react";
import { CommunicationsScreen } from "@/features/communications/screens/CommunicationsScreen";

export const metadata: Metadata = {
  title: "Kit de Comunicação Clínica | Lente Clínica",
  description:
    "Modelos e templates para comunicação ágil e ética com psiquiatras.",
};

export default function CommunicationsPage() {
  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Suspense
        fallback={
          <div className="h-96 w-full animate-pulse bg-[var(--lc-neutral-50)] rounded-[var(--lc-radius-md)] border border-[var(--lc-neutral-200)]" />
        }
      >
        <CommunicationsScreen />
      </Suspense>
    </div>
  );
}
