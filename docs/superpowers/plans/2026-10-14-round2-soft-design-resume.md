# Rodada 2 — saudação, órbita, formas suaves, 4 landings, Sobre e currículo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplicar o feedback do Eduardo: hero com saudação, órbita de logos no lugar do marquee, visual com curvas e círculos, só 4 landings, Sobre reescrito (com Caminu) e um currículo A4 no mesmo design, para download.

**Architecture:** Tokens e componentes existentes são ajustados (raio, pílulas, divisor em curva). Hero e Sobre ganham SVG/CSS decorativos (círculos, órbita) sem JS. O currículo é uma rota própria (`/[locale]/curriculo`) fora do chrome do site (route group `(site)`), impressa em PDF por um script Playwright que grava `public/curriculo-eduardo-dias-{pt,en}.pdf`.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind v4, next-intl, motion, Playwright, Vitest, `simple-icons` (devDependency só para gerar os SVGs dos logos).

**Spec:** `docs/superpowers/specs/2026-10-14-round2-soft-design-resume-design.md` (estende `2026-10-13-about-motion-design.md`).

**Working dir / branch:** `/Users/user/DevWeb/Sites/portifolio`, branch `feat/about-motion` (continua nela).

## Global Constraints

- Server Components por padrão; `'use client'` só com estado/eventos; **sem `useEffect`**; nunca `any`; early returns. Só Tailwind (exceções em `app/globals.css`: tokens, `@theme`, `@keyframes`, `bg-dots`). `hover:`, `focus-visible:` (nunca `focus:`), `transition-all duration-200 ease-in-out` (exceções de duração já registradas). Base quente + UMA cor de destaque laranja `#FF5A1F`. Sem gradiente de cor, glow, glassmorphism, sombra, animação bouncy. Reduced-motion e sem JS: tudo visível (`motion-reduce:`/`noscript:` com `!`; `noscript:` é variante nativa do Tailwind 4.3).
- Ícones: só `lucide-react`. **Exceção aprovada pelo Eduardo:** logos de tecnologia como SVG inline do Simple Icons (CC0), apenas na órbita da stack e no currículo, sempre em `currentColor` (sem cores de marca).
- Textos só em `messages/pt.json` e `en.json` (paridade; teste existente exige). Nomes de tecnologia e nomes próprios ficam em `content/`.
- Fatos fixos: e-mail `dududiaspf@gmail.com`; telefone `(62) 99426-7841`; LinkedIn `https://www.linkedin.com/in/eduardo-dias-8a924131a`; GitHub `https://github.com/edudiaspf18`; Instagram `https://www.instagram.com/dudu_diaspf/`; WhatsApp `https://wa.me/5562994267841`; Anápolis, GO. Landings mantidas: Charles Veículos (001), Aliança Móveis (002), Dra. Cecília Fontoura (004), Esther Duarte (005); só Esther tem URL (`https://www.estherduartenutri.com.br`). Caminu: app de roteiros de viagem com IA, React Native, em desenvolvimento; **sem link** (repositório privado).
- Currículo: não inventar fatos; fontes: mensagens e `content/*` já existentes + os dados acima.
- Foto original `foto perfil/foto minha.png` nunca entra no git; o site usa `public/images/eduardo.jpg`.
- Como rodar: `NEXT_PUBLIC_SITE_URL=http://localhost:3100 npm run build && NEXT_PUBLIC_SITE_URL=http://localhost:3100 npx next start -p 3100`; Playwright com cópia temporária da config sem `webServer` (apagar depois); matar a porta 3100 ao final.
- Commits terminam com `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Fora de escopo: blog, CMS, banco, formulário, GSAP, Lenis, WebGL, link do Caminu.

## Review Focus

1. Remoção dos 3 projetos e do marquee não deixa resíduo: chaves de mensagens, imagens, testes, shots, `featured`, `stat-sites`. (Tasks 1, 3)
2. Órbita: não pausa no hover (animação continua), nomes acessíveis (`sr-only`), reduced-motion estático, sem overflow em 375px. (Task 4)
3. Currículo cabe em 1 página A4 em PT e EN, sem header do site, PDF servido como `application/pdf`, texto do PDF não corta/cai fora. (Task 5)
4. Reorganização `(site)`: 404 localizado, skip link, header, sitemap, OG image e rota `/[locale]` continuam funcionando; `curriculo` não indexável. (Task 5)
5. Reduced motion/sem JS: hero (círculos, ponto), foto circular (clip-path), números, órbita. (Tasks 3, 4)

## File Structure

```
app/globals.css                          --radius 1rem; keyframes: orbit, orbit-reverse (remove marquee)
app/[locale]/layout.tsx                  só html/body/providers (header/main saem)
app/[locale]/(site)/layout.tsx           skip link, ScrollProgress, SiteHeader, <main id="content">
app/[locale]/(site)/page.tsx             (movido)         app/[locale]/(site)/[...rest]/page.tsx (movido)
app/[locale]/(site)/not-found.tsx        (movido)
app/[locale]/curriculo/page.tsx          currículo A4
components/curve-divider.tsx             divisor em curva
components/section-heading.tsx           número em círculo + CurveDivider
components/sections/hero.tsx, hero-title.tsx, hero-orbits.tsx
components/sections/about.tsx, about-photo.tsx, stack-orbit.tsx, caminu-card.tsx
components/sections/project-card.tsx, projects.tsx
components/section-nav.tsx, sections/emphasis-list.tsx, sections/contact.tsx, ui tweaks (pílulas)
content/projects.ts, stats.ts, stack-icons.ts (gerado), profile.ts
scripts/gen-stack-icons.ts, scripts/resume-pdf.ts, scripts/shots.ts
lib/orbit.ts
messages/pt.json, en.json
public/curriculo-eduardo-dias-pt.pdf, -en.pdf   (remover public/curriculo-eduardo-dias.pdf, projects/{evelyn,angelica,winner}.jpg)
tests/unit/orbit.test.ts, stack-icons.test.ts, resume-pdf.test.ts (+ ajustes)
tests/e2e/round2.spec.ts, resume.spec.ts (+ ajustes em hero/projects/about/motion/contact/i18n/layout)
```

---

### Task 1: Quatro landings, estatística "landings" e limpeza de conteúdo

**Files:**
- Modify: `content/projects.ts`, `content/stats.ts`, `scripts/shots.ts`, `components/sections/projects.tsx`, `components/sections/project-card.tsx`, `messages/pt.json`, `messages/en.json`, `tests/unit/content.test.ts`, `tests/unit/about-content.test.ts`, `tests/e2e/projects.spec.ts`, `tests/e2e/motion.spec.ts`, `tests/e2e/about.spec.ts`
- Delete: `public/projects/{evelyn,angelica,winner}.jpg`

**Interfaces:**
- Produces: `ProjectId = 'charles' | 'alianca' | 'cecilia' | 'esther'`; `projects` com 4 itens (ordem: charles, alianca, cecilia, esther); `StatId = 'years' | 'landings' | 'languages'`; stat `landings` = 4; `ProjectCard` sem prop `featured`.

- [ ] **Step 1: Atualizar os testes (falham primeiro)**

`tests/unit/content.test.ts`: ids únicos = `['charles','alianca','cecilia','esther']` (4), números `001,002,004,005` preservados; apenas `esther` tem URL (`https://www.estherduartenutri.com.br`), demais `null`.
`tests/unit/about-content.test.ts`: stats = `[['years',5,'+'],['landings',4,''],['languages',2,'']]` e rótulos `about.stats.landings` em pt e en.
`tests/e2e/projects.spec.ts`: 4 cards, 1 `project-link` (href exato da Esther), 3 `project-soon`; `img + placeholder === 4`.
`tests/e2e/motion.spec.ts`: remover o teste do 7º card em destaque; o teste "etiqueta Ver site" passa a usar o card da Esther (último, `nth(3)`); "card sem URL sem etiqueta" usa `nth(0)`; `a[target="_blank"]` count 2 no card da Esther; wrappers de Reveal: primeiro e último card com opacity 1.
`tests/e2e/about.spec.ts`: `stat-sites` → `stat-landings` com valor `4`.

