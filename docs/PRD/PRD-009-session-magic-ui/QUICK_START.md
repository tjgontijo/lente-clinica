# Quick Start: PRD-009 A Sessão Mágica

**TL;DR:** Construção da tela core do aplicativo. Um formulário React Hook Form complexo dividido em 2 colunas com suporte a reatividade (Painel de Alertas pisca de acordo com o que é checado no formulário). Total: 4.5h.

---

## 📊 Resumo das Tasks

| # | Problema/Task | Severidade | Fix / Localização |
|---|---------------|------------|------------------|
| T1 | Layout Split-View | 🔴 Crítico | `page.tsx` com Tailwind Grid |
| T2 | Accordion de Sintomas | 🔴 Crítico | `features/sessions/forms/` |
| T3 | Reatividade (useWatch) | 🟡 Moderado | `features/sessions/components/` |
| T4 | Modal de Cópia (Kit) | 🟢 Menor | `Dialog` após Submit |

---

## 🚀 Começar

1. Crie a branch: `git checkout -b feature/prd-009-session-magic`
2. Certifique-se de instalar os componentes `Accordion` e `Checkbox` do shadcn.
3. Dica Ouro: O segredo dessa página é evitar que o formulário da esquerda inteiro recarregue quando a terapeuta marcar um *checkbox*. Use e abuse do isolamento de estado e do `useWatch` no painel da direita para garantir que apenas o motor de inteligência seja acionado.
