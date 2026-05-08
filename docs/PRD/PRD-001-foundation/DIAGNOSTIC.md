# Diagnóstico Técnico e Riscos

## 1. Resumo Executivo
A fundação técnica depende da sincronia perfeita entre o Better Auth (identidade) e o Drizzle (dados). O principal desafio é a migração da base de conhecimento estática dos PDFs para o banco de dados sem perda de integridade nos alertas.

## 2. Riscos Críticos (Severidade Alta)
- **Colisão de Nomenclatura**: O Better Auth reserva `Session`. Se usarmos `Session` para o atendimento clínico, haverá conflito de tabelas.
  - **Mitigação**: Usar `ClinicalSession`.
- **Vazamento de PII (LGPD)**: Armazenar nomes de pacientes.
  - **Mitigação**: Campo `initials` estritamente limitado a iniciais.

## 3. Riscos Moderados
- **Escalabilidade do Seed**: A carga de 24 medicamentos e dezenas de sintomas deve ser rápida e idêntica em todos os ambientes.
  - **Mitigação**: Script de seed robusto com `upsert`.

## 4. Matriz de Risco

| Risco | Impacto | Probabilidade | Severidade |
| :--- | :--- | :--- | :--- |
| Conflito de Nomes | Alto | Média | **Crítica** |
| Erro de Carga Seed | Médio | Alta | **Moderada** |
| Inconformidade LGPD | Crítico | Baixa | **Alta** |

## 5. Ordem de Fixação / Implementação
1. Resolver Nomenclatura (ClinicalSession).
2. Garantir isolamento de dados por `userId`.
3. Validar Schema de Alertas (N:N).
