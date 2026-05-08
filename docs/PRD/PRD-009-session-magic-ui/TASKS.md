# Tasks: PRD-009 A Sessão Mágica

**Data:** 2026-05-08 | **Status:** Planejado | **Total Tasks:** 4 | **Estimado:** 4.5h

---

## 🔴 Fase 1: O Layout e a Estrutura (1h)

### T1: Criar a Base do Layout Duplo
**Localização:** `src/app/(dashboard)/cases/[id]/sessions/new/page.tsx`
**O que fazer:**
1. Página deve buscar os dados base (Categorias e Sintomas) em Server Component.
2. Construir o container com `grid grid-cols-1 lg:grid-cols-3 gap-8`.
3. Esquerda (`lg:col-span-2`): Vai hospedar o formulário.
4. Direita (`lg:col-span-1`): Usar `position: sticky; top: 100px` para ancorar o painel.

---

## 🔴 Fase 2: O Checklist Gigante (1.5h)

### T2: Componente do Formulário Base
**Localização:** `src/features/sessions/forms/session-checklist-form.tsx`
**O que fazer:**
1. Usar `react-hook-form` com um schema que aceita um array de `symptomIds`.
2. Para agrupar a lista, instale o componente de sanfona (`npx shadcn add accordion`).
3. Renderizar cada `symptomCategory` em um Acordeão.
4. Renderizar cada sintoma usando o `Checkbox` do shadcn.

---

## 🟡 Fase 3: A Reatividade dos Alertas (1.5h)

### T3: Painel de Alertas Sticky
**Localização:** `src/features/sessions/components/sticky-alerts-panel.tsx`
**O que fazer:**
1. Componente recebe como prop os `medications` ativos do paciente e os `selectedSymptomIds` (usando `useWatch` do hook-form).
2. Ele chama internamente um TanStack Query Hook (`useActiveAlertsQuery(selectedSymptomIds)`) que faz a mágica.
3. Renderizar os alertas que voltarem da query no padrão visual (Atenção = Amarelo, Urgência = Vermelho).

---

## 🟢 Fase 4: O Gran Finale (0.5h)

### T4: Gerador de Comunicação
**O que fazer:**
Ao clicar em "Salvar Sessão" (botão final), a Server Action (PRD-003) salva a sessão no banco e, na volta do sucesso, o frontend exibe um Dialog Modal de Sucesso. Esse Modal deve puxar o serviço do PRD-004 e apresentar à terapeuta a mensagem clínica pronta para copiar e colar no WhatsApp do psiquiatra.
