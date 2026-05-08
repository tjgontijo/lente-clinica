# PRD-007: UI de Medicações (Base de Conhecimento)

**Status:** Planejado
**Data:** 2026-05-08
**Versão:** 1.0

---

## 📋 O Que é Este PRD?

Este PRD descreve a construção do frontend para o domínio `medications`. É a digitalização do "Manual de Bolso da Psicofarmacologia". Aqui a terapeuta poderá buscar, filtrar e ler os detalhes sobre os medicamentos psiquiátricos, efeitos colaterais e recomendações de conduta terapêutica.

**Documento:** Frontend da Base de Conhecimento.
**Tempo Total Estimado:** 2.5 horas.

---

## 📂 Estrutura do PRD

```txt
PRD-007-medications-ui/
├── README.md
├── CONTEXT.md
├── DIAGNOSTIC.md
├── TASKS.md
└── QUICK_START.md
```

---

## 🎯 Resumo Executivo

### Status Atual
- O backend para leitura de medicamentos já existe.
- Os dados foram semeados no banco via Drizzle.
- Falta a interface visual completa (Páginas e Componentes).

### Ordem de Implementação

| Fase | Tasks | Tempo |
|------|-------|-------|
| 1: Componentes UI | T1-T2 | 1h |
| 2: Integração de Dados | T3 | 0.5h |
| 3: Rota e Estado | T4 | 1h |

**Total Estimado:** 2.5h

---

## 💾 Arquivos Principais Envolvidos

- `src/features/medications/components/medication-card.tsx`
- `src/features/medications/queries/use-medications-query.ts`
- `src/app/(dashboard)/medications/page.tsx`
