import { ChevronDown, Layers } from "lucide-react";
import Link from "next/link";

import { MobileMenu } from "@/components/layout/mobile-menu";
import { DesktopNavLinks } from "@/components/layout/nav-links";

function UserMenu() {
  return (
    <details className="group relative hidden md:block">
      <summary className="list-none cursor-pointer">
        <div className="flex items-center gap-2 rounded-[var(--lc-radius-full)] border border-[var(--lc-neutral-200)] bg-white px-2 py-1.5 hover:border-[var(--lc-neutral-300)]">
          <div className="flex size-8 items-center justify-center rounded-full border border-[var(--lc-neutral-300)] bg-[var(--lc-neutral-100)] text-[12px] font-bold text-[var(--lc-neutral-700)]">
            DR
          </div>
          <ChevronDown className="size-4 text-[var(--lc-neutral-500)] transition-transform group-open:rotate-180" />
        </div>
      </summary>

      <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-[var(--lc-radius-md)] border border-[var(--lc-neutral-200)] bg-white p-1 shadow-[var(--lc-shadow-1)]">
        <button
          type="button"
          className="w-full rounded-[var(--lc-radius-sm)] px-3 py-2 text-left text-[14px] text-[var(--lc-neutral-700)] hover:bg-[var(--lc-neutral-100)]"
        >
          Perfil
        </button>
        <button
          type="button"
          className="w-full rounded-[var(--lc-radius-sm)] px-3 py-2 text-left text-[14px] text-[var(--lc-neutral-700)] hover:bg-[var(--lc-neutral-100)]"
        >
          Configurações
        </button>
      </div>
    </details>
  );
}

export function TopNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--lc-neutral-150)] bg-white shadow-sm">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4">
        <Link href="/cases" className="group flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-[8px] bg-[var(--lc-teal-600)] text-white shadow-sm transition-transform group-hover:scale-105">
            <Layers size={18} strokeWidth={2.5} />
          </div>
          <span className="text-[17px] font-bold tracking-tight text-[var(--lc-neutral-900)]">
            Lente <span className="text-[var(--lc-teal-600)]">Clínica</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <DesktopNavLinks />
        </nav>

        <div className="flex items-center gap-1">
          <UserMenu />
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
