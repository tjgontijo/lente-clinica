# PRD-008: UI de Gestão de Casos e Timeline

**Status:** Planejado
**Data:** 2026-05-08
**Versão:** 1.0

---

## 📋 O Que é Este PRD?

Este PRD define a interface visual e funcional da gestão de pacientes (Casos Anônimos). Ele engloba a página inicial com a lista de pacientes da terapeuta, os modais de criação/edição e, principalmente, o **Perfil do Paciente** — uma dashboard que lista as medicações ativas e a "Linha do Tempo" das sessões já realizadas.

**Documento:** Frontend da Gestão de Casos e Perfil do Paciente.
**Tempo Total Estimado:** 3.5 horas.

---

## 📂 Estrutura do PRD

```txt
PRD-008-cases-timeline-ui/
├── README.md
├── CONTEXT.md
├── DIAGNOSTIC.md
├── TASKS.md
└── QUICK_START.md
```

---

## 🎯 Resumo Executivo

### Status Atual
- Os endpoints, Services e Schemas (Backend) foram entregues no PRD-002.
- Faltam as views que a terapeuta usa para criar o caso e revisar o histórico clínico de um paciente específico.

### Ordem de Implementação

| Fase | Tasks | Tempo |
|------|-------|-------|
| 1: Lista e Criação | T1-T2 | 1.5h |
| 2: Perfil do Caso | T3 | 1h |
| 3: Timeline de Sessões | T4 | 1h |

**Total Estimado:** 3.5h

---

## 💾 Arquivos Principais Envolvidos

- `src/app/(dashboard)/cases/page.tsx`
- `src/features/cases/forms/create-case-form.tsx`
- `src/app/(dashboard)/cases/[id]/page.tsx` (Perfil do Paciente)
