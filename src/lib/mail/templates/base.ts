/**
 * Base email layout shared across all transactional emails.
 * Wraps content in a branded container with header and footer.
 */
import { MAIL_THEME } from "@/lib/mail/theme";

export function baseLayout(content: string): string {
  const year = new Date().getFullYear();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const preferencesUrl = appUrl ? `${appUrl}/preferences` : "/preferences";

  return `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>Lente Clínica</title>
    <style>
      /* Reset */
      * { box-sizing: border-box; margin: 0; padding: 0; }

      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
          Helvetica, Arial, sans-serif;
        line-height: 1.6;
        color: ${MAIL_THEME.textPrimary};
        background-color: ${MAIL_THEME.surfaceApp};
        -webkit-font-smoothing: antialiased;
      }

      /* Wrapper */
      .wrapper {
        width: 100%;
        background-color: ${MAIL_THEME.surfaceApp};
        padding: 40px 16px;
      }

      /* Card */
      .card {
        max-width: 560px;
        margin: 0 auto;
        background-color: ${MAIL_THEME.surfaceCard};
        border-radius: 12px;
        border: 1px solid ${MAIL_THEME.borderDefault};
        overflow: hidden;
      }

      /* Header */
      .header {
        background-color: ${MAIL_THEME.brandPrimary};
        padding: 28px 32px;
        text-align: center;
      }
      .header-title {
        color: ${MAIL_THEME.textOnDark};
        font-size: 20px;
        font-weight: 700;
        letter-spacing: -0.01em;
      }
      .header-subtitle {
        color: ${MAIL_THEME.textOnDarkMuted};
        font-size: 13px;
        margin-top: 4px;
        opacity: 0.9;
      }

      /* Body */
      .body {
        padding: 32px;
      }
      .body p {
        font-size: 15px;
        color: ${MAIL_THEME.textBody};
        margin-bottom: 16px;
      }
      .body p:last-child {
        margin-bottom: 0;
      }

      /* CTA Button */
      .cta-wrapper {
        text-align: center;
        margin: 28px 0;
      }
      .cta-button {
        display: inline-block;
        background-color: ${MAIL_THEME.brandPrimary};
        color: ${MAIL_THEME.textOnDark} !important;
        padding: 14px 36px;
        border-radius: 99px;
        text-decoration: none;
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 0.01em;
      }

      /* Info box */
      .info-box {
        background-color: ${MAIL_THEME.surfaceSoft};
        border: 1px solid ${MAIL_THEME.borderDefault};
        border-radius: 8px;
        padding: 16px 20px;
        margin: 20px 0;
      }
      .info-box p {
        font-size: 13px;
        color: ${MAIL_THEME.textMuted};
        margin: 0;
      }

      /* Link fallback */
      .link-fallback {
        font-size: 12px;
        color: ${MAIL_THEME.textMuted};
        word-break: break-all;
        text-decoration: underline;
      }

      /* Divider */
      .divider {
        border: none;
        border-top: 1px solid ${MAIL_THEME.borderSoft};
        margin: 24px 0;
      }

      /* Footer */
      .footer {
        padding: 20px 32px;
        border-top: 1px solid ${MAIL_THEME.borderSoft};
        text-align: center;
      }
      .footer p {
        font-size: 12px;
        color: ${MAIL_THEME.textSubtle};
        margin: 0;
        line-height: 1.8;
      }
      .footer a {
        color: ${MAIL_THEME.textMuted};
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="card">

        <div class="header">
          <div class="header-title">Lente Clínica</div>
          <div class="header-subtitle">Apoio clínico em saúde mental</div>
        </div>

        <div class="body">
          ${content}
        </div>

        <div class="footer">
          <p>© ${year} Lente Clínica · Plataforma de apoio clínico</p>
          <p>Sua lente de observação e registro clínico</p>
          <p style="margin-top: 8px;">
            <a href="${preferencesUrl}">Gerenciar preferências</a>
          </p>
        </div>

      </div>
    </div>
  </body>
</html>`;
}
