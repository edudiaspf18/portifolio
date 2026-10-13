# Portfólio Eduardo Dias — Design

Data: 2026-10-12 · Local: `/Users/user/DevWeb/Sites/portifolio`

## Objetivo
Portfólio pessoal bilíngue (PT/EN), claro/escuro, elegante, clean, direto. Posicionamento: **AI Engineer em formação, foco Claude**. Front-end e UX como base. Alta conversão e SEO provados pelas landings.

## Fora de escopo
Blog, CMS, banco de dados, formulário com backend.

## Stack
Next.js 16 (App Router, RSC) · React 19 · TypeScript estrito (sem `any`) · Tailwind v4 · shadcn/ui · lucide-react · `next-intl` · `next-themes` · `motion` · Playwright (prints + e2e).

## Estrutura
```
app/[locale]/layout.tsx, page.tsx   generateStaticParams pt|en
app/sitemap.ts, robots.ts, opengraph-image.tsx
components/ui/*                     shadcn
components/sections/                hero, timeline, projects, stack, contact
components/                         theme-toggle, locale-switch (client)
content/projects.ts, timeline.ts, socials.ts
messages/pt.json, en.json
scripts/shots.ts                    Playwright
public/projects/*.jpg, public/curriculo-eduardo-dias.pdf
```

## Visual
Zinc monocromático + 1 cor de destaque (definida na implementação). Bordas 1px, `shadow-sm`, títulos `tracking-tight`, whitespace generoso, layout assimétrico, Geist Sans/Mono. Sem gradientes, sem glassmorphism. Transições `transition-all duration-200 ease-in-out`; `hover:` e `focus-visible:` em toda interação.

## Seções
1. **Hero:** "AI Engineer em formação · foco Claude". Subtítulo: front-end, alta conversão, SEO. CTAs: projetos, contato.
2. **Linha do tempo animada** (vertical; linha desenha com scroll; nós revelam; respeita `prefers-reduced-motion`):
   - 2020 Técnico de TI, Winner Tecnologia (até mar/2025)
   - 2021–mar/2025 Auxiliar de TI, BAAN (Base Aérea de Anápolis, Força Aérea Brasileira). Paralelo à Winner.
   - 2022–2023 Técnico em Informática para Internet, CPET
   - 2025-03 Desenvolvedor Front-End Júnior, Winner Tecnologia (presente)
   - 2026-09 Início da especialização em AI Engineering (Claude)
   - 2028-06 Engenharia de Software, UniEVANGÉLICA (previsão; cursando 5º período)
3. **Projetos:** 001 Charles Veículos, 002 AliancaM, 003 Evelyn Rafaela, 004 Cecília Fontoura, 005 Esther Duarte, 006 Angélica Batista, winner-tech. Card: print, nicho, stack, entregas (SEO, GA4, tracking WhatsApp), link ao vivo. Nome do cliente exibido. Links conhecidos: 003 `evelynrafaelanutri.com.br`, 005 `estherduartenutri.com.br`, 006 `dra-angelicabatista.com.br`. Demais: badge "em breve" até URL ser informada.
4. **Stack e aprendizado:** usando (HTML, CSS, JS, Tailwind, shadcn, Figma, Claude Code) vs estudando (TypeScript, React, Next.js, React Native, Agent SDK). WordPress/PHP/Power BI básicos. Scrum Foundation. Idiomas: PT nativo, EN básico.
5. **Contato:** e-mail `dududiaspf@gmail.com`, LinkedIn `/in/eduardo-dias8a924131a`, GitHub `github.com/edudiaspf18`, Instagram `instagram.com/dudu_diaspf`, WhatsApp (62) 99426-7841, download do currículo.

## Dados e i18n
Conteúdo estático tipado, tudo no servidor. `'use client'` só em theme-toggle, locale-switch, timeline. Rotas `/pt` e `/en` com `hreflang`; redirecionamento por `Accept-Language` só no primeiro acesso. Tema via `next-themes` (class, sem flash).

## SEO
Metadata por idioma, JSON-LD `Person`, OG image dinâmica, sitemap com alternates, Lighthouse alvo ≥ 95.

## Erros e bordas
- `shots.ts`: tenta URL ao vivo; falha → `next dev` local da pasta; falha → mantém print anterior e avisa.
- Projeto sem print: placeholder zinc. Link ausente: badge, nunca `href` vazio.

## Testes
`tsc --noEmit`, lint, `next build`. Playwright e2e: troca de idioma, toggle de tema, timeline visível, zero erro de console. Teste de paridade de chaves `pt.json` × `en.json`.

## Pendências
- URLs ao vivo de 001, 002, 004, winner-tech.
- Cor de destaque (padrão escolhido na implementação, ajustável).
