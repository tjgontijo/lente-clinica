---
name: next-feature-architecture
description: Use esta skill ao criar, alterar ou revisar código em projetos Next.js que seguem arquitetura por features, separação forte de responsabilidades, arquivos pequenos, services, repositories, schemas, hooks, mutations, API routes e acesso organizado ao banco de dados.
---

# Skill: Next.js Feature Architecture

## Objetivo

Guiar o desenvolvimento em projetos Next.js usando uma arquitetura modular por domínio, com responsabilidades bem separadas, arquivos pequenos e baixo acoplamento entre features.

A prioridade é manter o código previsível, fácil de navegar, fácil de testar e seguro para server/client boundaries.

## Princípios obrigatórios

1. Separar responsabilidade por camada.
2. Organizar código específico dentro de `features/[domain]`.
3. Manter `app/` como camada de roteamento, entrada HTTP e composição.
4. Manter banco de dados fora de componentes, hooks e código client.
5. Usar um arquivo por intenção sempre que possível.
6. Evitar arquivos grandes com múltiplas responsabilidades.
7. Evitar imports profundos entre features.
8. Preferir composição na rota/página em vez de uma feature importar outra diretamente.
9. Validar entradas com schemas antes de executar regra de negócio.
10. Colocar regras sensíveis no servidor.
11. Evitar useEffect, usando apenas em casos estritamente justificados.
12. Priorizar TanStack Query para busca e sincronização de dados.
13. Em Next.js 16+, usar `src/proxy.ts` em vez de `src/middleware.ts`.
14. Usar Cache Components com a diretiva `'use cache'` e a função `cacheLife()` para controle de cache granulado.
15. Focar em performance de consultas e renderização (ex: react-virtuoso para listas longas).
16. **IDs e UUIDs**: Proibido gerar IDs no código (ex: `cuid`, `nanoid`). Sempre use `uuid` com a responsabilidade de geração delegada ao PostgreSQL (`.defaultRandom()`).

## Estrutura padrão do projeto

Use esta estrutura como referência principal:

```txt
src/
  app/
    api/
    layout.tsx
    page.tsx

  components/
    ui/
    layout/

  features/
    [domain]/
      components/
      hooks/
      mutations/
      queries/
      schemas/
      services/
      repositories/
      mappers/
      types.ts
      constants.ts
      index.ts

  server/
    db/
      db.ts

  lib/
    utils.ts

  config/
  constants/
  types/
```

## Responsabilidade de cada diretório

### `src/app`

Use para rotas, layouts, páginas, handlers HTTP e composição entre features.

Pode conter:

```txt
page.tsx
layout.tsx
loading.tsx
error.tsx
not-found.tsx
route.ts
```

Não coloque regra de negócio complexa em `app/`.

### Cache e Data Fetching (Next.js 16+)

O sistema de cache evoluiu para ser mais granulado e explícito.

1. **`'use cache'`**: Use como diretiva no topo de funções assíncronas para habilitar o cache naquele escopo.
2. **`cacheLife()`**: Use para definir a duração do cache (ex: `cacheLife('hours')`).
3. **Fim dos Segment Configs**: Evite usar `export const dynamic`, `revalidate` ou `fetchCache`. As páginas são dinâmicas por padrão.

Exemplo:

```tsx
import { cacheLife } from 'next/cache';

export default async function Page() {
  'use cache';
  cacheLife('hours');
  
  const data = await fetch('...');
  return <div>...</div>;
}
```

### `src/app/api`

Use apenas como camada HTTP.

Uma API route deve:

1. Ler a request.
2. Chamar um service da feature.
3. Retornar a response.
4. Tratar erros de forma simples e previsível.

Uma API route não deve:

1. Acessar o Banco de Dados diretamente.
2. Conter regra de negócio.
3. Validar manualmente dados complexos se já existe schema.
4. Misturar múltiplos domínios no mesmo arquivo.

Exemplo:

```ts
import { NextResponse } from "next/server";

import { createUserService } from "@/features/users/services/create-user.service";

export async function POST(request: Request) {
  const body = await request.json();

  const user = await createUserService(body);

  return NextResponse.json(user, { status: 201 });
}
```

