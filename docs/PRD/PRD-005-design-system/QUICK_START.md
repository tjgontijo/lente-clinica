# Quick Start: PRD-005 Design System

**TL;DR:** Integração da identidade visual Lente Clínica no repositório, configurando variáveis CSS globais, adaptando componentes base do shadcn/ui e criando uma Agent Skill para governança de design futura. Total: 3.5h.

---

## 📊 Resumo das Tasks

| # | Problema/Task | Severidade | Fix / Localização |
|---|---------------|------------|------------------|
| T1 | Skill do Agente Ausente | 🔴 Crítico | `.agents/skills/lente-design-system/` |
| T2 | Variáveis CSS Faltantes | 🔴 Crítico | `globals.css` |
| T3 | Instalar Shadcn UI | 🟡 Moderado | Terminal CLI |
| T4 | Refatorar Cores Shadcn | 🟡 Moderado | `src/components/ui/` |
| T5 | Componentes de Domínio | 🟢 Menor | `src/features/*/components/` |

---

## 🚀 Começar

1. Crie a branch: `git checkout -b feature/prd-005-design-system`
2. Antes de codar qualquer tela, comece pela **T1**. Criar a skill garante que nas próximas execuções a IA não vai desalinhar o design.
3. Na T4, tenha o arquivo `docs/design-system/README.md` aberto ao lado para colar os valores corretos de radius, shadows e cores da paleta Teal/Amber/Red.
