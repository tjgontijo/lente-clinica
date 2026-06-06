"use client";

import { ChevronsUpDown, LogOut, Menu, Pill, Settings, MessageSquareText, ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";

import { MobileNavLink } from "@/components/layout/nav-links";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function MobileUserFooter() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-[var(--lc-radius-lg)] px-2 py-2 text-left hover:bg-[var(--lc-neutral-100)] data-[state=open]:bg-[var(--lc-neutral-100)]"
        >
          <Avatar className="size-10 rounded-[var(--lc-radius-md)]">
            <AvatarFallback className="rounded-[var(--lc-radius-md)] bg-[var(--lc-teal-50)] text-[13px] font-semibold text-[var(--lc-teal-700)]">
              DR
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-semibold text-[var(--lc-neutral-900)]">
              Dr. Psiquiatra
            </p>
            <p className="truncate text-[12px] text-[var(--lc-neutral-500)]">
              Plano Clinical
            </p>
          </div>
          <ChevronsUpDown className="size-4 text-[var(--lc-neutral-500)]" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side="top"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left">
            <Avatar className="size-8 rounded-[var(--lc-radius-md)]">
              <AvatarFallback className="rounded-[var(--lc-radius-md)] bg-[var(--lc-teal-50)] text-xs text-[var(--lc-teal-700)]">
                DR
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">Dr. Psiquiatra</p>
              <p className="truncate text-xs text-[var(--lc-neutral-500)]">
                Plano Clinical
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Settings className="mr-2 size-4" />
            Configurações
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="text-[var(--lc-red-700)] focus:text-[var(--lc-red-700)]">
          <LogOut className="mr-2 size-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function MobileMenu() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon-sm"
        className="text-[var(--lc-neutral-700)] hover:text-[var(--lc-teal-700)]"
        aria-label="Abrir menu"
      >
        <Menu className="size-5" />
      </Button>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-[var(--lc-neutral-700)] hover:text-[var(--lc-teal-700)]"
          aria-label="Abrir menu"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-[var(--lc-neutral-50)]">
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b border-[var(--lc-neutral-150)] pb-4">
            <SheetTitle>Navegação</SheetTitle>
          </SheetHeader>

          <main className="flex-1 space-y-6 overflow-y-auto py-5">
            <section className="space-y-3">
              <p className="px-1 text-[12px] font-semibold uppercase tracking-wider text-[var(--lc-neutral-500)]">
                Menu
              </p>
              <nav className="flex flex-col gap-2">
                <SheetClose asChild>
                  <div>
                    <MobileNavLink
                      href="/medications"
                      label="Medicações"
                      icon={<Pill className="size-4" />}
                      onClick={() => setOpen(false)}
                    />
                    <MobileNavLink
                      href="/communications"
                      label="Comunicação"
                      icon={<MessageSquareText className="size-4" />}
                      onClick={() => setOpen(false)}
                    />
                    <MobileNavLink
                      href="/checklists"
                      label="Sinais de Atenção"
                      icon={<ClipboardList className="size-4" />}
                      onClick={() => setOpen(false)}
                    />
                  </div>
                </SheetClose>
              </nav>
            </section>
          </main>

          <footer className="border-t border-[var(--lc-neutral-150)] pt-3">
            <MobileUserFooter />
          </footer>
        </div>
      </SheetContent>
    </Sheet>
  );
}
