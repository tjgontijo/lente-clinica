"use client";

import { Pill, MessageSquareText, ClipboardList } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

interface DesktopNavLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
}

function DesktopNavLink({ href, label, icon }: DesktopNavLinkProps) {
  const pathname = usePathname();
  const active = isActivePath(pathname, href);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-full px-3 py-1.5 text-[14px] font-medium transition-colors",
        active
          ? "bg-[var(--lc-teal-50)] text-[var(--lc-teal-700)]"
          : "text-[var(--lc-neutral-600)] hover:bg-[var(--lc-neutral-100)] hover:text-[var(--lc-teal-600)]",
      )}
      aria-current={active ? "page" : undefined}
    >
      <span className="size-4">{icon}</span>
      {label}
    </Link>
  );
}

export function DesktopNavLinks() {
  return (
    <>
      <DesktopNavLink
        href="/medications"
        label="Medicações"
        icon={<Pill size={16} />}
      />
      <DesktopNavLink
        href="/communications"
        label="Comunicação"
        icon={<MessageSquareText size={16} />}
      />
      <DesktopNavLink
        href="/checklists"
        label="Sinais de Atenção"
        icon={<ClipboardList size={16} />}
      />
    </>
  );
}

interface MobileNavLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export function MobileNavLink({
  href,
  label,
  icon,
  onClick,
}: MobileNavLinkProps) {
  const pathname = usePathname();
  const active = isActivePath(pathname, href);

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2 rounded-[var(--lc-radius-md)] px-3 py-2 text-[15px] font-medium",
        active
          ? "bg-white text-[var(--lc-teal-700)]"
          : "text-[var(--lc-neutral-800)] hover:bg-white",
      )}
    >
      {icon}
      {label}
    </Link>
  );
}
