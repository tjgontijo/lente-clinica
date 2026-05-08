# Diagnostic: Gaps Iniciais no Backend de Cases

**Data:** 2026-05-08
**Status:** Planejado
**Escopo:** Backend (Drizzle, Server Actions)

---

## 📋 Resumo Executivo

O sistema possui autenticação, mas não há tabelas ou services para o terapeuta salvar pacientes. Foco 100% no motor de dados nesta etapa.

- 🔴 1 Crítico: Falta do Modelo de Banco para Paciente e Vínculo Medicamentoso.
- 🟡 1 Moderado: Services seguros (isolando por usuário logado).

---

## 🔴 Problemas Críticos (Arquitetura)

### 1. Ausência do Domínio no Banco de Dados
**Problema:** Drizzle schema não possui `PatientCase` e `PatientMedication`.
**Localização:** `src/server/db/schema.ts`

**Solução Necessária:**
1. Escrever declarações das tabelas no Drizzle.
2. Executar `drizzle-kit push`.

---

## 🟡 Problemas Moderados (Segurança)

### 2. Services sem Validação Segura
**Problema:** Services precisam garantir que o `userId` não possa ser forjado ou que um terapeuta não acesse casos de outro.
**Solução Necessária:**
1. Criar validação de auth dentro das Server Actions antes de delegar para o Service.

---

## 🎯 Ordem de Fixação e Execução

### Fase 1: Data Layer (1h)
1. T1: Drizzle Schema
2. T2: Zod Schemas e Types

### Fase 2: Robustez & Services (1h)
3. T3: `cases` Services (CRUD lógico).
4. T4: Server Actions seguras.
