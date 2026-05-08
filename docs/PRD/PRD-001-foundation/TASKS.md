# Plano de Implementação (Tasks)

## Fase 1: Infraestrutura e Banco de Dados

### [T1] Setup do Drizzle e Neon
- **Tempo Estimado**: 1 hora
- **Objetivo**: Estabelecer conexão com o banco serverless.
- **O que fazer**:
  - Instalar `drizzle-orm`, `@neondatabase/serverless` e `drizzle-kit`.
  - Configurar `drizzle.config.ts`.
  - Criar `src/server/db/schema.ts` com modelos `User`, `Account`, `Session`, `Verification` (Better Auth) e `Medication`, `Symptom`, `PatientCase`, `ClinicalSession`.
- **Critério de Aceite**: `npx drizzle-kit push` reflete as tabelas no console do Neon.

### [T2] Implementação do Seed Script
- **Tempo Estimado**: 1.5 horas
- **Objetivo**: Popular a base de conhecimento médico.
- **O que fazer**:
  - Criar script que lê o JSON/Constante de medicamentos e sintomas.
  - Executar inserções com `db.insert(...).onConflictDoNothing()`.
- **Critério de Aceite**: Banco populado com 24 medicamentos e categorias de sintomas vinculadas.

## Fase 2: Autenticação

### [T3] Configuração do Better Auth
- **Tempo Estimado**: 1 hora
- **Objetivo**: Habilitar login de terapeutas.
- **O que fazer**:
  - Configurar `auth.ts` com Drizzle Adapter.
  - Criar rotas de API em `src/app/api/auth/[...better-auth]/route.ts`.
- **Critério de Aceite**: Usuário cadastrado via UI aparece na tabela `User`.

### [T4] Middleware de Proteção
- **Tempo Estimado**: 0.5 hora
- **Objetivo**: Bloquear acesso deslogado.
- **O que fazer**:
  - Criar `src/proxy.ts` (Next.js 16+ pattern).
  - Configurar redirecionamento de `/app/*` para `/login`.
- **Critério de Aceite**: Acesso direto a `/app/dashboard` sem sessão redireciona para `/login`.

## Fase 3: API

### [T5] Services de Listagem
- **Tempo Estimado**: 1 hora
- **Objetivo**: Disponibilizar dados para o front-end.
- **O que fazer**:
  - Criar `src/features/medications/services/list-medications.service.ts`.
  - Criar `src/features/symptoms/services/list-symptoms.service.ts`.
- **Critério de Aceite**: Funções retornam dados tipados prontos para o TanStack Query.
