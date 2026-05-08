# Diagnostic: Gaps no Layout Base

**Data:** 2026-05-08
**Status:** Planejado
**Escopo:** Frontend (Next.js App Router, Tailwind)

---

## 📋 Resumo Executivo

O projeto `lente-clinica` foi inicializado, mas seu `app/layout.tsx` está praticamente puro. Sem os contêineres globais e os provedores do TanStack Query, nenhuma feature inteligente pode ser construída no Frontend.

- 🔴 1 Crítico: Falta do `QueryClientProvider` (TanStack Query) exigido pela nossa arquitetura.
- 🟡 2 Moderados: Layout vazio e falta de um sistema unificado de notificações toast.

---

## 🔴 Problemas Críticos (Arquitetura)

### 1. Ausência do Provedor de Cache
**Problema:** A skill `nextjs-execution-guardrails` proíbe `useEffect` para fetch e exige TanStack Query. Contudo, o QueryClientProvider não está configurado na raiz.
**Solução:** Criar `providers.tsx` em client-side e envelopar o `children` no `layout.tsx`.

---

## 🟡 Problemas Moderados (UX)

### 2. Ausência da Estrutura de Menu
**Problema:** Sem a navegação base, as rotas ficam isoladas e a UX quebra.
**Solução:** Criar `TopNav` fixo no topo.

### 3. Falta de Feedback Global
**Problema:** Quando salvarmos um paciente ou medicação nas próximas etapas, o usuário precisa de um feedback tátil e rápido.
**Solução:** Implementar o componente `Toaster` do shadcn/ui na raiz do layout.
