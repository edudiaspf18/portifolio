# Rodada 3 — cortina de abertura, ritmo, trajetória, projetos (6), contato, ênfase e stack — Design

Data: 2026-10-14 · Base: branch `feat/about-motion` (após a rodada 2) · Estende as specs de 2026-10-12, 2026-10-13 e 2026-10-14 (rodada 2)

## Objetivo
Aplicar o feedback do Eduardo após ver a rodada 2: abertura com cortina e o monograma; menos espaço morto entre seções; trajetória sem vazio à direita; Caminu sai do Sobre e vira projeto acadêmico em Projetos, junto com o site da Winner; contato e linguagens de ênfase deixam de ser listas; animação de projetos menos "IA genérica"; hero sem "foco em Claude"; stack com ícone + nome por item, em três grupos, com C em Noções.

## Fora de escopo
Blog, CMS, banco, formulário com backend, GSAP/Lenis/WebGL, link para o repositório privado do Caminu, mudança de paleta/fontes.

## Regras mantidas
House rules das specs anteriores (Server Components, sem `useEffect`, sem `any`, só Tailwind com as exceções de `globals.css`, lucide, `hover:`/`focus-visible:`/`transition-all duration-200`, base quente + um laranja, sem gradiente/glow/sombra, reduced-motion e sem JS mantêm tudo visível, mensagens pt/en com paridade).
**Exceção dos logos (Simple Icons, CC0, `currentColor`) estendida** para: órbita do Sobre, medalhões de ênfase, grade da Stack, fichas do Contato (LinkedIn, GitHub, Instagram, WhatsApp) e currículo. Aprovado pelo Eduardo.
`'use client'` com estado é permitido onde há interação real: botão "copiar e-mail".

## 1. Cortina de abertura
- Overlay em cor de papel cobrindo a viewport, com o monograma "ED" ao centro (iniciais em serifada dentro de um círculo de linha fina, com o ponto laranja; derivado da identidade do `app/icon.tsx`, que mantém o fundo escuro e a barra laranja). Sequência (CSS puro, ~1,4 s): monograma surge e o ponto laranja faz meia volta (0–0,6 s); a cortina se abre em **duas folhas** (esquerda e direita deslizam para fora, 0,7–1,3 s); overlay termina `visibility: hidden` + `pointer-events: none` via `animation-fill-mode: forwards`.
- **Uma vez por sessão:** script inline mínimo antes do overlay (padrão do `next-themes`, sem `useEffect`) lê `sessionStorage.getItem('intro-seen')`; se existir, marca `document.documentElement.dataset.intro = 'seen'` e o overlay nem renderiza visualmente (`[data-intro=seen] &:hidden`); se não existir, grava a chave. Sem JS: cortina roda em toda visita (aceito). `prefers-reduced-motion`: fade de 300 ms, sem folhas.
- Acessibilidade: `aria-hidden`, não bloqueia foco após terminar; o conteúdo já está renderizado por baixo (LCP real não espera a cortina, mas o Lighthouse pode pontuar a cortina como LCP: registrar nos resultados).

## 2. Ritmo entre seções
- `py-24` → `py-16 md:py-20`; `mt-16` após títulos → `mt-12`; `mt-24` da lista de ênfase → `mt-16`; rodapé mais próximo do contato. Alvo: nenhum trecho com mais de ~96 px de vazio vertical entre blocos em 1440 px.

## 3. Trajetória sem vazio à direita
- Cada marco vira uma linha de grade em 12 colunas: **ano em serifada gigante** (`font-display`, ~5rem) nas 3 primeiras colunas, `sticky top-28` dentro do próprio item; conteúdo nas 9 colunas restantes ocupando a largura toda (sem `max-w-xl`), com a linha laranja de progresso à esquerda do conteúdo (mesma animação `useScroll`/`useSpring`). Nó do item vira círculo de 12 px com anel fino; o marco de IA é preenchido de laranja.
- À direita de cada conteúdo, um **círculo decorativo fino** (`aria-hidden`) com o número do marco (01…06) para fechar a composição. Em `< md`, o ano fica acima do conteúdo (sem sticky).

