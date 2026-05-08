# Context: Layout Global (Frontend Shell)

**Última atualização:** 2026-05-08

---

## 📌 Definição

O `Frontend Shell` é a fundação da interface gráfica. Diferente de sistemas ERP (que usam Sidebars pesadas), a Lente Clínica usa uma abordagem "App-like" focada em leitura e tomada de decisão rápida.

**O que é:**
- Um Top Nav (Menu Superior) leve e responsivo.
- Um contêiner centralizado (`max-w-5xl` ou similar) que limita o esticamento dos textos para proteger a legibilidade.
- A camada que envelopa a aplicação com provedores de estado global (TanStack Query).

**O que NÃO é:**
- Um dashboard complexo com múltiplos níveis de navegação na esquerda.

---

## 🔄 Fluxo de Navegação Principal

```txt
[Top Nav]
├── Logo Lente Clínica (Leva para Dashboard/Casos)
├── Aba "Meus Casos"
├── Aba "Buscador de Medicações"
└── Dropdown do Usuário (Configurações / Logout)
```

---

## 🎯 Por Que Isso é Crítico?
Se começarmos a desenhar as telas de Sessão ou Lista de Casos sem este "Casco", os desenvolvedores criarão margens e espaçamentos inconsistentes. O `MainShell` garante que todas as páginas futuras herdem o mesmo "respiro" (whitespace) e centralização, garantindo a sensação de um dossiê médico premium.
