import { MAIL_THEME } from "@/lib/mail/theme";
import { baseLayout } from "./base";

interface WelcomeTemplateParams {
  userName?: string;
  dashboardUrl: string;
}

export function welcomeTemplate({
  userName,
  dashboardUrl,
}: WelcomeTemplateParams): string {
  const greeting = userName ? `Olá, ${userName}!` : "Olá!";

  const content = `
    <p>${greeting}</p>

    <p>
      Bem-vindo(a) ao painel clínico da Dra. Tatiana Gontijo. Seu acesso foi configurado
      com sucesso.
    </p>

    <p>
      Por aqui você pode acompanhar pacientes, visualizar questionários de pré-consulta
      e gerenciar o fluxo de atendimento de forma centralizada.
    </p>

    <div class="cta-wrapper">
      <a href="${dashboardUrl}" class="cta-button">
        Acessar o Painel
      </a>
    </div>

    <div class="info-box">
      <p>
        <strong>Dica:</strong> Use sempre o link de acesso enviado por email para entrar
        no painel. Não há senha — o acesso é feito por link seguro (magic link).
      </p>
    </div>

    <hr class="divider" />

    <p style="font-size: 13px; color: ${MAIL_THEME.textSubtle};">
      Em caso de dúvidas, entre em contato com o suporte.
    </p>
  `;

  return baseLayout(content);
}

export const welcomeSubject =
  "Bem-vindo(a) ao painel clínico — Dra. Tatiana Gontijo";
