# Diagnostic: Lacunas de Usabilidade na Comunicacao Clinica

**Data:** 2026-06-23
**Status:** Concluido
**Escopo:** UX e Interatividade da Feature `/communications`

---

## 📋 Resumo Executivo

A solucao atual de Kit de Comunicacao Clinica funciona como uma base de conhecimento excelente, mas apresenta barreiras de usabilidade que limitam a agilidade no dia a dia da psicologa:

- 🟡 **Carga Cognitiva Elevada**: Ler 21 cenarios para achar o modelo adequado e cansativo.
- 🟡 **Falta de Contexto Clinico no Momento do Envio**: O roteiro de perguntas fica na barra lateral, exigindo que o profissional divida a atencao visual entre a lateral e o centro.
- 🟢 **Complexidade na Customizacao**: Digitar inline no meio do texto e inovador, mas exige que a psicologa analise o paragrafo inteiro para encontrar os colchetes. Um formulario guiado e mais tradicional e seguro.

---

## 🟡 Problemas Moderados

### 1. Dificuldade de Triagem e Selecao
- **Problema:** Encontrar o modelo de mensagem adequado exige navegar por uma lista extensa ou digitar termos de busca especificos.
- **Impacto:** Menor engajamento no uso dos modelos e perda de tempo no atendimento.
- **Solucao Necessaria:** Criar um funil de perguntas e respostas que faz a triagem automatica do cenario clinico ideal (Wizard).

### 2. Dispersao de Foco Cognitivo
- **Problema:** As perguntas clinicas para embasar a mensagem estao em uma barra lateral separada dos modelos.
- **Impacto:** A psicologa corre o risco de copiar e enviar a mensagem sem checar as perguntas recomendadas.
- **Solucao Necessaria:** Integrar o roteiro de perguntas do cenario diretamente na etapa de visualizacao e envio final do wizard.

---

## 🟢 Problemas Menores

### 3. Friccao na Digitacao de Variaveis Locais
- **Problema:** Embora tenhamos o input inline no card, a entrada e pequena e pode quebrar o fluxo visual da leitura.
- **Impacto:** Alguns usuarios podem preferir um formulario simples antes de ver a mensagem montada.
- **Solucao Necessaria:** Permitir que o wizard colete os dados em inputs dedicados na Etapa 4, alimentando o template gerado de forma limpa.

---

## ✅ O Que Esta Bem

| Item | Status | Evidencia |
|------|--------|-----------|
| Banco de Modelos | ✅ | 21 cenarios estruturados em [templates.ts](file:///Users/thiago/www/lente-clinica/src/features/communications/data/templates.ts) |
| Copia e Envio | ✅ | Botoes de copia e link direto para WhatsApp implementados em [template-card.tsx](file:///Users/thiago/www/lente-clinica/src/features/communications/components/template-card.tsx) |
| Layout Geral | ✅ | Layout limpo seguindo o design system do projeto |

---

## 📊 Matriz de Risco

| Problema | Severidade | Probabilidade | Risco | Esforco |
|----------|------------|---------------|-------|---------|
| Dificuldade de Triagem | Medio | Media | MEDIO | 2h |
| Dispersao de Foco | Medio | Baixa | BAIXO | 1h |
| Friccao de Variaveis | Baixo | Media | BAIXO | 1h |

---

## 🎯 Ordem de Fixacao

### Fase 1: Estrutura & Fluxo (3h)
- **T1**: Criar a interface de abas para o wizard na tela principal.
- **T2**: Implementar o questionario guiado de triagem (Etapas 1, 2 e 3).

### Fase 2: Robustez & UX (1h)
- **T3**: Criar o formulario dinamico de variaveis locais e a visualizacao final (Etapas 4 e 5).

### Fase 3: Persistencia & Refinamentos (1h)
- **T4**: Adicionar controle de estado e persistencia basica.