- [ ] **Step 2: Rodar e ver falhar** — `npm test` e `npx playwright test tests/e2e/projects.spec.ts tests/e2e/about.spec.ts tests/e2e/motion.spec.ts`. Expected: FAIL.

- [ ] **Step 3: Implementar**

`content/projects.ts`: manter só estes 4 itens (copiar do arquivo atual, sem tocar nos campos):
`charles` (001, url null), `alianca` (002, url null), `cecilia` (004, url null), `esther` (005, url `https://www.estherduartenutri.com.br`); `ProjectId` com 4 ids.
`content/stats.ts`: `id: 'sites'` → `id: 'landings'`, `value: 4`.
`scripts/shots.ts`: `targets` só com charles, alianca, cecilia, esther.
`components/sections/projects.tsx`: remover `lastIndex`/`featured`/`cn` e a classe `md:col-span-2`; grade `grid gap-8 md:grid-cols-2` com 4 itens.
`components/sections/project-card.tsx`: remover a prop `featured`, as classes `md:grid md:grid-cols-2`, `md:border-b-0 md:border-r` e a ramificação de `sizes` do featured (usar `(min-width: 1152px) 560px, (min-width: 768px) 50vw, 100vw`).
Mensagens (pt e en): remover `projects.items.{evelyn,angelica,winner}` e `about.stats.sites`; adicionar `about.stats.landings` = PT "landings entregues" / EN "landing pages delivered". Remover `rm public/projects/{evelyn,angelica,winner}.jpg`.

- [ ] **Step 4: Verificar** — `npm run lint && npm run typecheck && npm test`; rebuild; Playwright inteiro. Expected: PASS (ajustar só seletores quebrados por mudança de markup, nunca relaxar asserções). `grep -rniE "evelyn|angelica|winner|featured|stat-sites" app components content messages scripts tests` deve retornar nada (exceto, se houver, menções históricas em `docs/`).

- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat(projects): keep only 4 landings; stats landings"`

---

### Task 2: Sistema de formas suaves (raio, pílulas, divisor em curva, nav com ponto)

**Files:**
- Create: `components/curve-divider.tsx`
- Modify: `app/globals.css` (`--radius`), `components/section-heading.tsx`, `components/section-nav.tsx`, `components/sections/project-card.tsx`, `components/sections/emphasis-list.tsx`, `components/sections/contact.tsx`, `components/sections/stack.tsx`, `components/sections/hero.tsx` (apenas `rounded-full` nos botões), `components/theme-toggle.tsx`, `components/locale-switch.tsx`, `components/mobile-nav.tsx`
- Test: `tests/e2e/round2.spec.ts` (novo)

**Interfaces:**
- Produces: `CurveDivider({ className? })`; `SectionHeading` mantém `{ id, index, title, intro? }` mas com número em círculo e divisor em curva.

- [ ] **Step 1: Testes que falham** — `tests/e2e/round2.spec.ts`:
```ts
import { expect, test } from '@playwright/test';

test('divisor em curva e número em círculo nas seções', async ({ page }) => {
  await page.goto('/pt');
  const heading = page.locator('section:has(h2#timeline)');
  await expect(heading.locator('svg path').first()).toBeAttached();
  const number = heading.getByText('02', { exact: true });
  await expect(number).toHaveCSS('border-radius', /^(9999px|50%|\d{3,}px)$/);
});

test('botões e cards com cantos arredondados (sem cantos retos)', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/pt');
  const cta = page.getByRole('link', { name: 'Ver projetos' });
  await expect(cta).toHaveCSS('border-radius', /^(9999px|\d{3,}px)$/);
  const card = page.getByTestId('project-card').first();
  const radius = await card.evaluate((el) => parseFloat(getComputedStyle(el).borderTopLeftRadius));
  expect(radius).toBeGreaterThanOrEqual(24);
});

test('item ativo do menu mostra ponto laranja, não sublinhado reto', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/pt');
  await page.evaluate(() => document.getElementById('projects')?.scrollIntoView());
  const link = page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link', { name: 'Projetos' });
  await expect(link).toHaveAttribute('aria-current', 'location');
  await expect(link).toHaveCSS('border-bottom-width', '0px');
});
```

- [ ] **Step 2: Rodar e ver falhar** — `npx playwright test tests/e2e/round2.spec.ts`. Expected: FAIL.

- [ ] **Step 3: Implementar**

`app/globals.css`: em `:root` trocar `--radius: 0.125rem;` por `--radius: 1rem;`.

`components/curve-divider.tsx`:
```tsx
import { cn } from '@/lib/utils';

interface CurveDividerProps {
  className?: string;
}

export function CurveDivider({ className }: CurveDividerProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 24"
      preserveAspectRatio="none"
      className={cn('h-6 w-full text-border', className)}
    >
      <path
        d="M0 12 C 150 0, 300 24, 450 12 S 750 0, 900 12 S 1100 22, 1200 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
```

`components/section-heading.tsx` (substituir):
```tsx
import { CurveDivider } from '@/components/curve-divider';

interface SectionHeadingProps {
  id: string;
  index: string;
  title: string;
  intro?: string;
}

export function SectionHeading({ id, index, title, intro }: SectionHeadingProps) {
  return (
    <div>
      <CurveDivider />
      <div className="mt-8 grid gap-6 md:grid-cols-12 md:items-start">
        <p className="md:col-span-2">
          <span className="flex size-10 items-center justify-center rounded-full border border-border font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {index}
          </span>
        </p>
        <h2
          id={id}
          className="scroll-mt-24 font-display text-5xl leading-none tracking-tight md:col-span-6 md:text-7xl"
        >
          {title}
        </h2>
        {intro ? (
          <p className="max-w-sm leading-relaxed text-muted-foreground md:col-span-4">{intro}</p>
        ) : null}
      </div>
    </div>
  );
}
```
Atenção: o seletor do teste `section:has(h2#timeline)` precisa que o `h2` esteja dentro da `section` (já é).

`components/section-nav.tsx`: no `className` do link, remover `border-b border-transparent pb-0.5` e a variante `border-signal`; usar `relative rounded-full px-2 py-1` e, para o ativo, o ponto:
`'relative rounded-full px-2 py-1 text-sm transition-all duration-200 ease-in-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring after:absolute after:left-1/2 after:top-full after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-signal after:opacity-0 after:transition-all after:duration-200 aria-[current=location]:text-foreground aria-[current=location]:after:opacity-100'` + `text-muted-foreground` (inativo).
`components/theme-toggle.tsx`, `mobile-nav.tsx` (summary): `rounded-full`. `locale-switch.tsx`: links `rounded-full`, ativo com `border border-border`.
`components/sections/hero.tsx`: adicionar `rounded-full` às duas classes de botão (`buttonVariants` + className). `contact.tsx`: botão de currículo `rounded-full`; linhas de contato `rounded-full px-6 -mx-6 hover:bg-muted` (manter `divide-y` removendo-o se conflitar visualmente; usar `border-b border-border/60 last:border-b-0` por linha) e `h-` consistentes.
`stack.tsx`: `Badge` com `className` incluindo `rounded-full`.
`project-card.tsx`: `article` com `rounded-[2rem] overflow-hidden`; a barra do topo vira `rounded-full` (`h-1`) iniciando com `left-6 right-6`? Manter simples: `h-0.5` dentro do overflow-hidden.
`emphasis-list.tsx`: trocar a barra `w-0 ... group-hover:w-1.5` por um ponto: `absolute left-0 top-1/2 size-0 -translate-y-1/2 rounded-full bg-signal transition-all duration-300 ease-in-out group-hover:size-3 group-focus-visible:size-3` (aria-hidden); manter o resto.

