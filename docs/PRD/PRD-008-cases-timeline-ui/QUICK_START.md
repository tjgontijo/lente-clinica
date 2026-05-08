# Quick Start: PRD-008 UI Cases & Timeline

**TL;DR:** Implementação do portal de gestão de pacientes. Abarca a tela principal (Lista de Casos), o ciclo complexo de formulário via React Hook Form em Modais, o vinculo de medicamentos na UI, e o componente visual de Timeline que exibe o histórico de atendimentos. Total estimado: 3.5h.

---

## 📊 Resumo das Tasks

| # | Problema/Task | Severidade | Fix / Localização |
|---|---------------|------------|------------------|
| T1 | Lista "Meus Casos" | 🔴 Crítico | `app/(dashboard)/cases/page.tsx` |
| T2 | Modal Novo Paciente | 🔴 Crítico | `features/cases/forms/` |
| T3 | Perfil & Vinculo Remédio | 🟡 Moderado | `app/(dashboard)/cases/[id]/page.tsx` |
| T4 | Componente Timeline | 🟡 Moderado | `features/cases/components/` |

---

## 🚀 Começar

1. Crie a branch: `git checkout -b feature/prd-008-cases-ui`
2. Tenha certeza de que os componentes `Dialog`, `Form` e `Input` do Shadcn foram instalados no PRD-005.
3. Foque em entregar a T1 e a T2 perfeitas primeiro, para validar todo o fluxo do Server Action de ponta a ponta sem erros de hidratação.
