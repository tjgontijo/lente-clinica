# Contexto: Fundação Técnica e Domínios de Dados

## 1. O que é este domínio?
Este domínio representa o núcleo técnico da plataforma Lente Clínica. Ele engloba a infraestrutura de banco de dados, o sistema de segurança (autenticação) e a base de conhecimento clínico que sustenta toda a inteligência de alertas da aplicação.

## 2. O que NÃO é?
- Não é o sistema de teleconsultas ou chat.
- Não é um prontuário médico completo com CID-10 (foco apenas em sintomas e medicações).
- Não é um sistema multi-clínica (foco no terapeuta individual).

## 3. Stack Tecnológica
- **Framework:** Next.js (App Router)
- **Banco de Dados & ORM:** Neon (PostgreSQL Serverless) + Drizzle ORM
- **Autenticação:** Better Auth
- **Data Fetching (Client):** TanStack Query
- **Estilização:** TailwindCSS / shadcn/ui

## 4. Domínios e Entidades

### 4.1. Autenticação (Terapeutas)
- **User**: Cadastro do profissional.
- **Session**: Controle de sessão do professional (Better Auth).

### 4.2. Base de Conhecimento (Estática)
- **Medication**: Nome comercial, genérico, classe e descrição.
- **Symptom**: Descrição do sintoma e pergunta de sondagem.
- **MedicationSymptomAlert**: Relacionamento N:N definindo alertas de severidade Amarelo/Vermelho.

### 4.3. Dados do Paciente (Dinâmicos)
- **PatientCase**: Vinculado ao Terapeuta, armazena apenas iniciais.
- **ClinicalSession**: Registro de cada atendimento individual.

## 5. Fluxo de Implementação
1. Configuração do Driver Neon e Drizzle.
2. Definição do Schema Drizzle com foco em normalização.
3. Integração do Better Auth com Drizzle Adapter.
4. Carga inicial via Seed (conhecimento médico).

## 6. Validações Esperadas
- Iniciais do paciente devem ter no máximo 4 caracteres.
- Medicamentos devem ter nomes únicos.
- Sessões clínicas devem sempre pertencer a um caso de paciente válido.
