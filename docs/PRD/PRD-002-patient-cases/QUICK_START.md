# Quick Start: PRD-002 Backend Cases

**TL;DR:** Implementação base do banco de dados e regras de negócio para salvar Pacientes Anônimos e vincular medicamentos. Sem UI. Total estimado: 2h.

---

## 📊 Resumo das Tasks

| # | Problema/Task | Severidade | Fix / Localização |
|---|---------------|------------|------------------|
| T1 | Schema Drizzle ausente | 🔴 Crítico | `schema.ts` e `drizzle-kit push` |
| T2 | Validações Zod faltantes | 🟡 Moderado | `features/cases/schemas/` |
| T3 | Services não implementados | 🔴 Crítico | `features/cases/services/` |
| T4 | Exposição de API | 🔴 Crítico | Proteção via auth() nas actions |

---

## 🚀 Começar

1. Crie a branch: `git checkout -b feature/prd-002-backend`
2. Rode `npx drizzle-kit push` após o T1.
3. Teste os services via scripts isolados ou Jest, já que não haverá UI nesta fase.