- [ ] **Step 4: Verificar** — `npm run lint && npm run typecheck && npm test`; rebuild; Playwright inteiro verde. Ver em screenshot (1440 claro) Sobre/Projetos/Contato e `Read` ao menos duas imagens; relatar o que viu (divisor em curva, números em círculo, pílulas, card arredondado, ponto do menu).

- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat(design): soft shapes - radius, pills, curve divider, dot nav"`

---

### Task 3: Hero com saudação, círculos decorativos e remoção do marquee

**Files:**
- Create: `components/sections/hero-orbits.tsx`
- Modify: `components/sections/hero.tsx`, `components/sections/hero-title.tsx`, `app/globals.css` (+`orbit`, `orbit-reverse`, −`marquee`), `app/[locale]/page.tsx`, `messages/pt.json`, `messages/en.json`, `tests/e2e/hero.spec.ts`, `tests/e2e/i18n.spec.ts`, `tests/e2e/motion.spec.ts`, `tests/e2e/layout.spec.ts`
- Delete: `components/motion/marquee.tsx`, `content/marquee.ts`

**Interfaces:**
- Produces: `HeroTitle({ greeting, name })`; `HeroOrbits()`; classes `animate-orbit`, `animate-orbit-reverse`; mensagens `hero.greeting`, `hero.name` ("Eduardo Dias"), `hero.nickname`, `hero.role`, `hero.roleKeyword`, `hero.ctaResume`. Test ids: `hero-word`, `hero-underline`, `hero-role`, `hero-orbits`.

- [ ] **Step 1: Atualizar/criar testes (falham primeiro)**

`tests/e2e/hero.spec.ts`: o h1 contém "Olá, eu sou" e "Eduardo Dias" (PT) e "Hi, I'm" / "Eduardo Dias" (EN); a linha mono mostra "pode me chamar de Dias" (EN: "you can call me Dias"); `getByTestId('hero-role')` contém "AI Engineer em formação, foco em" e "Claude" (EN: "AI Engineer in training, focused on"); o `hero-role` aparece abaixo do h1 (bounding box `y` maior) e está dentro do viewport 1440×900 sem rolar; `marquee` não existe (`getByTestId('marquee')` count 0); `hero-orbits` presente; reduced-motion: palavras com `animation-name: none`, ponto orbitando com `animation-name: none` (`[data-testid=hero-orbits] span.animate-orbit` ou o elemento com testid `hero-orbit-dot`); sem JS: palavras visíveis. Manter os testes de relógio, status, underline (agora sob "Eduardo").
`tests/e2e/i18n.spec.ts`: "switch pt → en": h1 `toContainText('Olá, eu sou')` → após troca `toContainText("Hi, I'm")`.
`tests/e2e/motion.spec.ts` e `layout.spec.ts`: remover os testes do marquee (reduced-motion/375px) e qualquer menção; manter os demais.

- [ ] **Step 2: Rodar e ver falhar** — `npx playwright test tests/e2e/hero.spec.ts tests/e2e/i18n.spec.ts`. Expected: FAIL.

- [ ] **Step 3: Implementar**

Mensagens (adicionar em pt e en; remover `hero.titleLead`, `hero.titleFocus`, `hero.titleKey` e o namespace `marquee`; manter `hero.title`, `hero.eyebrow`, `subtitle`, `ctaProjects`, `ctaContact`, `local`, `clockLabel`, `now`):
- PT: `"greeting": "Olá, eu sou"`, `"name": "Eduardo Dias"`, `"nickname": "pode me chamar de Dias"`, `"role": "AI Engineer em formação, foco em"`, `"roleKeyword": "Claude"`, `"ctaResume": "Baixar currículo"`.
- EN: `"greeting": "Hi, I'm"`, `"name": "Eduardo Dias"`, `"nickname": "you can call me Dias"`, `"role": "AI Engineer in training, focused on"`, `"roleKeyword": "Claude"`, `"ctaResume": "Download resume"`.

`app/globals.css`: remover `--animate-marquee` + `@keyframes marquee`; adicionar dentro do `@theme inline`:
```css
  --animate-orbit: orbit 80s linear infinite;
  --animate-orbit-reverse: orbit 80s linear infinite reverse;
  @keyframes orbit {
    to {
      transform: rotate(360deg);
    }
  }
```
`components/sections/hero-title.tsx` (substituir; mantém o padrão CSS-only e o traço sob "Dias"):
```tsx
import { cn } from '@/lib/utils';

interface HeroTitleProps {
  greeting: string;
  name: string;
}

// Animação em CSS puro: o texto do LCP não depende de hidratação do JS.
const delay = (index: number): string => `${0.05 + index * 0.05}s`;

interface WordProps {
  text: string;
  index: number;
  italic?: boolean;
}

function Word({ text, index, italic = false }: WordProps) {
  return (
    <span className="inline-block overflow-hidden pb-[0.14em] pr-[0.08em] align-bottom">
      <span
        data-testid="hero-word"
        style={{ animationDelay: delay(index) }}
        className={cn('inline-block animate-word-up motion-reduce:animate-none', italic && 'italic')}
      >
        {text}
      </span>
    </span>
  );
}

export function HeroTitle({ greeting, name }: HeroTitleProps) {
  const greetingWords = greeting.split(' ');
  const nameWords = name.split(' ');
  const lastName = nameWords[nameWords.length - 1] ?? name;
  const firstNames = nameWords.slice(0, -1);
  const firstNameIndex = greetingWords.length;
  const lastIndex = firstNameIndex + firstNames.length;

  return (
    <h1 className="font-display text-[clamp(3.25rem,10.5vw,9.5rem)] leading-[0.95] tracking-tight">
      {greetingWords.map((word, i) => (
        <span key={`g-${i}`}>
          <Word text={word} index={i} />{' '}
        </span>
      ))}
      <br className="hidden md:block" />
      {firstNames.map((word, i) => (
        <span key={`n-${i}`}>
          <Word text={word} index={firstNameIndex + i} italic />{' '}
        </span>
      ))}
      <span className="relative inline-block">
        <Word text={lastName} index={lastIndex} italic />
        <svg
          aria-hidden
          viewBox="0 0 200 12"
          preserveAspectRatio="none"
          className="absolute -bottom-1 left-0 h-3 w-full text-signal md:h-4"
        >
          <path
            data-testid="hero-underline"
            pathLength={1}
            d="M2 8 C 40 2, 90 12, 130 6 S 190 4, 198 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            style={{ animationDelay: `${0.05 + lastIndex * 0.05 + 0.3}s` }}
            className="animate-draw motion-reduce:animate-none"
          />
        </svg>
      </span>
      <span className="-ml-[0.1em] text-signal">.</span>
    </h1>
  );
}
```
`components/sections/hero-orbits.tsx`:
```tsx
// Círculos concêntricos em linha fina (decorativos) com um ponto laranja percorrendo o círculo médio.
export function HeroOrbits() {
  return (
    <div
      aria-hidden
      data-testid="hero-orbits"
      className="pointer-events-none absolute -right-28 top-4 hidden size-[36rem] md:block lg:-right-10"
    >
      <svg viewBox="0 0 400 400" className="size-full text-border">
        <circle cx="200" cy="200" r="195" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="200" cy="200" r="140" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="200" cy="200" r="85" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
      <span className="absolute inset-0 animate-orbit motion-reduce:animate-none" data-testid="hero-orbit-dot">
        <span className="absolute left-1/2 top-[15%] size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal" />
      </span>
    </div>
  );
}
```
`components/sections/hero.tsx` (reescrever mantendo CLS e testids existentes; ler o arquivo atual e preservar relógio, subtítulo, CTAs magnéticos, status): estrutura
```tsx
<section id="top" className="relative overflow-hidden">
  <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-24">
    <HeroOrbits />
    <p className="…linha mono com relógio (igual ao atual)…">…</p>
    <div className="mt-8">
      <HeroTitle greeting={t('greeting')} name={t('name')} />
    </div>
    <p data-testid="hero-role" className="mt-6 font-display text-[clamp(1.75rem,4.6vw,3.75rem)] leading-tight tracking-tight">
      {t('role')} <em className="text-signal-ink">{t('roleKeyword')}</em>
    </p>
    <Reveal delay={0.5} className="mt-10 grid gap-10 md:grid-cols-12">
      …subtítulo (igual)… 
      …CTAs: "Ver projetos", "Falar comigo" (igual, com rounded-full) e um link discreto de currículo:
      <a href={`/curriculo-eduardo-dias-${locale}.pdf`} download className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-muted-foreground transition-all duration-200 ease-in-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Download className="size-4" />{t('ctaResume')}</a>
    </Reveal>
    …status "Agora: …" (igual)…
  </div>
</section>
```
`locale` vem de `getLocale()` (`import { getLocale, getTranslations } from 'next-intl/server'`); `Download` de `lucide-react`. Remover o `Marquee` e o import em `app/[locale]/page.tsx` (e `getTranslations('marquee')`). Deletar `components/motion/marquee.tsx` e `content/marquee.ts`.

