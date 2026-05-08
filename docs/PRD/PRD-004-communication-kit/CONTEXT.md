# Context: Motor de Geração de Comunicação Clínica

**Última atualização:** 2026-05-08
**Foco:** Backend / Services

---

## 📌 Definição

O domínio `communication` encapsula a lógica de formatação de texto. Ele pega dados brutos relacionais (Paciente, Sessão, Sintomas, Medicamentos) e converte em templates de comunicação (baseados no PDF da Dra. Tatiana).

**O que é:**
- Um parser (substituidor de variáveis) inteligente.
- Um seletor de templates baseado em severidade ou cenário específico.

**O que NÃO é:**
- Não usa IA generativa (LLM). O texto é fixo (determinístico), garantindo precisão médica e segurança jurídica.

---

## 🔄 Fluxo Lógico (Backend)

```txt
[Service recebe requisição com sessionId]
  ↓
[Busca a Sessão, o Caso (iniciais, idade) e as Medicações Ativas]
  ↓
[Identifica qual o alerta mais grave gerado nessa sessão (ex: Acatisia severa)]
  ↓
[Busca o template associado a esse cenário no banco de dados]
  ↓
[Faz parse das strings: troca "[iniciais]" por "M.S.", "[medicação]" por "Aripiprazol"]
  ↓
[Retorna a string completa para o frontend]
```

---

## 💾 Dados Armazenados (Visão Drizzle)

### CommunicationTemplate Model
```typescript
{
  id: uuid,
  scenario: string, // Ex: "Início de antidepressivo sem melhora"
  urgencyLevel: string, // 'YELLOW' | 'RED'
  contentShort: string, // Template curto (WhatsApp)
  contentMedium: string, // Template médio
  contentFormal: string | null // Template para E-mail (quando existir)
}
```

---

## 🔗 Integração com Outros Domínios

O serviço deste domínio terá que importar repositórios/serviços de:
- `sessions` (para ler o que foi observado).
- `cases` (para pegar os dados do paciente).

---

## 🎯 Por Que Isso é Crítico?
A comunicação precisa ser impecável. Se o parser falhar ou pegar a medicação errada, a terapeuta enviará uma informação clínica equivocada ao psiquiatra. O backend aqui atua como garantidor de integridade.
