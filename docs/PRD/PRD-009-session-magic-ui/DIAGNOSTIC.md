# Diagnostic: Gaps no Frontend de Sessões

**Data:** 2026-05-08
**Status:** Planejado
**Escopo:** Frontend (React Hook Form pesado, UI Dinâmica)

---

## 📋 Resumo Executivo

O frontend não possui a tela principal da aplicação. Criar um checklist em React pode gerar problemas brutais de performance se não for bem feito, pois são muitos checkboxes.

- 🔴 1 Crítico: A página de `new session` não existe.
- 🟡 2 Moderados: Componentizar o Acordeão (Shadcn) para agrupar sintomas, e plugar o serviço de geração de comunicação no final da sessão.

---

## 🔴 Problemas Críticos (Performance)

### 1. Re-renderização no Formulário do Checklist
**Problema:** Se fizermos um Form gigantesco, cada vez que o usuário clicar num checkbox de sintoma, a tela inteira vai recarregar, causando "lag".
**Solução:** Usar `react-hook-form` da maneira certa, registrando os inputs sem estado local no parent principal. O Painel de Alertas deve usar o hook `useWatch` para escutar apenas a array de sintomas selecionados e reagir a isso de forma isolada.

---

## 🟡 Problemas Moderados (Layout)

### 2. Layout em Split-View não testado
**Problema:** Nossa MainShell (PRD-006) é um container centralizado. A tela de sessão precisará de CSS Grid (`grid-cols-1 lg:grid-cols-3`) com o `col-span-2` para o formulário e `col-span-1` para o Painel Sticky.
**Solução:** Definir as regras de flex/grid diretamente na `page.tsx` usando as classes do Tailwind v4.