- [ ] **Step 4: Verificar** — lint, typecheck, unit, rebuild, Playwright inteiro. Ver /pt 1440 claro, 1440 escuro e 375 claro (aguardar 2.5 s) e `Read`: conferir saudação gigante, cargo logo abaixo, círculos à direita sem overflow horizontal, título legível em 375px. Relatar.

- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat(hero): greeting-first title, role line, decorative circles; remove marquee"`

---

### Task 4: Órbita de logos, foto circular e Sobre reescrito (com Caminu)

**Files:**
- Create: `scripts/gen-stack-icons.ts`, `content/stack-icons.ts` (gerado e commitado), `lib/orbit.ts`, `components/sections/stack-orbit.tsx`, `components/sections/caminu-card.tsx`
- Modify: `package.json` (+devDependency `simple-icons`, script `gen:icons`), `components/sections/about-photo.tsx`, `components/sections/about.tsx`, `messages/pt.json`, `messages/en.json`, `tests/e2e/about.spec.ts`
- Test: `tests/unit/orbit.test.ts`, `tests/unit/stack-icons.test.ts`, `tests/e2e/round2.spec.ts` (acrescentar)

**Interfaces:**
- Consumes: `animate-orbit`, `animate-orbit-reverse` (Task 3), `Reveal`.
- Produces: `StackIcon { id: string; name: string; path: string }`; `stackIcons: readonly StackIcon[]` (9 itens, ordem: html5, css3, javascript, typescript, react, nextjs, tailwind, figma, claude); `orbitPosition(index: number, count: number): { left: string; top: string }`; `StackOrbit({ label })`; `CaminuCard()`; `AboutPhoto({ src, alt, tag, children })` onde `children` é a órbita.

- [ ] **Step 1: Testes que falham**

`tests/unit/orbit.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { orbitPosition } from '@/lib/orbit';

describe('orbitPosition', () => {
  it('índice 0 fica no topo do círculo', () => {
    expect(orbitPosition(0, 4)).toEqual({ left: '50%', top: '0%' });
  });
  it('quatro itens: topo, direita, base, esquerda', () => {
    expect(orbitPosition(1, 4)).toEqual({ left: '100%', top: '50%' });
    expect(orbitPosition(2, 4)).toEqual({ left: '50%', top: '100%' });
    expect(orbitPosition(3, 4)).toEqual({ left: '0%', top: '50%' });
  });
  it('sem NaN para count 9', () => {
    for (let i = 0; i < 9; i += 1) {
      const p = orbitPosition(i, 9);
      expect(p.left).toMatch(/^\d+(\.\d+)?%$/);
      expect(p.top).toMatch(/^\d+(\.\d+)?%$/);
    }
  });
});
```
`tests/unit/stack-icons.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { stackIcons } from '@/content/stack-icons';

describe('stackIcons', () => {
  it('9 logos na ordem esperada, com path SVG não vazio', () => {
    expect(stackIcons.map((i) => i.id)).toEqual([
      'html5', 'css3', 'javascript', 'typescript', 'react', 'nextjs', 'tailwind', 'figma', 'claude',
    ]);
    for (const icon of stackIcons) {
      expect(icon.name).toBeTruthy();
      expect(icon.path.startsWith('M')).toBe(true);
    }
  });
});
```
`tests/e2e/round2.spec.ts` (acrescentar):
```ts
test('sobre: órbita com 9 tecnologias acessíveis, anel girando e sem pausar no hover', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/pt');
  const orbit = page.getByTestId('stack-orbit');
  await orbit.scrollIntoViewIfNeeded();
  await expect(orbit.locator('li')).toHaveCount(9);
  for (const name of ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'Figma', 'Claude']) {
    await expect(orbit.getByText(name, { exact: true })).toBeAttached();
  }
  expect(await orbit.evaluate((el) => getComputedStyle(el).animationName)).not.toBe('none');
  await orbit.locator('li').nth(4).hover();
  expect(await orbit.evaluate((el) => getComputedStyle(el).animationPlayState)).toBe('running');
});

test('sobre: órbita estática em reduced motion e sem overflow em 375px', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 375, height: 800 } });
  const page = await ctx.newPage();
  await page.goto('/pt');
  const orbit = page.getByTestId('stack-orbit');
  await orbit.scrollIntoViewIfNeeded();
  expect(await orbit.evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  await ctx.close();
});

test('sobre: copy nova e bloco Caminu sem link', async ({ page }) => {
  await page.goto('/pt');
  const about = page.locator('section:has(#about)');
  await expect(about).toContainText('Técnico em Informática para Internet');
  await expect(about).toContainText('HTML5, CSS3 e JavaScript ES6+');
  await expect(about).toContainText('BAAN');
  await expect(about).toContainText('SEO');
  await expect(about).toContainText('5º período');
  const caminu = page.getByTestId('caminu-card');
  await expect(caminu).toContainText('Caminu');
  await expect(caminu).toContainText('React Native');
  await expect(caminu).toContainText('PcD');
  await expect(caminu).toContainText('pet friendly');
  await expect(caminu.locator('a')).toHaveCount(0);
});

test('sobre em inglês: bloco Caminu traduzido', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByTestId('caminu-card')).toContainText('pet friendly');
  await expect(page.getByTestId('caminu-card')).toContainText('In progress');
});
```
`tests/e2e/about.spec.ts`: o teste da foto continua válido (`getByRole('img', { name: /Retrato de Eduardo Dias/ })`, `about-photo` com `clip-path: none` em reduced-motion/no-JS); remover qualquer asserção ligada ao bloco quadrado laranja.

- [ ] **Step 2: Rodar e ver falhar** — `npm test` e `npx playwright test tests/e2e/round2.spec.ts tests/e2e/about.spec.ts`. Expected: FAIL.

