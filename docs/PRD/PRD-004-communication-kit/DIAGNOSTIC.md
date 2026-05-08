# Diagnostic: Gaps e Necessidades do Motor de Templates

**Data:** 2026-05-08
**Status:** Planejado
**Escopo:** Backend (Drizzle, Services)

---

## 📋 Resumo Executivo

Temos o conteúdo dos templates documentado (PDF do Kit de Comunicação), mas o sistema backend não possui tabelas para armazená-los e muito menos um serviço capaz de interpretar e injetar variáveis (Iniciais, Nome do Fármaco, Tempo de Uso) dinamicamente.

- 🔴 1 Crítico: Falta do Parser dinâmico nos services.
- 🟡 1 Moderado: O banco não tem a tabela de Templates e não há Seed para isso.

**Conclusão:** O esforço será puramente algorítmico (RegExp ou string replace estruturado) no Service.

---

## 🔴 Problemas Críticos (Backend & Lógica)

### 1. Ausência do Parser Dinâmico (Service)
**Problema:** O texto do PDF contém marcações como `[iniciais]`, `[idade]`, `[medicação]`, `[x] dias`. O backend não tem um mecanismo estruturado para resolver essas variáveis de forma segura (prevenindo undefined).
**Impacto:**
- ❌ O texto chegará quebrado para a terapeuta.

**Solução Necessária:**
1. Desenvolver `generate-message.service.ts` com um mapa de substituição estruturado.

---

## 🟡 Problemas Moderados (Data Layer)

### 2. Drizzle Schema e Seed Incompletos
**Problema:** Os 21 cenários do Kit de Comunicação ainda não existem no banco de dados local.
**Solução Necessária:**
1. Criar a tabela `communicationTemplates`.
2. Adicionar o insert no script global de `seed.ts`.

---

## 🎯 Ordem de Fixação e Execução

### Fase 1: Base e Seed (1h)
1. T1: Drizzle Schema (`communicationTemplates`).
2. T2: Atualização do arquivo de Seed com os cenários do PDF.

### Fase 2: O Motor Lógico (1.5h)
3. T3: `generate-message.service.ts` (Implementação do Parser de Variáveis com segurança de nulos).

### Fase 3: Exposição da API (0.5h)
4. T4: Server Action de Geração de Mensagem.
