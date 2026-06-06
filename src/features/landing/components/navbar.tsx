import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[var(--lc-neutral-100)] bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center">
          <img
            src="/images/system/logo_horizontal.png"
            alt="Lente Clínica"
            className="h-8 w-auto"
          />
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="#pricing"
            className="text-sm font-medium text-[var(--lc-neutral-600)] hover:text-[var(--lc-teal-600)] transition-colors"
          >
            Planos
          </Link>
          <Button
            asChild
            className="rounded-full bg-[var(--lc-teal-600)] hover:bg-[var(--lc-teal-700)] text-white px-6"
          >
            <Link href="/sign-in">Entrar</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