## 4. Projetos (6) e animação nova
- Grade: `md:grid-cols-2 lg:grid-cols-3`, 6 cards numerados **01–06**: Charles Veículos, Aliança Móveis, Dra. Cecília Fontoura, Esther Duarte, **Winner Tech** (site institucional; print gerado pelo `shots.ts` a partir do projeto irmão `winner-tech`; URL ao vivo `null` até o Eduardo informar), **Caminu** (etiqueta "Projeto acadêmico · UniEVANGÉLICA", chip React Native, sem link e sem print: ilustração SVG própria em círculos e pontos de rota em linha fina, `aria-hidden`).
- Caminu sai do Sobre: o `CaminuCard` é removido; `about.body3` passa a citar "um projeto acadêmico em React Native, o Caminu (veja em Projetos)". Descrição completa fica no card de Projetos (mensagens `projects.items.caminu`).
- **Animação nova** (sem fade-up, sem zoom, sem barra no topo): o card **revela com `clip-path: circle()` crescendo** do canto inferior esquerdo (stagger por coluna); o print tem **parallax interno leve** ao rolar (`useScroll` no card, ±10 px); no hover a **borda do card se desenha** (SVG `rect` arredondado com `stroke-dashoffset` indo a 0 em 600 ms) e o print **sobe 12 px**; a etiqueta "Ver site" seguindo o cursor fica nos cards com URL. Reduced-motion e sem JS: tudo visível, borda estática.
- Stat "landings entregues" continua 4 (Winner e Caminu não são landings).

## 5. Contato
- Sai a lista. Layout em 12 colunas: à esquerda (7) título serifado + subtítulo + **dois botões-pílula grandes**: **WhatsApp** (laranja, principal, abre `wa.me`) e **E-mail** (contorno; ao clicar copia `dududiaspf@gmail.com` e mostra "Copiado" por 2 s; fallback: `mailto:` se a área de transferência falhar; é um componente client com estado); abaixo, o botão "Baixar currículo" (mantido).
- À direita (5): **fichas circulares** com os logos LinkedIn, GitHub, Instagram e WhatsApp em uma órbita lenta (mesmo padrão visual do Sobre, 80 s, sem pausa no hover), cada ficha é um link real com nome acessível (`sr-only`) e `target=_blank rel="noopener noreferrer"`; no centro, o e-mail em mono. Reduced-motion: fichas paradas.
- Mobile: botões empilhados; as fichas viram uma linha de 4 círculos (sem órbita).

## 6. Hero e metadados sem "foco em Claude"
- `hero.role` vira "AI Engineer em formação." (EN "AI Engineer in training."); `hero.roleKeyword` removida; o ponto final é laranja. `meta.description` sem Claude: "Portfólio de Eduardo Dias: AI Engineer em formação, landing pages de alta conversão e SEO. Anápolis, GO." (EN equivalente). `meta.jobTitle`, título e OG não mudam. O currículo usa a mesma linha de cargo (sem Claude); o perfil do currículo mantém a frase sobre Claude. Sobre (texto, órbita) e Stack continuam citando Claude.

## 7. Linguagens de ênfase → medalhões
- Sai a lista. Entram **5 medalhões circulares** (TypeScript, React, Next.js, Tailwind, Claude), ~11 rem, borda 1px, logo ao centro, nome em serifada abaixo, status em mono ("aprendendo" em laranja / "usando") e descrição curta **sempre visível** (não depende de hover). Em `< lg`: rolagem horizontal com `scroll-snap`. Hover/focus: medalhão sobe 4 px e a borda fica tinta. Sem links (as âncoras para `#stack` saem).

## 8. Stack com ícone + nome, em três grupos, com C
- `content/stack.ts` passa a ser estruturado: `{ id, name, icon: { kind: 'si', id } | { kind: 'lucide', name }, group: 'using' | 'learning' | 'basic', note? }`. Itens: **Uso no dia a dia**: HTML5, CSS3, JavaScript, Tailwind CSS, shadcn/ui, Figma, Claude Code, SEO (lucide `Search`), GA4 (googleanalytics), GTM (googletagmanager). **Estudando agora**: TypeScript, React, Next.js, React Native (logo React), Claude API, Agent SDK (logo Claude). **Noções**: WordPress, PHP, Power BI (lucide `ChartColumn`, Simple Icons não tem), Office (lucide `FileText`), **C** (Simple Icons `c`) com nota "visto nos primeiros períodos da faculdade".
- Cada item: ficha circular (`size-16`) com o ícone + nome embaixo; grade `grid-cols-3 sm:grid-cols-4 lg:grid-cols-6`; cada grupo com título mono e uma linha de introdução (mensagens). A nota do C aparece sob o nome em mono pequeno.
- `scripts/gen-stack-icons.ts` gera também: `c`, `shadcnui`, `googleanalytics`, `googletagmanager`, `wordpress`, `php`, `github`, `instagram`, `whatsapp`, e um `linkedin` **desenhado à mão** (Simple Icons não distribui mais a marca LinkedIn): path simples de "in" em círculo, criado no repositório (não é marca registrada da biblioteca; uso nominativo).

