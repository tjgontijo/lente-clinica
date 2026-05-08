# Tasks: PRD-006 Frontend Shell

**Data:** 2026-05-08 | **Status:** Planejado | **Total Tasks:** 4 | **Estimado:** 2h

---

## 🔴 Fase 1: Provedores Globais (0.5h)

### T1: Configurar TanStack Query Provider
**Localização:** `src/components/providers.tsx`
**O que fazer:**
1. Criar um componente "use client" que inicialize o `QueryClient`.
2. Adicionar as regras rigorosas da skill (desligar `refetchOnWindowFocus`).
3. Envelopar o conteúdo de `src/app/layout.tsx` neste provider.

---

## 🟡 Fase 2: Navegação e Shell (1h)

### T2: Criar o TopNav (Responsivo)
**Localização:** `src/components/layout/top-nav.tsx`
**O que fazer:**
1. Usar a abordagem **Mobile First** aproveitando os breakpoints padrão do Tailwind v4 (`sm`, `md`, `lg`, `xl`, `2xl`).
2. **Desktop (`md:flex`):** Mostrar os links "Meus Casos" e "Medicações" centralizados no Header.
3. **Mobile (`md:hidden`):** Esconder os links e exibir um Ícone de Hamburger (Menu).
4. Instalar o componente `npx shadcn add sheet` para usar como o *Drawer* lateral que se abre no celular ao clicar no menu.
5. Adicionar o Avatar/Dropdown do usuário à direita (visível em ambos).

### T3: Criar o MainShell
**Localização:** `src/components/layout/main-shell.tsx`
**O que fazer:**
1. Um wrapper simples: `<main className="max-w-5xl mx-auto px-4 py-8 w-full">`
2. Isso garante que todo o conteúdo futuro não passe de ~1024px de largura, protegendo a leitura no desktop.

---

## 🟢 Fase 3: Feedback Visual (0.5h)

### T4: Configurar Toaster
**Localização:** `src/app/layout.tsx`
**O que fazer:**
1. Instalar via shadcn: `npx shadcn add sonner` (ou toast).
2. Adicionar `<Toaster />` no final do body no layout principal.

### T5: Preparar Skeletons (Suspense)
**Localização:** `src/app/loading.tsx` e UI
**O que fazer:**
1. Instalar via shadcn: `npx shadcn add skeleton`.
2. Criar `src/app/loading.tsx` contendo um grid de Skeletons base para transições de rotas puras.
