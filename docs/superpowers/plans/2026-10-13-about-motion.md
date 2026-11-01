# Sobre mim + movimento + nova identidade visual — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dar vida ao portfólio: identidade editorial "papel e tinta" (claro por padrão), seção **Sobre mim** com a foto, linguagens de ênfase e números animados, e um sistema de movimento em todo o site.

**Architecture:** Tokens de tema (paper/ink/signal) mapeados nas variáveis do shadcn em `globals.css`, então todo componente usa `bg-background text-foreground border-border text-muted-foreground` + `bg-signal`/`text-signal-ink`. Movimento com `motion` (já instalado) em componentes pequenos de `components/motion/`; Server Components fazem a composição e só as folhas são `'use client'`. Tudo visível sem JS e com reduced-motion.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind v4, shadcn base-nova, next-intl, next-themes, motion, Vitest, Playwright. Nenhuma dependência nova.

**Spec:** `docs/superpowers/specs/2026-10-13-about-motion-design.md` (estende `2026-10-12-portifolio-design.md`).

**Working dir / branch:** `/Users/user/DevWeb/Sites/portifolio`, branch `feat/about-motion` (criada a partir de `feat/portfolio`).

## Global Constraints

- Server Components por padrão. `'use client'` só com estado/eventos. **Sem `useEffect`**: para relógio e nav ativa use `useSyncExternalStore`; para count-up use `onViewportEnter`. Nunca `any`. Early returns.
- Só Tailwind. Única exceção em `app/globals.css`: tokens de tema, `@theme`, o `@keyframes` do marquee e a utility `bg-dots` (padrão de pontos, não gradiente de cor).
- UI via shadcn com `cn()`. Ícones só `lucide-react`.
- Toda interação: `hover:`, `focus-visible:` (nunca `focus:`), `transition-all duration-200 ease-in-out`.
- Estética: base monocromática quente + **UMA** cor de destaque laranja `#FF5A1F`. Sem gradiente de cor, sem glow, sem glassmorphism, sem sombra pesada (`shadow-sm` no máximo), sem animação bouncy (use `ease [0.22,1,0.36,1]`). Cantos retos (`--radius: 0.125rem`). Bordas 1px.
- Tokens exatos: claro `--background #F5F2EB`, `--foreground #0F0E0C`, `--muted-foreground #5C5850`, `--border #D8D3C7`, `--signal #FF5A1F`, `--signal-ink #C2410C`; escuro `--background #0E0D0B`, `--foreground #F2EFE8`, `--muted-foreground #A39E93`, `--border #2A2824`, `--signal #FF5A1F`, `--signal-ink #FF7A45`.
- Tema padrão **claro** (`defaultTheme="light"`, `enableSystem={false}`); toggle continua. Grade de pontos só no escuro, 14% do foreground.
- Fontes (`next/font/google`): Instrument Serif 400 normal+italic como `--font-instrument-serif` (classe `font-display`), Geist Sans e Geist Mono mantidas. Se o build não alcançar o Google Fonts, baixar os arquivos para `app/fonts/` e usar `next/font/local`.
- `prefers-reduced-motion`: sem parallax, magnetismo, marquee animado, count-up (valor final), reveal instantâneo. Sem JS: tudo visível (padrão `noscript:` e `motion-reduce:` com `!` já usado em `timeline-client.tsx`).
- Textos só em `messages/pt.json` e `en.json` (paridade de chaves; teste existente exige). Nomes de tecnologia ficam em `content/`.
- Foto original `foto perfil/foto minha.png` fica fora do git (`.gitignore`); o site usa `public/images/eduardo.jpg` (JPEG ≤ 800px; `next/image` serve WebP/AVIF). Divergência da spec (que dizia webp): sem encoder webp nativo no macOS; efeito para o usuário é o mesmo.
- Commits terminam com a linha `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Fora de escopo: blog, CMS, banco, formulário, GSAP, Lenis, WebGL.
- Divergência da spec: o card de projeto não inclina (tilt); o efeito é print que amplia (`scale 1.04`), barra laranja que cresce no topo e etiqueta "Ver site" que segue o cursor. Menos código, mesmo ganho de percepção.

## Review Focus

1. Foto ausente → placeholder "ED", nunca imagem quebrada. (Task 3: unit `hasProfilePhoto` + e2e)
2. Reduced motion e JS desligado: título do hero, foto, números (valor final), reveals e marquee visíveis. (Tasks 2, 3, 4: e2e)
3. Sistema escuro + tema padrão claro: `html` sem `dark` ao abrir; toggle leva ao escuro com tinta quente. (Task 1: e2e)
4. 375px sem overflow horizontal e sem erro de console com marquee, foto com bloco deslocado e cards em destaque. (Tasks 2–5: e2e `layout.spec`)
5. Contraste do `signal-ink` e `muted-foreground` nos dois temas (Lighthouse a11y 100) e menu mobile funcionando com o novo link "Sobre". (Tasks 4, 5)

## File Structure

```
app/globals.css                         tokens, @theme (font-display, signal, marquee), bg-dots
app/[locale]/layout.tsx                 fontes, tema claro padrão, ScrollProgress
app/[locale]/page.tsx                   ordem: Hero, Marquee, About, Timeline, Projects, Stack, Contact, Footer; JSON-LD image
app/[locale]/not-found.tsx              tokens
components/motion/reveal.tsx            fade-up whileInView (client)
components/motion/magnetic.tsx          atração ao cursor (client)
components/motion/marquee.tsx           faixa contínua (server, CSS)
components/motion/live-clock.tsx        relógio (client, useSyncExternalStore)
components/motion/count-up.tsx          contador (client, onViewportEnter)
components/motion/scroll-progress.tsx   barra de progresso (client)
components/motion/cursor-label.tsx      etiqueta que segue o cursor (client)
components/section-nav.tsx              nav desktop com item ativo (client, useSyncExternalStore)
components/section-heading.tsx          index "01" + font-display
components/site-header.tsx, mobile-nav.tsx, theme-toggle.tsx, locale-switch.tsx   tokens
components/sections/hero.tsx, hero-title.tsx   título animado
components/sections/about.tsx, about-photo.tsx, emphasis-list.tsx
components/sections/timeline*.tsx, projects.tsx, project-card.tsx, stack.tsx, contact.tsx, footer.tsx   tokens + motion
content/marquee.ts, emphasis.ts, stats.ts
lib/clock.ts, lib/profile-photo.ts
messages/pt.json, en.json
public/images/eduardo.jpg
tests/unit/clock.test.ts, profile-photo.test.ts, about-content.test.ts
tests/e2e/identity.spec.ts, hero.spec.ts, about.spec.ts, motion.spec.ts (+ ajustes em theme/layout/seo)
```

---

### Task 1: Tokens, fontes, tema claro padrão e shell

**Files:**
- Modify: `app/globals.css`, `app/[locale]/layout.tsx`, `components/site-header.tsx`, `components/mobile-nav.tsx`, `components/theme-toggle.tsx`, `components/locale-switch.tsx`, `components/section-heading.tsx`, `app/[locale]/not-found.tsx`, `tests/e2e/theme.spec.ts`
- Modify (callers do SectionHeading): `components/sections/timeline.tsx`, `projects.tsx`, `stack.tsx`, `contact.tsx` (apenas adicionar a prop `index`)
- Create: `tests/e2e/identity.spec.ts`

**Interfaces:**
- Produces: classes Tailwind `bg-background text-foreground text-muted-foreground border-border bg-signal text-signal-ink font-display bg-dots animate-marquee`; `SectionHeading({ id: string; index: string; title: string; intro?: string })`.

- [ ] **Step 1: Escrever os testes que falham**

`tests/e2e/identity.spec.ts`:
```ts
import { expect, test } from '@playwright/test';

