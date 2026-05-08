"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardList, Loader2, MessageSquare, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CommunicationDialog } from "../components/communication-dialog";
import { useCreateSessionMutation } from "../mutations/use-create-session-mutation";
import { createSessionSchema } from "../schemas/sessions.schema";

type SessionFormValues = z.infer<typeof createSessionSchema>;

interface SessionChecklistFormProps {
  caseId: string;
  categories: any[];
  onSymptomChange: (ids: string[]) => void;
}

export function SessionChecklistForm({
  caseId,
  categories,
  onSymptomChange,
}: SessionChecklistFormProps) {
  const router = useRouter();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const { mutate: createSession, isPending } = useCreateSessionMutation();

  const form = useForm<SessionFormValues>({
    resolver: zodResolver(createSessionSchema),
    defaultValues: {
      caseId,
      date: new Date(),
      notes: "",
      symptomIds: [],
    },
  });

  const watchedSymptomIds = form.watch("symptomIds");

  useEffect(() => {
    onSymptomChange(watchedSymptomIds);
  }, [watchedSymptomIds, onSymptomChange]);

  const onSubmit = (data: SessionFormValues) => {
    createSession(data, {
      onSuccess: () => {
        setShowSuccessDialog(true);
      },
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <Dialog
        open={showSuccessDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowSuccessDialog(false);
            router.push(`/cases/${caseId}`);
          }
        }}
      >
        <CommunicationDialog
          caseId={caseId}
          symptomIds={watchedSymptomIds}
          onClose={() => {
            setShowSuccessDialog(false);
            router.push(`/cases/${caseId}`);
          }}
        />
      </Dialog>

      <Card className="p-8 rounded-[32px] border-[var(--lc-neutral-150)] bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[var(--lc-teal-50)] flex items-center justify-center text-[var(--lc-teal-600)]">
            <ClipboardList size={22} />
          </div>
          <div>
            <h2 className="text-[20px] font-bold text-[var(--lc-neutral-900)]">
              Checklist de Sintomas
            </h2>
            <p className="text-[13px] text-[var(--lc-neutral-500)]">
              Selecione todos os sintomas observados ou relatados.
            </p>
          </div>
        </div>

        <Accordion type="multiple" className="w-full space-y-4">
          {categories.map((category) => (
            <AccordionItem
              key={category.id}
              value={category.id}
              className="border-[var(--lc-neutral-100)] rounded-[20px] overflow-hidden border px-6"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3 text-left">
                  <span className="text-[16px] font-bold text-[var(--lc-neutral-800)]">
                    {category.name}
                  </span>
                  <Badge className="bg-[var(--lc-neutral-50)] text-[var(--lc-neutral-500)] border-none h-5 text-[10px] font-bold px-2">
                    {category.symptoms.length} itens
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {category.symptoms.map((symptom: any) => (
                    <div
                      key={symptom.id}
                      className="flex items-start gap-3 p-3 rounded-[16px] hover:bg-[var(--lc-neutral-50)] transition-colors"
                    >
                      <Checkbox
                        id={symptom.id}
                        checked={watchedSymptomIds.includes(symptom.id)}
                        onCheckedChange={(checked) => {
                          const current = form.getValues("symptomIds");
                          const next = checked
                            ? [...new Set([...current, symptom.id])]
                            : current.filter((id) => id !== symptom.id);
                          form.setValue("symptomIds", next);
                        }}
                        className="mt-1 border-[var(--lc-neutral-300)] data-[state=checked]:bg-[var(--lc-teal-600)] data-[state=checked]:border-[var(--lc-teal-600)]"
                      />
                      <div className="flex flex-col gap-0.5 pointer-events-none">
                        <Label
                          htmlFor={symptom.id}
                          className="text-[15px] font-medium text-[var(--lc-neutral-800)] leading-none cursor-pointer"
                        >
                          {symptom.name}
                        </Label>
                        {symptom.whatItLooksLike && (
                          <p className="text-[12px] text-[var(--lc-neutral-400)] leading-tight">
                            {symptom.whatItLooksLike}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>

      {/* Notes Section */}
      <Card className="p-8 rounded-[32px] border-[var(--lc-neutral-150)] bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[var(--lc-neutral-50)] flex items-center justify-center text-[var(--lc-neutral-400)]">
            <MessageSquare size={22} />
          </div>
          <div>
            <h2 className="text-[20px] font-bold text-[var(--lc-neutral-900)]">
              Notas da Sessão
            </h2>
            <p className="text-[13px] text-[var(--lc-neutral-500)]">
              Observações adicionais relevantes para o histórico.
            </p>
          </div>
        </div>

        <Textarea
          placeholder="Ex: Paciente relatou melhora no sono mas mantém irritabilidade matinal..."
          className="min-h-[150px] rounded-[24px] border-[var(--lc-neutral-200)] focus:border-[var(--lc-teal-500)] focus:ring-(--lc-teal-500)/10 p-6 text-[15px] leading-relaxed"
          {...form.register("notes")}
        />
      </Card>

      <div className="flex items-center justify-end">
        <Button
          type="submit"
          disabled={isPending}
          className="h-14 px-10 rounded-full bg-[var(--lc-teal-600)] hover:bg-[var(--lc-teal-700)] text-white font-bold gap-2 text-[16px] shadow-lg shadow-teal-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {isPending ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save size={20} />
              Salvar Sessão Clínica
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
