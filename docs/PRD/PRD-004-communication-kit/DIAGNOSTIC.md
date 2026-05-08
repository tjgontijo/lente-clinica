# Diagnostic: Gaps no Motor de Comunicação

**Data:** 2026-05-08
**Status:** Planejado
**Escopo:** Backend (Parsing, Templates, Data Layer)

---

## 📋 Resumo Executivo

Temos o conteúdo dos templates documentado (PDF do Kit de Comunicação), mas o sistema backend não possui tabelas para armazená-los e muito menos um serviço capaz de interpretar e injetar variáveis (Primeiro Nome, Nome do Fármaco, Tempo de Uso) dinamicamente.

---

## 🔴 Problemas Críticos (Lógica)

### 1. Ausência de Mecanismo de Parsing
**Problema:** O texto do PDF contém marcações como `[nome]`, `[idade]`, `[medicação]`, `[x] dias`. O backend não tem um mecanismo estruturado para resolver essas variáveis de forma segura (prevenindo undefined).
**Solução:** Criar um `generate-message.service.ts` que execute múltiplos `.replace()` ou utilize uma biblioteca leve de template engine para processar as strings.

---

## 🟡 Problemas Moderados (Dados)

### 2. Volatilidade dos Templates
**Problema:** Se deixarmos os textos hardcoded no código, qualquer ajuste gramatical exigirá um novo deploy.
**Solução:** Criar a tabela `communication_template` e popular via Seed, permitindo que os textos sejam gerenciados via banco de dados no futuro.
