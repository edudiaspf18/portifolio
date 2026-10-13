# Rodada 2 — hero com saudação, órbita de stack, formas suaves, 4 landings, Sobre reescrito e currículo — Design

Data: 2026-10-14 · Base: branch `feat/about-motion` · Estende `2026-10-13-about-motion-design.md`

## Objetivo
Corrigir o que o Eduardo apontou depois de ver a rodada 1: o hero deve se apresentar como pessoa antes de cargo; o carrossel de texto parece genérico de IA; o visual ainda é "quadrado demais"; só quatro landings devem aparecer; o "Sobre mim" precisa de uma copy melhor e com o projeto Caminu; e o portfólio ganha um currículo com o mesmo design, disponível para download.

## Fora de escopo
Blog, CMS, banco, formulário com backend, GSAP/Lenis/WebGL, publicar o repositório do Caminu, qualquer link para repositório privado.

## Regras mantidas (house rules)
Server Components por padrão; `'use client'` só com estado/eventos; sem `useEffect`; nunca `any`; só Tailwind (exceções em `globals.css`: tokens, `@theme`, keyframes, `bg-dots`); shadcn + `cn()`; `hover:`, `focus-visible:` (nunca `focus:`), `transition-all duration-200 ease-in-out` (exceções já registradas na spec da rodada 1); base quente + UMA cor de destaque laranja; sem gradiente de cor, glow, glassmorphism, sombra pesada, animação bouncy; reduced-motion e sem JS mantêm tudo visível; textos só em `messages/*` com paridade pt/en.
**Exceção explícita aprovada pelo Eduardo:** logos de tecnologia (TypeScript, React etc.) não existem no lucide. Podem ser SVG inline da biblioteca Simple Icons (CC0), restritos à órbita da stack e ao currículo. Todo o resto continua só `lucide-react`.

## 1. Hero com saudação primeiro
- `h1` gigante: "Olá, eu sou *Eduardo Dias.*" (EN: "Hi, I'm *Eduardo Dias.*"), mesma animação de palavras e traço laranja desenhado sob "Dias". O ponto final continua laranja. Na linha mono acima do título, em vez do nome repetido, "pode me chamar de Dias" (EN: "you can call me Dias"): toque pessoal alinhado ao Instagram de conteúdo, sem tirar o nome completo do h1 (SEO por nome e tom profissional).
- Logo abaixo, em serifada grande (~40% do tamanho do h1): "AI Engineer em formação, foco em *Claude*." (EN: "AI Engineer in training, focused on *Claude*."). É um `<p>` com `font-display`, visível sem rolar. O cargo continua em `<title>`, meta description, OG e JSON-LD `jobTitle` (não mudam).
- Mantidos: linha mono com relógio ao vivo de Anápolis, subtítulo, CTAs magnéticos, status "Agora: ...".
- Novo: círculos concêntricos em linha fina (SVG decorativo, `aria-hidden`) no terço direito do hero, com um ponto laranja pequeno percorrendo o círculo médio (CSS, lento). Sem gradiente. Reduced-motion: ponto parado.
- Mensagens: `hero.greeting` ("Olá, eu sou"), `hero.name` ("Eduardo Dias"), `hero.nickname`, `hero.role` (a frase do cargo), `hero.roleKeyword` ("Claude"). Remover `titleLead/titleFocus/titleKey`. Manter `hero.title` e `hero.eyebrow` (usadas pela imagem OG).

## 2. Marquee sai; órbita de stack entra
- Remover `components/motion/marquee.tsx`, `content/marquee.ts`, `messages.marquee.*` e os testes do marquee; a seção deixa de existir entre hero e Sobre.
- Nova `StackOrbit` (no Sobre, ao redor da foto): anel fino girando devagar (60 s por volta, linear) com fichas circulares (`size-14`, borda 1px, fundo `background`) contendo os logos: HTML5, CSS3, JavaScript, TypeScript, React, Next.js, Tailwind CSS, Figma, Claude. Cada ficha gira em sentido contrário para ficar em pé. **Não pausa no hover**: a ficha sob o cursor cresce 1.15x e mostra o nome em uma etiqueta pílula; a mesma etiqueta aparece com `focus-visible`.
- Acessibilidade: lista `<ul aria-label>`; cada item tem o nome em `sr-only`; os SVGs são `aria-hidden`. Reduced-motion: anel e fichas estáticos, distribuídos no círculo.
- Logos: gerados por `scripts/gen-stack-icons.ts` a partir do pacote `simple-icons` (devDependency, só para gerar) para `content/stack-icons.ts` (commitado; cada item `{ id, name, path, hex }`, com `path` do Simple Icons). Nenhuma cor de marca é usada: todos os logos em `currentColor` (tinta), para manter a base monocromática.
- A órbita é puro CSS (`@keyframes` em `globals.css`, exceção já permitida) e Server Component; só o rótulo no hover usa CSS (`group-hover`).

