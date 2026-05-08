# Diagnostic: Gaps no Motor de Inteligência

**Data:** 2026-05-08
**Status:** Planejado
**Escopo:** Backend (Drizzle, Server Actions)

---

## 📋 Resumo Executivo

Sem este PRD, não há como cruzar sintomas vs. remédios e não há como salvar o resultado de uma sessão. Todo o esforço desta fase é de Engenharia de Dados (JOINs e Transactions).

- 🔴 2 Críticos: Ausência de tabela para salvar a sessão e falta do serviço de cruzamento relacional.

---

## 🔴 Problemas Críticos (Arquitetura)

### 1. Ausência da Engine de Cruzamento
**Problema:** Precisamos de um serviço que pegue as medicações ativas e retorne os alertas associados, divididos por severidade.
**Solução:** Criar `get-active-alerts.service.ts` fazendo os JOINs necessários no Drizzle.

### 2. Drizzle Schema de Sessão
**Problema:** Faltam `clinicalSessions` e `sessionObservations`.
**Solução:** Adicionar tabelas sem causar conflito de nomes com Better Auth.

---

## 🎯 Ordem de Fixação e Execução

### Fase 1: Data Layer & Motor (2h)
1. T1: Drizzle Schema.
2. T2: `get-active-alerts.service.ts`.

### Fase 2: Robustez (1h)
3. T3: `create-session.service.ts` (Lógica transacional).
4. T4: Server Actions.
