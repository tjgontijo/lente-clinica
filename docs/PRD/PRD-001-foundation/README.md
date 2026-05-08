# PRD-001: Arquitetura de Dados, Base de Conhecimento e Autenticação

## 1. Resumo
Este PRD define a fundação técnica do MVP da Plataforma **Lente Clínica**, estabelecendo a estrutura de dados para o cruzamento inteligente de medicações e sintomas, além de implementar a autenticação segura de terapeutas.

## 2. Status
- **Fase**: Planejamento / Fundação
- **Prioridade**: Crítica
- **Severidade Geral**: Alta (Bloqueador de funcionalidades)
- **Tempo Total Estimado**: 4-6 horas
- **Entregas**: 5 Tasks principais

## 3. Matriz de Risco Resumida
- **Colisão de Nomes**: Risco de conflito entre `Session` (Auth) e `ClinicalSession` (Domínio).
- **Dados Sensíveis**: Risco de vazamento de dados de- **PatientCase**: Vinculado ao Terapeuta, armazena apenas primeiro nome, sufixo de telefone e ano de nascimento.ro nome, sufixo de telefone e isolamento por usuário).
- **Integridade do Seed**: Risco de erros na carga inicial dos PDFs.

## 4. Arquivos do Pacote
- [CONTEXT.md](CONTEXT.md): Domínios e fluxo técnico.
- [DIAGNOSTIC.md](DIAGNOSTIC.md): Riscos e conformidade.
- [TASKS.md](TASKS.md): Plano de execução.
- [QUICK_START.md](QUICK_START.md): Guia de validação.

## 5. Como começar
Certifique-se de ter acesso ao Neon Console e as chaves do Better Auth preparadas. Siga para o [TASKS.md](TASKS.md) para iniciar a implementação.