- [ ] **Step 3: Logos (gerados)**

```bash
npm i -D simple-icons
```
`scripts/gen-stack-icons.ts` (rodado uma vez; commit do resultado):
```ts
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import * as si from 'simple-icons';

interface Wanted {
  id: string;
  name: string;
  key: string;
}

const wanted: readonly Wanted[] = [
  { id: 'html5', name: 'HTML5', key: 'siHtml5' },
  { id: 'css3', name: 'CSS3', key: 'siCss3' },
  { id: 'javascript', name: 'JavaScript', key: 'siJavascript' },
  { id: 'typescript', name: 'TypeScript', key: 'siTypescript' },
  { id: 'react', name: 'React', key: 'siReact' },
  { id: 'nextjs', name: 'Next.js', key: 'siNextdotjs' },
  { id: 'tailwind', name: 'Tailwind CSS', key: 'siTailwindcss' },
  { id: 'figma', name: 'Figma', key: 'siFigma' },
  { id: 'claude', name: 'Claude', key: 'siClaude' },
];

const icons = si as unknown as Record<string, { path: string } | undefined>;
const rows = wanted.map(({ id, name, key }) => {
  const icon = icons[key];
  if (!icon) throw new Error(`simple-icons não exporta ${key}; escolha o equivalente mais próximo`);
  return `  { id: '${id}', name: '${name}', path: '${icon.path}' },`;
});

const out = `// Gerado por scripts/gen-stack-icons.ts a partir do Simple Icons (CC0). Não editar à mão.
export interface StackIcon {
  id: string;
  name: string;
  path: string;
}

export const stackIcons: readonly StackIcon[] = [
${rows.join('\n')}
];
`;
writeFileSync(path.join(process.cwd(), 'content', 'stack-icons.ts'), out);
```
`package.json` scripts: `"gen:icons": "tsx scripts/gen-stack-icons.ts"`. Rodar `npm run gen:icons`. Se `siCss3` (ou outro export) não existir na versão instalada, usar o mais próximo (`siCss`), manter `id: 'css3'`/`name: 'CSS3'`, e relatar.

`lib/orbit.ts`:
```ts
export interface OrbitPosition {
  left: string;
  top: string;
}

const trim = (n: number): string => `${Number(n.toFixed(3))}%`;

// Posição em % de um item num círculo (raio 50% do contêiner), começando no topo e andando no sentido horário.
export function orbitPosition(index: number, count: number): OrbitPosition {
  const angle = (2 * Math.PI * index) / count;
  return {
    left: trim(50 + 50 * Math.sin(angle)),
    top: trim(50 - 50 * Math.cos(angle)),
  };
}
```
(Para `count=4`, `Math.sin(Math.PI)` ≈ 1.2e-16: o `toFixed(3)` normaliza para `50%`/`100%`/`0%`.)

- [ ] **Step 4: Componentes**

`components/sections/stack-orbit.tsx` (Server Component):
```tsx
import { stackIcons } from '@/content/stack-icons';
import { orbitPosition } from '@/lib/orbit';

interface StackOrbitProps {
  label: string;
}

export function StackOrbit({ label }: StackOrbitProps) {
  return (
    <ul
      aria-label={label}
      data-testid="stack-orbit"
      className="absolute inset-0 animate-orbit motion-reduce:animate-none"
    >
      {stackIcons.map((icon, i) => {
        const pos = orbitPosition(i, stackIcons.length);
        return (
          <li key={icon.id} className="group absolute size-0" style={{ left: pos.left, top: pos.top }}>
            <div className="absolute -left-7 -top-7 size-14 animate-orbit-reverse motion-reduce:animate-none">
              <span className="sr-only">{icon.name}</span>
              <span
                aria-hidden
                className="flex size-14 items-center justify-center rounded-full border border-border bg-background text-foreground transition-all duration-200 ease-in-out group-hover:scale-110 group-hover:border-foreground"
              >
                <svg viewBox="0 0 24 24" className="size-6 fill-current" role="presentation">
                  <path d={icon.path} />
                </svg>
              </span>
              <span
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-foreground px-3 py-1 text-xs text-background opacity-0 transition-all duration-200 ease-in-out group-hover:opacity-100"
              >
                {icon.name}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
```
`components/sections/about-photo.tsx` (reescrever; mantém wrapper para o observer e a clip-path, agora circular; `children` = órbita):
```tsx
'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import Image from 'next/image';
import { useRef } from 'react';
import type { ReactNode } from 'react';

interface AboutPhotoProps {
  src: string;
  alt: string;
  tag: string;
  children?: ReactNode;
}

export function AboutPhoto({ src, alt, tag, children }: AboutPhotoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [16, -16]);

  return (
    // A detecção de viewport fica no wrapper (sem clip-path): um alvo 100% recortado tem área
    // de interseção zero e o IntersectionObserver nunca o marcaria como visível.
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="relative mx-auto aspect-square w-full max-w-md px-7 md:max-w-none"
    >
      <div className="relative size-full">
        <div aria-hidden className="absolute inset-0 rounded-full border border-border" />
        {children}
        <div aria-hidden className="absolute inset-[14%] rounded-full border border-border" />
        <span aria-hidden className="absolute inset-[14%] animate-orbit motion-reduce:animate-none">
          <span className="absolute left-1/2 top-0 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal" />
        </span>
        <motion.div
          data-testid="about-photo"
          style={{ y }}
          variants={{ hidden: { clipPath: 'circle(0% at 50% 50%)' }, visible: { clipPath: 'circle(75% at 50% 50%)' } }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-[20%] overflow-hidden rounded-full border border-foreground bg-muted motion-reduce:[clip-path:none]! noscript:[clip-path:none]! noscript:transform-none! motion-reduce:transform-none!"
        >
          <Image src={src} alt={alt} fill sizes="(min-width: 768px) 280px, 60vw" className="object-cover" />
        </motion.div>
        <span className="absolute bottom-[10%] left-0 -rotate-6 rounded-full border border-foreground bg-background px-4 py-1 font-mono text-xs uppercase tracking-widest">
          {tag}
        </span>
      </div>
    </motion.div>
  );
}
```
`components/sections/caminu-card.tsx`:
```tsx
import { getTranslations } from 'next-intl/server';

export async function CaminuCard() {
  const t = await getTranslations('about.caminu');
  return (
    <aside
      data-testid="caminu-card"
      className="mt-12 rounded-[2rem] border border-border p-8 md:p-10"
    >
      <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        <span aria-hidden className="size-2.5 rounded-full bg-signal" />
        {t('kicker')}
      </p>
      <h3 className="mt-4 font-display text-5xl tracking-tight">{t('name')}</h3>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">{t('description')}</p>
      <p className="mt-6">
        <span className="inline-flex rounded-full border border-border px-4 py-1 font-mono text-xs uppercase tracking-widest">
          {t('chip')}
        </span>
      </p>
    </aside>
  );
}
```
`components/sections/about.tsx` (editar o arquivo atual): remover `body2` antigo; usar `lead`, `body1`, `body2`, `body3`; passar `<StackOrbit label={t('orbit.label')} />` como filho de `AboutPhoto`; placeholder "ED" circular (`aspect-square rounded-full`, mesmo `data-testid`); `CaminuCard` ao fim da coluna de texto (após os números) ou abaixo do grid; manter estatísticas e a lista de ênfase. Remover classes de borda quadrada (`border border-foreground` no placeholder vira `rounded-full`).

