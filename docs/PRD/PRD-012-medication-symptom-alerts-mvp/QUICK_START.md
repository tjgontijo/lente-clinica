# Quick Start: Medication Symptom Alerts MVP

**Ultima atualizacao:** 2026-05-09

---

## TL;DR

O MVP deve usar IA para gerar candidatos offline, salvar esses candidatos em staging, promover apenas aprovados para `medication_symptom_alert` e usar somente essa tabela em runtime.

Nao colocar IA na tela de nova observacao. Nao afirmar causalidade.

---

## Tabela Resumida

| Task | Prioridade | Resultado |
|------|------------|-----------|
| T1 | Critica | Tabela de candidatos criada |
| T2 | Critica | Batch IA gera candidatos |
| T3 | Critica | Output IA entra em staging |
| T4 | Alta | Candidatos aprovados viram alertas finais |
| T5 | Alta | Runtime usa tabela estruturada |
| T6 | Media | Observacao salva temporalidade |
| T7 | Media | Cobertura pode ser auditada |
| T8 | Media | Tela vira observacao medicamentosa |
| T9 | Baixa | Microcopy evita causalidade |

---

## Criticos Primeiro

1. Criar `medication_symptom_alert_candidate`.
2. Criar script de batch para 1 a 3 medicamentos.
3. Consumir output para staging.
4. Aprovar e promover alguns candidatos.
5. Alterar `calculateRealTimeAlertsService` para usar `medication_symptom_alert`.

So depois mexer mais profundamente na UX.

---

## Arquivos Principais

- `src/server/db/schema.ts`
- `src/features/sessions/services/calculate-real-time-alerts.service.ts`
- `src/features/sessions/schemas/sessions.schema.ts`
- `src/features/sessions/repositories/create-session.repository.ts`
- `src/features/sessions/forms/session-checklist-form.tsx`
- `src/server/db/scripts/enrichment/generate-enrichment-batch.ts`
- `src/server/db/scripts/relevance/generate-relevance-batch.ts`
- `src/features/medications/prompts/medication-enrichment.prompt.ts`

---

## Prompt MVP

O prompt de candidatos deve receber:

```json
{
  "medication": {
    "id": "...",
    "name": "...",
    "className": "...",
    "attentionSignals": [],
    "clinicalConfounders": [],
    "coordinationNotes": []
  },
  "symptoms": [
    {
      "id": "...",
      "name": "Agitacao",
      "category": "Ansiedade e medo",
      "whatItLooksLike": "..."
    }
  ]
}
```

E devolver:

```json
{
  "candidates": [
    {
      "symptomId": "...",
      "severity": "YELLOW",
      "context": "Pode merecer atencao se surgiu ou piorou apos inicio ou aumento recente.",
      "rationale": "Sinal compativel com ativacao observavel no acompanhamento."
    }
  ]
}
```

Regras essenciais:

- usar somente `symptomId` recebido;
- nao criar sintomas;
- nao recomendar conduta;
- nao afirmar causalidade;
- preferir nao retornar candidato quando a relacao for fraca.

---

## Como Testar os Principais Cenarios

### Cenario 1: alerta aparece

1. Criar ou promover par `medicationId + symptomId`.
2. Garantir que o caso tem essa medicacao ativa.
3. Abrir `/cases/[id]/sessions/new`.
4. Marcar o sintoma.
5. Ver alerta contextual.

### Cenario 2: alerta nao aparece sem par

1. Marcar sintoma sem registro em `medication_symptom_alert`.
2. Confirmar que nao aparece alerta.

### Cenario 3: medicamento inativo nao gera alerta

1. Marcar `patientMedication.isCurrent = false`.
2. Marcar sintoma correspondente.
3. Confirmar que nao aparece alerta.

### Cenario 4: texto nao afirma causalidade

1. Ler cards de alerta.
2. Confirmar que usam "pode", "merece atencao", "relacao incerta".
3. Confirmar que nao dizem "foi causado por".

---

## Comandos de Inicio

```bash
git checkout -b feature/medication-symptom-alerts-mvp
npm install
npm run lint
```

Confirmar scripts de banco:

```bash
cat package.json
```

---

## Sugestao de Commits

```txt
feat(alerts): add medication symptom alert candidate staging
feat(alerts): generate llm alert candidate batches
feat(alerts): consume and promote alert candidates
feat(sessions): use structured medication symptom alerts
feat(sessions): capture medication timing in observations
refactor(sessions): align new session screen with medication support
```

---

## Definicao de Pronto do MVP

- Existe pelo menos um lote de candidatos gerado por IA.
- Candidatos ficam em staging antes da tabela final.
- Existe forma de promover aprovados.
- Runtime usa `medication_symptom_alert`.
- Tela nao depende de IA para decidir alertas.
- Microcopy evita causalidade.
- `npm run lint` passa.
