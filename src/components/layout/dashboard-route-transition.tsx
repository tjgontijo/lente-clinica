"use client";

import { usePathname } from "next/navigation";

export function DashboardRouteTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div
      key={pathname}
      className="animate-in fade-in slide-in-from-right-2 duration-300"
    >
      {children}
    </div>
  );
}
