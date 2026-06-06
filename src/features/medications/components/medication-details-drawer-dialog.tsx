"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ProductWithMedication } from "../types";
import { MedicationDetails } from "./medication-details";

interface MedicationDetailsDrawerDialogProps {
  product: ProductWithMedication | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MedicationDetailsDrawerDialog({
  product,
  open,
  onOpenChange,
}: MedicationDetailsDrawerDialogProps) {
  const isMobile = useIsMobile();

  if (!product) return null;

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh] bg-white">
          <DrawerHeader className="text-left border-b border-[var(--lc-neutral-100)] pb-4">
            <DrawerTitle className="text-[20px] font-bold text-[var(--lc-neutral-900)]">
              Detalhes do Medicamento
            </DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="px-6 pb-12 pt-4 h-full max-h-[calc(90vh-80px)]">
            <MedicationDetails product={product} />
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl w-[95vw] max-h-[90vh] bg-white p-0 rounded-[32px] border-none shadow-2xl transition-all duration-500 overflow-hidden">
        <DialogHeader className="p-8 pb-4">
          <DialogTitle className="text-[14px] font-bold uppercase tracking-widest text-[var(--lc-neutral-400)] flex items-center gap-2">
            <span className="w-8 h-[2px] bg-[var(--lc-teal-500)] rounded-full" />
            Base de Conhecimento
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[calc(90vh-100px)] px-10 pb-10 pt-2">
          <MedicationDetails product={product} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
