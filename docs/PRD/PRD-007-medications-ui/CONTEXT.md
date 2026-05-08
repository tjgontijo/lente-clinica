# Context: Buscador de Medicações

**Última atualização:** 2026-05-08

---

## 📌 Definição

O "Buscador de Medicações" é uma tela de acesso rápido. Muitas vezes a terapeuta só quer tirar uma dúvida ("Escitalopram causa perda de libido?") sem precisar criar um caso clínico formal.

**O que é:**
- Um diretório pesquisável (searchbar) de todos os medicamentos cadastrados.
- Cards informativos detalhados, desenhados para leitura rápida.

**O que NÃO é:**
- Não tem funcionalidade de escrita (CRUD completo). A base é fixa/sistêmica e alimentada apenas via Seed.

---

## 🔄 Fluxo de Usuário

```txt
[Clica em "Medicações" no TopNav]
  ↓
[Abre a rota /medications]
  ↓
[Visualiza a Searchbar e uma lista em grid de componentes MedicationCard]
  ↓
[Digita "Venlafaxina" na barra]
  ↓
[A URL atualiza com ?search=Venlafaxina (URL State)]
  ↓
[O React Query atualiza a lista de cards instantaneamente usando debounce]
```

---

## 🎯 Regras de Negócio de Frontend
- **URL State:** Todo filtro (busca textual, paginação se houver) deve morar na URL (`searchParams`). Isso permite que a terapeuta copie o link e salve nos favoritos do navegador. Não guarde filtros textuais apenas em `useState`.
- **Skeleton:** O input de busca fica imediatamente disponível, mas os cards devem renderizar via Skeleton até que a resposta do TanStack Query chegue.