Mensagens (`about`, pt e en; substituir `lead`, `body1`, `body2`; adicionar `body3`, `caminu`, `orbit`):
- PT: `lead` "Comecei pela base: montagem e manutenção de computadores, redes e muito desenvolvimento no Técnico em Informática para Internet." · `body1` "Desde o fim do técnico, pratico HTML5, CSS3 e JavaScript ES6+. A rotina de TI na BAAN, resolvendo problema de usuário de verdade, me ensinou a projetar para quem usa e me ajudou a virar o dev que sou hoje." · `body2` "Na prática, aprendi SEO e construo landing pages de alta conversão: rápidas, claras e feitas para levar a pessoa à ação." · `body3` "Agora meu foco é AI Engineering, com Claude. Estou no 5º período de Engenharia de Software e atuo em um projeto em React Native, o Caminu." · `caminu`: `{ "kicker": "Projeto em andamento", "name": "Caminu", "description": "App que monta o roteiro da sua viagem com IA integrada: sugere os melhores destinos e pontos turísticos, é totalmente acessível para PcD, pet friendly e propõe roteiros que fogem do mais do mesmo.", "chip": "React Native" }` · `orbit`: `{ "label": "Tecnologias da minha stack" }`.
- EN: `lead` "I started with the foundation: computer assembly and maintenance, networks and a lot of development in my Technical Degree in Internet Computing." · `body1` "Since finishing the technical course, I practice HTML5, CSS3 and ES6+ JavaScript. The IT routine at BAAN, solving real users' problems, taught me to design for the people who use things and helped me become the developer I am today." · `body2` "In practice, I learned SEO and I build high-conversion landing pages: fast, clear and made to lead people to act." · `body3` "Now my focus is AI Engineering, with Claude. I'm in the 5th term of Software Engineering and working on a React Native project, Caminu." · `caminu`: `{ "kicker": "In progress", "name": "Caminu", "description": "An app that plans your trip itinerary with built-in AI: it suggests the best destinations and sights, is fully accessible for people with disabilities, pet friendly and proposes itineraries that avoid the usual tourist routes.", "chip": "React Native" }` · `orbit`: `{ "label": "Technologies in my stack" }`.

- [ ] **Step 5: Verificar** — lint, typecheck, unit (`orbit`, `stack-icons`), rebuild, Playwright inteiro. Ver `/pt` 1440 claro (seção Sobre), 1440 escuro e 375 claro e `Read`: foto circular centrada nos anéis, fichas dos logos sem cortar nas bordas (verificar `px-7` suficiente), etiqueta "Anápolis, GO", bloco Caminu. Hover numa ficha: nome aparece e a rotação continua. Corrigir defeitos reais (logos cortados, ficha cobrindo a foto, overflow em 375px).

- [ ] **Step 6: Commit** — `git add -A && git commit -m "feat(about): stack logo orbit, circular portrait, new copy and Caminu card"`

---

### Task 5: Currículo A4 no mesmo design, PDFs e download

**Files:**
- Create: `app/[locale]/(site)/layout.tsx`, `app/[locale]/curriculo/page.tsx`, `content/profile.ts`, `scripts/resume-pdf.ts`, `public/curriculo-eduardo-dias-pt.pdf`, `public/curriculo-eduardo-dias-en.pdf`
- Move (git mv): `app/[locale]/page.tsx`, `app/[locale]/[...rest]`, `app/[locale]/not-found.tsx` → `app/[locale]/(site)/`
- Modify: `app/[locale]/layout.tsx` (só html/body/providers), `components/sections/contact.tsx` (download por idioma), `messages/pt.json`, `messages/en.json` (`resume.*`), `package.json` (`resume` script), `README.md`, `tests/e2e/contact.spec.ts`, `tests/e2e/i18n.spec.ts` (se algum seletor depender)
- Delete: `public/curriculo-eduardo-dias.pdf`
- Test: `tests/e2e/resume.spec.ts`, `tests/unit/resume-pdf.test.ts`

**Interfaces:**
- Consumes: `stackIcons`, `projects`, `hasProfilePhoto`, mensagens `timeline.items.*`, `projects.items.*`, `about.caminu`, `stack.*`, `socials`.
- Produces: rota `/pt/curriculo` e `/en/curriculo` (`data-testid="resume"`, largura 210 mm, altura de conteúdo ≤ 297 mm em mídia print); PDFs `public/curriculo-eduardo-dias-{pt,en}.pdf` de 1 página; `profile.phone`.

- [ ] **Step 1: Testes que falham**

`tests/e2e/resume.spec.ts`:
```ts
import { expect, test } from '@playwright/test';

for (const locale of ['pt', 'en'] as const) {
  test(`/${locale}/curriculo: sem chrome do site, com seções e cabe em 1 página A4`, async ({ page, request }) => {
    await page.goto(`/${locale}/curriculo`);
    const resume = page.getByTestId('resume');
    await expect(resume).toBeVisible();
    await expect(page.getByRole('banner')).toHaveCount(0);
    await expect(page.getByTestId('scroll-progress')).toHaveCount(0);
    await expect(resume.getByRole('heading', { level: 1 })).toHaveText('Eduardo Dias');
    await expect(resume).toContainText('dududiaspf@gmail.com');
    await expect(resume).toContainText('(62) 99426-7841');
    await expect(resume).toContainText('Winner Tecnologia');
    await expect(resume).toContainText('BAAN');
    await expect(resume).toContainText('UniEVANGÉLICA');
    await expect(resume).toContainText('CPET');
    await expect(resume).toContainText('Caminu');
    await expect(resume).toContainText('Scrum Foundation');
    await page.emulateMedia({ media: 'print' });
    await page.setViewportSize({ width: 794, height: 1123 });
    const box = await resume.boundingBox();
    expect(box?.width).toBeLessThanOrEqual(795);
    expect(box?.height).toBeLessThanOrEqual(1123);
    expect(await page.locator('meta[name="robots"]').getAttribute('content')).toContain('noindex');
    const pdf = await request.get(`/curriculo-eduardo-dias-${locale}.pdf`);
    expect(pdf.status()).toBe(200);
    expect(pdf.headers()['content-type']).toContain('pdf');
  });
}
```
`tests/unit/resume-pdf.test.ts`:
```ts
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('PDFs do currículo', () => {
  for (const locale of ['pt', 'en']) {
    it(`${locale}: é um PDF de 1 página`, () => {
      const buf = readFileSync(path.join(process.cwd(), 'public', `curriculo-eduardo-dias-${locale}.pdf`));
      expect(buf.subarray(0, 5).toString()).toBe('%PDF-');
      const pages = buf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? [];
      expect(pages).toHaveLength(1);
    });
  }
});
```
`tests/e2e/contact.spec.ts`: o botão `Baixar currículo` agora aponta para `/curriculo-eduardo-dias-pt.pdf` em `/pt` e `-en.pdf` em `/en` (texto EN "Download resume"); hero também tem um link `Baixar currículo`/`Download resume` com o mesmo `href`.

- [ ] **Step 2: Rodar e ver falhar** — `npx playwright test tests/e2e/resume.spec.ts tests/e2e/contact.spec.ts`; `npm test`. Expected: FAIL.

- [ ] **Step 3: Reorganizar em route group `(site)`**

