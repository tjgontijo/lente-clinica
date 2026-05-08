import { DashboardRouteTransition } from "@/components/layout/dashboard-route-transition";
import { MainShell } from "@/components/layout/main-shell";
import { TopNav } from "@/components/layout/top-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNav />
      <MainShell>
        <DashboardRouteTransition>{children}</DashboardRouteTransition>
      </MainShell>
    </>
  );
}
