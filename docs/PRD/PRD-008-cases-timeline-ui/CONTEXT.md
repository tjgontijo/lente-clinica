# Context: Gestão de Casos e Linha do Tempo

**Última atualização:** 2026-05-08

---

## 📌 Definição

Esta é a área core de CRM (Customer Relationship Management) da terapeuta, mas convertida para um contexto clínico LGPD-friendly. 

**O que é:**
- A Home do sistema. Mostra uma lista limpa (tabela ou lista de cards) com o primeiro nome dos pacientes, sufixo do telefone e os últimos atendimentos.
- O Perfil do Paciente: uma view focada onde é possível associar uma medicação (puxando da base do PRD-007) e visualizar a Timeline cronológica das Sessões.

**O que NÃO é:**
- Não expõe o formulário da sessão ainda (isso é PRD-009). Aqui vemos apenas o resultado estático das sessões que já aconteceram.

---

## 🔄 Fluxo de Usuário

```txt
[Clica em "Meus Casos"]
  ↓
[Visualiza lista. Clica em "Novo Paciente"]
  ↓
[Modal pede Primeiro Nome, Sufixo do Telefone e Ano de Nascimento. Botão Salvar.]
  ↓
[Toast de Sucesso e a tela atualiza. Clica no Caso "Maria"]
  ↓
[Abre a página do Perfil do Paciente. Fica visível o Cabeçalho com a idade calculada]
  ↓
[Visualiza seção de "Medicações em Uso" e seção de "Evolução" (Timeline vazia inicialmente)]
```

---

## 🎯 Por Que Isso é Crítico?
A Timeline é a prova visual do valor da plataforma. Quando a terapeuta clica em um caso antigo, ela precisa bater o olho rapidamente e ler as "tags" dos sintomas vermelhos ou amarelos que foram gerados na sessão da semana passada. A leitura vertical de cima para baixo (mais recente para mais antiga) facilita a rememoração do caso.
