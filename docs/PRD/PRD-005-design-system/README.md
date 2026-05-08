# PRD-005: Design System Implementation

**Status:** Planejado
**Data:** 2026-05-08
**Versão:** 1.0

---

## 📋 O Que é Este PRD?

Este PRD define a implementação técnica do **Design System Lente Clínica** no repositório. Ele transforma as diretrizes estáticas (cores oklch, tipografia Geist, sombras e radii) em código real reutilizável no Next.js (Tailwind v4 + shadcn/ui). 

Além disso, define a criação de uma **Agent Skill** para garantir que qualquer código de UI gerado no futuro respeite a identidade da marca.

**Documento:** Implementação visual e criação de Skill.
**Tempo Total Estimado:** 3 a 4 horas.

---

## 📂 Estrutura do PRD

```txt
PRD-005-design-system/
├── README.md
├── CONTEXT.md
├── DIAGNOSTIC.md
├── TASKS.md
└── QUICK_START.md
```

---

## 🎯 Resumo Executivo

### Status Atual
- O backend e banco de dados (PRDs 001 a 004) estão mapeados.
- O Design System existe como documentação (`docs/design-system`), mas o app real ainda é "cru".

### Ordem de Implementação

| Fase | Tasks | Tempo |
|------|-------|-------|
| 1: Regras & Fundação | T1-T2 | 1h |
| 2: Base UI (shadcn) | T3-T4 | 1h |
| 3: Domain Components | T5 | 1.5h |

**Total Estimado:** 3.5h

---

## 💾 Arquivos Principais Envolvidos

- `.agents/skills/lente-design-system/SKILL.md` - Nova skill criada.
- `src/app/globals.css` - Injeção das variáveis.
- `src/components/ui/` - Componentes Shadcn adaptados.
- `src/features/*/components/` - Componentes de domínio.
