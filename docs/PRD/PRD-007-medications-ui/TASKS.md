# Tasks: PRD-007 Medications UI

**Data:** 2026-05-08 | **Status:** Planejado | **Total Tasks:** 4 | **Estimado:** 2.5h

---

## 🔴 Fase 1: Componentes Visuais (1h)

### T1: Criar MedicationCard
**Localização:** `src/features/medications/components/medication-card.tsx`
**O que fazer:**
1. Usar o componente `Card` do Shadcn como base.
2. Renderizar: `name`, `commercialNames` (como Badge de tom neutro), `class.name` (como Badge Teal), `description` e `ethicalCare`.
3. Garantir espaçamentos coerentes (Tailwind `gap-4`, `p-6`) conforme o design system.

### T2: Componentes de Skeleton / Empty State
**Localização:** `src/features/medications/components/medications-skeleton.tsx`
**O que fazer:**
Criar um grid com 6 cards em formato Skeleton (Shadcn `Skeleton`) para ser usado durante o loading do TanStack Query.

---

## 🟡 Fase 2: Integração de Dados (0.5h)

### T3: Query Hook de Medicações
**Localização:** `src/features/medications/queries/use-medications-query.ts`
**O que fazer:**
1. Escrever o hook `useMedicationsQuery(search?: string)`.
2. A function dele chamará o service server-side ou API Route responsável por listar e filtrar as medicações no Drizzle.

---

## 🟢 Fase 3: Rotas e Estado (1h)

### T4: Rota de Busca (Page)
**Localização:** `src/app/(dashboard)/medications/page.tsx`
**O que fazer:**
1. Esta será a página acessível via menu.
2. Embutir uma `<Searchbar />` no topo. A Searchbar deve alterar a URL usando `useRouter` e `replace` com um pequeno *debounce*.
3. Renderizar o grid de `MedicationCard` alimentado pelo hook de `useMedicationsQuery` que observa a URL. Se `isPending`, exibir os Skeletons da T2. Se a lista for vazia, exibir um Empty State amigável.
