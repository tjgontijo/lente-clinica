# Quick Start: PRD-004 Motor de Comunicação

**TL;DR:** Implementação estritamente backend do motor de geração de texto clínico. A tarefa é focar em Data Layer (Drizzle), Seed de dados do Kit de Comunicação e a criação do Service de Parser que troca variáveis como `[nome]` por dados reais do banco. Total: 3h.

---

## 📊 Resumo das Tasks

| # | Problema/Task | Severidade | Fix / Localização |
|---|---------------|------------|------------------|
| T1 | Tabela de Templates | 🔴 Crítico | `schema.ts` |
| T2 | Seed do Kit de Com. | 🟢 Menor | `seed.ts` |
| T3 | Service de Geração | 🔴 Crítico | `generate-message.service.ts` |
| T4 | Server Action | 🟡 Moderado | `actions.ts` |

---

## 🚀 Começar

1. Garanta que o `schema.ts` já contém a tabela `communication_template`.
2. No service de geração, use regex global `/\[nome\]/g` para garantir que todas as ocorrências do nome sejam trocadas no texto.
3. Não foque em UI. O retorno deve ser apenas um objeto JSON com a mensagem processada.
