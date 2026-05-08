# Guia de Validação (Quick Start)

## 1. Resumo das Tasks

| ID | Task | Prioridade | Esforço |
| :--- | :--- | :--- | :--- |
| **T1** | Setup Drizzle/Neon | Crítica | 1h |
| **T2** | Seed da Base | Alta | 1.5h |
| **T3** | Better Auth | Alta | 1h |
| **T4** | Proxy/Proteção | Média | 0.5h |
| **T5** | API Services | Baixa | 1h |

## 2. Inicialização Rápida
```bash
# 1. Configurar .env com DATABASE_URL e BETTER_AUTH_SECRET
# 2. Instalar
npm install
# 3. Empurrar schema
npx drizzle-kit push
# 4. Rodar seed
npm run seed
```

## 3. Principais Arquivos de Verificação
- `src/server/db/schema.ts`: Verifique as relações de alertas.
- `src/proxy.ts`: Verifique a proteção de rotas `/app`.
- `src/features/medications/services/*`: Verifique os tipos de retorno.

## 4. Sugestão de Desenvolvimento
- **Branch**: `feat/foundation-auth-db`
- **Commits Sugeridos**:
  - `feat: setup drizzle with neon schema`
  - `feat: integrate better-auth with drizzle adapter`
  - `feat: implement knowledge base seed`
  - `feat: add proxy route protection`
