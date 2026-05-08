# Tasks: PRD-005 Design System Implementation

**Data:** 2026-05-08 | **Status:** Planejado | **Total Tasks:** 5 | **Estimado:** 3.5h

---

## 🔴 Fase 1: Regras e Fundação (1h)

### T1: Criar a Agent Skill de Design
**Localização:** `.agents/skills/lente-design-system/SKILL.md`
**O que fazer:**
Criar uma skill ensinando o agente a usar as classes utilitárias baseadas em variáveis CSS.
Atualizar o arquivo `AGENTS.md` na raiz para apontar que componentes UI devem obrigatoriamente acionar essa skill.

### T2: Injetar Variáveis no Globals
**Localização:** `src/app/globals.css` e `src/app/layout.tsx`
**O que fazer:**
1. Copiar as raízes `:root` do arquivo `docs/design-system/colors_and_type.css` para o `globals.css`.
2. Importar as fontes `Geist Sans` e `Geist Mono` no `layout.tsx` usando `next/font`.

---

## 🟡 Fase 2: Base UI com Shadcn (1h)

### T3: Adicionar Componentes Base do Shadcn
**O que fazer:**
Executar via CLI a instalação dos componentes primários:
`npx shadcn@latest add button badge card alert input label`

### T4: Customizar (Overriding) Shadcn
**Localização:** `src/components/ui/*.tsx`
**O que fazer:**
Editar os componentes recém-instalados para que consumam as variáveis `--lc-`.
- Em `button.tsx`: Ajustar raios (`rounded-[var(--lc-radius-full)]`) e cores de background/hover.
- Em `alert.tsx`: Criar as `variants` específicas de "Atenção" (Amarelo) e "Urgência" (Vermelho) apontando pros tokens de background, borda e texto do Design System.

---

## 🟢 Fase 3: Componentes de Domínio (1.5h)

### T5: Criar os Componentes Específicos
**O que fazer:**
Transformar o HTML estático do design system em componentes React nos respectivos domínios:
1. `src/features/medications/components/medication-card.tsx`
2. `src/features/sessions/components/checklist-item.tsx`
3. `src/features/sessions/components/severity-alert-panel.tsx`
4. `src/features/communication/components/message-generator.tsx`
