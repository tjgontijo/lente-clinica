# Context: Sessões Clínicas e Painel Inteligente

**Última atualização:** 2026-05-08

---

## 📌 Definição

O domínio `sessions` representa um encontro (consulta) entre a terapeuta e o paciente em uma data específica. É aqui que o "Checklist de Sinais de Atenção" da Dra. Tatiana ganha vida interativa.

**O que é:**
- O registro de evolução do paciente (Timeline).
- O motor inteligente que cruza: `Sintoma Observado na Sessão` + `Medicação em Uso` = `Alerta Vermelho/Amarelo`.

**O que NÃO é:**
- Um bloco de notas infinito. O foco são os "Sintomas Estruturados" (SessionObservations) para gerar os alertas, e não apenas anotações em texto livre.

---

## 🔄 Fluxo Completo

```txt
[Abre o Paciente J.S.]
  ↓
[Sistema vê que J.S. toma Escitalopram]
  ↓
[Renderiza Card: "O que observar hoje: risco de embotamento"]
  ↓
[Terapeuta clica em "Nova Sessão"]
  ↓
[Abre o Checklist de Sintomas (Busca e caixas de seleção)]
  ↓
[Terapeuta marca "Agitação Intensa"]
  ↓
[Sistema cruza "Agitação" + "Escitalopram" e exibe Alerta Vermelho de Mania]
  ↓
[Salva a Sessão. Ela vai para a Linha do Tempo do Paciente]
```

---

## 💾 Dados Armazenados (Visão Drizzle)

### ClinicalSession Model
```typescript
{
  id: uuid,
  caseId: string, // FK para PatientCase
  date: Date, // Data da sessão
  notes: string | null,
  createdAt: Date
}
```

### SessionObservation Model
```typescript
{
  sessionId: string, // FK para ClinicalSession
  symptomId: string, // FK para Symptom
  createdAt: Date
}
```

---

## 🔗 Integração com Outros Domínios

### `sessions` ← `cases` & `medications`
Para a mágica funcionar, o serviço da sessão precisa puxar o `PatientCase` (para pegar as `PatientMedication` atuais) e fazer um JOIN com a tabela `MedicationSymptomAlert` do domínio `knowledge`.

---

## 🎯 Por Que Isso é Crítico?
Este é o "Aha! Moment" (Momento Uau) do produto. É a tela que o usuário vai usar toda semana. A performance aqui deve ser instantânea, e a interface deve ser limpa para não sobrecarregar a carga cognitiva do profissional de saúde durante um atendimento.