## Features

Cada domínio deve ficar em:

```txt
src/features/[domain]/
```

Exemplos:

```txt
src/features/auth/
src/features/users/
src/features/products/
src/features/orders/
src/features/payments/
```

Tudo que é específico daquele domínio deve morar dentro da feature.

## Estrutura interna de uma feature

Use este padrão:

```txt
features/users/
  components/
    UserForm.tsx
    UserCard.tsx
    UserList.tsx

  hooks/
    use-user-form.ts

  mutations/
    use-create-user-mutation.ts
    use-update-user-mutation.ts
    use-delete-user-mutation.ts

  queries/
    use-users-query.ts
    use-user-query.ts

  schemas/
    create-user.schema.ts
    update-user.schema.ts

  services/
    create-user.service.ts
    update-user.service.ts
    delete-user.service.ts
    get-user.service.ts

  repositories/
    create-user.repository.ts
    find-user-by-id.repository.ts
    find-user-by-email.repository.ts
    update-user.repository.ts
    delete-user.repository.ts

  mappers/
    user.mapper.ts

  types.ts
  constants.ts
  index.ts
```

## Regra de camadas

Siga este fluxo:

```txt
Component
  chama hook, query ou mutation

Mutation ou Query
  chama API route ou Server Action

API route ou Server Action
  chama service

Service
  valida dados e executa regra de negócio

Repository
  acessa o banco de dados

server/db
  fornece a conexão com o banco
```

## Banco de dados

A conexão com o banco deve ficar em:

```txt
src/server/db/
```

Exemplo de conexão:

```ts
import "server-only";

// Configuração do seu ORM/Driver preferido
export const db = {}; 
```

O arquivo de conexão não deve ter regra de negócio nem queries específicas.

## Repositories

Repositories ficam dentro da feature quando a operação pertence ao domínio.

Use um arquivo por operação de banco.

Bom:

```txt
repositories/
  create-user.repository.ts
  find-user-by-id.repository.ts
  find-user-by-email.repository.ts
  update-user.repository.ts
  delete-user.repository.ts
```

Evite:

```txt
repositories/
  user.repository.ts
```

Motivo: arquivos genéricos tendem a crescer demais.

Exemplo:

```ts
import "server-only";

import { db } from "@/server/db/db";

export async function findUserByEmail(email: string) {
  // Exemplo genérico de query
  return db.user.findUnique({
    where: { email },
  });
}
```

## Services

Services representam casos de uso e regras de negócio.

Use um arquivo por caso de uso.

Bom:

```txt
services/
  create-user.service.ts
  update-user.service.ts
  delete-user.service.ts
  get-user.service.ts
```

O service pode:

1. Validar dados com schema.
2. Consultar repositories.
3. Aplicar regra de negócio.
4. Disparar efeitos de domínio.
5. Retornar dados para API route ou Server Action.

O service não deve:

1. Saber detalhes de HTTP.
2. Receber `Request` diretamente.
3. Retornar `NextResponse`.
4. Conter JSX.
5. Ser usado em Client Components.

Exemplo:

```ts
import "server-only";

import { createUserSchema } from "../schemas/create-user.schema";
import { createUser } from "../repositories/create-user.repository";
import { findUserByEmail } from "../repositories/find-user-by-email.repository";

export async function createUserService(input: unknown) {
  const data = createUserSchema.parse(input);

  const userAlreadyExists = await findUserByEmail(data.email);

  if (userAlreadyExists) {
    throw new Error("E-mail já cadastrado");
  }

  return createUser(data);
}
```

## Schemas

Schemas validam entrada de dados.

Use Zod quando o projeto usar Zod.

```txt
schemas/
  create-user.schema.ts
  update-user.schema.ts
```

Exemplo:

```ts
import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
```

## Mutations

Mutations de client devem ficar dentro da feature.

Use:

```txt
features/[domain]/mutations/use-create-[domain]-mutation.ts
```

Exemplo:

```ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { CreateUserInput } from "../schemas/create-user.schema";

async function createUserRequest(data: CreateUserInput) {
  const response = await fetch("/api/users", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erro ao criar usuário");
  }

  return response.json();
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUserRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
```

