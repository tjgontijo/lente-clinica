"use client";

import { ArrowRight, Calendar, Phone, Plus, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateCaseForm } from "@/features/cases/forms/create-case-form";
import { useCasesQuery } from "@/features/cases/queries/use-cases-query";

export default function CasesPage() {
  const { data: cases, isPending } = useCasesQuery();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);

  return (
    <div className="flex flex-col gap-8 pb-24">
      <div className="flex items-center gap-2 text-[var(--lc-teal-600)]">
        <Users size={20} strokeWidth={2.5} />
        <h1 className="text-[13px] font-bold uppercase tracking-wider">
          Gestão de Casos
        </h1>
      </div>

      <Drawer open={isCreateDrawerOpen} onOpenChange={setIsCreateDrawerOpen}>
        <DrawerTrigger asChild>
          <Button
            size="icon"
            className="fixed bottom-8 right-8 z-40 h-14 w-14 rounded-full bg-[var(--lc-teal-600)] text-white hover:bg-[var(--lc-teal-700)] md:hidden"
            aria-label="Cadastrar novo caso clínico"
          >
            <Plus size={24} strokeWidth={2.75} />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="overflow-y-auto px-6 pt-5 pb-8">
          <CreateCaseForm onSuccess={() => setIsCreateDrawerOpen(false)} />
        </DrawerContent>
      </Drawer>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogTrigger asChild>
          <Button
            size="icon"
            className="fixed bottom-8 right-8 z-40 hidden h-14 w-14 rounded-full bg-[var(--lc-teal-600)] text-white hover:bg-[var(--lc-teal-700)] md:inline-flex"
            aria-label="Cadastrar novo caso clínico"
          >
            <Plus size={24} strokeWidth={2.75} />
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-[450px] rounded-[32px] border-none p-8">
          <CreateCaseForm onSuccess={() => setIsCreateModalOpen(false)} />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isPending ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items are stable
              key={i}
              className="h-[180px] w-full rounded-[24px] border border-[var(--lc-neutral-100)] bg-white"
            />
          ))
        ) : cases && cases.length > 0 ? (
          cases.map((pCase) => (
            <Link
              key={pCase.id}
              href={`/cases/${pCase.id}`}
              className="group focus:outline-none"
            >
              <Card className="relative flex h-full flex-col gap-4 overflow-hidden rounded-[24px] border-[var(--lc-neutral-150)] bg-white p-6 transition-all duration-300 hover:border-[var(--lc-teal-200)] hover:shadow-md">
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--lc-neutral-50)] text-[var(--lc-neutral-400)] transition-colors group-hover:bg-[var(--lc-teal-50)] group-hover:text-[var(--lc-teal-600)]">
                    <Users size={24} />
                  </div>
                  <div className="text-[var(--lc-neutral-300)] transition-colors group-hover:text-[var(--lc-teal-300)]">
                    <ArrowRight size={20} />
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-[20px] font-bold text-[var(--lc-neutral-900)]">
                    {pCase.firstName}
                  </h3>

                  <div className="flex flex-col gap-2">
                    {pCase.phoneSuffix && (
                      <div className="flex items-center gap-2 text-[14px] text-[var(--lc-neutral-500)]">
                        <Phone
                          size={14}
                          className="text-[var(--lc-neutral-300)]"
                        />
                        Final do telefone:{" "}
                        <span className="font-mono font-bold text-[var(--lc-neutral-700)]">
                          {pCase.phoneSuffix}
                        </span>
                      </div>
                    )}
                    {pCase.birthYear && (
                      <div className="flex items-center gap-2 text-[14px] text-[var(--lc-neutral-500)]">
                        <Calendar
                          size={14}
                          className="text-[var(--lc-neutral-300)]"
                        />
                        Ano nasc:{" "}
                        <span className="font-medium text-[var(--lc-neutral-700)]">
                          {pCase.birthYear}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="absolute right-0 top-0 h-24 w-24 bg-gradient-to-bl from-(--lc-teal-50)/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-[var(--lc-neutral-200)] bg-[var(--lc-neutral-50)] px-6 py-20 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white text-[var(--lc-neutral-200)] shadow-sm">
              <Users size={40} />
            </div>
            <h3 className="mb-2 text-[22px] font-bold text-[var(--lc-neutral-900)]">
              Nenhum caso clínico cadastrado
            </h3>
            <p className="max-w-[400px] text-[var(--lc-neutral-500)]">
              Use o botão flutuante para cadastrar o primeiro caso clínico.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
