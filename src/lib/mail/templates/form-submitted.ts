import { MAIL_THEME } from "@/lib/mail/theme";
import { baseLayout } from "./base";

interface FormSubmittedTemplateParams {
  userName: string;
  formTitle: string;
  submittedAt: Date;
  reviewUrl: string;
}

export function formSubmittedTemplate({
  userName,
  formTitle,
  submittedAt,
  reviewUrl,
}: FormSubmittedTemplateParams): string {
  const formattedDate = submittedAt.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const content = `
    <p>Uma nova resposta foi recebida no painel clínico.</p>

    <div class="info-box">
      <p><strong>Paciente:</strong> ${userName}</p>
      <p style="margin-top: 8px;"><strong>Formulário:</strong> ${formTitle}</p>
      <p style="margin-top: 8px;"><strong>Enviado em:</strong> ${formattedDate}</p>
    </div>

    <p>
      Acesse o painel para visualizar as respostas completas e adicionar anotações clínicas.
    </p>

    <div class="cta-wrapper">
      <a href="${reviewUrl}" class="cta-button">
        Ver Respostas
      </a>
    </div>

    <hr class="divider" />

    <p style="font-size: 13px; color: ${MAIL_THEME.textSubtle};">
      Esta é uma notificação automática do painel clínico.
    </p>
  `;

  return baseLayout(content);
}

export function formSubmittedSubject(userName: string): string {
  return `Nova resposta de ${userName} — Dra. Tatiana Gontijo`;
}
