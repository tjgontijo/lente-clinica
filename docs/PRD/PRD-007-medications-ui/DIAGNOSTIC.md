# Diagnostic: Gaps no Frontend de Medicações

**Data:** 2026-05-08
**Status:** Planejado
**Escopo:** Frontend (Next.js, UI, React Query)

---

## 📋 Resumo Executivo

A camada de dados está pronta, mas a rota `/medications` devolve 404 porque não foi criada no App Router. Além disso, não há a tradução do design estático do card de medicação (do `docs/design-system`) para um componente React usando Shadcn e tokens.

- 🔴 1 Crítico: Componente visual do Cartão de Medicamento não existe no código.
- 🟡 1 Moderado: Ausência de integração assíncrona (Query Hook) para buscar via API/Action.

---

## 🔴 Problemas Críticos (UI e Design)

### 1. Ausência do MedicationCard
**Problema:** A representação visual do remédio (que tem nome, mecanismo, classe e cuidados) ainda não foi componentizada.
**Solução:** Construir `MedicationCard.tsx` no domínio `features/medications/components` utilizando tipografia Geist e as variáveis de cor (Teal) da nossa arquitetura.

---

## 🟡 Problemas Moderados (Estado e Rota)

### 2. URL State Não Configurado
**Problema:** Se criarmos uma busca usando apenas `useState`, a rota perderá "linkability". 
**Solução:** Implementar a busca usando um hook que sincroniza o input de pesquisa com a URL (`?search=`), e fazer o React Query escutar essa mudança de URL.
