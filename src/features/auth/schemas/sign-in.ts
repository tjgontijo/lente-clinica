import { z } from "zod";

export const magicLinkSignInSchema = z.object({
  email: z.string().trim().min(1, "Informe o email.").email("Email inválido."),
});

export const passwordSignInSchema = z.object({
  email: z.string().trim().min(1, "Informe o email.").email("Email inválido."),
  password: z.string().min(1, "Informe a senha.").max(255, "Senha inválida."),
});

export type MagicLinkSignInInput = z.infer<typeof magicLinkSignInSchema>;
export type PasswordSignInInput = z.infer<typeof passwordSignInSchema>;
