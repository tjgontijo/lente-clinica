# PRD-002: Gestão de Casos (Patient Cases)

**Status:** Planejado
**Data:** 2026-05-08
**Versão:** 1.1 (Foco Backend)

---

## 📋 O Que é Este PRD?

Este PRD define a implementação do backend do domínio de **Casos Clínicos Anônimos**. É a fundação de dados para criar casos (com iniciais e ano de nascimento) e vincular medicamentos ativos. Nenhuma UI será construída nesta fase.

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
- PRD-001 implementou o Schema e Seed do Drizzle.
- Faltam as entidades e os Services para salvar dados gerados pelos usuários (Pacientes e Medicações vinculadas).

### Ordem de Fixação / Implementação

| Fase | Tasks | Tempo |
|------|-------|-------|
| 1: Data Layer | T1-T2 | 1h |
| 2: Server Actions & Services | T3-T4 | 1h |

**Total Estimado:** 2h

---

## 💾 Arquivos Principais Envolvidos

- `src/server/db/schema.ts` - Atualização do schema Drizzle.
- `src/features/cases/services/` - Serviços de manipulação de dados.
- `src/features/cases/actions.ts` - Server Actions.
