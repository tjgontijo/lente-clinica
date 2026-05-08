"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Check,
  Copy,
  ExternalLink,
  Loader2,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { generateCommunicationAction } from "@/features/communication/actions";

interface CommunicationDialogProps {
  caseId: string;
  symptomIds: string[];
  onClose: () => void;
}

export function CommunicationDialog({
  caseId,
  symptomIds,
  onClose,
}: CommunicationDialogProps) {
  const [copied, setCopied] = useState(false);

  const { data: message, isPending } = useQuery({
    queryKey: ["generate-message", caseId, symptomIds],
    queryFn: () =>
      generateCommunicationAction({
        caseId,
        symptomIds,
        urgencyLevel: "YELLOW", // Default for now
      }),
    enabled: !!caseId && symptomIds.length > 0,
  });

  const handleCopy = () => {
    if (message?.message) {
      navigator.clipboard.writeText(message.message);
      setCopied(true);
      toast.success("Mensagem copiada para a área de transferência!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <DialogContent className="max-w-[550px] rounded-[32px] border-none p-8 overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--lc-teal-50)] to-transparent opacity-50 -z-10" />

      <DialogHeader>
        <div className="flex items-center gap-2 text-[var(--lc-teal-600)] mb-2">
          <Sparkles size={18} />
          <span className="text-[12px] font-bold uppercase tracking-wider">
            Gerador de Comunicação
          </span>
        </div>
        <DialogTitle className="text-[24px] font-bold text-[var(--lc-neutral-900)]">
          Sessão Salva!
        </DialogTitle>
        <DialogDescription className="text-[15px] text-[var(--lc-neutral-500)]">
          Gere uma mensagem técnica para enviar ao psiquiatra responsável pelo
          caso sobre os sintomas observados.
        </DialogDescription>
      </DialogHeader>

      <div className="py-6">
        {isPending ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2
              size={32}
              className="animate-spin text-[var(--lc-teal-500)]"
            />
            <p className="text-[14px] text-[var(--lc-neutral-500)] font-medium">
              Sintetizando observações clínicas...
            </p>
          </div>
        ) : message ? (
          <div className="flex flex-col gap-4">
            <div className="relative group">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Badge className="bg-[var(--lc-teal-500)] text-white border-none">
                  Profissional
                </Badge>
              </div>
              <div className="bg-[var(--lc-neutral-50)] p-6 rounded-[24px] border border-[var(--lc-neutral-100)] text-[15px] text-[var(--lc-neutral-700)] leading-relaxed font-medium whitespace-pre-wrap max-h-[300px] overflow-y-auto custom-scrollbar">
                {message.message}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <Button
                onClick={handleCopy}
                className="flex-1 h-12 rounded-full bg-[var(--lc-neutral-900)] hover:bg-black text-white font-bold gap-2"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? "Copiado!" : "Copiar Mensagem"}
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-full border-[var(--lc-teal-200)] text-[var(--lc-teal-700)] hover:bg-[var(--lc-teal-50)] font-bold gap-2"
              >
                <ExternalLink size={18} />
                Abrir WhatsApp
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-[14px] text-[var(--lc-neutral-500)]">
              Não há sintomas suficientes para gerar uma mensagem técnica.
            </p>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button
          variant="ghost"
          onClick={onClose}
          className="w-full text-[var(--lc-neutral-500)] font-medium"
        >
          Fechar sem enviar
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