test('tema padrão é claro mesmo com sistema escuro', async ({ browser }) => {
  const ctx = await browser.newContext({ colorScheme: 'dark' });
  const page = await ctx.newPage();
  await page.goto('/pt');
  await expect(page.locator('html')).not.toHaveClass(/dark/);
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(245, 242, 235)');
  await ctx.close();
});

test('toggle leva ao escuro com tinta quente', async ({ page }) => {
  await page.goto('/pt');
  await page.getByRole('button', { name: 'Alternar tema' }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(14, 13, 11)');
});

test('títulos de seção usam a fonte display e numeração', async ({ page }) => {
  await page.goto('/pt');
  const h2 = page.locator('h2#timeline');
  await expect(h2).toHaveCSS('font-family', /Instrument/);
  await expect(page.getByText('02', { exact: true }).first()).toBeVisible();
});
```

`tests/e2e/theme.spec.ts` (substituir inteiro):
```ts
import { expect, test } from '@playwright/test';

test('toggle alterna claro/escuro', async ({ page }) => {
  await page.goto('/pt');
  await expect(page.locator('html')).not.toHaveClass(/dark/);
  await page.getByRole('button', { name: 'Alternar tema' }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.getByRole('button', { name: 'Alternar tema' }).click();
  await expect(page.locator('html')).not.toHaveClass(/dark/);
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx playwright test tests/e2e/identity.spec.ts tests/e2e/theme.spec.ts` (servidor: `NEXT_PUBLIC_SITE_URL=http://localhost:3100 npm run build && NEXT_PUBLIC_SITE_URL=http://localhost:3100 npx next start -p 3100`, config temporária sem `webServer` ou `reuseExistingServer`).
Expected: FAIL (fundo ainda `rgb(10, 10, 10)`-ish/escuro, sem `Instrument`).

- [ ] **Step 3: `app/globals.css`**

Manter `@import`s e `@custom-variant dark`. Em `@theme inline` **acrescentar** (mantendo os `--color-*` existentes):
```css
  --font-display: var(--font-instrument-serif), ui-serif, Georgia, serif;
  --color-signal: var(--signal);
  --color-signal-ink: var(--signal-ink);
  --animate-marquee: marquee 40s linear infinite;
  @keyframes marquee {
    to {
      transform: translateX(-50%);
    }
  }
```
Substituir os blocos `:root` e `.dark` por (manter também as variáveis `--chart-*`, `--sidebar-*`, `--card`, `--popover`, `--secondary`, `--accent`, `--destructive`, `--input` apontando para os mesmos tons quentes):
```css
:root {
  --background: #f5f2eb;
  --foreground: #0f0e0c;
  --card: #f5f2eb;
  --card-foreground: #0f0e0c;
  --popover: #f5f2eb;
  --popover-foreground: #0f0e0c;
  --primary: #0f0e0c;
  --primary-foreground: #f5f2eb;
  --secondary: #ebe6d9;
  --secondary-foreground: #0f0e0c;
  --muted: #ebe6d9;
  --muted-foreground: #5c5850;
  --accent: #ebe6d9;
  --accent-foreground: #0f0e0c;
  --destructive: oklch(0.577 0.245 27.325);
  --border: #d8d3c7;
  --input: #d8d3c7;
  --ring: #ff5a1f;
  --signal: #ff5a1f;
  --signal-ink: #c2410c;
  --radius: 0.125rem;
}
/* As variáveis --chart-* e --sidebar-* existentes ficam como estão (não são usadas no site). */

.dark {
  --background: #0e0d0b;
  --foreground: #f2efe8;
  --card: #0e0d0b;
  --card-foreground: #f2efe8;
  --popover: #0e0d0b;
  --popover-foreground: #f2efe8;
  --primary: #f2efe8;
  --primary-foreground: #0e0d0b;
  --secondary: #1a1814;
  --secondary-foreground: #f2efe8;
  --muted: #1a1814;
  --muted-foreground: #a39e93;
  --accent: #1a1814;
  --accent-foreground: #f2efe8;
  --destructive: oklch(0.704 0.191 22.216);
  --border: #2a2824;
  --input: #2a2824;
  --ring: #ff5a1f;
  --signal: #ff5a1f;
  --signal-ink: #ff7a45;
}
```
Depois do `@layer base`, acrescentar a utility do padrão de pontos:
```css
@utility bg-dots {
  background-image: radial-gradient(
    color-mix(in oklab, var(--foreground) 14%, transparent) 1px,
    transparent 1px
  );
  background-size: 22px 22px;
}
```

- [ ] **Step 4: `app/[locale]/layout.tsx`**

Trocar o import de fontes e as classes/tema:
```tsx
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google';
// ...
const instrumentSerif = Instrument_Serif({
  variable: '--font-instrument-serif',
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
});
```
`<body className={cn(geistSans.variable, geistMono.variable, instrumentSerif.variable, 'bg-background font-sans text-foreground antialiased dark:bg-dots')}>`
`<ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>`
Skip link: `bg-foreground text-background ... focus-visible:ring-signal` (remover `zinc/orange` hardcoded).

- [ ] **Step 5: Componentes do shell com tokens**

`components/section-heading.tsx`:
```tsx
interface SectionHeadingProps {
  id: string;
  index: string;
  title: string;
  intro?: string;
}

export function SectionHeading({ id, index, title, intro }: SectionHeadingProps) {
  return (
    <div className="grid gap-6 border-t border-border pt-6 md:grid-cols-12">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground md:col-span-2">
        {index}
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
  );
}
```
Callers: `timeline.tsx` → `index="02"`, `projects.tsx` → `index="03"`, `stack.tsx` → `index="04"`, `contact.tsx` → `index="05"`.

`components/site-header.tsx`: `header` → `sticky top-0 z-40 border-b border-border bg-background`; logo link `font-display text-xl tracking-tight transition-all duration-200 ease-in-out hover:text-signal-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal`; links `text-sm text-muted-foreground transition-all duration-200 ease-in-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal`. (Link "about" entra na Task 3.)
`components/mobile-nav.tsx`: summary `border-border text-foreground hover:bg-muted group-open:bg-muted focus-visible:ring-signal`; painel `border-border bg-background`; links `text-muted-foreground hover:text-foreground focus-visible:ring-signal`.
`components/theme-toggle.tsx`: `hover:bg-muted focus-visible:ring-signal`.
`components/locale-switch.tsx`: ativo `text-foreground`, inativo `text-muted-foreground`, `hover:text-foreground`, `focus-visible:ring-signal`; aria-current permanece `page`.
`app/[locale]/not-found.tsx`: `<h1 className="font-display text-6xl tracking-tight">`; link `text-muted-foreground hover:text-foreground focus-visible:ring-signal`.

- [ ] **Step 6: Verificar**

Run: `npm run lint && npm run typecheck && npm test`, rebuild e `npx playwright test` (suíte inteira).
Expected: PASS. Ajustar apenas seletores de testes antigos quebrados por mudança de classe (nunca relaxar asserções). Se `Instrument_Serif` não baixar no build offline, aplicar a regra de fonte local das Global Constraints.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat(design): warm paper/ink tokens, Instrument Serif, light default theme"
```

---

### Task 2: Hero animado, relógio, marquee e botões magnéticos

**Files:**
- Create: `lib/clock.ts`, `content/marquee.ts`, `components/motion/reveal.tsx`, `magnetic.tsx`, `marquee.tsx`, `live-clock.tsx`, `components/sections/hero-title.tsx`
- Modify: `components/sections/hero.tsx`, `app/[locale]/page.tsx`, `messages/pt.json`, `messages/en.json`
- Test: `tests/unit/clock.test.ts`, `tests/e2e/hero.spec.ts`

**Interfaces:**
- Produces: `formatClock(now: Date, timeZone?: string): string | null`; `marqueeItems: readonly string[]`; `Reveal({ children, delay?, className? })`; `Magnetic({ children, strength? })`; `Marquee({ label })`; `LiveClock({ label })`; `HeroTitle({ lead, focus, keyword })`. Test ids: `hero-word`, `hero-underline`, `live-clock`, `marquee`.

- [ ] **Step 1: Testes que falham**

`tests/unit/clock.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { formatClock } from '@/lib/clock';

describe('formatClock', () => {
  it('converte para o horário de Anápolis (UTC-3)', () => {
    expect(formatClock(new Date('2026-10-13T15:30:00Z'))).toBe('12:30');
  });
  it('meia-noite é 00:xx, nunca 24:xx', () => {
    expect(formatClock(new Date('2026-10-13T03:05:00Z'))).toBe('00:05');
  });
  it('fuso inválido retorna null em vez de lançar', () => {
    expect(formatClock(new Date(), 'Not/AZone')).toBeNull();
  });
});
```

`tests/e2e/hero.spec.ts`:
```ts
import { expect, test } from '@playwright/test';

test('hero pt: título completo, relógio, status e marquee', async ({ page }) => {
  await page.goto('/pt');
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toContainText('AI Engineer em formação');
  await expect(h1).toContainText('foco em');
  await expect(h1).toContainText('Claude');
  await expect(page.getByTestId('live-clock')).toHaveText(/^\d{2}:\d{2}$/);
  await expect(page.getByText('Agora: estudando Next.js')).toBeVisible();
  const marquee = page.getByTestId('marquee');
  await expect(marquee).toBeVisible();
  await expect(marquee.locator('ul').first().locator('li')).toHaveCount(7);
  await expect(marquee.locator('ul[aria-hidden="true"]')).toHaveCount(1);
});

test('hero en: título em inglês', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('AI Engineer in training');
  await expect(page.getByText('Now: learning Next.js')).toBeVisible();
});

test('hero: palavras sobem e o traço desenha', async ({ page }) => {
  await page.goto('/pt');
  const words = page.getByTestId('hero-word');
  expect(await words.count()).toBeGreaterThanOrEqual(6);
  await expect(words.last()).toHaveCSS('transform', /none|matrix\(1, 0, 0, 1, 0, 0\)/);
  await expect(page.getByTestId('hero-underline')).toBeAttached();
});

test('hero: reduced motion mostra tudo de imediato', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/pt');
  const words = page.getByTestId('hero-word');
  for (let i = 0; i < (await words.count()); i++) {
    await expect(words.nth(i)).toHaveCSS('transform', /none|matrix\(1, 0, 0, 1, 0, 0\)/);
  }
  await ctx.close();
});

test('hero: sem JS o título fica visível', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/pt');
  const words = page.getByTestId('hero-word');
  for (let i = 0; i < (await words.count()); i++) {
    await expect(words.nth(i)).toHaveCSS('transform', /none|matrix\(1, 0, 0, 1, 0, 0\)/);
  }
  await ctx.close();
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test` (clock) e `npx playwright test tests/e2e/hero.spec.ts`. Expected: FAIL.

- [ ] **Step 3: Implementar utilidades e primitivos**

`lib/clock.ts`:
```ts
export function formatClock(now: Date, timeZone: string = 'America/Sao_Paulo'): string | null {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
      timeZone,
    }).format(now);
  } catch {
    return null;
  }
}
```

`content/marquee.ts`:
```ts
export const marqueeItems: readonly string[] = [
  'TypeScript', 'React', 'Next.js', 'Tailwind', 'Claude', 'Figma', 'SEO',
];
```

`components/motion/reveal.tsx`:
```tsx
'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'motion-reduce:!opacity-100 motion-reduce:!transform-none noscript:!opacity-100 noscript:!transform-none',
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
```

`components/motion/magnetic.tsx`:
```tsx
'use client';

