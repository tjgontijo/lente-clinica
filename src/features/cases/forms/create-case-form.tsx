"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCaseSchema, type CreateCaseInput } from "../schemas/cases.schema";
import { useCreateCaseMutation } from "../mutations/use-create-case-mutation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { User, Phone, Calendar, Loader2 } from "lucide-react";

interface CreateCaseFormProps {
	onSuccess?: () => void;
}

export function CreateCaseForm({ onSuccess }: CreateCaseFormProps) {
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
		<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
			<DialogHeader>
				<DialogTitle className="text-[24px] font-bold text-[var(--lc-neutral-900)]">
					Novo Paciente
				</DialogTitle>
				<DialogDescription className="text-[15px] text-[var(--lc-neutral-500)]">
					Cadastre os dados básicos para iniciar o acompanhamento. Lembre-se de
					não usar sobrenomes para garantir o anonimato.
				</DialogDescription>
			</DialogHeader>

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

			<DialogFooter className="pt-2">
				<Button
					type="submit"
					disabled={isPending}
					className="w-full h-12 rounded-full bg-[var(--lc-teal-600)] hover:bg-[var(--lc-teal-700)] text-white font-bold gap-2 transition-all shadow-md shadow-teal-600/10"
				>
					{isPending ? (
						<>
							<Loader2 size={18} className="animate-spin" />
							Cadastrando...
						</>
					) : (
						"Confirmar Cadastro"
					)}
				</Button>
			</DialogFooter>
		</form>
	);
}
