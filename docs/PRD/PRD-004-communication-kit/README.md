# PRD-004: Communication Kit (Gerador de Textos)

**Status:** Planejado
**Data:** 2026-05-08
**Versão:** 1.0 (Foco Exclusivo Backend)

---

## 📋 O Que é Este PRD?

Este PRD define a implementação do motor backend do **Kit de Comunicação**. Ele será responsável por ler os dados de uma sessão clínica recém-salva, cruzar com a base de templates de comunicação, e devolver o texto estruturado para que a plataforma o exiba futuramente.

**Documento:** Implementação do domínio `communication` (apenas data layer e services).
**Tempo Total Estimado:** 3 horas.

---

## 📂 Estrutura do PRD

```txt
PRD-004-communication-kit/
├── README.md
├── CONTEXT.md
├── DIAGNOSTIC.md
├── TASKS.md
└── QUICK_START.md
```

---

## 🎯 Resumo Executivo

### Status Atual
- PRDs 001, 002 e 003 estruturaram as bases de conhecimento, os pacientes e o motor de sessão.
- **Falta o motor final:** Transformar o "Alerta" (Sintoma + Droga) em um texto acionável e ético que a terapeuta possa copiar e enviar ao psiquiatra.

### Ordem de Implementação (Foco Backend)

| Fase | Tasks | Tempo |
|------|-------|-------|
| 1: Data Layer & Seed | T1-T2 | 1h |
| 2: Motor de Geração | T3 | 1.5h |
| 3: Server Actions | T4 | 0.5h |

**Total Estimado:** 3h

---

## 💾 Arquivos Principais Envolvidos

- `src/server/db/schema.ts` - Tabela de Templates.
- `src/features/communication/services/generate-message.service.ts` - O parser de variáveis.

---

## ✅ Como Começar

1. Ler o **CONTEXT.md** para entender como as variáveis (ex: `[nome]`) funcionam.
2. Criar a branch: `git checkout -b feature/communication-backend`
3. Executar as tasks no backend, garantindo cobertura de testes caso necessário.
