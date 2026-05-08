# PRD-011: Multiprofessional MVP Pivot (Plataforma Universal)

**Status:** Draft
**Data:** 2026-05-08
**Versao:** 1.0

---

## 📋 O Que e Este PRD?

Este PRD define a transição do produto Lente Clínica de uma ferramenta focada exclusivamente em psicoterapia para uma biblioteca clínica **multiprofissional**. O objetivo é criar uma ficha única, segura, observacional e útil para qualquer profissional (psicólogos, médicos generalistas, enfermeiros, etc.) que acompanhe pacientes medicados em saúde mental, antes de segmentar por perfis.

**Documento:** Adaptação de schema, prompts e UI para o "Núcleo Comum Multiprofissional".

**Tempo Total:** 2h - 3h

---

## 📂 Estrutura do PRD

```txt
PRD-011-multiprofessional-mvp/
├── README.md (este arquivo)
├── CONTEXT.md (contexto do dominio)
├── DIAGNOSTIC.md (problemas e riscos)
├── TASKS.md (plano de implementacao)
└── QUICK_START.md (guia rapido)
```

---

## 🎯 Resumo Executivo

### Status Atual

- O pipeline de enriquecimento via LLM está otimizado (v3.1) e funciona via Batch API.
- O modelo de dados e os prompts atuais usam termos como "terapeuta", "sessão" e "O que observar na sessão".
- O posicionamento comercial apontou para a necessidade de abranger todos os profissionais clínicos (SaaS).

### Severidade

| Criticos | Moderados | Menores |
|----------|-----------|---------|
| 🔴 0   | 🟡 2    | 🟢 3  |

### Ordem de Fixacao

| Fase | Tasks | Tempo |
|------|-------|-------|
| 1: Robustez de Dados | T1 | 30m |
| 2: Atualização de IA | T2, T3 | 1h |
| 3: Refinamento de UX | T4, T5 | 1h |

**Total:** 2h 30m

---

## 🟡 Problemas Moderados

### T1: Renomear sessionObservations para careObservations e confoundingEffects para clinicalConfounders

**Impacto:** Os termos atuais restringem a visão da plataforma a sessões de terapia ou soam como bula.
**Solucao:** Atualizar o schema do Drizzle e os schemas do Zod para usar `careObservations` e `clinicalConfounders`.

### T2: Atualizar o Prompt Estático (v4.0)

**Impacto:** A IA gera textos focados apenas na figura do "terapeuta".
**Solucao:** Modificar as instruções fixas do prompt para referenciar "profissionais", "atendimentos" e "cuidado clínico".

---

## 🟢 Problemas Menores

### T3: Ajustar Scripts de Batch para refletir novo Prompt e Schema

**Impacto:** Os scripts de geração e consumo dependem do schema atual.
**Solucao:** Atualizar a validação no `consume-enrichment-batch.ts` e a geração no `generate-enrichment-batch.ts`.

### T4: Atualizar Interface do Medication Details

**Impacto:** A interface atual exibe títulos como "O que observar na sessão" e ícones específicos.
**Solucao:** Alterar títulos, ícones e exibir o campo `careObservations` em vez de `sessionObservations`.

### T5: Atualizar formatador Markdown

**Impacto:** O botão "Copiar MD" reflete a estrutura antiga.
**Solucao:** Atualizar os rótulos gerados pelo exportador de Markdown.

---

## 💾 Arquivos Principais

- `src/server/db/schema.ts` - Schema do banco de dados.
- `src/features/medications/schemas/medication-enrichment.schema.ts` - Schema de validação Zod.
- `src/features/medications/prompts/medication-enrichment.prompt.ts` - Instruções da LLM.
- `src/features/medications/components/medication-details.tsx` - Interface de usuário.
- `src/server/db/scripts/generate-enrichment-batch.ts` - Gerador de lote.

---

## ✅ Como Comecar

1. Ler: CONTEXT.md, DIAGNOSTIC.md, QUICK_START.md, TASKS.md
2. Executar tasks na ordem: banco de dados -> prompt -> scripts -> UI.
3. Gerar um novo lote de teste para garantir a conformidade do novo schema.
4. Validar os componentes de interface.

---

## 📊 Matriz de Risco

| Task | Severidade | Probabilidade | Risco | Esforco |
|------|------------|---------------|-------|---------|
| T1 | Medio | Media | MEDIO | 30m |
| T2 | Medio | Baixa | BAIXO | 30m |

---

**Status:** Validacao pendente
