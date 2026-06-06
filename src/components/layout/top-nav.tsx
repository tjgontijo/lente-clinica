"use client";

import { Layers, LogOut, Settings, User as UserIcon, CreditCard } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { MobileMenu } from "@/components/layout/mobile-menu";
import { DesktopNavLinks } from "@/components/layout/nav-links";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "@/lib/auth/auth-client";

function UserMenu() {
  const router = useRouter();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  const user = session?.user;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "??";

  if (!mounted) {
    return (
      <div className="hidden h-9 w-9 shrink-0 rounded-full bg-[var(--lc-neutral-100)] md:block" />
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="hidden rounded-full transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lc-teal-600)] hover:opacity-80 md:block"
        >
          <Avatar className="size-9 border-none shadow-sm">
            <AvatarImage src={user?.image ?? ""} />
            <AvatarFallback className="bg-[var(--lc-neutral-100)] text-[13px] font-bold text-[var(--lc-neutral-700)]">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-52 rounded-[var(--lc-radius-md)] border-[var(--lc-neutral-200)] shadow-[var(--lc-shadow-md)]"
      >
        <div className="px-2 py-1.5 md:hidden">
          <p className="truncate text-sm font-semibold">{user?.name}</p>
          <p className="truncate text-xs text-[var(--lc-neutral-500)]">
            {user?.email}
          </p>
        </div>
        <DropdownMenuSeparator className="md:hidden" />
        <DropdownMenuItem className="cursor-pointer gap-2 py-2.5">
          <UserIcon size={16} />
          Perfil
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer gap-2 py-2.5">
          <Settings size={16} />
          Configurações
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer gap-2 py-2.5" asChild>
          <Link href="/checkout" className="flex items-center w-full">
            <CreditCard size={16} />
            Assinatura
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[var(--lc-neutral-150)]" />
        <DropdownMenuItem
          variant="destructive"
          onClick={handleSignOut}
          className="cursor-pointer gap-2 py-2.5"
        >
          <LogOut size={16} />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function TopNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--lc-neutral-150)] bg-white shadow-sm">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-6">
        <Link href="/medications" className="group flex items-center gap-2">
          <Image
            src="/images/system/logo_horizontal.png"
            alt="Lente Clínica"
            width={160}
            height={40}
            className="h-8 w-auto transition-transform group-hover:scale-105"
            priority
          />
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
