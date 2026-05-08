# Quick Start: PRD-003 Backend Sessions

**TL;DR:** Construção do core de dados da plataforma: a tabela transacional de evolução do paciente e a engine relacional de alertas. Sem interface. Total: 3h.

---

## 📊 Resumo das Tasks

| # | Problema/Task | Severidade | Fix / Localização |
|---|---------------|------------|------------------|
| T1 | Schema Drizzle | 🔴 Crítico | `schema.ts` |
| T2 | Motor de Inteligência | 🔴 Crítico | `get-active-alerts.service.ts` |
| T3 | Salvar Sessão Atomica | 🟡 Moderado | Serviço com `db.transaction` |
| T4 | Actions Expostas | 🟡 Moderado | `actions.ts` |

---

## 🚀 Começar

1. Crie a branch: `git checkout -b feature/prd-003-backend`
2. Modifique o schema na T1 e rode `npx drizzle-kit push`.
3. Valide o motor T2 e T3 injetando dados via script local ou testes (sem UI).
