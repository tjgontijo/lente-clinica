# Context: Gestão de Casos Anônimos

**Última atualização:** 2026-05-08

---

## 📌 Definição

O domínio `cases` é a área privada do terapeuta para organizar os pacientes que ele atende na clínica e controlar suas evoluções psicofarmacológicas.

**O que é:**
- Um registro pseudonimizado (apenas Iniciais e Ano de Nascimento).
- Uma ponte (tabela pivô) para conectar um paciente à nossa Base de Conhecimento (`Medications`).

**O que NÃO é:**
- Um prontuário eletrônico completo.
- Um repositório de dados sensíveis (Nome, CPF, Telefone).

---

## 🔄 Fluxo Completo

```txt
[Dashboard do Terapeuta]
  ↓
[Clica em "Novo Caso"]
  ↓
[Preenche Iniciais (ex: M.S.) e Ano de Nasc (ex: 1990)]
  ↓
[Sistema cria o caso e abre a tela do Paciente]
  ↓
[Terapeuta busca medicação (ex: Escitalopram) e vincula ao Paciente]
```

---

## 💾 Dados Armazenados (Visão Drizzle)

### PatientCase Model
```typescript
{
  id: uuid,
  userId: string, // FK para o User logado (Better Auth)
  initials: string,
  birthYear: number | null,
  status: string, // 'active' | 'archived'
  createdAt: Date
}
```

### PatientMedication Model
```typescript
{
  caseId: string, // FK para PatientCase
  medicationId: string, // FK para Medication (Domínio knowledge)
  isCurrent: boolean,
  createdAt: Date
}
```

---

## 🔗 Integração com Outros Domínios

### `cases` ← `auth`
Os casos são estritamente isolados por usuário. O serviço de listagem (`listCasesService`) DEVE sempre filtrar por `userId` recebido do token da sessão.

### `cases` → `medications` (Knowledge Base)
A tela de adicionar medicamento ao paciente precisa consumir o serviço/lista do domínio `medications` para alimentar o combobox/select.

---

## 📋 Validações (Zod)

### Input Validation
- `initials`: Máximo de 5 caracteres. Letras maiúsculas. (ex: "J.S.").
- `birthYear`: Ano válido (1900 até ano atual).
- `medicationId`: UUID válido.

---

## 🎯 Por Que Isso é Crítico?
Garante o pilar da ferramenta sem infringir a LGPD. Sem vincular um caso às drogas que ele toma, a plataforma não tem como executar sua principal proposta de valor: os alertas inteligentes de sintomas na sessão.
