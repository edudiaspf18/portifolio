# Portfólio · Eduardo Dias

Site pessoal bilíngue (PT/EN) de Eduardo Dias, AI Engineer em formação: hero, trajetória, projetos (landing pages reais), stack e contato. Rotas `/pt` e `/en`, tema claro/escuro, SEO completo (metadata, hreflang, JSON-LD, sitemap, OG image, favicon gerado).

## Stack

Next.js 16 (App Router, RSC) · React 19 · TypeScript · Tailwind v4 · shadcn/ui · next-intl · next-themes · motion · Vitest · Playwright.

## Estrutura

- `app/[locale]/` layout, página, not-found localizado, catch-all 404 e OG image por idioma
- `app/icon.tsx`, `app/apple-icon.tsx` favicon (monograma ED)
- `components/sections/` seções da página (hero, timeline, projects, stack, contact, footer)
- `content/` dados tipados: `projects.ts`, `stack.ts`, `timeline.ts`, `socials.ts`
- `messages/pt.json`, `messages/en.json` todo o texto (mesmas chaves nos dois, validado por teste)
- `public/projects/` screenshots dos projetos · `public/curriculo-eduardo-dias-{pt,en}.pdf` currículos gerados
- `scripts/shots.ts` gerador de screenshots · `tests/unit`, `tests/e2e`

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` / `npm start` | build e servidor de produção |
| `npm run lint` | ESLint |
| `npm run typecheck` | `next typegen` + `tsc --noEmit` |
| `npm test` | testes unitários (Vitest) |
| `npm run e2e` | Playwright; builda com `NEXT_PUBLIC_SITE_URL=http://localhost:3100` e sobe na porta 3100 |
| `npm run shots` | gera `public/projects/<id>.jpg` |

## Variável de ambiente

`NEXT_PUBLIC_SITE_URL` (ex: `https://seudominio.com.br`) DEVE estar definida no build. Sem ela, canonical, hreflang, sitemap, robots, OG e JSON-LD apontam para `http://localhost:3000`.

Atenção: `npm run e2e` builda em `.next` com `localhost:3100`. Rebuilde com a URL real antes de publicar.

## Screenshots dos projetos (`npm run shots`)

Para cada projeto, tenta a URL ao vivo; se falhar ou não houver, sobe `npm run dev` dentro da landing irmã em `~/DevWeb` (pode criar/atualizar `.next`, `next-env.d.ts` e `tsbuildinfo` nesses projetos; nenhum código-fonte é editado). Raiz alterável com `SHOTS_ROOT`. Um projeto só: `npm run shots -- --only <id>`.

## Identidade e movimento

- Tema claro é o padrão (papel `#f5f2eb`, tinta quente, sinal laranja); o escuro é opt-in via toggle. Tokens (`--signal`, `--signal-ink`, `--ring`, fontes, animações `marquee`, `word-up`, `draw`) em `app/globals.css`.
- Movimento em `components/motion/*` (reveal, magnetic, contador, relógio, barra de progresso, marquee). Todo movimento respeita `prefers-reduced-motion`; sem JS o conteúdo continua visível (as animações simplesmente não aparecem).
- Lighthouse: a performance varia de 91 a 96 entre execuções nesta máquina (LCP ~100–200 ms, CLS 0; acessibilidade, boas práticas e SEO são 100), então a meta "≥ 95" só é atingida em algumas execuções. Falham no laboratório o LCP simulado e o CSS que bloqueia renderização; várias correções foram tentadas sem ganho confiável.
- Foto da seção Sobre: `public/images/eduardo.jpg`. Para gerar de novo:

```bash
sips -s format jpeg -s formatOptions 82 -Z 800 "foto perfil/foto minha.png" --out public/images/eduardo.jpg
```

`foto perfil/` está no `.gitignore` (original nunca vai para o repositório).

## Currículo

- Rota A4 sem header do site: `/pt/curriculo` e `/en/curriculo` (`app/[locale]/curriculo/page.tsx`, `noindex`). Dados fixos em `content/profile.ts`; o resto vem das mensagens.
- PDFs commitados em `public/curriculo-eduardo-dias-{pt,en}.pdf`. Para regenerar: `npm run build && npm start -- -p 3100` e, em outro terminal, `npm run resume` (usa `BASE_URL`, padrão `http://localhost:3100`; ex.: `BASE_URL=http://localhost:3000 npm run resume`).
- Os botões do hero e do contato baixam o PDF do idioma atual.

## Como editar

- Adicionar projeto ou trocar URL ao vivo: `content/projects.ts` (campo `url`; `null` mostra "Em breve"), incluir `niche` e `description` em `messages/*.json` (`projects.items.<id>`), rodar `npm run shots -- --only <id>`.
- Textos: `messages/pt.json` e `messages/en.json`, sempre com as mesmas chaves.
- Stack, trajetória e redes: `content/stack.ts`, `content/timeline.ts`, `content/socials.ts`.
- Currículo: ver seção "Currículo".

## Deploy

Qualquer host com Node (ex: Vercel). Defina `NEXT_PUBLIC_SITE_URL` no ambiente de build, rode `npm run build` e `npm start`. Confira `/sitemap.xml` e o canonical após publicar.
