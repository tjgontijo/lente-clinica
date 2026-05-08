import Link from "next/link";
import { cn } from "@/lib/utils";
import { Layers, Briefcase, Pill } from "lucide-react";

interface NavLinkProps {
	href: string;
	children: React.ReactNode;
	icon: React.ReactNode;
	active?: boolean;
}

function NavLink({ href, children, icon, active }: NavLinkProps) {
	return (
		<Link
			href={href}
			className={cn(
				"flex items-center gap-2 px-3 py-1.5 rounded-full text-[14px] font-medium transition-colors",
				active
					? "bg-[var(--lc-teal-50)] text-[var(--lc-teal-700)]"
					: "text-[var(--lc-neutral-600)] hover:text-[var(--lc-teal-600)] hover:bg-[var(--lc-neutral-100)]",
			)}
		>
			<span className="w-4 h-4">{icon}</span>
			{children}
		</Link>
	);
}

export function TopNav() {
	return (
		<header className="sticky top-0 z-50 w-full bg-white border-b border-[var(--lc-neutral-150)] shadow-sm">
			<div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
				<div className="flex items-center gap-8">
					<Link href="/" className="flex items-center gap-2 group">
						<div className="w-8 h-8 bg-[var(--lc-teal-600)] rounded-[8px] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
							<Layers size={18} strokeWidth={2.5} />
						</div>
						<span className="text-[17px] font-bold tracking-tight text-[var(--lc-neutral-900)]">
							Lente <span className="text-[var(--lc-teal-600)]">Clínica</span>
						</span>
					</Link>

					<nav className="hidden md:flex items-center gap-2">
						<NavLink href="/cases" icon={<Briefcase size={16} />} active>
							Meus Casos
						</NavLink>
						<NavLink href="/medications" icon={<Pill size={16} />}>
							Medicações
						</NavLink>
					</nav>
				</div>

				<div className="flex items-center gap-4">
					{/* Avatar Placeholder - Futuro Better Auth Integration */}
					<div className="flex items-center gap-3 pl-4 border-l border-[var(--lc-neutral-150)]">
						<div className="flex flex-col items-end mr-1">
							<span className="text-[12px] font-semibold text-[var(--lc-neutral-900)] leading-tight">
								Dr. Psiquiatra
							</span>
							<span className="text-[11px] text-[var(--lc-neutral-500)]">
								Plano Clinical
							</span>
						</div>
						<div className="w-9 h-9 rounded-full bg-[var(--lc-neutral-200)] border border-[var(--lc-neutral-300)] flex items-center justify-center text-[var(--lc-neutral-600)] font-bold text-[13px] shadow-inner">
							DR
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
