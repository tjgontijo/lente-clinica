# PRD-009: A Sessão Mágica (Split-View)

**Status:** Planejado
**Data:** 2026-05-08
**Versão:** 1.0

---

## 📋 O Que é Este PRD?

Este PRD descreve a "jóia da coroa" do Lente Clínica. É a interface onde a terapeuta registra a sessão do paciente. Ela adota um layout de duas colunas (Split-View) no desktop, onde a esquerda contém o longo checklist de sintomas organizados por categorias, e a direita contém um painel fixo que pisca Alertas de Inteligência Clínica conforme a terapeuta interage com o checklist.

**Documento:** Frontend da Nova Sessão (Checklist Interativo).
**Tempo Total Estimado:** 4.5 horas.

---

## 📂 Estrutura do PRD

```txt
PRD-009-session-magic-ui/
├── README.md
├── CONTEXT.md
├── DIAGNOSTIC.md
├── TASKS.md
└── QUICK_START.md
```

---

## 🎯 Resumo Executivo

### Status Atual
- PRDs anteriores cobriram a base de dados, a navegação, e o portal de Casos.
- Agora precisamos da tela que conecta os Casos aos Sintomas, extraindo valor dos Remédios via o Motor Inteligente (PRD-003).

### Ordem de Implementação

| Fase | Tasks | Tempo |
|------|-------|-------|
| 1: Layout Split-View | T1 | 1h |
| 2: O Checklist (Forms) | T2 | 1.5h |
| 3: Reatividade (Alertas) | T3 | 1.5h |
| 4: Gerador de Mensagem | T4 | 0.5h |

**Total Estimado:** 4.5h

---

## 💾 Arquivos Principais Envolvidos

- `src/app/(dashboard)/cases/[id]/sessions/new/page.tsx`
- `src/features/sessions/forms/session-checklist-form.tsx`
- `src/features/sessions/components/sticky-alerts-panel.tsx`
