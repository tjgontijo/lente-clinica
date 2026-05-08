<!-- BEGIN:nextjs-agent-rules -->
# Next.js 16 Foundation

Este projeto utiliza Next.js 16 com mudanças profundas em APIs e convenções. Leia `node_modules/next/dist/docs/` antes de codificar.
<!-- END:nextjs-agent-rules -->

## Skills Obrigatórias

Sempre consulte o diretório `.agents/skills/` para diretrizes específicas. As skills principais são:

- **Arquitetura**: `$next-feature-architecture` (localizada em `.agents/skills/next-feature-architecture/`)
- **PRDs**: `$prd-pack-generator` (localizada em `.agents/skills/prd-pack-generator-skill/`)

## Diretrizes Críticas (Next.js 16+)

1. **Proxy vs Middleware**: Use `src/proxy.ts` em vez de `src/middleware.ts` com nextjs 16+.
2. **Cache**: Use Cache Components (`'use cache'` + `cacheLife()`). Evite segment configs (`dynamic`, `revalidate`).
3. **useEffect**: Proibido, exceto em casos com justificativa técnica explícita.
4. **Data Fetching**: Prioridade total para **TanStack Query**.
5. **Performance**: Focar em renderização eficiente e virtualização (`react-virtuoso`).
6. **Banco de Dados**: Acesso isolado em `repositories` e regras em `services`. Nunca acesse o DB em components ou hooks.
7. **IDs e UUIDs**: Proibido gerar IDs no código (ex: `cuid`). Use sempre `uuid` gerado pelo PostgreSQL (`.defaultRandom()`).

## Estrutura de Pastas

```txt
app/          # Rotas e Composição
features/     # Domínios (Components, Hooks, Services, Repositories, Schemas)
server/db/    # Conexão com Banco de Dados
components/ui # Componentes Genéricos (Shadcn)
```

## Comandos de Qualidade

Execute antes de finalizar tarefas:
```bash
npm run lint
```
*Mantenha o package manager existente no projeto (npm).*