## 3. Foto circular e formas suaves (design geral)
- `--radius: 1rem` (shadcn herda). Botões e badges em pílula (`rounded-full`). Cards e contêineres de imagem `rounded-[2rem]`, sem sombra, borda 1px.
- Foto do Sobre: círculo (`rounded-full`) com 2 anéis concêntricos finos e o ponto laranja orbitando o anel interno; remover o bloco laranja quadrado deslocado; a etiqueta "Anápolis, GO" vira pílula rotacionada leve.
- Divisor de seção: substituir `border-t` reto por `CurveDivider` (SVG de uma curva suave de 1px, `stroke` = cor da borda); número da seção dentro de um círculo (`size-9 rounded-full border`).
- Nav ativa: ponto laranja sob o item (não sublinhado reto). Campos de contato com hover em pílula suave (`hover:bg-muted rounded-full`).
- Timeline: mantém círculos; linha continua laranja.
- Linhas de ênfase: separadores finos; barra de hover vira um ponto/arco laranja à esquerda (círculo `size-3` que cresce) em vez de barra reta.
- Paleta, serifada e tipografia mantidas. Sem sombra, sem preenchimento colorido em cards: a suavidade vem de curvas, círculos e linhas, não de "cartão arredondado com sombra".

## 4. Só quatro landings
- Manter: `charles`, `alianca`, `cecilia`, `esther` (grade 2×2). Remover `evelyn`, `angelica`, `winner` de `content/projects.ts`, `messages.projects.items`, `scripts/shots.ts` e `public/projects/{evelyn,angelica,winner}.jpg`. Remover a regra de card em destaque (`featured`).
- URLs ao vivo: só `esther` (`https://www.estherduartenutri.com.br`). Os demais mostram "Em breve" até o Eduardo informar a URL.
- Stat "sites entregues" (7) → "landings" (4): `stats.id: 'landings'`, `value: 4`; label PT "landings entregues", EN "landing pages delivered". Demais estatísticas inalteradas.
- JSON-LD/SEO inalterados.

## 5. Sobre mim, nova copy (somente fatos do Eduardo)
Texto (PT; EN equivalente):
- `lead`: "Comecei pela base: montagem e manutenção de computadores, redes e muito desenvolvimento no Técnico em Informática para Internet."
- `body1`: "Desde o fim do técnico, pratico HTML5, CSS3 e JavaScript ES6+. A rotina de TI na BAAN, resolvendo problema de usuário de verdade, me ensinou a projetar para quem usa e me ajudou a virar o dev que sou hoje."
- `body2`: "Na prática, aprendi SEO e construo landing pages de alta conversão: rápidas, claras e feitas para levar a pessoa à ação."
- `body3`: "Agora meu foco é AI Engineering, com Claude. Estou no 5º período de Engenharia de Software e atuo em um projeto em React Native, o Caminu."
- Bloco **Projeto em andamento**: "Caminu — app que monta o roteiro da sua viagem com IA integrada: sugere os melhores destinos e pontos turísticos, é totalmente acessível para PcD, pet friendly e propõe roteiros que fogem do mais do mesmo." Chip "React Native". **Sem link** (repositório privado).
- Linguagens de ênfase e números mantidos (números com `landings`).

