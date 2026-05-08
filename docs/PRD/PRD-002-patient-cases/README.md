# PRD-002: Casos Clínicos (Data Layer)

**Status:** Planejado
**Data:** 2026-05-08
**Versão:** 1.0

---

## 📋 O Que é Este PRD?

Este PRD define a implementação do backend do domínio de **Casos Clínicos Anônimos**. É a fundação de dados para criar casos (com primeiro nome, sufixo de telefone e ano de nascimento) e vincular medicamentos ativos. Nenhuma UI será construída nesta fase.

**Documento:** Implementação *greenfield* do domínio `cases` (Data Layer e Services).
**Tempo Total Estimado:** 2 horas.

---

## 📂 Estrutura do PRD

```txt
PRD-002-patient-cases/
├── README.md
├── CONTEXT.md
├── DIAGNOSTIC.md
├── TASKS.md
└── QUICK_START.md
```

---

## 🎯 Resumo Executivo

### Status Atual
- O sistema possui Auth e Banco de Dados (PRD-001).
- Precisamos da capacidade de salvar o perfil básico do paciente antes de registrar sessões.

### Ordem de Implementação

| Fase | Tasks | Tempo |
|------|-------|-------|
| 1: Data Layer | T1 | 0.5h |
| 2: Schemas | T2 | 0.5h |
| 3: Services | T3-T4 | 1h |

**Total Estimado:** 2h

---

## 💾 Arquivos Principais Envolvidos

- `src/server/db/schema.ts`
- `src/features/cases/repositories/`
- `src/features/cases/services/`
- `src/features/cases/schemas/cases.schema.ts`
