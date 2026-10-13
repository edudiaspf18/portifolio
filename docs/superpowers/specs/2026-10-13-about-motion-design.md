# Sobre mim + sistema de movimento + nova identidade visual — Design

Data: 2026-10-13 · Base: branch `feat/portfolio` (PR #1) · Estende `2026-10-12-portifolio-design.md`

## Objetivo
O portfólio é a porta de entrada para quem quer ver o trabalho de Eduardo: quem ele é, o que sabe fazer e a qualidade de UI/UX do próprio site. O site atual é estático e sem vida (fundo escuro chapado, só a timeline anima). Esta entrega adiciona uma seção **Sobre mim** com foto, um sistema de movimento em todo o site e uma identidade visual própria, fugindo da estética genérica de sites gerados por IA.

## Fora de escopo
Blog, CMS, banco, formulário com backend, WebGL/3D, GSAP, Lenis, qualquer dependência nova de animação (usar `motion`, já instalado).

## Regras mantidas (house rules)
Server Components por padrão; `'use client'` só com estado/eventos; sem `useEffect` (relógio via `useSyncExternalStore`); nunca `any`; só Tailwind (tokens de tema em `globals.css` são a única exceção); shadcn + `cn()`; ícones só `lucide-react`; interação com `hover:`, `focus-visible:` (nunca `focus:`) e `transition-all duration-200 ease-in-out`; monocromático + UMA cor de destaque; sem gradiente, sem glow pesado, sem glassmorphism, sem animação bouncy; bordas 1px; `shadow-sm` no máximo. Tudo respeita `prefers-reduced-motion` e permanece visível sem JS (padrão `noscript:` já usado na timeline).

## Identidade visual
- **Tipografia:** Instrument Serif (display, itálico nos destaques) + Geist Sans (corpo) + Geist Mono (metadados, numeração). Carregadas com `next/font` (sem layout shift).
- **Claro (padrão, `defaultTheme="light"`, `enableSystem={false}`):** papel `#F5F2EB`, tinta zinc-950, linhas 1px zinc-300, destaque laranja `#FF5A1F`.
- **Escuro (toggle):** tinta quente `#0E0D0B`, texto `#F2EFE8`, grade de pontos a 4% de opacidade, mesmo laranja.
- Cantos retos, seções numeradas (`01 — Sobre`), linhas finas, nada flutuante. Laranja apenas como destaque com propósito (traço sob "Claude", barras, números, hover).
- Contraste: texto pequeno em laranja usa `#C2410C`-equivalente no claro (≥ 4.5:1); validar no Lighthouse (a11y 100).

## Seções (ordem final)
1. **Hero** — título display gigante "AI Engineer em formação, *foco em Claude.*" com revelação palavra a palavra e traço laranja desenhado (SVG path) sob "Claude". Linha mono com **relógio ao vivo de Anápolis** (fuso America/Sao_Paulo) e status "Agora: estudando Next.js, construindo com Claude Code". CTAs magnéticos.
2. **Marquee** — faixa contínua: TypeScript · React · Next.js · Tailwind · Claude · Figma · SEO. Pausa no hover; estática com reduced-motion.
3. **`01 — Sobre mim` (`#about`, nova)** — grid 12 colunas.
   - Foto (5 col): `foto perfil/foto minha.png` convertida para `public/images/eduardo.webp` (~800px, otimizada). Recorte quadrado, bloco laranja chapado deslocado atrás, moldura 1px, etiqueta rotacionada "Anápolis, GO". Revela com `clip-path`; parallax leve no scroll. `alt` descritivo traduzido.
   - Texto (7 col), somente fatos do currículo: cinco anos em suporte técnico (Winner, BAAN/FAB), front-end e UX com Figma desde mar/2025, AI Engineering com foco em Claude desde set/2026, cursando Engenharia de Software (UniEVANGÉLICA, previsão jun/2028). Rascunho para o Eduardo editar em `messages/*.json`.
   - **Linguagens de ênfase:** linhas grandes (TypeScript, React, Next.js, Tailwind, Claude), cada uma com rótulo "usando" ou "aprendendo". No hover/focus a barra laranja desliza e aparece uma linha "o que faço com isso".
   - **Números** que contam ao entrar na tela (count-up uma vez): 5+ anos em TI, 7 sites entregues (6 landings + Winner Tech), 2 idiomas.
4. **`02 — Trajetória`** — timeline atual, restilizada com os novos tokens (linha laranja).
5. **`03 — Projetos`** — cards com reveal em stagger; hover: print sobe e inclina levemente, etiqueta "Ver site" segue o cursor (só para cards com link). O 7º card (Winner Tech) vira destaque em largura total.
6. **`04 — Stack`**, **`05 — Contato`**, rodapé — restilizados; lista de contato com seta animada no hover.

## Sistema de movimento
`components/motion/`:
- `reveal.tsx` — wrapper `whileInView` (once), variantes `fade-up` e `stagger`; reduced-motion/noscript visíveis.
- `magnetic.tsx` — atrai o elemento ao cursor (raio pequeno); desligado em touch e reduced-motion.
- `marquee.tsx` — CSS keyframes via Tailwind arbitrary utilities; duplica o conteúdo para loop contínuo; `aria-hidden` na cópia.
- `count-up.tsx` — `useInView` + `animate` do `motion`; valor final presente no HTML SSR (SEO/no-JS).
- `scroll-progress.tsx` — barra de 2px no topo ligada a `useScroll`.
- `live-clock.tsx` — `useSyncExternalStore` (snapshot servidor `null` para evitar mismatch; atualiza por minuto).
- `parallax.tsx` — `useScroll` + `useTransform` para a foto.
Header ganha link "Sobre" e destaque do item ativo (`useInView` por seção, sem `useEffect` próprio).

## Dados e i18n
Novas chaves em `messages/pt.json` e `en.json` (paridade garantida pelo teste): `nav.about`, `about.*` (título, parágrafos, rótulos, alt da foto, números, linhas de ênfase com descrição), `hero.*` revisado, `now.*` (status), `marquee.*` se necessário. `content/emphasis.ts` (ids e estado usando/aprendendo) e `content/stats.ts` (valores numéricos). Textos nunca hardcoded em componentes.

## Performance e SEO
Foto via `next/image` (`priority` apenas se acima da dobra, senão lazy), dimensões explícitas, WebP. Fontes com `display: swap`. JSON-LD `Person` ganha `image`. Meta: Lighthouse ≥ 95 nas quatro categorias em `/pt` e `/en`; sem layout shift (CLS ≈ 0).

## Erros e bordas
- Foto ausente: a seção renderiza placeholder zinc com iniciais "ED" (nunca imagem quebrada); teste cobre via função testável como `hasShot`.
- JS desligado: todo conteúdo visível, números no valor final, marquee estático.
- Reduced motion: sem parallax, sem magnetismo, sem marquee animado, sem count-up (valor final), reveal instantâneo.
- Touch: sem efeitos de cursor (magnetic, etiqueta "Ver site").
- Relógio: fuso fixo America/Sao_Paulo; falha de `Intl` → omite o horário, mantém o local.

## Testes
- Unit: paridade de chaves pt/en (já existe), `content/emphasis` e `stats` coerentes com as mensagens, helper de foto presente/ausente.
- e2e (Playwright): seção `#about` visível com foto carregada (`naturalWidth > 0`); contadores chegam ao valor final; marquee presente; reduced-motion e `javaScriptEnabled:false` mostram tudo; tema claro por padrão (`html` sem classe `dark` com `colorScheme: 'dark'` do sistema) e toggle funciona; 375px sem overflow; header com link ativo muda ao rolar; zero erro de console.
- `lint`, `typecheck`, `next build`, Lighthouse ≥ 95.

## Pendências do Eduardo
- Revisar o texto de "Sobre mim" (rascunho baseado só no currículo).
- Confirmar "7 sites entregues" e "5+ anos em TI".
- Confirmar o status "Agora: estudando Next.js, construindo com Claude Code".