## Dados, i18n, SEO
Mensagens novas/alteradas em pt e en: `intro.label` ("Abrindo o site…" para `aria-label` do overlay), `hero.role` (sem keyword), `meta.description`, `about.body3`, `projects.items.{winner,caminu}` + `projects.academic`, `projects.kinds.*` se necessário, `contact.{whatsapp,email,copy,copied,orbitLabel}`, `stack.{intro.using,intro.learning,intro.basic,notes.c}`, `about.emphasis.*` mantidas. `content/projects.ts` com `kind: 'landing' | 'site' | 'academic'` e `image: boolean`. JSON-LD inalterado (exceto description). Sitemap/robots/OG inalterados.

## Erros e bordas
- Cortina: `sessionStorage` indisponível (modo privado) → cortina roda; erro no script é engolido (try/catch). Sem JS: roda e some via CSS. Reduced-motion: fade.
- Projetos sem print (Caminu, ou Winner se `shots` falhar): ilustração/placeholder, nunca imagem quebrada.
- Copiar e-mail: `navigator.clipboard` ausente ou negado → abre `mailto:`.
- Timeline: anos repetidos (2020, 2021…) não se sobrepõem no sticky (cada item tem o próprio sticky, limitado à altura do item).
- 375 px: sem overflow em todas as seções (medalhões com snap, fichas de contato em linha, cards em coluna).

## Testes
- Unit: `content/stack.ts` (todo item com ícone resolvível: `si` existe em `stack-icons`, lucide nomeado), `projects` com 6 ids e `kind`, `stats.landings = 4`, paridade pt/en, `stack-icons` ≥ 18 itens.
- e2e: cortina presente no primeiro carregamento e `visibility: hidden` após ≤ 2 s; segunda navegação no mesmo contexto não mostra a cortina (`data-intro=seen`); reduced-motion termina em ≤ 0,5 s; sem JS termina oculta; hero sem "Claude" na linha do cargo e meta description sem "Claude"; trajetória com 6 anos em coluna e conteúdo ocupando ≥ 60% da largura do contêiner em 1440; projetos 6 cards, 1 link (Esther), Caminu com "Projeto acadêmico" e sem link, borda SVG presente, reveal visível em reduced-motion/sem JS; contato: botão WhatsApp com `wa.me`, botão e-mail copia (permissão `clipboard-read/write` no contexto) e mostra "Copiado", 4 fichas com links corretos; medalhões 5 com descrição visível sem hover; stack 3 grupos, 21 itens com nome visível, nota do C; ritmo: distância vertical entre o fim de uma seção e o título da próxima ≤ 160 px em 1440; 375 px sem overflow; a11y 100 no Lighthouse; currículo regenerado (cargo sem Claude).

## Divergências
- §8: o path do `linkedin` não foi desenhado à mão; é o glifo da marca LinkedIn que o Simple Icons distribuía, usado de forma nominativa. O cabeçalho de `content/stack-icons.ts` registra isso.
- Ritmo (§2): o teste mede o contrato de padding das seções, não a distância visual entre título e conteúdo.
- Trajetória (§3): a linha vertical é um elemento próprio com progresso por scroll, alinhado à coluna de anos, em vez de borda por item. Conteúdo com `md:pr-16` para não passar sob o círculo numerado.
- Projetos (§4): o reveal circular usa um wrapper com `useInView` (`project-reveal.tsx`); a geometria da moldura (`project-frame.tsx`) é feita por CSS.
- Contato (§5): o botão de currículo é pílula com contorno (não preenchida); só o WhatsApp usa a cor de destaque. `socials` monta e-mail e WhatsApp a partir de `contactEmail`/`whatsappHref`.
- Cortina (§1): em reduced motion o atraso do hero é 0,3 s, aplicado só quando a cortina ainda não foi vista.
- Resolvido: o resumo do currículo (`resume.summary`) também perdeu "foco em Claude" (pt e en).
- LCP: em viewport desktop (1440) o elemento LCP é o h1 (~48 ms). Em viewport móvel (412) e no Lighthouse é o parágrafo do hero (~1,22 s medido; 3,6 s simulado), igual em contexto novo e com `intro-seen`: o atraso vem do `Reveal` (delay 0,5 s) do bloco do parágrafo, não da cortina. `--intro-delay` caiu para 0,9 s (só h1 e sublinhado o usam); LCP e Lighthouse (perf 90) não mudaram. Trade-off aceito para não antecipar o Reveal atrás da cortina.

## Pendências do Eduardo
- URL ao vivo do site da Winner Tech, de Charles, Aliança e Cecília.
- Captura do Caminu, se quiser substituir a ilustração.
