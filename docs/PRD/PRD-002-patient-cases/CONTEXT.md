# Context: Gestão de Casos

**Última atualização:** 2026-05-08

---

## 📌 Definição

O domínio de `cases` é onde os pacientes "nascem" no sistema. Como o foco da Lente Clínica é a segurança jurídica, não salvamos o nome completo do paciente.

**O que é:**
- Um registro pseudonimizado (apenas Primeiro Nome, 4 dígitos do telefone e Ano de Nascimento).
- Uma âncora para todas as sessões clínicas e medicamentos.

**O que NÃO é:**
- Um prontuário completo com CPF, Endereço ou Histórico de Doenças Crônicas (nesta fase).

---

## 🔄 Fluxo de Implementação (Backend)

```txt
[Request de Criação de Caso]
  ↓
[Valida via Zod (firstName, phoneSuffix, birthYear)]
  ↓
[Insere no Postgres via Drizzle]
  ↓
[Retorna o Objeto Criado para a UI]
```

---

## 🎯 Por Que Isso é Crítico?
Sem o `patientCase`, não há onde "pendurar" a evolução clínica. Ele é a entidade central que permite que a terapeuta acompanhe se o paciente melhorou ou piorou ao longo do tempo.
