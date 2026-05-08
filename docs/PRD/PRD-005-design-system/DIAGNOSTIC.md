# Diagnostic: Gaps no Frontend Visual

**Data:** 2026-05-08
**Status:** Planejado
**Escopo:** Frontend (CSS, Tailwind, Componentes)

---

## 📋 Resumo Executivo

Atualmente o sistema não possui uma padronização visual aplicada no código. Se os desenvolvedores (ou IAs) começarem a criar as páginas dos PRDs 002 e 003 agora, teremos uma salada de classes Tailwind genéricas que causarão retrabalho massivo no futuro.

- 🔴 1 Crítico: Falta da skill do agente para policiar o design.
- 🟡 2 Moderados: Variáveis globais não injetadas e ausência de componentes base (UI Kit).

---

## 🔴 Problemas Críticos

### 1. Ausência de Governança de Design (Agent Skill)
**Problema:** Sem uma regra clara, agentes vão usar `text-gray-500` em vez de `text-[var(--lc-neutral-500)]`.
**Solução:** Criar o arquivo `SKILL.md` para o design system e listá-lo no `AGENTS.md`.

---

## 🟡 Problemas Moderados

### 2. Fundação CSS Não Implementada
**Problema:** As definições de `oklch` de `docs/design-system/colors_and_type.css` não estão sendo carregadas pela aplicação Next.js.
**Solução:** Mesclar o conteúdo para dentro de `src/app/globals.css`. Configurar tipografia Geist.

### 3. Componentes Complexos Soltos
**Problema:** Componentes vitais como o `SeverityAlert` e `MedicationCard` estão apenas em HTML estático na pasta docs.
**Solução:** Reescrevê-los como componentes React/Tailwind dentro das pastas `features/` corretas.
