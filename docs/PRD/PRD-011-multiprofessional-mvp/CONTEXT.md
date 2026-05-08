# Context: Transição para Núcleo Comum Multiprofissional (MVP)

**Ultima atualizacao:** 2026-05-08

---

## 📌 Definicao

O **Núcleo Comum Multiprofissional** é a padronização do conteúdo clínico da Lente Clínica para atender a diferentes perfis de profissionais de saúde (psicólogos, médicos de família, enfermeiros, equipes multiprofissionais) sem a necessidade de gerar múltiplas fichas de medicamentos concorrentes no MVP.

**O que e:**

- Uma ficha universal focada no manejo de pacientes medicados.
- Uma ponte clínica que unifica a linguagem entre quem prescreve e quem acompanha.
- Uma base de dados padronizada que permite escalar o SaaS rapidamente.

**O que NAO e:**

- Não é um material para decisão prescritiva.
- Não é um gerador de bulas customizadas por profissão.
- Não segmenta os resultados da LLM por profissão no nível do banco de dados (nesta fase).

---

## 🔄 Fluxo Completo

```txt
[Profissional (Qualquer Perfil) acessa a Lente Clínica]
  ↓
[Busca por um medicamento]
  ↓
[Visualiza a Ficha de "Núcleo Comum"]
  - Lê a descrição ampla.
  - Verifica Observações de Cuidado (Care Observations).
  - Consulta perguntas úteis e sinais de atenção.
  ↓
[Copia o Markdown para seu prontuário (Sessão, Retorno, Evolução)]
```

Neste modelo, o dado em si (o que a IA gerou) é o mesmo. A interface no futuro poderá adaptar os rótulos (ex: "Para a Sessão" vs "Para a Consulta"), mas o banco de dados armazena um modelo unificado.

---

## 💾 Dados Armazenados

### Medication Enrichment Schema

A mudança principal ocorre no atributo de observações, que deixa de ser restritivo.

```typescript
{
  description: string,
  clinicalContexts: string[],
  patientReports: string[],
  careObservations: string[], // <-- ANTES: sessionObservations
  confoundingEffects: string[],
  usefulQuestions: string[],
  coordinationNotes: string[],
  attentionSignals: string[],
  clinicalPhrase: string
}
```

---

## 🎯 Estados

Não há novos estados neste PRD. O ciclo de vida do enriquecimento (PENDING -> PENDING_BATCH -> NEEDS_REVIEW -> APPROVED) permanece o mesmo, validado no PRD-010.

---

## 🔗 Integracao com Outros Dominios

### UI ← Database

A interface de exibição (`medication-details.tsx`) deve passar a renderizar `careObservations` de forma ampla, evitando jargões exclusivos de psicoterapia (ex: "O que observar na sessão" vira "O que observar no atendimento").

### Batch API ← LLM Prompts

A geração do JSONL para a Batch API usará um novo prompt (`v4.0`) que instrui a IA a adotar um tom "multiprofissional" e não estritamente "terapêutico".

---

## 🎯 Por Que Isso e Critico?

- **Redução de Complexidade:** Evita gerar e revisar 4 a 5 versões diferentes da mesma medicação durante a fase MVP.
- **Go-to-Market Acelerado:** Permite vender assinaturas (B2C) para médicos generalistas e enfermeiros, ampliando o mercado endereçável imediato.
- **Custo e Escalabilidade:** Mantém o custo da Batch API baixo ao gerar apenas um schema por substância ativa.

---

## 📝 Resumo para Implementacao

- Atualizar o esquema do Drizzle e rodar uma migração/push (já que os dados atuais do banco são apenas de teste e podem ser dropados/recriados).
- Refatorar os schemas do Zod.
- Atualizar a constante `MEDICATION_ENRICHMENT_STATIC_PROMPT` para refletir as orientações universais.
- Modificar o front-end para exibir o novo campo e rótulos mais amplos.