## 6. Currículo no mesmo design, para download
- Rota `app/[locale]/curriculo/page.tsx` (`/pt/curriculo`, `/en/curriculo`), layout de impressão A4 vertical, **sem header/progresso/skip link do site**. Para isso, reorganizar com route group: `app/[locale]/(site)/layout.tsx` (header, `ScrollProgress`, `<main id="content">`) com `page.tsx` e `[...rest]` movidos para `(site)`; `app/[locale]/layout.tsx` fica só com `html`, fontes, providers. `curriculo` fica fora do grupo (sem chrome do site). `metadata.robots = { index: false }` na rota do currículo (evita conteúdo duplicado; o PDF continua público).
- Design: papel `#F5F2EB` (impresso com `print-color-adjust: exact` via Tailwind `print:` utilitários e `printBackground` no Playwright), nome em Instrument Serif grande, cargo em itálico, foto circular pequena com anel fino e ponto laranja, curva fina como divisor, seções em duas colunas (principal: Perfil, Experiência, Projetos; lateral: Contato, Formação, Stack com logos monocromáticos em fichas circulares, Certificação, Idiomas). Uma página A4.
- Conteúdo (fonte: mensagens + `content/*`): contatos (e-mail, telefone, LinkedIn, GitHub, Instagram, Anápolis/GO); Perfil (3 linhas, versão curta do Sobre); Experiência: Desenvolvedor Front-End Júnior (Winner Tecnologia, mar/2025–atual), Técnico de TI (Winner, 2020–mar/2025), Auxiliar de TI (BAAN, 2021–mar/2025); Formação: Engenharia de Software (UniEVANGÉLICA, 5º período, previsão jun/2028), Técnico em Informática para Internet (CPET, 2022–2023); Projetos: as 4 landings (nome, nicho, tags) + Caminu; Stack; Certificação: Scrum Foundation; Idiomas: Português nativo, Inglês básico. Nada além disso.
- PDFs: `scripts/resume-pdf.ts` (Playwright `page.pdf({ format: 'A4', printBackground: true, margin: 0, preferCSSPageSize: false })`) lê `BASE_URL` (padrão `http://localhost:3100`) e grava `public/curriculo-eduardo-dias-pt.pdf` e `public/curriculo-eduardo-dias-en.pdf` (commitados). `npm run resume`. Remover `public/curriculo-eduardo-dias.pdf` (antigo, FAB/BAAN em dois cargos) e o PDF original da raiz não é tocado.
- Download: botão do Contato e um link discreto no hero apontam para o PDF do idioma atual (`/curriculo-eduardo-dias-{locale}.pdf`, atributo `download`); mensagens `contact.resume` e `hero.ctaResume`.

## Dados, i18n e SEO
Novas/alteradas chaves em `messages/pt.json` e `en.json` (paridade garantida pelo teste existente): `hero.*`, `about.*` (copy, `caminu`, `orbit.label`), `stats.landings`, `resume.*` (rótulos de seção do currículo), `contact.resume`, `hero.ctaResume`. `content/stack-icons.ts` novo. Lighthouse: manter acessibilidade 100; performance segue a oscilação já registrada.

## Erros e bordas
- Foto ausente: placeholder "ED" também circular (já existe).
- Reduced-motion: sem rotação da órbita, sem ponto orbitando, sem parallax; tudo visível. Sem JS: CSS roda; conteúdo visível.
- Impressão: o currículo cabe em 1 página A4 em PT e EN (teste mede a altura em `emulateMedia('print')`).
- Touch: etiquetas das fichas visíveis com foco/toque (focus-visible) e sem depender de hover.

## Testes
- Unit: `content/stack-icons` com 9 itens, `path` não vazio; paridade pt/en; projetos = exatamente `charles, alianca, cecilia, esther`; stats `landings = 4`; PDFs existem e começam com `%PDF`.
- e2e: hero com "Olá, eu sou" no h1 e o cargo logo abaixo (EN também); marquee ausente; órbita com 9 itens acessíveis, anel estático em reduced-motion, sem pausa no hover (a animação continua rodando com o mouse sobre a ficha); cards 4 (1 link, 3 "Em breve"); Sobre com texto do Caminu e sem link para ele; `/pt/curriculo` e `/en/curriculo` sem header do site, com nome e seções; altura ≤ 1123 px em print; link de download em cada idioma serve `application/pdf`; 375px sem overflow; contraste e a11y 100 no Lighthouse.
- Os testes existentes que referenciam 7 projetos, `featured`, `marquee` e `stat-sites` são atualizados (nunca relaxados).

## Pendências do Eduardo
- URLs ao vivo de Charles, Aliança e Cecília (hoje "Em breve"); `npm run shots` com internet para prints dos sites no ar.
- Confirmar a copy nova do Sobre e do currículo; texto do Caminu foi escrito a partir da sua descrição.
- Se o repositório do Caminu virar público, passar a URL para adicionar o link.
