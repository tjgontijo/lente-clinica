# Quick Start: PRD-007 UI Medicações

**TL;DR:** Implementação do Buscador Visual de Medicações. Criação da página `/medications`, do componente `MedicationCard`, e da sincronização da busca com a URL (URL State) alimentando o TanStack Query. Total estimado: 2.5h.

---

## 📊 Resumo das Tasks

| # | Problema/Task | Severidade | Fix / Localização |
|---|---------------|------------|------------------|
| T1 | `MedicationCard` ausente | 🔴 Crítico | `features/medications/components/` |
| T2 | Skeletons / Fallback | 🟡 Moderado | Componente Skeleton Grid |
| T3 | Query Fetching | 🔴 Crítico | `use-medications-query.ts` |
| T4 | Page e URL State | 🔴 Crítico | `app/(dashboard)/medications/page.tsx` |

---

## 🚀 Começar

1. Crie a branch: `git checkout -b feature/prd-007-medications-ui`
2. Garanta que o PRD-006 (Shell/Providers) já foi integrado, pois precisaremos do contexto do QueryClient.
3. Para testes de UI na T1, use mock data estático primeiro para acertar a tipografia e as cores Teal, e depois faça o wire-up com os dados reais na T3.
