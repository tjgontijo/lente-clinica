# Quick Start: PRD-006 Frontend Shell

**TL;DR:** Configuração da fundação da interface de usuário. Instalação do React Query na raiz, criação do Menu Superior (sem sidebar) e limitação de largura de leitura para a plataforma. Total estimado: 2h.

---

## 📊 Resumo das Tasks

| # | Problema/Task | Severidade | Fix / Localização |
|---|---------------|------------|------------------|
| T1 | React Query não configurado | 🔴 Crítico | `providers.tsx` |
| T2 | Navegação ausente | 🟡 Moderado | `top-nav.tsx` |
| T3 | Layout espremido/largo demais | 🟡 Moderado | `main-shell.tsx` |
| T4 | Feedback visual ausente | 🟢 Menor | `Toaster` do Shadcn |

---

## 🚀 Começar

1. Crie a branch: `git checkout -b feature/prd-006-frontend-shell`
2. Inicie criando o Provider (T1) pois ele é requisito para todos os PRDs subsequentes.
3. Ao construir a navegação, não tente colocar links que ainda não existem. Faça apontamentos provisórios para `/cases` e `/medications`.