```bash
mkdir -p "app/[locale]/(site)"
git mv "app/[locale]/page.tsx" "app/[locale]/(site)/page.tsx"
git mv "app/[locale]/[...rest]" "app/[locale]/(site)/[...rest]"
git mv "app/[locale]/not-found.tsx" "app/[locale]/(site)/not-found.tsx"
```
`app/[locale]/layout.tsx`: manter fontes, `metadata`, `generateStaticParams`, `<html>`, `<body>` e providers; **remover** do corpo o skip link, `<ScrollProgress />`, `<SiteHeader />` e `<main id="content">` (os filhos passam direto dentro do `ThemeProvider`). Remover imports que ficarem sem uso (`getTranslations`, `SiteHeader`, `ScrollProgress`).
`app/[locale]/(site)/layout.tsx`:
```tsx
import type { ReactNode } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ScrollProgress } from '@/components/motion/scroll-progress';
import { SiteHeader } from '@/components/site-header';

interface SiteLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function SiteLayout({ children, params }: SiteLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('nav');
  return (
    <>
      <a
        href="#content"
        className="sr-only rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-all duration-200 ease-in-out focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {t('skip')}
      </a>
      <ScrollProgress />
      <SiteHeader />
      <main id="content">{children}</main>
    </>
  );
}
```
(Copiar as classes do skip link do `layout.tsx` atual se divergirem.) Rodar a suíte existente inteira após a mudança: 404 localizado, `/`, sitemap, OG image, ícones devem continuar verdes. Se o `proxy.ts` matcher precisar de ajuste para `/curriculo-eduardo-dias-*.pdf` (tem ponto, já excluído pelo matcher `.*\..*`), confirmar.

- [ ] **Step 4: Dados e mensagens do currículo**

`content/profile.ts`:
```ts
export const profile = {
  name: 'Eduardo Dias',
  phone: '(62) 99426-7841',
  email: 'dududiaspf@gmail.com',
  linkedin: 'linkedin.com/in/eduardo-dias-8a924131a',
  github: 'github.com/edudiaspf18',
  instagram: 'instagram.com/dudu_diaspf',
} as const;
```
Mensagens `resume` (pt e en):
- PT: `"metaTitle": "Currículo · Eduardo Dias"`, `"summary": "Dev front-end e AI Engineer em formação, com foco em Claude. Base sólida em HTML5, CSS3 e JavaScript ES6+, prática em SEO e em landing pages de alta conversão. Cinco anos em suporte técnico me ensinaram a projetar para quem usa."`, `"sections": { "contact": "Contato", "profile": "Perfil", "experience": "Experiência", "education": "Formação", "projects": "Projetos", "stack": "Stack", "certification": "Certificação", "languages": "Idiomas" }`, `"caminuLine": "Caminu: app de roteiros de viagem com IA, acessível para PcD e pet friendly (React Native, em desenvolvimento)."`
- EN: `"metaTitle": "Resume · Eduardo Dias"`, `"summary": "Front-end developer and AI Engineer in training, focused on Claude. Solid foundation in HTML5, CSS3 and ES6+ JavaScript, hands-on SEO and high-conversion landing pages. Five years in technical support taught me to design for the people who use things."`, `"sections": { "contact": "Contact", "profile": "Profile", "experience": "Experience", "education": "Education", "projects": "Projects", "stack": "Stack", "certification": "Certification", "languages": "Languages" }`, `"caminuLine": "Caminu: AI-powered trip planning app, accessible for people with disabilities and pet friendly (React Native, in progress)."`
Também `contact.resume` continua (já existe) e `hero.ctaResume` (Task 3).

- [ ] **Step 5: Página do currículo**

`app/[locale]/curriculo/page.tsx` (Server Component; paleta fixa clara para impressão — cores em valores arbitrários porque o documento é sempre claro; escala em `pt`/mm):
```tsx
import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CurveDivider } from '@/components/curve-divider';
import { projects } from '@/content/projects';
import { profile } from '@/content/profile';
import { stackIcons } from '@/content/stack-icons';
import { timeline } from '@/content/timeline';
import { hasProfilePhoto } from '@/lib/profile-photo';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'resume' });
  return { title: t('metaTitle'), robots: { index: false, follow: false } };
}

const EXPERIENCE_IDS = ['frontend', 'techWinner', 'baan'] as const;
const EDUCATION_IDS = ['degree', 'cpet'] as const;

export default async function ResumePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [r, tl, tp, th, ts] = await Promise.all([
    getTranslations('resume'),
    getTranslations('timeline'),
    getTranslations('projects'),
    getTranslations('hero'),
    getTranslations('stack'),
  ]);
  const photo = hasProfilePhoto();
  void timeline; // ordem vem de EXPERIENCE_IDS/EDUCATION_IDS (subconjunto do timeline)

  return (
    <div className="min-h-screen bg-[#ebe6d9] print:bg-white">
      <div
        data-testid="resume"
        className="mx-auto h-[297mm] w-[210mm] overflow-hidden bg-[#f5f2eb] p-[12mm] text-[9.5pt] leading-snug text-[#0f0e0c]"
      >
        <header className="flex items-center gap-6">
          {photo ? (
            <div className="relative size-[28mm] shrink-0">
              <span aria-hidden className="absolute -inset-[3mm] rounded-full border border-[#d8d3c7]" />
              <span className="absolute inset-0 overflow-hidden rounded-full border border-[#0f0e0c]">
                <Image src="/images/eduardo.jpg" alt="" fill sizes="106px" className="object-cover" />
              </span>
              <span aria-hidden className="absolute -right-[3.5mm] top-[6mm] size-[3mm] rounded-full bg-[#ff5a1f]" />
            </div>
          ) : null}
          <div>
            <h1 className="font-display text-[34pt] leading-none tracking-tight">{profile.name}</h1>
            <p className="mt-2 font-display text-[15pt] leading-tight">
              {th('role')} <em className="text-[#c2410c]">{th('roleKeyword')}</em>
            </p>
          </div>
        </header>

        <CurveDivider className="my-4 text-[#d8d3c7]" />

        <div className="grid grid-cols-[1fr_58mm] gap-8">
          <div className="space-y-5">
            <section>
              <h2 className="font-mono text-[7.5pt] uppercase tracking-widest text-[#5c5850]">{r('sections.profile')}</h2>
              <p className="mt-2">{r('summary')}</p>
            </section>
            <section>
              <h2 className="font-mono text-[7.5pt] uppercase tracking-widest text-[#5c5850]">{r('sections.experience')}</h2>
              <ol className="mt-2 space-y-3">
                {EXPERIENCE_IDS.map((id) => (
                  <li key={id}>
                    <p className="font-mono text-[7.5pt] uppercase tracking-widest text-[#5c5850]">{tl(`items.${id}.period`)}</p>
                    <p className="font-display text-[13pt] leading-tight">{tl(`items.${id}.title`)}</p>
                    <p className="text-[#5c5850]">{tl(`items.${id}.org`)}</p>
                    <p className="mt-0.5">{tl(`items.${id}.description`)}</p>
                  </li>
                ))}
              </ol>
            </section>
            <section>
              <h2 className="font-mono text-[7.5pt] uppercase tracking-widest text-[#5c5850]">{r('sections.projects')}</h2>
              <ul className="mt-2 space-y-1.5">
                {projects.map((p) => (
                  <li key={p.id}>
                    <span className="font-display text-[11.5pt]">{p.name}</span>
                    <span className="text-[#5c5850]"> · {tp(`items.${p.id}.niche`)}</span>
                  </li>
                ))}
                <li className="pt-1">{r('caminuLine')}</li>
              </ul>
            </section>
          </div>

          <aside className="space-y-5">
            <section>
              <h2 className="font-mono text-[7.5pt] uppercase tracking-widest text-[#5c5850]">{r('sections.contact')}</h2>
              <ul className="mt-2 space-y-1 break-words">
                <li>{profile.email}</li>
                <li>{profile.phone}</li>
                <li>{profile.linkedin}</li>
                <li>{profile.github}</li>
                <li>{profile.instagram}</li>
                <li>{th('local')}</li>
              </ul>
            </section>
            <section>
              <h2 className="font-mono text-[7.5pt] uppercase tracking-widest text-[#5c5850]">{r('sections.education')}</h2>
              <ol className="mt-2 space-y-2.5">
                {EDUCATION_IDS.map((id) => (
                  <li key={id}>
                    <p className="font-display text-[11.5pt] leading-tight">{tl(`items.${id}.title`)}</p>
                    <p className="text-[#5c5850]">{tl(`items.${id}.org`)}</p>
                    <p className="font-mono text-[7.5pt] uppercase tracking-widest text-[#5c5850]">{tl(`items.${id}.period`)}</p>
                  </li>
                ))}
              </ol>
            </section>
            <section>
              <h2 className="font-mono text-[7.5pt] uppercase tracking-widest text-[#5c5850]">{r('sections.stack')}</h2>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {stackIcons.map((icon) => (
                  <li key={icon.id} title={icon.name}>
                    <span className="sr-only">{icon.name}</span>
                    <span aria-hidden className="flex size-[8mm] items-center justify-center rounded-full border border-[#d8d3c7]">
                      <svg viewBox="0 0 24 24" className="size-[4mm] fill-current" role="presentation">
                        <path d={icon.path} />
                      </svg>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 font-mono text-[7pt] text-[#5c5850]">{stackIcons.map((i) => i.name).join(' · ')}</p>
            </section>
            <section>
              <h2 className="font-mono text-[7.5pt] uppercase tracking-widest text-[#5c5850]">{r('sections.certification')}</h2>
              <p className="mt-2">{ts('scrum')}</p>
            </section>
            <section>
              <h2 className="font-mono text-[7.5pt] uppercase tracking-widest text-[#5c5850]">{r('sections.languages')}</h2>
              <p className="mt-2">{ts('languages')}</p>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
```
Notas: remover a linha `void timeline;` e o import de `timeline` se o lint reclamar (não são necessários); a página usa `Image` (`next/image`) com a foto; se o texto de alguma seção estourar os 297 mm em PT ou EN, reduzir `text-[9.5pt]` para `9pt` ou encurtar os parágrafos; o teste mede `h-[297mm]` fixo, então o conteúdo precisa **caber sem `overflow-hidden` cortar** — verificar também que `resume.scrollHeight <= resume.clientHeight` em print (acrescentar essa asserção ao e2e).

