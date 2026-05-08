# Context: Geração de Texto Clínico

**Última atualização:** 2026-05-08

---

## 📌 Definição

O motor de comunicação é o que transforma dados frios (JSON) em uma mensagem profissional. Ele age como um tradutor ético entre a observação da psicóloga e a linguagem do médico assistente.

**O que é:**
- Um parser de strings que substitui placeholders por dados dinâmicos.
- Um repositório de templates pré-aprovados para diferentes cenários clínicos.

---

## 🔄 Fluxo de Processamento (Backend)

```txt
[Request: generateMessage(sessionId, scenarioId)]
  ↓
[Busca a Sessão, o Caso (Primeiro Nome, idade) e as Medicações Ativas]
  ↓
[Busca o Template correspondente ao ScenarioId no Banco]
  ↓
[Faz parse das strings: troca "[nome]" por "Maria", "[medicação]" por "Aripiprazol"]
  ↓
[Retorna o objeto { message: string, urgencyLevel: string }]
```

---

## 🎯 Placeholders Suportados
- `[nome]`: Primeiro nome do paciente (ex: Maria).
- `[idade]`: Idade calculada (ex: 34 anos).
- `[medicação]`: Lista de medicamentos atuais (ex: Venlafaxina).
- `[sintomas]`: Sintomas observados na sessão.