import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import type { PointerEvent, ReactNode } from 'react';

interface MagneticProps {
  children: ReactNode;
  strength?: number;
}

export function Magnetic({ children, strength = 0.25 }: MagneticProps) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 20 });
  const sy = useSpring(y, { stiffness: 220, damping: 20 });

  function onMove(event: PointerEvent<HTMLDivElement>): void {
    if (reduce || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function onLeave(): void {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div style={{ x: sx, y: sy }} onPointerMove={onMove} onPointerLeave={onLeave} className="inline-block">
      {children}
    </motion.div>
  );
}
```

`components/motion/marquee.tsx` (server):
```tsx
import { Asterisk } from 'lucide-react';
import { marqueeItems } from '@/content/marquee';

interface MarqueeProps {
  label: string;
}

function Row({ hidden }: { hidden: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-8 pr-8">
      {marqueeItems.map((item) => (
        <li key={item} className="flex items-center gap-8 font-display text-4xl md:text-6xl">
          {item}
          <Asterisk className="size-6 text-signal md:size-8" aria-hidden />
        </li>
      ))}
    </ul>
  );
}

export function Marquee({ label }: MarqueeProps) {
  return (
    <section
      aria-label={label}
      data-testid="marquee"
      className="overflow-hidden border-y border-border py-6"
    >
      <div className="flex w-max animate-marquee transition-all duration-200 ease-in-out hover:[animation-play-state:paused] motion-reduce:animate-none">
        <Row hidden={false} />
        <Row hidden />
      </div>
    </section>
  );
}
```

`components/motion/live-clock.tsx`:
```tsx
'use client';

import { useSyncExternalStore } from 'react';
import { formatClock } from '@/lib/clock';

interface LiveClockProps {
  label: string;
}

function subscribe(onChange: () => void): () => void {
  const id = setInterval(onChange, 15_000);
  return () => clearInterval(id);
}

const getSnapshot = (): string | null => formatClock(new Date());
const getServerSnapshot = (): null => null;

export function LiveClock({ label }: LiveClockProps) {
  const time = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (!time) return <span aria-hidden className="inline-block w-[5ch]" />;
  return (
    <time data-testid="live-clock" aria-label={`${label} ${time}`} className="tabular-nums">
      {time}
    </time>
  );
}
```

`components/sections/hero-title.tsx`:
```tsx
'use client';

import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

interface HeroTitleProps {
  lead: string;
  focus: string;
  keyword: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

interface WordProps {
  text: string;
  index: number;
  italic?: boolean;
}

function Word({ text, index, italic = false }: WordProps) {
  const reduce = useReducedMotion();
  return (
    <span className="inline-block overflow-hidden pb-[0.14em] align-bottom">
      <motion.span
        data-testid="hero-word"
        initial={reduce ? false : { y: '110%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: 0.15 + index * 0.07, ease: EASE }}
        className={cn('inline-block motion-reduce:!transform-none noscript:!transform-none', italic && 'italic')}
      >
        {text}
      </motion.span>
    </span>
  );
}

export function HeroTitle({ lead, focus, keyword }: HeroTitleProps) {
  const reduce = useReducedMotion();
  const leadWords = lead.split(' ');
  const focusWords = focus.split(' ');
  const offset = leadWords.length;
  const keyIndex = offset + focusWords.length;

  return (
    <h1 className="font-display text-[clamp(3.25rem,11vw,9.5rem)] leading-[0.95] tracking-tight">
      {leadWords.map((word, i) => (
        <span key={`l-${i}`}>
          <Word text={word} index={i} />{' '}
        </span>
      ))}
      <br className="hidden md:block" />
      {focusWords.map((word, i) => (
        <span key={`f-${i}`}>
          <Word text={word} index={offset + i} italic />{' '}
        </span>
      ))}
      <span className="relative inline-block">
        <Word text={keyword} index={keyIndex} italic />
        <svg
          aria-hidden
          viewBox="0 0 200 12"
          preserveAspectRatio="none"
          className="absolute -bottom-1 left-0 h-3 w-full text-signal md:h-4"
        >
          <motion.path
            data-testid="hero-underline"
            d="M2 8 C 40 2, 90 12, 130 6 S 190 4, 198 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, delay: 0.15 + keyIndex * 0.07 + 0.4, ease: EASE }}
            className="motion-reduce:![stroke-dasharray:none] noscript:![stroke-dasharray:none]"
          />
        </svg>
      </span>
      <span className="text-signal">.</span>
    </h1>
  );
}
```

- [ ] **Step 4: Hero e mensagens**

`components/sections/hero.tsx`:
```tsx
import { ArrowDown } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { LiveClock } from '@/components/motion/live-clock';
import { Magnetic } from '@/components/motion/magnetic';
import { Reveal } from '@/components/motion/reveal';
import { HeroTitle } from '@/components/sections/hero-title';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export async function Hero() {
  const t = await getTranslations('hero');
  return (
    <section id="top" className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-28">
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        <span>Eduardo Dias</span>
        <span aria-hidden>/</span>
        <span>{t('local')}</span>
        <LiveClock label={t('clockLabel')} />
      </p>
      <div className="mt-8">
        <HeroTitle lead={t('titleLead')} focus={t('titleFocus')} keyword={t('titleKey')} />
      </div>
      <Reveal delay={0.9} className="mt-10 grid gap-10 md:grid-cols-12">
        <p className="max-w-xl text-lg leading-relaxed text-muted-foreground md:col-span-6">
          {t('subtitle')}
        </p>
        <div className="flex flex-wrap items-start gap-3 md:col-span-6 md:justify-end">
          <Magnetic>
            <a
              href="#projects"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'transition-all duration-200 ease-in-out hover:bg-signal hover:text-foreground focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2',
              )}
            >
              {t('ctaProjects')}
              <ArrowDown className="size-4" />
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href="#contact"
              className={cn(
                buttonVariants({ size: 'lg', variant: 'outline' }),
                'border-border transition-all duration-200 ease-in-out hover:border-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2',
              )}
            >
              {t('ctaContact')}
            </a>
          </Magnetic>
        </div>
      </Reveal>
      <p className="mt-12 flex items-center gap-3 border-t border-border pt-6 text-sm text-muted-foreground">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-signal opacity-75 motion-reduce:animate-none" />
          <span className="relative inline-flex size-2 rounded-full bg-signal" />
        </span>
        {t('now')}
      </p>
    </section>
  );
}
```

Mensagens (acrescentar, mantendo TODAS as chaves existentes de `hero`: `eyebrow` e `title` são usadas por `app/[locale]/opengraph-image.tsx`):
- `pt.hero`: `"titleLead": "AI Engineer em formação,"`, `"titleFocus": "foco em"`, `"titleKey": "Claude"`, `"local": "Anápolis, GO"`, `"clockLabel": "Horário local"`, `"now": "Agora: estudando Next.js, construindo com Claude Code."`
- `en.hero`: `"titleLead": "AI Engineer in training,"`, `"titleFocus": "focused on"`, `"titleKey": "Claude"`, `"local": "Anápolis, Brazil"`, `"clockLabel": "Local time"`, `"now": "Now: learning Next.js, building with Claude Code."`
- `pt.marquee.label`: `"Tecnologias em foco"`; `en.marquee.label`: `"Technologies in focus"` (novo namespace `marquee`).

`app/[locale]/page.tsx`: importar `Marquee` e `getTranslations('marquee')`; render `<Hero /><Marquee label={tm('label')} /> ...` (manter o restante).

- [ ] **Step 5: Verificar**

Run: `npm run lint && npm run typecheck && npm test` e `npx playwright test` (suíte inteira, incl. `layout.spec` 375px sem overflow). Também ver a página em 1440px e 375px (screenshot via Playwright, `Read`) e relatar o que viu.
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat(hero): animated title, live clock, marquee, magnetic CTAs"
```

---

### Task 3: Seção Sobre mim (foto, ênfase, números)

**Files:**
- Create: `content/emphasis.ts`, `content/stats.ts`, `lib/profile-photo.ts`, `components/motion/count-up.tsx`, `components/sections/about.tsx`, `about-photo.tsx`, `emphasis-list.tsx`, `public/images/eduardo.jpg`
- Modify: `app/[locale]/page.tsx`, `components/site-header.tsx` (link `about`), `messages/*.json`, `.gitignore`, `tests/e2e/seo.spec.ts`
- Test: `tests/unit/profile-photo.test.ts`, `tests/unit/about-content.test.ts`, `tests/e2e/about.spec.ts`

**Interfaces:**
- Consumes: `Reveal`, `SectionHeading({id,index,title})`, tokens (Task 1).
- Produces: `hasProfilePhoto(dir?: string): boolean`; `emphasis: readonly { id: EmphasisId; name: string; status: 'using' | 'learning' }[]`; `stats: readonly { id: StatId; value: number; suffix: string }[]`; `CountUp({ to, suffix? })`; `AboutPhoto({ src, alt, tag })`.

- [ ] **Step 1: Preparar a foto (sem dependência nova)**

```bash
mkdir -p public/images
sips -s format jpeg -s formatOptions 82 -Z 800 "foto perfil/foto minha.png" --out public/images/eduardo.jpg
ls -la public/images/eduardo.jpg   # esperado: < 250KB
printf '\nfoto perfil/\n' >> .gitignore
```
Ver a imagem resultante (`Read`) e confirmar rosto centrado, sem corte. O PNG original NÃO entra no git.

- [ ] **Step 2: Testes que falham**

`tests/unit/profile-photo.test.ts`:
```ts
import { mkdtempSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { hasProfilePhoto } from '@/lib/profile-photo';

describe('hasProfilePhoto', () => {
  it('true só quando eduardo.jpg existe', () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), 'photo-'));
    expect(hasProfilePhoto(dir)).toBe(false);
    writeFileSync(path.join(dir, 'eduardo.jpg'), 'x');
    expect(hasProfilePhoto(dir)).toBe(true);
  });
});
```

`tests/unit/about-content.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { emphasis } from '@/content/emphasis';
import { stats } from '@/content/stats';
import en from '@/messages/en.json';
import pt from '@/messages/pt.json';

describe('about content', () => {
  it('toda ênfase tem descrição nos dois idiomas', () => {
    for (const { id } of emphasis) {
      expect((pt.about.emphasis as Record<string, string>)[id], id).toBeTruthy();
      expect((en.about.emphasis as Record<string, string>)[id], id).toBeTruthy();
    }
  });
  it('ênfase: TypeScript, React, Next.js aprendendo; Tailwind e Claude usando', () => {
    const byId = Object.fromEntries(emphasis.map((e) => [e.id, e.status]));
    expect(byId).toEqual({
      typescript: 'learning',
      react: 'learning',
      nextjs: 'learning',
      tailwind: 'using',
      claude: 'using',
    });
  });
  it('números: 5+ anos, 7 sites, 2 idiomas, com rótulos', () => {
    expect(stats.map((s) => [s.id, s.value, s.suffix])).toEqual([
      ['years', 5, '+'],
      ['sites', 7, ''],
      ['languages', 2, ''],
    ]);
    for (const { id } of stats) {
      expect((pt.about.stats as Record<string, string>)[id], id).toBeTruthy();
    }
  });
});
```

`tests/e2e/about.spec.ts`:
```ts
import { expect, test } from '@playwright/test';

test('sobre: foto carrega, texto, ênfase e números finais', async ({ page }) => {
  await page.goto('/pt');
  const section = page.locator('section:has(#about)');
  await section.scrollIntoViewIfNeeded();
  await expect(page.locator('h2#about')).toHaveText('Sobre mim');
  const photo = section.getByRole('img', { name: /Retrato de Eduardo Dias/ });
  await expect(photo).toBeVisible();
  await expect.poll(() => photo.evaluate((i) => (i as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  const rows = page.getByTestId('emphasis-list').getByRole('link');
  await expect(rows).toHaveCount(5);
  await expect(rows.first()).toContainText('TypeScript');
  await expect(rows.first()).toContainText('aprendendo');
  await expect(rows.nth(3)).toContainText('usando');
  await page.getByTestId('stats').scrollIntoViewIfNeeded();
  await expect(page.getByTestId('stat-years')).toHaveText('5+', { timeout: 5000 });
  await expect(page.getByTestId('stat-sites')).toHaveText('7');
  await expect(page.getByTestId('stat-languages')).toHaveText('2');
});

test('sobre: em inglês', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('h2#about')).toHaveText('About me');
  await expect(page.getByRole('img', { name: /Portrait of Eduardo Dias/ })).toBeAttached();
});

test('sobre: reduced motion e sem JS mostram foto e números finais', async ({ browser }) => {
  for (const options of [{ reducedMotion: 'reduce' as const }, { javaScriptEnabled: false }]) {
    const ctx = await browser.newContext(options);
    const page = await ctx.newPage();
    await page.goto('/pt');
    await expect(page.getByTestId('about-photo')).toHaveCSS('clip-path', 'none');
    await expect(page.getByTestId('stat-years')).toHaveText('5+');
    await ctx.close();
  }
});

test('sobre: link do menu leva à seção', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/pt');
  await page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link', { name: 'Sobre' }).click();
  await expect(page).toHaveURL(/#about$/);
});
```

`tests/e2e/seo.spec.ts`: no teste do JSON-LD acrescentar `expect(data.image).toMatch(/\/images\/eduardo\.jpg$/)` (e `image: string` no tipo local).

- [ ] **Step 3: Rodar e ver falhar**

Run: `npm test` e `npx playwright test tests/e2e/about.spec.ts`. Expected: FAIL.

- [ ] **Step 4: Conteúdo e utilidades**

`lib/profile-photo.ts`:
```ts
import { existsSync } from 'node:fs';
import path from 'node:path';

export const profilePhotoDir: string = path.join(process.cwd(), 'public', 'images');

export function hasProfilePhoto(dir: string = profilePhotoDir): boolean {
  return existsSync(path.join(dir, 'eduardo.jpg'));
}
```

`content/emphasis.ts`:
```ts
export type EmphasisId = 'typescript' | 'react' | 'nextjs' | 'tailwind' | 'claude';

export interface Emphasis {
  id: EmphasisId;
  name: string;
  status: 'using' | 'learning';
}

export const emphasis: readonly Emphasis[] = [
  { id: 'typescript', name: 'TypeScript', status: 'learning' },
  { id: 'react', name: 'React', status: 'learning' },
  { id: 'nextjs', name: 'Next.js', status: 'learning' },
  { id: 'tailwind', name: 'Tailwind', status: 'using' },
  { id: 'claude', name: 'Claude', status: 'using' },
];
```

`content/stats.ts`:
```ts
export type StatId = 'years' | 'sites' | 'languages';

export interface Stat {
  id: StatId;
  value: number;
  suffix: string;
}

export const stats: readonly Stat[] = [
  { id: 'years', value: 5, suffix: '+' },
  { id: 'sites', value: 7, suffix: '' },
  { id: 'languages', value: 2, suffix: '' },
];
```

Mensagens `about` (adicionar em AMBOS; `nav.about` = "Sobre" / "About"):
```json
"about": {
  "title": "Sobre mim",
  "lead": "Comecei no suporte técnico: montando computadores, passando cabo e resolvendo problema de usuário de verdade.",
  "body1": "Cinco anos nisso me ensinaram a projetar para quem usa. Hoje desenvolvo interfaces e landing pages de alta conversão, com UX, Figma e SEO.",
  "body2": "Desde setembro de 2026 me especializo em AI Engineering, com foco em Claude. Sigo cursando Engenharia de Software na UniEVANGÉLICA.",
  "photoAlt": "Retrato de Eduardo Dias, de óculos redondos e camiseta preta, ao ar livre",
  "tag": "Anápolis, GO",
  "emphasisTitle": "Linguagens de ênfase",
  "status": { "using": "usando", "learning": "aprendendo" },
  "viewInStack": "Ver na stack",
  "emphasis": {
    "typescript": "Tipagem estrita em tudo que escrevo agora. Aprendendo a fazer certo desde o começo.",
    "react": "Componentes e Server Components. Aprendendo a pensar interface como sistema.",
    "nextjs": "App Router, SEO e performance. É onde as landings ganham velocidade.",
    "tailwind": "Todo o visual, com tokens e zero CSS solto.",
    "claude": "Claude Code no dia a dia, API e Agent SDK nos estudos. É a minha especialização."
  },
  "stats": { "years": "anos em TI", "sites": "sites entregues", "languages": "idiomas" }
}
```
```json
"about": {
  "title": "About me",
  "lead": "I started in tech support: assembling computers, running cable and solving real users' problems.",
  "body1": "Five years of that taught me to design for the people who use things. Today I build interfaces and high-conversion landing pages, with UX, Figma and SEO.",
  "body2": "Since September 2026 I'm specializing in AI Engineering, focused on Claude. I'm still studying Software Engineering at UniEVANGÉLICA.",
  "photoAlt": "Portrait of Eduardo Dias, wearing round glasses and a black t-shirt, outdoors",
  "tag": "Anápolis, Brazil",
  "emphasisTitle": "Languages of focus",
  "status": { "using": "using", "learning": "learning" },
  "viewInStack": "See in stack",
  "emphasis": {
    "typescript": "Strict typing in everything I write now. Learning to do it right from the start.",
    "react": "Components and Server Components. Learning to think of interfaces as systems.",
    "nextjs": "App Router, SEO and performance. It's where landing pages get fast.",
    "tailwind": "All the visuals, with tokens and zero loose CSS.",
    "claude": "Claude Code every day, API and Agent SDK in my studies. It's my specialization."
  },
  "stats": { "years": "years in IT", "sites": "sites delivered", "languages": "languages" }
}
```

- [ ] **Step 5: Componentes**

`components/motion/count-up.tsx`:
```tsx
'use client';

import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react';

interface CountUpProps {
  to: number;
  suffix?: string;
}

// O valor inicial já é o final: SSR, sem JS e reduced-motion exibem o número correto.
// Ao entrar na tela, zera e conta até o final (uma vez).
export function CountUp({ to, suffix = '' }: CountUpProps) {
  const reduce = useReducedMotion();
  const value = useMotionValue(to);
  const text = useTransform(value, (v) => `${Math.round(v)}${suffix}`);

  function onEnter(): void {
    if (reduce) return;
    value.set(0);
    animate(value, to, { duration: 1.2, ease: [0.22, 1, 0.36, 1] });
  }

  return (
    <motion.span onViewportEnter={onEnter} viewport={{ once: true, margin: '-40px' }}>
      {text}
    </motion.span>
  );
}
```

`components/sections/about-photo.tsx`:
```tsx
'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import Image from 'next/image';
import { useRef } from 'react';

interface AboutPhotoProps {
  src: string;
  alt: string;
  tag: string;
}

export function AboutPhoto({ src, alt, tag }: AboutPhotoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [24, -24]);

  return (
    <div ref={ref} className="relative mx-auto max-w-md pb-4 pr-4 md:max-w-none">
      <div aria-hidden className="absolute bottom-0 right-0 size-[calc(100%-1rem)] bg-signal" />
      <motion.div
        data-testid="about-photo"
        style={{ y }}
        initial={reduce ? false : { clipPath: 'inset(0 0 100% 0)' }}
        whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative aspect-square overflow-hidden border border-foreground bg-muted motion-reduce:[clip-path:none]! noscript:[clip-path:none]!"
      >
        <Image src={src} alt={alt} fill sizes="(min-width: 768px) 440px, 90vw" className="object-cover" />
      </motion.div>
      <span className="absolute -left-2 top-6 -rotate-6 border border-foreground bg-background px-3 py-1 font-mono text-xs uppercase tracking-widest">
        {tag}
      </span>
    </div>
  );
}
```
Nota: `clip-path: inset(0 0 100% 0)` esconde o bloco; `noscript:`/`motion-reduce:` com `!` forçam `none`.

`components/sections/emphasis-list.tsx` (server):
```tsx
import { getTranslations } from 'next-intl/server';
import { emphasis } from '@/content/emphasis';
import { cn } from '@/lib/utils';

export async function EmphasisList() {
  const t = await getTranslations('about');
  return (
    <div>
      <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {t('emphasisTitle')}
      </h3>
      <ul data-testid="emphasis-list" className="mt-6 divide-y divide-border border-y border-border">
        {emphasis.map((item) => (
          <li key={item.id}>
            <a
              href="#stack"
              aria-label={`${item.name}, ${t(`status.${item.status}`)}. ${t('viewInStack')}`}
              className="group relative grid items-baseline gap-2 py-6 pl-4 transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal md:grid-cols-12 md:gap-6"
            >
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 w-0 bg-signal transition-all duration-300 ease-in-out group-hover:w-1.5 group-focus-visible:w-1.5"
              />
              <span className="font-display text-4xl tracking-tight transition-all duration-200 ease-in-out group-hover:translate-x-3 group-focus-visible:translate-x-3 md:col-span-5 md:text-6xl">
                {item.name}
              </span>
              <span
                className={cn(
                  'font-mono text-xs uppercase tracking-widest md:col-span-2',
                  item.status === 'learning' ? 'text-signal-ink' : 'text-muted-foreground',
                )}
              >
                {t(`status.${item.status}`)}
              </span>
              <span className="text-muted-foreground transition-all duration-200 ease-in-out md:col-span-5 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-visible:opacity-100">
                {t(`emphasis.${item.id}`)}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
```
O `aria-label` do link reúne nome+estado; o teste usa `toContainText` (texto visível) — o texto visível inclui nome e status. Conferir que o e2e passa; se `getByRole('link')` filtrar por nome acessível, o `toHaveCount(5)` continua valendo.

`components/sections/about.tsx` (server):
```tsx
import { getTranslations } from 'next-intl/server';
import { CountUp } from '@/components/motion/count-up';
import { Reveal } from '@/components/motion/reveal';
import { SectionHeading } from '@/components/section-heading';
import { AboutPhoto } from '@/components/sections/about-photo';
import { EmphasisList } from '@/components/sections/emphasis-list';
import { stats } from '@/content/stats';
import { hasProfilePhoto } from '@/lib/profile-photo';

export async function AboutSection() {
  const t = await getTranslations('about');
  const photo = hasProfilePhoto();

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading id="about" index="01" title={t('title')} />
      <div className="mt-16 grid gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          {photo ? (
            <AboutPhoto src="/images/eduardo.jpg" alt={t('photoAlt')} tag={t('tag')} />
          ) : (
            <div
              data-testid="about-photo-placeholder"
              className="flex aspect-square items-center justify-center border border-foreground bg-muted font-display text-8xl"
            >
              ED
            </div>
          )}
        </div>
        <div className="md:col-span-7">
          <Reveal>
            <p className="font-display text-3xl leading-tight tracking-tight md:text-5xl">{t('lead')}</p>
          </Reveal>
          <Reveal delay={0.1} className="mt-8 max-w-xl space-y-4 text-lg leading-relaxed text-muted-foreground">
            <p>{t('body1')}</p>
            <p>{t('body2')}</p>
          </Reveal>
          <dl data-testid="stats" className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-8">
            {stats.map((stat) => (
              <div key={stat.id} className="flex flex-col-reverse gap-1">
                <dt className="text-sm text-muted-foreground">{t(`stats.${stat.id}`)}</dt>
                <dd data-testid={`stat-${stat.id}`} className="font-display text-5xl tracking-tight md:text-6xl">
                  <CountUp to={stat.value} suffix={stat.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div className="mt-24">
        <Reveal>
          <EmphasisList />
        </Reveal>
      </div>
    </section>
  );
}
```
Se `getByTestId('stat-years')` receber texto com espaços/quebras, usar `toHaveText` com regex; o `<motion.span>` renderiza só o número.

`site-header.tsx`: `const links = ['about', 'timeline', 'projects', 'stack', 'contact'] as const;`

`app/[locale]/page.tsx`: importar `AboutSection`; ordem `<Hero /><Marquee/><AboutSection /><TimelineSection /> ...`; no JSON-LD acrescentar `image: \`${siteUrl}/images/eduardo.jpg\``. Renumerar `SectionHeading` index: timeline `02`, projects `03`, stack `04`, contact `05` (já feito na Task 1; conferir).

- [ ] **Step 6: Verificar**

Run: `npm run lint && npm run typecheck && npm test`, rebuild, `npx playwright test` (suíte inteira). Teste manual do placeholder: renomear `public/images/eduardo.jpg`, rebuild, conferir `about-photo-placeholder` (sem `img` quebrada), restaurar. Ver `/pt` 1440px e 375px (screenshot + `Read`) na área Sobre; relatar.
Expected: PASS; sem overflow em 375px.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat(about): about section with photo, emphasis list and count-up stats"
```

---

### Task 4: Movimento no site todo e restyle das demais seções

**Files:**
- Create: `components/motion/scroll-progress.tsx`, `components/motion/cursor-label.tsx`, `components/section-nav.tsx`
- Modify: `app/[locale]/layout.tsx`, `components/site-header.tsx`, `components/sections/{timeline-client,timeline,projects,project-card,stack,contact,footer}.tsx`
- Test: `tests/e2e/motion.spec.ts` (+ ajustes pontuais em `projects.spec.ts` se um seletor quebrar)

**Interfaces:**
- Consumes: `Reveal`, `SectionHeading`, tokens.
- Produces: `ScrollProgress()`, `CursorLabel({ label, enabled, className, children })`, `SectionNav({ label, links })` com `aria-current="location"` no ativo. Test ids: `scroll-progress`.

- [ ] **Step 1: Testes que falham**

`tests/e2e/motion.spec.ts`:
```ts
import { expect, test } from '@playwright/test';

test('barra de progresso cresce com o scroll', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/pt');
  const bar = page.getByTestId('scroll-progress');
  await expect(bar).toBeAttached();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect
    .poll(() => bar.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).a))
    .toBeGreaterThan(0.9);
});

