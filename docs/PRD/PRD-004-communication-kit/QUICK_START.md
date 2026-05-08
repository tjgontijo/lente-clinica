# Quick Start: PRD-004 Communication Backend

**TL;DR:** Implementação estritamente backend do motor de geração de texto clínico. A tarefa é focar em Data Layer (Drizzle), Seed de dados do Kit de Comunicação e a criação do Service de Parser que troca variáveis como `[iniciais]` por dados reais do banco. Total: 3h.

---

## 📊 Resumo das Tasks (Backend Only)

| # | Problema/Task | Severidade | Fix / Localização |
|---|---------------|------------|------------------|
| T1 | Tabela no Drizzle | 🔴 Crítico | `schema.ts` |
| T2 | Seed de Templates | 🟡 Moderado | `seed.ts` |
| T3 | Lógica de Parser (Replace) | 🔴 Crítico | `generate-message.service.ts` |
| T4 | Exposição Segura | 🟢 Menor | Server Actions |

---

## 🚀 Começar

1. Crie a branch:
```bash
git checkout -b feature/prd-004-communication-backend
```

2. Após editar o schema na T1, não se esqueça de empurrar para o banco:
```bash
npx drizzle-kit push
```

3. Na T3, o foco é lidar bem com nulos. Lembre-se que o ano de nascimento (`birthYear`) do paciente é opcional no banco. Se não houver, o parser precisa lidar graciosamente com o `[idade]` em vez de quebrar ou retornar "NaN".
