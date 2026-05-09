import { MAIL_THEME } from "@/lib/mail/theme";
import { baseLayout } from "./base";

interface MagicLinkTemplateParams {
  verificationUrl: string;
}

export function magicLinkTemplate({
  verificationUrl,
}: MagicLinkTemplateParams): string {
  const content = `
    <p>Olá!</p>

    <p>
      Clique no botão abaixo para acessar o painel clínico. Por segurança, este link
      expira em <strong>15 minutos</strong>.
    </p>

    <div class="cta-wrapper">
      <a href="${verificationUrl}" class="cta-button">
        Acessar Painel
      </a>
    </div>

    <div class="info-box">
      <p>
        Não conseguiu clicar no botão? Copie e cole o link abaixo no seu navegador:
      </p>
      <p style="margin-top: 8px;">
        <a href="${verificationUrl}" class="link-fallback">${verificationUrl}</a>
      </p>
    </div>

    <hr class="divider" />

    <p style="font-size: 13px; color: ${MAIL_THEME.textSubtle};">
      Se você não solicitou este link, ignore este email. Nenhuma ação é necessária.
    </p>
  `;

  return baseLayout(content);
}

export const magicLinkSubject = "Seu link de acesso — Dra. Tatiana Gontijo";
