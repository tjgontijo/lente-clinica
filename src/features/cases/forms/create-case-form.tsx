"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Loader2, Phone, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateCaseMutation } from "../mutations/use-create-case-mutation";
import {
  type CreateCaseInput,
  createCaseSchema,
} from "../schemas/cases.schema";

interface CreateCaseFormProps {
  onSuccess?: () => void;
  showHeader?: boolean;
}

export function CreateCaseForm({
  onSuccess,
  showHeader = true,
}: CreateCaseFormProps) {
  const { mutate: createCase, isPending } = useCreateCaseMutation();

  const form = useForm<CreateCaseInput>({
    resolver: zodResolver(createCaseSchema),
    defaultValues: {
      firstName: "",
      phoneSuffix: "",
      birthYear: undefined,
    },
  });

  const onSubmit = (data: CreateCaseInput) => {
    createCase(data, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
      },
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={showHeader ? "space-y-6 pt-4" : "space-y-6"}
    >
      {showHeader && (
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold text-[var(--lc-neutral-900)]">
            Novo Caso Clínico
          </DialogTitle>
        </DialogHeader>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="firstName"
            className="text-[14px] font-bold text-[var(--lc-neutral-700)] flex items-center gap-2"
          >
            <User size={14} className="text-[var(--lc-neutral-400)]" />
            Primeiro Nome
          </Label>
          <Input
            id="firstName"
            placeholder="Ex: Maria"
            className="h-11 rounded-[12px] border-[var(--lc-neutral-200)] focus:border-[var(--lc-teal-500)] focus:ring-(--lc-teal-500)/10"
            {...form.register("firstName")}
          />
          {form.formState.errors.firstName && (
            <p className="text-[12px] font-medium text-red-500 mt-1">
              {form.formState.errors.firstName.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="phoneSuffix"
              className="text-[14px] font-bold text-[var(--lc-neutral-700)] flex items-center gap-2"
            >
              <Phone size={14} className="text-[var(--lc-neutral-400)]" />
              Final do Telefone
            </Label>
            <Input
              id="phoneSuffix"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Ex: 1234"
              maxLength={4}
              className="h-11 rounded-[12px] border-[var(--lc-neutral-200)] focus:border-[var(--lc-teal-500)] focus:ring-(--lc-teal-500)/10 font-mono"
              {...form.register("phoneSuffix")}
            />
            {form.formState.errors.phoneSuffix && (
              <p className="text-[12px] font-medium text-red-500 mt-1">
                {form.formState.errors.phoneSuffix.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="birthYear"
              className="text-[14px] font-bold text-[var(--lc-neutral-700)] flex items-center gap-2"
            >
              <Calendar size={14} className="text-[var(--lc-neutral-400)]" />
              Ano de Nasc.
            </Label>
            <Input
              id="birthYear"
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Ex: 1990"
              className="h-11 rounded-[12px] border-[var(--lc-neutral-200)] focus:border-[var(--lc-teal-500)] focus:ring-(--lc-teal-500)/10"
              {...form.register("birthYear", { valueAsNumber: true })}
            />
            {form.formState.errors.birthYear && (
              <p className="text-[12px] font-medium text-red-500 mt-1">
                {form.formState.errors.birthYear.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="pt-6">
        <Button
          type="submit"
          disabled={isPending}
          className="h-12 w-full rounded-full bg-[var(--lc-teal-600)] text-white font-bold gap-2 hover:bg-[var(--lc-teal-700)]"
        >
          {isPending ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Cadastrando...
            </>
          ) : (
            "Cadastrar"
          )}
        </Button>
      </div>
    </form>
  );
}
