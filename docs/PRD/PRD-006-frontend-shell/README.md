# PRD-006: Frontend Shell e Layout Global

**Status:** Planejado
**Data:** 2026-05-08
**Versão:** 1.0

---

## 📋 O Que é Este PRD?

Este PRD define a implementação do "Casco" (Shell) da plataforma Lente Clínica. Ele materializa a visão de UX "Autoridade sem arrogância", abandonando a Sidebar corporativa em favor de uma navegação superior (Top Nav) minimalista e um layout de largura controlada.

**Documento:** Implementação do layout global, navegação e provedores de estado (Frontend).
**Tempo Total Estimado:** 2 horas.

---

## 📂 Estrutura do PRD

```txt
PRD-006-frontend-shell/
├── README.md
├── CONTEXT.md
├── DIAGNOSTIC.md
├── TASKS.md
└── QUICK_START.md
```

---

## 🎯 Resumo Executivo

### Status Atual
- O Backend está planejado e parcialmente executado.
- O Design System (PRD-005) definiu a identidade visual.
- Falta a "tela em branco" estruturada onde as funcionalidades vão morar.

### Ordem de Implementação

| Fase | Tasks | Tempo |
|------|-------|-------|
| 1: Provedores | T1 | 0.5h |
| 2: Navegação e Shell | T2-T3 | 1h |
| 3: Feedback Visual | T4 | 0.5h |

**Total Estimado:** 2h

---

## 💾 Arquivos Principais Envolvidos

- `src/app/layout.tsx` - O entrypoint da aplicação.
- `src/components/layout/top-nav.tsx` - A barra de navegação superior.
- `src/components/layout/main-shell.tsx` - O limitador de largura.
- `src/components/providers.tsx` - Onde o React Query vai morar.
