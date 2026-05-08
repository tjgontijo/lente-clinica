# Context: Design System & Shadcn UI

**Última atualização:** 2026-05-08

---

## 📌 Definição

O Design System da Lente Clínica traduz a postura de **"Autoridade sem arrogância"**. 
Para implementar isso tecnicamente sem reinventar a roda, **VAMOS USAR SHADCN/UI sim**, mas com uma grande ressalva: não usaremos as cores ou raios padrão dele.

**O que é:**
- O Shadcn servirá como motor de acessibilidade (Radix) e estrutura (DOM).
- O nosso arquivo `colors_and_type.css` será o "tema" injetado por cima do Shadcn, usando os tokens `--lc-*`.

---

## 🧠 A Necessidade de uma Nova Skill

Como você bem notou, agentes de IA tendem a alucinar classes Tailwind genéricas (ex: `bg-blue-500`, `rounded-lg`, `shadow-md`). Se isso acontecer, o projeto perderá a identidade clínica (Teal e tons neutros frios).

Portanto, **é obrigatório criar uma skill (`$lente-design-system`)** antes de codar a UI. 
Esta skill instruirá os agentes a:
1. Sempre usar as variáveis `--lc-` em vez de cores puras do Tailwind (ex: `bg-[var(--lc-teal-600)]`).
2. Usar as fontes Geist e ícones Lucide.
3. Seguir o tom de voz PT-BR sem ordens imperativas (Ex: "Veja as opções", não "Clique aqui!").
4. Aplicar corretamente as hierarquias de alerta (Yellow vs Red).

---

## 🎨 O Casamento Tailwind v4 + Shadcn + Tokens

O fluxo será:
1. O Tailwind v4 extrai as variáveis do `globals.css`.
2. Instalamos um botão do Shadcn (`npx shadcn add button`).
3. Entramos no arquivo `button.tsx` e trocamos o `bg-primary` padrão pelo nosso `bg-[var(--lc-teal-600)] hover:bg-[var(--lc-teal-700)] rounded-[var(--lc-radius-full)]`.
4. Pronto, temos um botão acessível, mas com a exata cara do design system original.