test('menu desktop marca a seção ativa', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/pt');
  const nav = page.getByRole('navigation', { name: 'Navegação principal' });
  await page.locator('h2#projects').scrollIntoViewIfNeeded();
  await page.evaluate(() => document.getElementById('projects')?.scrollIntoView());
  await expect(nav.getByRole('link', { name: 'Projetos' })).toHaveAttribute('aria-current', 'location');
  await expect(nav.getByRole('link', { name: 'Contato' })).not.toHaveAttribute('aria-current', 'location');
});

test('projetos: 7º card em destaque ocupa a largura toda', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/pt');
  const cards = page.getByTestId('project-card');
  const last = await cards.last().boundingBox();
  const first = await cards.first().boundingBox();
  expect(last && first && last.width).toBeGreaterThan((first?.width ?? 0) * 1.8);
});

test('projetos com link: etiqueta "Ver site" existe e imagem é link', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/pt');
  const card = page.getByTestId('project-card').nth(2);
  await expect(card.locator('a[target="_blank"]')).toHaveCount(2);
  await expect(card.getByTestId('cursor-label')).toBeAttached();
});

test('reduced motion e sem JS: seções revelam sem scroll', async ({ browser }) => {
  for (const options of [{ reducedMotion: 'reduce' as const }, { javaScriptEnabled: false }]) {
    const ctx = await browser.newContext(options);
    const page = await ctx.newPage();
    await page.goto('/pt');
    const cards = page.getByTestId('project-card');
    await expect(cards.first().locator('xpath=..')).toHaveCSS('opacity', '1');
    await expect(cards.last().locator('xpath=..')).toHaveCSS('opacity', '1');
    await ctx.close();
  }
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx playwright test tests/e2e/motion.spec.ts`. Expected: FAIL.

- [ ] **Step 3: Primitivos**

`components/motion/scroll-progress.tsx`:
```tsx
'use client';

import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';

export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      data-testid="scroll-progress"
      style={{ scaleX: reduce ? scrollYProgress : scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-signal"
    />
  );
}
```

`components/motion/cursor-label.tsx`:
```tsx
'use client';

import { motion, useMotionValue } from 'motion/react';
import type { PointerEvent, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CursorLabelProps {
  label: string;
  enabled: boolean;
  className?: string;
  children: ReactNode;
}

export function CursorLabel({ label, enabled, className, children }: CursorLabelProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  function onMove(event: PointerEvent<HTMLDivElement>): void {
    if (event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  if (!enabled) return <div className={className}>{children}</div>;

  return (
    <div onPointerMove={onMove} className={cn('group/cursor', className)}>
      {children}
      <motion.span
        aria-hidden
        data-testid="cursor-label"
        style={{ x, y }}
        className="pointer-events-none absolute left-0 top-0 -ml-9 -mt-4 hidden bg-signal px-3 py-1 font-mono text-xs uppercase tracking-widest text-[#0f0e0c] opacity-0 transition-opacity duration-200 ease-in-out group-hover/cursor:opacity-100 [@media(hover:hover)]:block"
      >
        {label}
      </motion.span>
    </div>
  );
}
```

`components/section-nav.tsx`:
```tsx
'use client';

import { useSyncExternalStore } from 'react';
import { cn } from '@/lib/utils';

interface SectionNavProps {
  label: string;
  links: readonly { id: string; label: string }[];
}

const SECTION_IDS = ['about', 'timeline', 'projects', 'stack', 'contact'] as const;

function subscribe(onChange: () => void): () => void {
  window.addEventListener('scroll', onChange, { passive: true });
  window.addEventListener('resize', onChange);
  return () => {
    window.removeEventListener('scroll', onChange);
    window.removeEventListener('resize', onChange);
  };
}

function getSnapshot(): string {
  const line = window.innerHeight * 0.35;
  let active = '';
  for (const id of SECTION_IDS) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= line) active = id;
  }
  return active;
}

const getServerSnapshot = (): string => '';

export function SectionNav({ label, links }: SectionNavProps) {
  const active = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return (
    <nav aria-label={label} className="hidden items-center gap-6 md:flex">
      {links.map((link) => (
        <a
          key={link.id}
          href={`#${link.id}`}
          aria-current={active === link.id ? 'location' : undefined}
          className={cn(
            'border-b border-transparent pb-0.5 text-sm transition-all duration-200 ease-in-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal',
            active === link.id ? 'border-signal text-foreground' : 'text-muted-foreground',
          )}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
```
`site-header.tsx`: substituir o `<nav>` desktop por `<SectionNav label={t('primary')} links={links.map((id) => ({ id, label: t(id) }))} />`.
`layout.tsx`: renderizar `<ScrollProgress />` logo antes de `<SiteHeader />`.

- [ ] **Step 4: Cards de projeto e demais seções**

`components/sections/project-card.tsx` (substituir inteiro):
```tsx
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { CursorLabel } from '@/components/motion/cursor-label';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@/content/projects';
import { hasShot } from '@/lib/shots';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  niche: string;
  description: string;
  soonLabel: string;
  visitLabel: string;
  tagLabels: readonly string[];
  featured?: boolean;
}

export function ProjectCard({
  project,
  niche,
  description,
  soonLabel,
  visitLabel,
  tagLabels,
  featured = false,
}: ProjectCardProps) {
  const shot = hasShot(project.id);
  const image = shot ? (
    <Image
      src={`/projects/${project.id}.jpg`}
      alt=""
      fill
      sizes={featured ? '(min-width: 1152px) 560px, 100vw' : '(min-width: 1152px) 560px, (min-width: 768px) 50vw, 100vw'}
      className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04]"
    />
  ) : (
    <div className="flex size-full items-center justify-center font-display text-6xl text-muted-foreground">
      {project.number}
    </div>
  );

  return (
    <article
      data-testid="project-card"
      className={cn(
        'group relative flex h-full flex-col border border-border bg-background transition-all duration-200 ease-in-out hover:border-foreground',
        featured && 'md:grid md:grid-cols-2',
      )}
    >
      <span
        aria-hidden
        className="absolute left-0 top-0 z-10 h-0.5 w-0 bg-signal transition-all duration-500 ease-out group-hover:w-full"
      />
      <CursorLabel
        label={visitLabel}
        enabled={Boolean(project.url)}
        className="relative aspect-[16/10] overflow-hidden border-b border-border bg-muted md:aspect-auto md:min-h-72"
      >
        {project.url ? (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={-1}
            aria-hidden
            className="absolute inset-0"
          >
            {image}
          </a>
        ) : (
          image
        )}
      </CursorLabel>
      <div className="flex flex-1 flex-col gap-4 p-6 md:p-8">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {project.number} · {niche}
        </p>
        <h3 className="font-display text-4xl tracking-tight">{project.name}</h3>
        <p className="leading-relaxed text-muted-foreground">{description}</p>
        <ul className="flex flex-wrap gap-2">
          {tagLabels.map((label) => (
            <li key={label}>
              <Badge variant="outline" className="border-border font-normal">
                {label}
              </Badge>
            </li>
          ))}
        </ul>
        <p className="font-mono text-xs text-muted-foreground">{project.stack.join(' · ')}</p>
        <div className="mt-auto pt-2">
          {project.url ? (
            <a
              data-testid="project-link"
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-signal-ink transition-all duration-200 ease-in-out hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
            >
              {visitLabel}
              <ArrowUpRight className="size-4" />
            </a>
          ) : (
            <Badge data-testid="project-soon" variant="secondary" className="font-normal">
              {soonLabel}
            </Badge>
          )}
        </div>
      </div>
    </article>
  );
}
```
Nota: com a imagem como `<a aria-hidden tabIndex=-1>`, o teste `card.locator('a[target="_blank"]')` conta 2 (imagem + texto) para cards com URL.

`components/sections/projects.tsx`:
```tsx
import { getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/motion/reveal';
import { SectionHeading } from '@/components/section-heading';
import { ProjectCard } from '@/components/sections/project-card';
import { projects } from '@/content/projects';
import { cn } from '@/lib/utils';

export async function ProjectsSection() {
  const t = await getTranslations('projects');
  const lastIndex = projects.length - 1;
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading id="projects" index="03" title={t('title')} intro={t('intro')} />
      <div className="mt-16 grid gap-8 md:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal
            key={project.id}
            delay={(i % 2) * 0.1}
            className={cn(i === lastIndex && 'md:col-span-2')}
          >
            <ProjectCard
              project={project}
              niche={t(`items.${project.id}.niche`)}
              description={t(`items.${project.id}.description`)}
              soonLabel={t('soon')}
              visitLabel={t('visit')}
              tagLabels={project.tags.map((tag) => t(`tags.${tag}`))}
              featured={i === lastIndex}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```
Atenção: `Reveal` envolve cada card em um `div` (o pai do `project-card`), usado pelo teste `xpath=..`. Os testes existentes `projects.spec.ts` usam `data-testid` dos cards/links: devem continuar válidos; ajustar só seletores que dependam de classes.

`timeline-client.tsx`: substituir classes por tokens (`border-border`, linha `bg-signal`, pontos `bg-background`, marco `border-signal bg-signal`, outros `border-muted-foreground`, textos `text-muted-foreground`, título `font-display text-3xl tracking-tight`), mantendo toda a lógica de motion, `data-testid`, wrapper/ref e variantes `motion-reduce:`/`noscript:`. `timeline.tsx`: `SectionHeading index="02"` (já) .
`stack.tsx`: Group → `border-t border-border pt-6`, título `font-mono text-xs uppercase tracking-widest text-muted-foreground`, Badge `border-border font-normal`, acento `border-signal-ink text-signal-ink`; bloco extras `border-t border-border text-muted-foreground`; envolver o grid em `<Reveal>`.
`contact.tsx`: lista `divide-border border-border`, link `font-display text-3xl md:text-5xl tracking-tight hover:text-signal-ink focus-visible:ring-signal` com a seta `transition-all duration-200 ease-in-out group-hover:translate-x-1 group-hover:-translate-y-1` (link com `group`), botão de currículo usando `buttonVariants` com `hover:bg-signal hover:text-foreground`; envolver em `Reveal`.
`footer.tsx`: `border-border text-muted-foreground`; wordmark `font-display text-2xl text-foreground` "Eduardo Dias" acima da linha de copyright.

- [ ] **Step 5: Verificar**

Run: `npm run lint && npm run typecheck && npm test`, rebuild, `npx playwright test` (suíte inteira). Ver 1440px e 375px das seções Projetos/Contato e o hover do card (screenshot com `page.hover`, `Read`); relatar.
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat(motion): scroll progress, active nav, project card motion, restyled sections"
```

---

### Task 5: Verificação final e entrega

**Files:** apenas correções do que falhar; `README.md` (seção de identidade/motion e foto), `docs/superpowers/specs/2026-10-13-about-motion-design.md` (nota da divergência JPEG).

- [ ] **Step 1: Suíte completa**

Run: `npm run lint && npm run typecheck && npm test` e Playwright inteiro (`NEXT_PUBLIC_SITE_URL=http://localhost:3100 npm run build && ... npx next start -p 3100`). Expected: tudo PASS, zero erro de console.

- [ ] **Step 2: Lighthouse `/pt` e `/en` (alvo ≥ 95 nas 4 categorias; accessibility 100)**

```bash
npx lighthouse http://localhost:3100/pt --only-categories=performance,accessibility,best-practices,seo --quiet --chrome-flags="--headless=new --no-sandbox" --output=json --output-path=/private/tmp/claude-501/-Users-user-DevWeb-Sites-portifolio/5450f64e-7bed-4e2f-aef9-9a1046bfc76e/scratchpad/lh-pt.json
```
(Se Chrome não for achado: `CHROME_PATH=$(node -e "console.log(require('@playwright/test').chromium.executablePath())")`.) Repetir para `/en`. Se < 95: corrigir as auditorias reais (contraste do `signal-ink`/`muted-foreground`, CLS por fontes, LCP da foto/hero, imagem sem `priority`/dimensões, JS do marquee). Relatar os 4 scores por idioma, antes e depois.

- [ ] **Step 3: Verificação visual (obrigatória, ver as imagens)**

Playwright `fullPage` de `/pt` e `/en` em 375, 768 e 1440 px, claro e escuro, no diretório `scratchpad/final3/`. `Read` no mínimo: 1440 claro `/pt`, 375 escuro `/pt`, 1440 escuro `/en`, mais a seção Sobre em 1440 claro. Procurar: sobreposição da etiqueta da foto, bloco laranja cortado, marquee transbordando, texto sem contraste, título do hero quebrando mal em 375px, grade de pontos pesada demais. Corrigir defeitos reais e relatar o que viu; não afirmar nada que não foi visto.

- [ ] **Step 4: Reduced motion e sem JS (e2e já cobre; conferir manualmente 1 captura de cada)**

- [ ] **Step 5: Documentação e commit**

README: mencionar tema claro padrão, `components/motion/`, `public/images/eduardo.jpg` (como gerar com `sips`) e que `foto perfil/` está no `.gitignore`. Spec: nota "foto em JPEG (next/image serve WebP/AVIF)".
```bash
git add -A && git commit -m "chore: final verification, docs for about/motion"
```

- [ ] **Step 6: Pendências ao usuário**

Informar: revisar o texto de "Sobre mim"; confirmar "7 sites entregues", "5+ anos em TI" e o status "Agora: ..."; o 7º card agora é destaque; preencher URLs ao vivo faltantes; `npm run shots` com internet.
