# Context: A Sessão em Split-View

**Última atualização:** 2026-05-08

---

## 📌 Definição

O `Split-View` é um padrão de design usado para evitar o "ping-pong" cognitivo. Quando um formulário é muito longo (como um checklist de 40+ sintomas), o usuário não deveria rolar até o fim da página para ver o resultado do que acabou de preencher.

**O que é:**
- Um layout responsivo (2 colunas no Desktop, 1 coluna agrupada no Mobile).
- **Coluna Principal (Esquerda):** O Acordeão de Sintomas (agrupados por Categorias como Psiquiátricos, Físicos, etc) com `checkboxes`.
- **Painel Lateral (Direita - Sticky):** Os medicamentos que o paciente toma e o Feed de Alertas que surge dinamicamente.

---

## 🔄 A "Mágica" Reativa

```txt
[Abre a Tela de Nova Sessão]
  ↓
[Painel da Direita lista os Remédios (Ex: Venlafaxina). Não há alertas visíveis.]
  ↓
[Terapeuta rola a Esquerda e marca o sintoma "Sudorese Noturna"]
  ↓
[O estado do formulário muda. O TanStack Query cruza os dados localmente.]
  ↓
[Um Card Amarelo (TriangleAlert) desliza no painel da Direita: "Atenção: Venlafaxina pode causar sudorese noturna."]
  ↓
[Ao terminar, ela clica em Salvar Sessão, gerando o texto do Kit de Comunicação]
```

---

## 🎯 Desafio Técnico
A busca pelo motor de inteligência não deve engasgar a renderização dos checkboxes. Usar `useWatch` do React Hook Form para monitorar a seleção de sintomas e debouncing se necessário. Não renderize todos os 40 sintomas num re-render gigante; isole a reatividade no painel da direita.
