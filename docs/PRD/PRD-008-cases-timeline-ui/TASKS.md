# Tasks: PRD-008 Cases Timeline UI

**Data:** 2026-05-08 | **Status:** Planejado | **Total Tasks:** 4 | **Estimado:** 3.5h

---

## 🔴 Fase 1: Lista e Criação (1.5h)

### T1: Página de Lista de Casos
**Localização:** `src/app/(dashboard)/cases/page.tsx`
**O que fazer:**
1. Página Server Component que busca os casos (ou usa Client Component com TanStack Query para atualização instantânea).
2. Tabela simples ou Lista de Cards mostrando Iniciais e Idade calculada.
3. Botão primário no cabeçalho: "Novo Paciente".

### T2: Form e Modal de Criação
**Localização:** `src/features/cases/forms/create-case-form.tsx`
**O que fazer:**
1. Criar form com `react-hook-form` e `zodResolver`.
2. Usar Hook de Mutation (`useCreateCaseMutation`).
3. Embutir o formulário dentro de um `Dialog` do Shadcn.
4. Lidar com o estado `isPending` (desabilitando botão e mostrando spinner) e sucesso (fechando modal, gerando Toast e invalidando cache).

---

## 🟡 Fase 2: Perfil do Caso (1h)

### T3: Layout Base da Tela do Paciente
**Localização:** `src/app/(dashboard)/cases/[id]/page.tsx`
**O que fazer:**
1. Cabeçalho hero simples: "Caso M.S." com botão secundário de "Voltar para lista".
2. Criar Seção "Medicações em Uso". Listar os `PatientMedications` ativos como tags ou pequenos cards (`Badge` components do design system).
3. Botão/Combobox de "+ Adicionar Medicação" que faz fetch das medicações existentes e submete a mutation de vinculo.

---

## 🟢 Fase 3: Timeline Visual (1h)

### T4: Componente de Histórico (Timeline)
**Localização:** `src/features/cases/components/session-timeline.tsx`
**O que fazer:**
1. Abaixo das medicações em uso, na página do caso.
2. Buscar o histórico de `clinicalSessions` ordenado da mais nova para a mais velha.
3. Renderizar uma lista vertical com linha conectora lateral (estilo "feed" ou timeline).
4. Em cada "card" da timeline, exibir a Data, um snippet das Notes (se houver), e renderizar as `sessionObservations` (sintomas) marcadas na cor referente à severidade da época.
