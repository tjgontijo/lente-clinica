# Diagnostic: Gaps no Frontend de Casos

**Data:** 2026-05-08
**Status:** Planejado
**Escopo:** Frontend (React Hook Form, Modais, React Query)

---

## 📋 Resumo Executivo

As validações via Zod e Services de Casos já funcionam no server, mas não temos os Formulários React conectados a eles via Mutations do TanStack.

- 🔴 1 Crítico: Falta da Mutação de Criação de Caso conectada a um Form de UI.
- 🟡 2 Moderados: Layout do Perfil do Paciente ainda não estruturado para acomodar Timeline e vínculos de medicações de forma elegante.

---

## 🔴 Problemas Críticos (Forms e Mutations)

### 1. Inexistência do CreateCaseForm
**Problema:** A UI não tem como receber input das "Iniciais" e enviar para a Server Action de salvar.
**Solução:** Criar `features/cases/forms/create-case-form.tsx` usando `react-hook-form`, `zodResolver` (reaproveitando o Zod schema do Backend), e amarrar isso em um `<Dialog>` do Shadcn. A submissão com sucesso deve fechar o modal, invalidar a Query de lista de casos, e disparar um Toast verde.

---

## 🟡 Problemas Moderados (UX do Perfil)

### 2. A UX de Vincular Medicação
**Problema:** No perfil do paciente, como a terapeuta adiciona um remédio? Se for uma tela separada, perde-se o contexto.
**Solução:** Usar um "ComboBox" (um `<Select>` com busca) que consome o domínio de `medications` diretamente na tela de perfil do caso. Ao selecionar e confirmar, faz uma mutation silenciosa que adiciona o vínculo.
