# PRD-003: Clinical Sessions (Motor Inteligente Backend)

**Status:** Planejado
**Data:** 2026-05-08
**Versão:** 1.1 (Foco Backend)

---

## 📋 O Que é Este PRD?

Este PRD define a implementação de **backend** do domínio `sessions`. Ele contém o banco para salvar o checklist da sessão e, principalmente, o **Motor de Cruzamento de Dados** (inteligência que lê a medicação e emite alertas). Não abordaremos UI.

**Documento:** Implementação do domínio `sessions` (Data Layer e Service).
**Tempo Total Estimado:** 3 horas.

---

## 📂 Estrutura do PRD

```txt
PRD-003-clinical-sessions/
├── README.md
├── CONTEXT.md
├── DIAGNOSTIC.md
├── TASKS.md
└── QUICK_START.md
```

---

## 🎯 Resumo Executivo

### Ordem de Fixação / Implementação

| Fase | Tasks | Tempo |
|------|-------|-------|
| 1: Data Layer & Motor | T1-T2 | 2h |
| 2: Server Actions & Log | T3-T4 | 1h |

**Total Estimado:** 3h

---

## 💾 Arquivos Principais Envolvidos

- `src/server/db/schema.ts` - Tabelas de Sessão.
- `src/features/sessions/services/cross-alerts.service.ts` - O motor de inteligência relacional.