- [ ] **Step 6: Script de PDF e download**

`scripts/resume-pdf.ts`:
```ts
import path from 'node:path';
import { chromium } from '@playwright/test';

const base = process.env.BASE_URL ?? 'http://localhost:3100';
const locales = ['pt', 'en'] as const;

async function main(): Promise<void> {
  const browser = await chromium.launch();
  try {
    for (const locale of locales) {
      const page = await browser.newPage({ colorScheme: 'light', viewport: { width: 794, height: 1123 } });
      try {
        const response = await page.goto(`${base}/${locale}/curriculo`, { waitUntil: 'networkidle' });
        if (!response?.ok()) throw new Error(`${locale}: ${response?.status() ?? 'sem resposta'}`);
        await page.emulateMedia({ media: 'print' });
        const out = path.join(process.cwd(), 'public', `curriculo-eduardo-dias-${locale}.pdf`);
        await page.pdf({
          path: out,
          width: '210mm',
          height: '297mm',
          printBackground: true,
          margin: { top: '0', right: '0', bottom: '0', left: '0' },
        });
        console.log(`ok ${out}`);
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
```
`package.json`: `"resume": "tsx scripts/resume-pdf.ts"`. Com o servidor de produção em `:3100` rodando: `npm run resume`; conferir que cada PDF tem 1 página (teste unitário) e **ver** o resultado: renderizar o PDF em imagem (`pdftoppm -png -r 80 public/curriculo-eduardo-dias-pt.pdf /tmp/.../resume-pt` se `pdftoppm` existir; senão `qlmanage -t -s 1000 -o <dir> <pdf>` no macOS; senão screenshot da própria rota em mídia print) e `Read` ao menos o PT e o EN; relatar o que viu (corte de texto, foto, anéis, logos, margens).
`git rm public/curriculo-eduardo-dias.pdf` e adicionar os dois novos PDFs.
`components/sections/contact.tsx`: botão de currículo com `href={`/curriculo-eduardo-dias-${locale}.pdf`}` (`getLocale()` de `next-intl/server`) e `download`; texto `t('resume')`.
`README.md`: seção "Currículo": rota, como gerar (`npm run build && npm start -- -p 3100` e `npm run resume`), PDFs commitados, rota não indexável.

- [ ] **Step 7: Verificar** — `npm run lint && npm run typecheck && npm test`; rebuild; `npm run resume`; Playwright inteiro (incl. `resume.spec.ts`, 404, sitemap, OG image, ícones). Expected: PASS.

- [ ] **Step 8: Commit** — `git add -A && git commit -m "feat(resume): A4 resume route and PDFs in the portfolio design; (site) route group"`

---

### Task 6: Verificação final e entrega

**Files:** correções do que falhar; `README.md`; `docs/superpowers/specs/2026-10-14-round2-soft-design-resume-design.md` (nota de divergências, ex.: nomes dos logos não focáveis, ficha sem tab stop).

- [ ] **Step 1: Suíte completa** — `npm run lint && npm run typecheck && npm test` e Playwright inteiro. Expected: tudo PASS, zero erro de console. Confirmar `grep -rniE "evelyn|angelica|winner|featured|marquee|stat-sites" app components content messages scripts tests` sem resíduos.

- [ ] **Step 2: Lighthouse `/pt` e `/en`** (accessibility deve ser 100; best-practices e SEO 100; performance registrar a oscilação já aceita): `npx lighthouse http://localhost:3100/pt --only-categories=performance,accessibility,best-practices,seo --quiet --chrome-flags="--headless=new --no-sandbox" --output=json --output-path=/private/tmp/claude-501/-Users-user-DevWeb-Sites-portifolio/5450f64e-7bed-4e2f-aef9-9a1046bfc76e/scratchpad/lh6-pt.json` (se Chrome não for achado, `CHROME_PATH=$(node -e "console.log(require('@playwright/test').chromium.executablePath())")`). Repetir para `/en` e `/pt/curriculo`. Relatar os 4 scores por rota, antes/depois de correções (contraste dos `border-border` em círculos não conta; texto sim).

- [ ] **Step 3: Verificação visual obrigatória** — screenshots (fullPage ou por seção, aguardar ~3 s e rolar a página antes) de `/pt` e `/en` em 375, 768 e 1440 px, claro e escuro, em `scratchpad/final6/`; `Read` no mínimo: 1440 claro `/pt` (hero+Sobre), 1440 escuro `/pt` (hero+Sobre), 375 claro `/pt` (hero), 375 escuro `/pt` (Sobre com órbita), 1440 claro `/en` (topo) e os dois PDFs do currículo. Conferir: saudação gigante e cargo logo abaixo, círculos sem overflow, órbita sem fichas cortadas, foto circular centrada, divisores em curva, cards 2×2, pílulas, número em círculo, contraste, espaçamento. Corrigir defeitos reais e relatar o que foi visto; não afirmar nada que não foi visto.

- [ ] **Step 4: Reduced motion e sem JS** — o e2e cobre; conferir manualmente 1 captura de cada (hero e Sobre).

- [ ] **Step 5: Documentação e commit** — README (identidade suave, órbita, currículo, `npm run gen:icons`, `npm run resume`); nota de divergências na spec. `git add -A && git commit -m "chore: round 2 verification and docs"`.

- [ ] **Step 6: Pendências ao usuário** — URLs ao vivo de Charles, Aliança e Cecília (hoje "Em breve"); `npm run shots` com internet; conferir copy do Sobre e do currículo; link do Caminu só se o repo virar público.