A mutation pode:

1. Chamar API route ou Server Action.
2. Controlar loading, erro e sucesso.
3. Invalidar cache.
4. Disparar toast.
5. Redirecionar quando fizer sentido.

A mutation não pode:

1. Acessar banco.
2. Importar o ORM ou Driver de banco.
3. Executar regra de negócio sensível.
4. Substituir service.
5. Validar regra de domínio crítica apenas no client.

## Queries

Queries de client devem ficar dentro da feature.

Use:

```txt
features/[domain]/queries/use-[domain]-query.ts
features/[domain]/queries/use-[domain-list]-query.ts
```

Exemplo:

```ts
"use client";

import { useQuery } from "@tanstack/react-query";

async function getUsersRequest() {
  const response = await fetch("/api/users");

  if (!response.ok) {
    throw new Error("Erro ao buscar usuários");
  }

  return response.json();
}

export function useUsersQuery() {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsersRequest,
  });
}
```

## Hooks

Use `hooks/` para lógica client reutilizável que não seja necessariamente query ou mutation.

Exemplos:

```txt
hooks/
  use-user-form.ts
  use-user-filters.ts
```

Hooks devem começar with `"use client"` quando usarem estado, efeitos ou APIs do browser.

## Components

Componentes específicos da feature ficam dentro da própria feature.

```txt
features/users/components/UserForm.tsx
```

Componentes genéricos ficam em:

```txt
src/components/ui/
```

Exemplo:

```txt
src/components/ui/Button.tsx
src/components/ui/Input.tsx
src/components/ui/Dialog.tsx
```

Uma feature pode importar componentes genéricos de `components/ui`.

Uma feature deve evitar importar componentes internos de outra feature.

## Mappers

Use mappers para converter dados entre formatos.

Exemplos:

```txt
mappers/
  user.mapper.ts
```

Use mappers quando:

1. O retorno do banco não deve ser exposto diretamente.
2. A API precisa devolver um DTO.
3. O formulário usa um formato diferente do banco.
4. Existe normalização de dados.

Exemplo:

```ts
type UserEntity = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
};

export function toUserDTO(user: UserEntity) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}
```

## Types

Use `types.ts` para tipos específicos da feature.

```ts
export type UserStatus = "active" | "inactive";
```

Tipos globais e realmente compartilhados devem ficar em:

```txt
src/types/
```

## Index da feature

Use `index.ts` como API pública da feature.

Exporte apenas o que outras partes do projeto podem usar.

Exemplo:

```ts
export { UserForm } from "./components/UserForm";
export { UserList } from "./components/UserList";

export type { UserStatus } from "./types";
```

Evite expor repositories pelo `index.ts`.

Repositories são detalhes internos do servidor.

## Imports permitidos

Features podem importar de:

```txt
@/components/ui
@/lib
@/server
@/config
@/constants
@/types
```

Features devem evitar importar diretamente de:

```txt
@/features/other-feature/components/*
@/features/other-feature/repositories/*
@/features/other-feature/services/*
```

Quando precisar combinar features, faça a composição em `app/`.

Bom:

```tsx
import { UserProfile } from "@/features/users";
import { RecentOrders } from "@/features/orders";

export default function UserPage() {
  return (
    <>
      <UserProfile />
      <RecentOrders />
    </>
  );
}
```

Evite:

```tsx
import { RecentOrders } from "@/features/orders/components/RecentOrders";

export function UserProfile() {
  return <RecentOrders />;
}
```

## Server boundaries

Qualquer arquivo que acessa banco, secrets, autenticação sensível ou integração privada deve usar:

```ts
import "server-only";
```

Use isso em:

```txt
services/
repositories/
server/
```

Nunca importe arquivos server-only em Client Components.

## Client boundaries

Arquivos que usam React hooks, estado, efeitos, browser APIs, TanStack Query ou eventos de UI devem usar:

```ts
"use client";
```

Use isso em:

```txt
components client-side
hooks
queries
mutations
```

## Padrão para novas features

Ao criar uma nova feature, siga este checklist:

1. Criar pasta em `src/features/[domain]`.
2. Criar `components/` se houver UI específica.
3. Criar `schemas/` para validação de entrada.
4. Criar `services/` para casos de uso.
5. Criar `repositories/` para operações de banco.
6. Criar `queries/` para leitura client-side.
7. Criar `mutations/` para escrita client-side.
8. Criar `types.ts` para tipos do domínio.
9. Criar `index.ts` expondo apenas a API pública.
10. Criar ou atualizar `app/api/[domain]/route.ts` quando houver endpoint HTTP.
11. Garantir que cada arquivo tenha uma responsabilidade clara.

## Padrão de nome de arquivos

Use kebab-case para arquivos.

Bom:

```txt
create-user.service.ts
find-user-by-email.repository.ts
use-create-user-mutation.ts
create-user.schema.ts
```

Evite:

```txt
userService.ts
UserRepository.ts
users.ts
helpers.ts
utils.ts
```

Use nomes genéricos como `utils.ts` apenas quando o arquivo for realmente genérico e pequeno.

## Limite de tamanho dos arquivos

Evite arquivos grandes.

Diretriz:

1. Até 80 linhas: ideal.
2. Até 150 linhas: aceitável.
3. Acima de 150 linhas: avaliar divisão.
4. Acima de 250 linhas: dividir, exceto casos justificados.

Divida por intenção, não por tipo abstrato.

## Como implementar uma tarefa

Antes de alterar código:

1. Identifique o domínio afetado.
2. Verifique se já existe feature para esse domínio.
3. Localize schemas, services, repositories, queries e mutations relacionados.
4. Preserve padrões existentes do projeto.
5. Evite criar uma nova abstração se o padrão atual já resolve.
6. Se precisar criar nova pasta, siga a estrutura desta skill.

Durante a implementação:

1. Comece pelo schema se houver entrada de dados.
2. Crie ou ajuste repository se precisar banco.
3. Crie ou ajuste service para regra de negócio.
4. Conecte API route ou Server Action ao service.
5. Crie ou ajuste query/mutation para the client.
6. Atualize componente usando hook, query ou mutation.
7. Exporte no `index.ts` apenas se for uso público da feature.

Depois da implementação:

1. Remova código morto.
2. Verifique imports server/client.
3. Verifique se não há acesso ao banco no client.
4. Verifique se não há regra de negócio na API route.
5. Verifique se os arquivos continuam pequenos.
6. Rode lint, typecheck e testes quando disponíveis.

## Tratamento de erros

Não espalhe tratamento de erro complexo por componentes.

Preferência:

1. Repository retorna erro técnico ou lança erro técnico.
2. Service transforma erro de domínio quando necessário.
3. API route transforma erro em resposta HTTP.
4. Mutation transforma erro em feedback de UI.

## O que não fazer

Não faça:

1. Acesso ao banco de dados dentro de component.
2. Acesso ao banco de dados dentro de hook.
3. Regra de negócio dentro de `route.ts`.
4. Schema duplicado em vários lugares.
5. Feature importando internals de outra feature.
6. Arquivo `service.ts` gigante.
7. Arquivo `repository.ts` gigante.
8. Diretório `utils` virando depósito de lógica.
9. Imports profundos sem necessidade.
10. Misturar client e server no mesmo arquivo.
11. Usar useEffect para sincronizar estado que poderia ser derivado ou tratado em handlers de eventos.

## Critério de conclusão

Considere a tarefa concluída apenas quando:

1. A responsabilidade de cada arquivo estiver clara.
2. A feature estiver organizada por domínio.
3. Acesso ao banco de dados isolado em `repositories` e regras em `services`.
4. **IDs e UUIDs**: Proibido gerar IDs no código (ex: `cuid`, `nanoid`). Sempre use `uuid` com a responsabilidade de geração delegada ao PostgreSQL (`.defaultRandom()`).
5. A API route estiver fina.
6. Queries e mutations estiverem no lado client.
7. Schemas validarem entrada relevante.
8. Não houver mistura indevida entre client e server.
9. O código estiver pequeno, legível e consistente.
10. Os comandos de verificação do projeto tiverem sido executados, quando disponíveis.
