"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Loader2, Mail } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  type MagicLinkSignInInput,
  magicLinkSignInSchema,
  type PasswordSignInInput,
  passwordSignInSchema,
} from "@/features/auth/schemas/sign-in";
import { authClient } from "@/lib/auth/auth-client";

const RESEND_COOLDOWN_SECONDS = 45;
type SignInMode = "magic-link" | "password";

function getAuthErrorMessage(result: unknown, fallback: string): string {
  const maybeResult = result as {
    error?: {
      message?: string;
    };
  };

  return maybeResult?.error?.message ?? fallback;
}

export function SignInForm() {
  const [mode, setMode] = React.useState<SignInMode>("magic-link");
  const [sent, setSent] = React.useState(false);
  const [sentEmail, setSentEmail] = React.useState("");
  const [resendSecondsLeft, setResendSecondsLeft] = React.useState(0);
  const [isResending, setIsResending] = React.useState(false);
  const passwordEmailInputRef = React.useRef<HTMLInputElement | null>(null);
  const passwordInputRef = React.useRef<HTMLInputElement | null>(null);

  const magicLinkForm = useForm<MagicLinkSignInInput>({
    resolver: zodResolver(magicLinkSignInSchema),
    defaultValues: { email: "" },
  });

  const passwordForm = useForm<PasswordSignInInput>({
    resolver: zodResolver(passwordSignInSchema),
    defaultValues: { email: "", password: "" },
  });

  React.useEffect(() => {
    if (resendSecondsLeft <= 0) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setResendSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [resendSecondsLeft]);

  React.useEffect(() => {
    if (mode !== "password") {
      return;
    }

    const timerId = window.setTimeout(() => {
      const email = passwordForm.getValues("email")?.trim();

      if (email) {
        passwordInputRef.current?.focus();
        return;
      }

      passwordEmailInputRef.current?.focus();
    }, 0);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [mode, passwordForm]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = magicLinkForm;

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = passwordForm;
  const passwordEmailField = registerPassword("email");
  const passwordField = registerPassword("password");

  const handleSendMagicLink = async (email: string) => {
    try {
      const result = await authClient.signIn.magicLink({
        email: email.toLowerCase(),
        callbackURL: "/medications",
      });

      if ((result as { error?: unknown })?.error) {
        toast.error(
          getAuthErrorMessage(
            result,
            "Falha ao enviar o link. Tente novamente.",
          ),
        );
        return;
      }

      setSentEmail(email.toLowerCase());
      setSent(true);
      setResendSecondsLeft(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      console.error("[SignIn] Magic link error:", error);
      toast.error("Falha ao enviar o link. Tente novamente.");
    }
  };

  const onSubmit = async ({ email }: MagicLinkSignInInput) => {
    await handleSendMagicLink(email);
  };

  const onSubmitPassword = async ({ email, password }: PasswordSignInInput) => {
    try {
      const result = await authClient.signIn.email({
        email: email.toLowerCase(),
        password,
        callbackURL: "/medications",
      });

      if ((result as { error?: unknown })?.error) {
        toast.error(
          getAuthErrorMessage(result, "Falha ao acessar com senha."),
        );
        return;
      }
    } catch (error) {
      console.error("[SignIn] Password sign-in error:", error);
      toast.error("Falha ao acessar com senha.");
    }
  };

  const handleResendMagicLink = async () => {
    if (resendSecondsLeft > 0 || !sentEmail) {
      return;
    }

    setIsResending(true);
    await handleSendMagicLink(sentEmail);
    setIsResending(false);
  };

  const switchToPassword = () => {
    const sourceEmail = sent ? sentEmail : magicLinkForm.getValues("email");
    passwordForm.setValue("email", sourceEmail ?? "");
    setMode("password");
  };

  const switchToMagicLink = () => {
    const sourceEmail = passwordForm.getValues("email");
    magicLinkForm.setValue("email", sourceEmail ?? "");
    setMode("magic-link");
  };

  if (sent && mode === "magic-link") {
    return (
      <div className="space-y-7">
        <div>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--lc-teal-50)]">
            <Mail className="h-6 w-6 text-[var(--lc-teal-600)]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--lc-teal-900)]">
            Verifique seu email
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enviamos um link de acesso para{" "}
            <strong className="text-foreground">{sentEmail}</strong>. Clique
            nele para entrar no painel clínico.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-muted/40 p-4">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Dica:</strong> O link expira em
            15 minutos. Se não receber o email, verifique a pasta de spam.
          </p>
        </div>

        <Button
          variant="outline"
          className="w-full rounded-[var(--lc-radius-full)]"
          onClick={() => void handleResendMagicLink()}
          disabled={resendSecondsLeft > 0 || isResending}
        >
          {isResending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Reenviando...
            </>
          ) : resendSecondsLeft > 0 ? (
            `Reenviar link (${resendSecondsLeft}s)`
          ) : (
            "Reenviar link mágico"
          )}
        </Button>

        <Button
          variant="outline"
          className="w-full rounded-[var(--lc-radius-full)]"
          onClick={switchToPassword}
        >
          <KeyRound className="mr-2 h-4 w-4" />
          Acessar com senha
        </Button>

        <Button
          variant="ghost"
          className="w-full rounded-[var(--lc-radius-full)]"
          onClick={() => {
            setSent(false);
            setSentEmail("");
            setResendSecondsLeft(0);
          }}
        >
          Usar outro email
        </Button>
      </div>
    );
  }

  if (mode === "password") {
    return (
      <div className="space-y-7">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--lc-teal-900)]">
            Acessar com senha
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Use seu email e senha para acessar o painel clínico.
          </p>
        </div>

        <form
          onSubmit={handlePasswordSubmit(onSubmitPassword)}
          className="space-y-5"
          noValidate
        >
          <Field data-invalid={!!passwordErrors.email}>
            <FieldLabel htmlFor="password-email">Email</FieldLabel>
            <Input
              id="password-email"
              type="email"
              placeholder="dra@clinica.com.br"
              autoComplete="email"
              aria-invalid={!!passwordErrors.email}
              disabled={isPasswordSubmitting}
              {...passwordEmailField}
              ref={(node) => {
                passwordEmailField.ref(node);
                passwordEmailInputRef.current = node;
              }}
            />
            {passwordErrors.email && (
              <FieldError>{passwordErrors.email.message}</FieldError>
            )}
          </Field>

          <Field data-invalid={!!passwordErrors.password}>
            <FieldLabel htmlFor="password">Senha</FieldLabel>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={!!passwordErrors.password}
              disabled={isPasswordSubmitting}
              {...passwordField}
              ref={(node) => {
                passwordField.ref(node);
                passwordInputRef.current = node;
              }}
            />
            {passwordErrors.password && (
              <FieldError>{passwordErrors.password.message}</FieldError>
            )}
          </Field>

          <Button
            type="submit"
            className="w-full bg-[var(--lc-teal-600)] hover:bg-[var(--lc-teal-700)] text-white rounded-[var(--lc-radius-full)]"
            size="lg"
            disabled={isPasswordSubmitting}
          >
            {isPasswordSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Acessando...
              </>
            ) : (
              "Acessar plataforma"
            )}
          </Button>
        </form>

        <Button
          variant="ghost"
          className="w-full rounded-[var(--lc-radius-full)] bg-[var(--lc-neutral-100)] text-muted-foreground hover:bg-[var(--lc-neutral-150)] hover:text-foreground"
          onClick={switchToMagicLink}
        >
          Acessar com link mágico
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--lc-teal-900)]">
          Acesse o painel
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Informe seu email e receba um link de acesso seguro para a Lente
          Clínica.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="dra@clinica.com.br"
            autoComplete="email"
            autoFocus
            aria-invalid={!!errors.email}
            disabled={isSubmitting}
            {...register("email")}
          />
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </Field>

        <Button
          type="submit"
          className="w-full bg-[var(--lc-teal-600)] hover:bg-[var(--lc-teal-700)] text-white rounded-[var(--lc-radius-full)]"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            "Acessar plataforma"
          )}
        </Button>
      </form>

      <Button
        variant="ghost"
        className="w-full rounded-[var(--lc-radius-full)] bg-[var(--lc-neutral-100)] text-muted-foreground hover:bg-[var(--lc-neutral-150)] hover:text-foreground"
        onClick={switchToPassword}
      >
        Acessar com senha
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Acesso exclusivo para profissionais de saúde mental.
      </p>
    </div>
  );
}
