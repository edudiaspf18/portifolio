# Portfólio Eduardo Dias Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Portfólio bilíngue (PT/EN), claro/escuro, com linha do tempo animada, vitrine das 7 landings e contato, posicionado como "AI Engineer em formação, foco Claude".

**Architecture:** Next.js 16 App Router, tudo estático em RSC. Conteúdo tipado em `content/*.ts`, textos em `messages/{pt,en}.json` (`next-intl`, rotas `/pt` e `/en`). `'use client'` só em theme-toggle, locale-switch e timeline. Prints dos projetos gerados por script Playwright para `public/projects/*.jpg`.

**Tech Stack:** Next.js 16, React 19, TypeScript estrito, Tailwind v4, shadcn/ui, lucide-react, next-intl, next-themes, motion, Vitest, Playwright, tsx.

**Spec:** `docs/superpowers/specs/2026-10-12-portifolio-design.md`

**Working dir:** `/Users/user/DevWeb/Sites/portifolio` (não é repo git; Task 1 faz `git init`).

## Global Constraints

- Server Components por padrão. `'use client'` só com hooks de estado ou eventos.
- Evitar `useEffect`. Nunca `any`. Early returns.
- Nunca CSS puro nem `.module.css`. Só Tailwind. (Tokens do shadcn em `globals.css`, gerados pelo init, são a única exceção.)
- UI via shadcn (`@/components/ui/*`) com `cn()`. Ícones só de `lucide-react` (sem ícones de marca: links externos usam `ArrowUpRight`).
- Toda interação: `hover:`, `focus-visible:` (nunca `focus:`), `transition-all duration-200 ease-in-out`.
- Estética: zinc monocromático + UMA cor de destaque (`orange-600` claro / `orange-500` escuro). Bordas 1px `border-zinc-200 dark:border-zinc-800`. `shadow-sm` no máximo. Sem gradientes, sem glassmorphism, sem animação bouncy.
- Texto secundário `text-zinc-500`. Títulos grandes `tracking-tight`. Espaçamento generoso (`gap-8`, `py-24`).
- Idiomas: `pt` (default) e `en`. Toda string visível vem de `messages/*.json`, exceto nomes próprios e nomes de tecnologia.
- Antes de escrever código Next: ler `node_modules/next/dist/docs/` (AGENTS.md gerado avisa de breaking changes). `params` é `Promise` no Next 16; `middleware` chama-se `proxy`.
- Fora de escopo: blog, CMS, banco, formulário com backend.
- Dados fixos: e-mail `dududiaspf@gmail.com`; LinkedIn `https://www.linkedin.com/in/eduardo-dias-8a924131a`; GitHub `https://github.com/edudiaspf18`; Instagram `https://www.instagram.com/dudu_diaspf/`; WhatsApp `https://wa.me/5562994267841`; Anápolis, GO.
- URLs ao vivo conhecidas: evelyn `https://www.evelynrafaelanutri.com.br`, esther `https://www.estherduartenutri.com.br`, angelica `https://www.dra-angelicabatista.com.br`. Demais `null` (badge "em breve").

## Review Focus

1. Locale inválido (`/fr`, `/xx/abc`) → 404, nunca crash. (Task 3, e2e)
2. `Accept-Language: en-US` em `/` → `/en`; idioma não suportado (`fr`) → `/pt`. (Task 3, e2e)
3. `prefers-reduced-motion: reduce` → itens da timeline visíveis sem scroll e linha completa. (Task 4, e2e)
4. Projeto sem print em `public/projects/` → placeholder, nunca imagem quebrada. (Task 5, unit `hasShot` + e2e)
5. Viewport 375px → sem scroll horizontal. Sistema em dark (`colorScheme: 'dark'`) → `html.dark` no primeiro render. (Task 3 e Task 8, e2e)

---

## File Structure

```
package.json, tsconfig.json, next.config.ts, vitest.config.ts, playwright.config.ts, .env.example
proxy.ts                               next-intl proxy (locale detection/redirect)
i18n/routing.ts, request.ts, navigation.ts
app/[locale]/layout.tsx                html/body, fontes, providers
app/[locale]/page.tsx                  composição + metadata + JSON-LD
app/[locale]/opengraph-image.tsx
app/[locale]/not-found.tsx
app/sitemap.ts, app/robots.ts
app/globals.css                        (gerado)
components/ui/button.tsx, badge.tsx    (shadcn)
components/site-header.tsx, theme-toggle.tsx, locale-switch.tsx
components/section-heading.tsx
components/sections/hero.tsx, timeline.tsx, timeline-client.tsx,
                    projects.tsx, project-card.tsx, stack.tsx, contact.tsx, footer.tsx
content/timeline.ts, projects.ts, stack.ts, socials.ts
lib/site.ts, lib/shots.ts
messages/pt.json, en.json
scripts/shots.ts
public/projects/*.jpg, public/curriculo-eduardo-dias.pdf
tests/unit/messages.test.ts, content.test.ts, shots.test.ts
tests/e2e/i18n.spec.ts, theme.spec.ts, timeline.spec.ts, projects.spec.ts, layout.spec.ts
```

---

### Task 1: Scaffold, dependências, ferramentas de teste

**Files:**
- Create: projeto Next na raiz, `vitest.config.ts`, `playwright.config.ts`, `.env.example`
- Modify: `package.json` (scripts)

**Interfaces:**
- Produces: scripts `dev`, `build`, `start`, `lint`, `typecheck`, `test`, `e2e`, `shots`; alias `@/*` → raiz.

- [ ] **Step 1: Scaffold (raiz já tem `docs/` e o PDF; create-next-app aceita)**

```bash
cd /Users/user/DevWeb/Sites/portifolio
npx create-next-app@latest . --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --turbopack --yes
```
Expected: `package.json`, `app/`, `next.config.ts` criados; `docs/` e PDF intactos.

- [ ] **Step 2: Instalar dependências**

```bash
npm i next-intl next-themes motion
npm i -D vitest @playwright/test tsx
npx playwright install chromium
npx shadcn@latest init -d
npx shadcn@latest add button badge
```
Se `shadcn init` perguntar, escolher base `zinc`. Expected: `components/ui/button.tsx`, `badge.tsx`, `lib/utils.ts` (`cn`).

- [ ] **Step 3: Ler docs do Next instalado**

Run: `ls node_modules/next/dist/docs/` e ler os guias de `proxy`, `i18n`, `metadata`, `opengraph-image`. Confirmar: arquivo `proxy.ts` (não `middleware.ts`) e `params` como `Promise`. Se algo divergir do plano, seguir a doc e anotar no commit.

- [ ] **Step 4: Scripts e config**

`package.json` → `"scripts"` deve conter:
```json
"dev": "next dev",
"build": "next build",
"start": "next start",
"lint": "eslint .",
"typecheck": "next typegen && tsc --noEmit",
"test": "vitest run",
"e2e": "playwright test",
"shots": "tsx scripts/shots.ts"
```

`vitest.config.ts`:
```ts
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: { include: ['tests/unit/**/*.test.ts'] },
  resolve: { alias: { '@': fileURLToPath(new URL('.', import.meta.url)) } },
});
```

`playwright.config.ts`:
```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  use: { baseURL: 'http://localhost:3100' },
  webServer: {
    command: 'npm run build && npx next start -p 3100',
    url: 'http://localhost:3100/pt',
    timeout: 240_000,
    reuseExistingServer: !process.env.CI,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
```

`.env.example`:
```
NEXT_PUBLIC_SITE_URL=https://seu-dominio.com.br
```

- [ ] **Step 5: Verificar e commitar**

Run: `npm run lint && npx tsc --noEmit && npm run build`
Expected: PASS.

```bash
git init && git add -A && git commit -m "chore: scaffold next 16 + tooling"
```
(Mensagem de commit termina com a linha `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.)

---

### Task 2: Camada de conteúdo + mensagens (TDD)

**Files:**
- Create: `content/timeline.ts`, `content/projects.ts`, `content/stack.ts`, `content/socials.ts`, `lib/site.ts`, `lib/shots.ts`, `messages/pt.json`, `messages/en.json`
- Test: `tests/unit/messages.test.ts`, `tests/unit/content.test.ts`, `tests/unit/shots.test.ts`

**Interfaces:**
- Produces:
  - `type TimelineKind = 'work' | 'study' | 'milestone'`; `interface TimelineEntry { id: TimelineId; kind: TimelineKind }`; `const timeline: readonly TimelineEntry[]` (ordem cronológica).
  - `type ProjectId`; `interface Project { id: ProjectId; number: string; name: string; url: string | null; stack: readonly string[]; tags: readonly ProjectTag[] }`; `const projects: readonly Project[]`.
  - `const stackUsing / stackLearning / stackBasic: readonly string[]`.
  - `interface Social { id: SocialId; href: string; label: string }`; `const socials: readonly Social[]`.
  - `siteUrl: string` (`lib/site.ts`); `hasShot(id: string, dir?: string): boolean` (`lib/shots.ts`).
  - Chaves de mensagens: `meta.*`, `nav.*`, `hero.*`, `timeline.{title,items.<id>.{period,title,org,description}}`, `projects.{title,intro,soon,visit,tags.<tag>,items.<id>.{niche,description}}`, `stack.*`, `contact.*`, `footer.*`, `notFound.*`.

- [ ] **Step 1: Escrever testes que falham**

`tests/unit/messages.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import pt from '@/messages/pt.json';

function keys(obj: unknown, prefix = ''): string[] {
  if (typeof obj !== 'object' || obj === null) return [prefix];
  return Object.entries(obj).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k));
}

describe('messages', () => {
  it('pt e en têm as mesmas chaves', () => {
    expect(keys(en).sort()).toEqual(keys(pt).sort());
  });
  it('nenhum valor vazio', () => {
    const empty = (o: unknown): boolean =>
      typeof o === 'string' ? o.trim() === '' : Object.values(o as object).some(empty);
    expect(empty(pt)).toBe(false);
    expect(empty(en)).toBe(false);
  });
});
```

`tests/unit/content.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { projects } from '@/content/projects';
import { socials } from '@/content/socials';
import { timeline } from '@/content/timeline';
import pt from '@/messages/pt.json';

describe('content', () => {
  it('timeline: todo id tem textos', () => {
    for (const { id } of timeline) {
      const item = (pt.timeline.items as Record<string, Record<string, string>>)[id];
      expect(item, id).toBeDefined();
      expect(Object.keys(item).sort()).toEqual(['description', 'org', 'period', 'title']);
    }
  });
  it('projects: ids únicos, textos presentes, url null ou https', () => {
    const ids = projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(7);
    for (const p of projects) {
      const item = (pt.projects.items as Record<string, Record<string, string>>)[p.id];
      expect(item, p.id).toBeDefined();
      expect(item.niche).toBeTruthy();
      expect(item.description).toBeTruthy();
      if (p.url !== null) expect(p.url.startsWith('https://')).toBe(true);
      for (const tag of p.tags) {
        expect((pt.projects.tags as Record<string, string>)[tag], tag).toBeTruthy();
      }
    }
  });
  it('socials: hrefs fixos', () => {
    const byId = Object.fromEntries(socials.map((s) => [s.id, s.href]));
    expect(byId.email).toBe('mailto:dududiaspf@gmail.com');
    expect(byId.github).toBe('https://github.com/edudiaspf18');
    expect(byId.instagram).toBe('https://www.instagram.com/dudu_diaspf/');
    expect(byId.linkedin).toBe('https://www.linkedin.com/in/eduardo-dias-8a924131a');
    expect(byId.whatsapp).toBe('https://wa.me/5562994267841');
  });
});
```

`tests/unit/shots.test.ts`:
```ts
import { mkdtempSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { hasShot } from '@/lib/shots';

describe('hasShot', () => {
  it('true só quando o jpg existe', () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), 'shots-'));
    writeFileSync(path.join(dir, 'a.jpg'), 'x');
    expect(hasShot('a', dir)).toBe(true);
    expect(hasShot('b', dir)).toBe(false);
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test`
Expected: FAIL (módulos não existem).

- [ ] **Step 3: Implementar conteúdo**

`lib/site.ts`:
```ts
export const siteUrl: string = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
```

`lib/shots.ts`:
```ts
import { existsSync } from 'node:fs';
import path from 'node:path';

export const shotsDir: string = path.join(process.cwd(), 'public', 'projects');

export function hasShot(id: string, dir: string = shotsDir): boolean {
  return existsSync(path.join(dir, `${id}.jpg`));
}
```

`content/timeline.ts`:
```ts
export type TimelineKind = 'work' | 'study' | 'milestone';
export type TimelineId = 'techWinner' | 'baan' | 'cpet' | 'frontend' | 'ai' | 'degree';

export interface TimelineEntry {
  id: TimelineId;
  kind: TimelineKind;
}

export const timeline: readonly TimelineEntry[] = [
  { id: 'techWinner', kind: 'work' },
  { id: 'baan', kind: 'work' },
  { id: 'cpet', kind: 'study' },
  { id: 'frontend', kind: 'work' },
  { id: 'ai', kind: 'milestone' },
  { id: 'degree', kind: 'study' },
];
```

`content/projects.ts`:
```ts
export type ProjectId =
  | 'charles'
  | 'alianca'
  | 'evelyn'
  | 'cecilia'
  | 'esther'
  | 'angelica'
  | 'winner';
export type ProjectTag = 'seo' | 'ga4' | 'gtm' | 'whatsapp' | 'cookies';

export interface Project {
  id: ProjectId;
  number: string;
  name: string;
  url: string | null;
  stack: readonly string[];
  tags: readonly ProjectTag[];
}

const base = ['Next.js', 'React', 'TypeScript', 'Tailwind'] as const;

export const projects: readonly Project[] = [
  { id: 'charles', number: '001', name: 'Charles Veículos', url: null, stack: [...base, 'shadcn/ui'], tags: ['seo', 'ga4', 'whatsapp'] },
  { id: 'alianca', number: '002', name: 'Aliança Móveis', url: null, stack: [...base, 'Playwright'], tags: ['gtm'] },
  { id: 'evelyn', number: '003', name: 'Evelyn Rafaela', url: 'https://www.evelynrafaelanutri.com.br', stack: [...base], tags: ['whatsapp'] },
  { id: 'cecilia', number: '004', name: 'Dra. Cecília Fontoura', url: null, stack: [...base, 'Playwright'], tags: ['whatsapp'] },
  { id: 'esther', number: '005', name: 'Esther Duarte', url: 'https://www.estherduartenutri.com.br', stack: [...base], tags: ['seo', 'ga4', 'cookies', 'whatsapp'] },
  { id: 'angelica', number: '006', name: 'Dra. Angélica Batista', url: 'https://www.dra-angelicabatista.com.br', stack: [...base], tags: ['seo', 'ga4', 'cookies', 'whatsapp'] },
  { id: 'winner', number: '007', name: 'Winner Tech', url: null, stack: [...base], tags: ['whatsapp'] },
];
```

`content/stack.ts`:
```ts
export const stackUsing: readonly string[] = [
  'HTML', 'CSS', 'JavaScript', 'Tailwind CSS', 'shadcn/ui', 'Figma',
  'Claude Code', 'SEO técnico', 'GA4 / GTM', 'WordPress',
];
export const stackLearning: readonly string[] = [
  'TypeScript', 'React', 'Next.js', 'React Native', 'Claude API', 'Agent SDK',
];
export const stackBasic: readonly string[] = ['PHP', 'Power BI', 'Pacote Office'];
```

`content/socials.ts`:
```ts
export type SocialId = 'email' | 'linkedin' | 'github' | 'instagram' | 'whatsapp';

export interface Social {
  id: SocialId;
  href: string;
  label: string;
}

export const socials: readonly Social[] = [
  { id: 'email', href: 'mailto:dududiaspf@gmail.com', label: 'dududiaspf@gmail.com' },
  { id: 'linkedin', href: 'https://www.linkedin.com/in/eduardo-dias-8a924131a', label: 'LinkedIn' },
  { id: 'github', href: 'https://github.com/edudiaspf18', label: 'GitHub' },
  { id: 'instagram', href: 'https://www.instagram.com/dudu_diaspf/', label: 'Instagram' },
  { id: 'whatsapp', href: 'https://wa.me/5562994267841', label: 'WhatsApp' },
];
```

`messages/pt.json`:
```json
{
  "meta": {
    "title": "Eduardo Dias · AI Engineer em formação",
    "description": "Portfólio de Eduardo Dias: AI Engineer em formação com foco em Claude, landing pages de alta conversão e SEO. Anápolis, GO."
  },
  "nav": {
    "timeline": "Trajetória",
    "projects": "Projetos",
    "stack": "Stack",
    "contact": "Contato",
    "theme": "Alternar tema",
    "language": "Idioma",
    "home": "Início"
  },
  "hero": {
    "eyebrow": "Eduardo Dias · Anápolis, GO",
    "title": "AI Engineer em formação. Foco em Claude.",
    "subtitle": "Construo landing pages de alta conversão com SEO e uso IA para entregar mais rápido. Front-end e UX são a minha base.",
    "ctaProjects": "Ver projetos",
    "ctaContact": "Falar comigo"
  },
  "timeline": {
    "title": "Trajetória",
    "items": {
      "techWinner": {
        "period": "2020 – mar/2025",
        "title": "Técnico de TI",
        "org": "Winner Tecnologia",
        "description": "Montagem de computadores, cabeamento estruturado e suporte direto na resolução de problemas técnicos."
      },
      "baan": {
        "period": "2021 – mar/2025",
        "title": "Auxiliar de TI",
        "org": "BAAN · Força Aérea Brasileira",
        "description": "Atendimento primário e apoio às rotinas de infraestrutura de TI, em paralelo à Winner."
      },
      "cpet": {
        "period": "2022 – 2023",
        "title": "Técnico em Informática para Internet",
        "org": "CPET",
        "description": "Formação técnica em desenvolvimento web."
      },
      "frontend": {
        "period": "mar/2025 – hoje",
        "title": "Desenvolvedor Front-End Júnior",
        "org": "Winner Tecnologia",
        "description": "Interfaces web com UX/UI e Figma. Landing pages de alta conversão com SEO e rastreamento."
      },
      "ai": {
        "period": "set/2026",
        "title": "Início em AI Engineering",
        "org": "Foco em Claude",
        "description": "Uso de IA no fluxo de desenvolvimento e estudo de Claude Code, Claude API e Agent SDK."
      },
      "degree": {
        "period": "jun/2028 (previsão)",
        "title": "Engenharia de Software",
        "org": "UniEVANGÉLICA",
        "description": "Bacharelado em andamento, 5º período."
      }
    }
  },
  "projects": {
    "title": "Projetos",
    "intro": "Landing pages de clientes reais, feitas para converter e ser encontradas no Google.",
    "soon": "Em breve",
    "visit": "Visitar site",
    "tags": {
      "seo": "SEO",
      "ga4": "GA4",
      "gtm": "GTM",
      "whatsapp": "WhatsApp",
      "cookies": "Cookies"
    },
    "items": {
      "charles": { "niche": "Seminovos e locadora · Anápolis, GO", "description": "Vitrine de 26 veículos com filtros, página por carro e CTA direto ao WhatsApp." },
      "alianca": { "niche": "Móveis para escritório", "description": "Landing de conversão com tracking via GTM e testes end-to-end." },
      "evelyn": { "niche": "Nutrição · Anápolis, GO", "description": "Landing de autoridade que leva ao agendamento da consulta pelo WhatsApp." },
      "cecilia": { "niche": "Biomedicina estética · Uberlândia, MG", "description": "Landing editorial com credibilidade profissional à vista e jornada da paciente." },
      "esther": { "niche": "Nutrição online · Anápolis, GO", "description": "Atendimento online para todo o Brasil, avaliação presencial e agendamento via WhatsApp." },
      "angelica": { "niche": "Odontologia", "description": "Identidade vetorizada, tipografia editorial, SEO, tracking e consentimento de cookies." },
      "winner": { "niche": "Institucional · Winner Tech", "description": "Site que apresenta os sistemas Zelo, Alfa, Lume e Laço e a oferta de sites sob medida." }
    }
  },
  "stack": {
    "title": "Stack",
    "using": "Uso no dia a dia",
    "learning": "Estudando agora",
    "basic": "Noções",
    "extras": "Certificação e idiomas",
    "scrum": "Scrum Foundation (concluído)",
    "languages": "Português nativo · Inglês básico"
  },
  "contact": {
    "title": "Vamos conversar",
    "subtitle": "Landing page, site ou um projeto com IA. Respondo rápido.",
    "resume": "Baixar currículo",
    "location": "Anápolis, GO"
  },
  "footer": {
    "rights": "© 2026 Eduardo Dias.",
    "built": "Feito com Next.js, Tailwind e Claude."
  },
  "notFound": {
    "title": "Página não encontrada",
    "back": "Voltar ao início"
  }
}
```

`messages/en.json` (mesmas chaves, valores em inglês):
```json
{
  "meta": {
    "title": "Eduardo Dias · AI Engineer in training",
    "description": "Eduardo Dias' portfolio: AI Engineer in training focused on Claude, high-conversion landing pages and SEO. Anápolis, Brazil."
  },
  "nav": {
    "timeline": "Journey",
    "projects": "Projects",
    "stack": "Stack",
    "contact": "Contact",
    "theme": "Toggle theme",
    "language": "Language",
    "home": "Home"
  },
  "hero": {
    "eyebrow": "Eduardo Dias · Anápolis, Brazil",
    "title": "AI Engineer in training. Focused on Claude.",
    "subtitle": "I build high-conversion landing pages with SEO and use AI to ship faster. Front-end and UX are my foundation.",
    "ctaProjects": "See projects",
    "ctaContact": "Get in touch"
  },
  "timeline": {
    "title": "Journey",
    "items": {
      "techWinner": {
        "period": "2020 – Mar 2025",
        "title": "IT Technician",
        "org": "Winner Tecnologia",
        "description": "Computer assembly, structured cabling and hands-on technical support."
      },
      "baan": {
        "period": "2021 – Mar 2025",
        "title": "IT Assistant",
        "org": "BAAN · Brazilian Air Force",
        "description": "First-line support and help with core IT infrastructure routines, alongside Winner."
      },
      "cpet": {
        "period": "2022 – 2023",
        "title": "Technical Degree in Internet Computing",
        "org": "CPET",
        "description": "Technical training in web development."
      },
      "frontend": {
        "period": "Mar 2025 – present",
        "title": "Junior Front-End Developer",
        "org": "Winner Tecnologia",
        "description": "Web interfaces with UX/UI and Figma. High-conversion landing pages with SEO and tracking."
      },
      "ai": {
        "period": "Sep 2026",
        "title": "Started AI Engineering",
        "org": "Focused on Claude",
        "description": "AI in the development workflow, plus Claude Code, Claude API and Agent SDK studies."
      },
      "degree": {
        "period": "Jun 2028 (expected)",
        "title": "Software Engineering",
        "org": "UniEVANGÉLICA",
        "description": "Bachelor's degree in progress, 5th term."
      }
    }
  },
  "projects": {
    "title": "Projects",
    "intro": "Landing pages for real clients, built to convert and to be found on Google.",
    "soon": "Coming soon",
    "visit": "Visit site",
    "tags": {
      "seo": "SEO",
      "ga4": "GA4",
      "gtm": "GTM",
      "whatsapp": "WhatsApp",
      "cookies": "Cookies"
    },
    "items": {
      "charles": { "niche": "Used cars and rentals · Anápolis, Brazil", "description": "Showcase of 26 vehicles with filters, a page per car and a direct WhatsApp CTA." },
      "alianca": { "niche": "Office furniture", "description": "Conversion landing page with GTM tracking and end-to-end tests." },
      "evelyn": { "niche": "Nutrition · Anápolis, Brazil", "description": "Authority landing page that drives appointment booking through WhatsApp." },
      "cecilia": { "niche": "Aesthetic biomedicine · Uberlândia, Brazil", "description": "Editorial landing page with professional credentials up front and the patient journey." },
      "esther": { "niche": "Online nutrition · Anápolis, Brazil", "description": "Online care across Brazil, in-person assessment and booking via WhatsApp." },
      "angelica": { "niche": "Dentistry", "description": "Vectorized identity, editorial typography, SEO, tracking and cookie consent." },
      "winner": { "niche": "Corporate · Winner Tech", "description": "Site presenting the Zelo, Alfa, Lume and Laço systems and the custom website offer." }
    }
  },
  "stack": {
    "title": "Stack",
    "using": "Daily drivers",
    "learning": "Learning now",
    "basic": "Basics",
    "extras": "Certification and languages",
    "scrum": "Scrum Foundation (completed)",
    "languages": "Portuguese native · English basic"
  },
  "contact": {
    "title": "Let's talk",
    "subtitle": "A landing page, a website or an AI project. I reply fast.",
    "resume": "Download resume",
    "location": "Anápolis, Brazil"
  },
  "footer": {
    "rights": "© 2026 Eduardo Dias.",
    "built": "Built with Next.js, Tailwind and Claude."
  },
  "notFound": {
    "title": "Page not found",
    "back": "Back to home"
  }
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test && npx tsc --noEmit`
Expected: PASS (3 arquivos). Se `tsc` reclamar de `resolveJsonModule`, habilitar em `tsconfig.json`.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: content layer, messages pt/en, hasShot"
```

---

### Task 3: i18n, tema, layout, header, hero (TDD e2e)

**Files:**
- Create: `i18n/routing.ts`, `i18n/request.ts`, `i18n/navigation.ts`, `proxy.ts`, `app/[locale]/layout.tsx`, `app/[locale]/page.tsx`, `app/[locale]/not-found.tsx`, `components/site-header.tsx`, `components/theme-toggle.tsx`, `components/locale-switch.tsx`, `components/section-heading.tsx`, `components/sections/hero.tsx`
- Modify: `next.config.ts`; remover `app/layout.tsx`, `app/page.tsx` gerados
- Test: `tests/e2e/i18n.spec.ts`, `tests/e2e/theme.spec.ts`, `tests/e2e/layout.spec.ts`

**Interfaces:**
- Consumes: `messages/*.json` (Task 2).
- Produces: `routing` (`locales: ['pt','en']`, `defaultLocale: 'pt'`); `Link`, `usePathname` de `@/i18n/navigation`; `SectionHeading({ id, title, intro? })`; layout com `<html lang class>`; `ThemeToggle`, `LocaleSwitch`, `SiteHeader`, `Hero`.

- [ ] **Step 1: Escrever e2e que falha**

`tests/e2e/i18n.spec.ts`:
```ts
import { expect, test } from '@playwright/test';

test.describe('i18n', () => {
  test('Accept-Language en → /en', async ({ browser }) => {
    const ctx = await browser.newContext({ locale: 'en-US', extraHTTPHeaders: { 'Accept-Language': 'en-US' } });
    const page = await ctx.newPage();
    await page.goto('/');
    await expect(page).toHaveURL(/\/en$/);
    await ctx.close();
  });
  test('idioma não suportado → /pt', async ({ browser }) => {
    const ctx = await browser.newContext({ extraHTTPHeaders: { 'Accept-Language': 'fr-FR' } });
    const page = await ctx.newPage();
    await page.goto('/');
    await expect(page).toHaveURL(/\/pt$/);
    await ctx.close();
  });
  test('locale inválido → 404', async ({ page }) => {
    expect((await page.goto('/xx'))?.status()).toBe(404);
    expect((await page.goto('/xx/abc'))?.status()).toBe(404);
  });
  test('switch pt → en muda URL, lang e h1', async ({ page }) => {
    await page.goto('/pt');
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('AI Engineer em formação');
    await page.getByRole('link', { name: 'en', exact: true }).click();
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('AI Engineer in training');
  });
});
```

`tests/e2e/theme.spec.ts`:
```ts
import { expect, test } from '@playwright/test';

test('sistema dark → html.dark no primeiro render', async ({ browser }) => {
  const ctx = await browser.newContext({ colorScheme: 'dark' });
  const page = await ctx.newPage();
  await page.goto('/pt');
  await expect(page.locator('html')).toHaveClass(/dark/);
  await ctx.close();
});

test('toggle alterna dark/light', async ({ browser }) => {
  const ctx = await browser.newContext({ colorScheme: 'light' });
  const page = await ctx.newPage();
  await page.goto('/pt');
  await expect(page.locator('html')).not.toHaveClass(/dark/);
  await page.getByRole('button', { name: 'Alternar tema' }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.getByRole('button', { name: 'Alternar tema' }).click();
  await expect(page.locator('html')).not.toHaveClass(/dark/);
  await ctx.close();
});
```

`tests/e2e/layout.spec.ts`:
```ts
import { expect, test } from '@playwright/test';

for (const path of ['/pt', '/en']) {
  test(`${path}: sem scroll horizontal em 375px e sem erro de console`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(e.message));
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });
}
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx playwright test tests/e2e/i18n.spec.ts`
Expected: FAIL (404 / sem rota `[locale]`).

- [ ] **Step 3: Implementar i18n**

`i18n/routing.ts`:
```ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['pt', 'en'],
  defaultLocale: 'pt',
});
```

`i18n/navigation.ts`:
```ts
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, usePathname } = createNavigation(routing);
```

`i18n/request.ts`:
```ts
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const messages = (await import(`../messages/${locale}.json`)) as { default: Record<string, unknown> };
  return { locale, messages: messages.default };
});
```

`proxy.ts` (raiz):
```ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```
Nota: a matcher exclui `/sitemap.xml`, `/robots.txt`, `/curriculo-*.pdf`, `/projects/*.jpg`. Se a doc do Next 16 exigir `export function proxy`, ajustar para `export default` conforme a doc lida no Task 1.

`next.config.ts`:
```ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);
```

- [ ] **Step 4: Implementar layout, componentes e hero**

Apagar `app/layout.tsx` e `app/page.tsx`. Mover o `import './globals.css'` para o novo layout (o `app/globals.css` fica).

`app/[locale]/layout.tsx`:
```tsx
import type { ReactNode } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';
import { SiteHeader } from '@/components/site-header';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import '../globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          'bg-white font-sans text-zinc-950 antialiased dark:bg-zinc-950 dark:text-zinc-50',
        )}
      >
        <NextIntlClientProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SiteHeader />
            <main>{children}</main>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```
Garantir em `app/globals.css` (Tailwind v4) que `font-sans` use `var(--font-geist-sans)` (o `@theme inline` gerado pelo create-next-app já faz isso).

`app/[locale]/not-found.tsx`:
```tsx
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function NotFound() {
  const t = await getTranslations('notFound');
  return (
    <section className="mx-auto max-w-6xl px-6 py-36">
      <h1 className="text-4xl font-bold tracking-tight">{t('title')}</h1>
      <Link
        href="/"
        className="mt-8 inline-block text-sm text-zinc-500 transition-all duration-200 ease-in-out hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:hover:text-zinc-50"
      >
        {t('back')}
      </Link>
    </section>
  );
}
```
Nota: para `/xx` o Next serve 404 do próprio framework (sem `[locale]` válido). O teste só exige status 404.

`components/theme-toggle.tsx`:
```tsx
'use client';

import { Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations('nav');

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={t('theme')}
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="transition-all duration-200 ease-in-out hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-400 dark:hover:bg-zinc-900"
    >
      <Sun className="size-4 dark:hidden" />
      <Moon className="hidden size-4 dark:block" />
    </Button>
  );
}
```

`components/locale-switch.tsx`:
```tsx
'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';

export function LocaleSwitch() {
  const active = useLocale();
  const pathname = usePathname();
  const t = useTranslations('nav');

  return (
    <nav aria-label={t('language')} className="flex items-center gap-1 text-xs font-medium">
      {routing.locales.map((locale) => (
        <Link
          key={locale}
          href={pathname}
          locale={locale}
          aria-current={locale === active ? 'true' : undefined}
          className={cn(
            'rounded-md px-2 py-1 uppercase transition-all duration-200 ease-in-out hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:hover:text-zinc-50',
            locale === active ? 'text-zinc-950 dark:text-zinc-50' : 'text-zinc-500',
          )}
        >
          {locale}
        </Link>
      ))}
    </nav>
  );
}
```

`components/site-header.tsx`:
```tsx
import { getTranslations } from 'next-intl/server';
import { LocaleSwitch } from '@/components/locale-switch';
import { ThemeToggle } from '@/components/theme-toggle';

const links = ['timeline', 'projects', 'stack', 'contact'] as const;

export async function SiteHeader() {
  const t = await getTranslations('nav');
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-6">
        <a
          href="#top"
          className="text-sm font-semibold tracking-tight transition-all duration-200 ease-in-out hover:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
        >
          Eduardo Dias
        </a>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className="text-sm text-zinc-500 transition-all duration-200 ease-in-out hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:hover:text-zinc-50"
            >
              {t(id)}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LocaleSwitch />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
```

`components/section-heading.tsx`:
```tsx
interface SectionHeadingProps {
  id: string;
  title: string;
  intro?: string;
}

export function SectionHeading({ id, title, intro }: SectionHeadingProps) {
  return (
    <div className="grid gap-4 md:grid-cols-12">
      <h2
        id={id}
        className="scroll-mt-24 text-3xl font-bold tracking-tight md:col-span-5 md:text-4xl"
      >
        {title}
      </h2>
      {intro ? (
        <p className="max-w-xl leading-relaxed text-zinc-500 md:col-span-7">{intro}</p>
      ) : null}
    </div>
  );
}
```
Nota: os `href="#timeline"` etc. apontam para o `id` do `<h2>`; cada seção usa `id` = nome da chave (`timeline`, `projects`, `stack`, `contact`).

`components/sections/hero.tsx`:
```tsx
import { ArrowDown } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export async function Hero() {
  const t = await getTranslations('hero');
  return (
    <section id="top" className="mx-auto max-w-6xl px-6 pb-24 pt-24 md:pt-36">
      <div className="max-w-4xl">
        <p className="text-sm font-medium text-orange-600 dark:text-orange-500">{t('eyebrow')}</p>
        <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
          {t('title')}
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-zinc-500">{t('subtitle')}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="#projects"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'bg-zinc-950 text-zinc-50 transition-all duration-200 ease-in-out hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200',
            )}
          >
            {t('ctaProjects')}
            <ArrowDown className="size-4" />
          </a>
          <a
            href="#contact"
            className={cn(
              buttonVariants({ size: 'lg', variant: 'outline' }),
              'border-zinc-200 transition-all duration-200 ease-in-out hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:border-zinc-800 dark:hover:bg-zinc-900',
            )}
          >
            {t('ctaContact')}
          </a>
        </div>
      </div>
    </section>
  );
}
```

`app/[locale]/page.tsx` (será expandido nos Tasks seguintes):
```tsx
import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/sections/hero';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Hero />;
}
```

- [ ] **Step 5: Rodar e ver passar**

Run: `npx tsc --noEmit && npm run lint && npx playwright test tests/e2e/i18n.spec.ts tests/e2e/theme.spec.ts tests/e2e/layout.spec.ts`
Expected: PASS. Se `/xx` não devolver 404, conferir matcher do `proxy.ts` e `notFound()` no layout.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: i18n, theme, header, hero"
```

---

### Task 4: Linha do tempo animada (TDD e2e)

**Files:**
- Create: `components/sections/timeline.tsx`, `components/sections/timeline-client.tsx`
- Modify: `app/[locale]/page.tsx`
- Test: `tests/e2e/timeline.spec.ts`

**Interfaces:**
- Consumes: `timeline` (`content/timeline.ts`), chaves `timeline.*`, `SectionHeading`.
- Produces: `TimelineSection()` (server), `TimelineClient({ items: TimelineItem[] })` com `interface TimelineItem { id: string; kind: TimelineKind; period: string; title: string; org: string; description: string }`. Test ids: `timeline-item`, `timeline-line`.

- [ ] **Step 1: Escrever e2e que falha**

`tests/e2e/timeline.spec.ts`:
```ts
import { expect, test } from '@playwright/test';

test('timeline: 6 itens, ordem cronológica, revelam no scroll', async ({ page }) => {
  await page.goto('/pt');
  const items = page.getByTestId('timeline-item');
  await expect(items).toHaveCount(6);
  await expect(items.first()).toContainText('Técnico de TI');
  await expect(items.last()).toContainText('Engenharia de Software');
  await page.locator('#timeline').scrollIntoViewIfNeeded();
  await items.last().scrollIntoViewIfNeeded();
  await expect(items.last()).toHaveCSS('opacity', '1');
});

test('timeline: reduced motion mostra tudo sem scroll e linha completa', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/pt');
  const items = page.getByTestId('timeline-item');
  for (let i = 0; i < 6; i++) {
    await expect(items.nth(i)).toHaveCSS('opacity', '1');
  }
  const transform = await page.getByTestId('timeline-line').evaluate((el) => getComputedStyle(el).transform);
  expect(['none', 'matrix(1, 0, 0, 1, 0, 0)']).toContain(transform);
  await ctx.close();
});

test('timeline em inglês', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByTestId('timeline-item').first()).toContainText('IT Technician');
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx playwright test tests/e2e/timeline.spec.ts`
Expected: FAIL (`timeline-item` não existe).

- [ ] **Step 3: Implementar**

`components/sections/timeline-client.tsx`:
```tsx
'use client';

import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { useRef } from 'react';
import type { TimelineKind } from '@/content/timeline';
import { cn } from '@/lib/utils';

export interface TimelineItem {
  id: string;
  kind: TimelineKind;
  period: string;
  title: string;
  org: string;
  description: string;
}

interface TimelineClientProps {
  items: readonly TimelineItem[];
}

export function TimelineClient({ items }: TimelineClientProps) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 70%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <ol ref={ref} className="relative ml-2 border-l border-zinc-200 dark:border-zinc-800">
      <motion.span
        aria-hidden
        data-testid="timeline-line"
        style={{ scaleY: reduce ? 1 : scaleY }}
        className="absolute -left-px top-0 h-full w-px origin-top bg-orange-600 dark:bg-orange-500"
      />
      {items.map((item) => (
        <motion.li
          key={item.id}
          data-testid="timeline-item"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative pb-14 pl-8 last:pb-0 md:pl-12"
        >
          <span
            aria-hidden
            className={cn(
              'absolute -left-[5px] top-2 size-2.5 rounded-full border bg-white dark:bg-zinc-950',
              item.kind === 'milestone'
                ? 'border-orange-600 bg-orange-600 dark:border-orange-500 dark:bg-orange-500'
                : 'border-zinc-400 dark:border-zinc-600',
            )}
          />
          <p className="font-mono text-xs uppercase tracking-wide text-zinc-500">{item.period}</p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight">{item.title}</h3>
          <p className="mt-1 text-sm font-medium text-zinc-500">{item.org}</p>
          <p className="mt-3 max-w-xl leading-relaxed text-zinc-500">{item.description}</p>
        </motion.li>
      ))}
    </ol>
  );
}
```

`components/sections/timeline.tsx`:
```tsx
import { getTranslations } from 'next-intl/server';
import { SectionHeading } from '@/components/section-heading';
import { TimelineClient, type TimelineItem } from '@/components/sections/timeline-client';
import { timeline } from '@/content/timeline';

export async function TimelineSection() {
  const t = await getTranslations('timeline');
  const items: TimelineItem[] = timeline.map(({ id, kind }) => ({
    id,
    kind,
    period: t(`items.${id}.period`),
    title: t(`items.${id}.title`),
    org: t(`items.${id}.org`),
    description: t(`items.${id}.description`),
  }));

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading id="timeline" title={t('title')} />
      <div className="mt-16 md:ml-[41.666%]">
        <TimelineClient items={items} />
      </div>
    </section>
  );
}
```

`app/[locale]/page.tsx`: retornar `<><Hero /><TimelineSection /></>`.

- [ ] **Step 4: Rodar e ver passar**

Run: `npx tsc --noEmit && npm run lint && npx playwright test tests/e2e/timeline.spec.ts tests/e2e/layout.spec.ts`
Expected: PASS. Se o primeiro teste falhar por opacity < 1 no último item, aumentar a espera com `expect.poll`/`toHaveCSS` (já faz retry) e conferir `viewport.margin`.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: animated timeline"
```

---

### Task 5: Projetos + script de prints (TDD e2e)

**Files:**
- Create: `components/sections/projects.tsx`, `components/sections/project-card.tsx`, `scripts/shots.ts`
- Modify: `app/[locale]/page.tsx`, `next.config.ts` (nenhum domínio remoto; imagens locais)
- Test: `tests/e2e/projects.spec.ts`

**Interfaces:**
- Consumes: `projects`, `Project`, `hasShot`, chaves `projects.*`, `Badge`.
- Produces: `ProjectsSection()`, `ProjectCard({ project, niche, description, soonLabel, visitLabel, tagLabels })`. Test ids: `project-card`, `project-soon`, `project-link`. Imagens `public/projects/<id>.jpg` (JPEG; `next/image` serve WebP/AVIF).

- [ ] **Step 1: Escrever e2e que falha**

`tests/e2e/projects.spec.ts`:
```ts
import { expect, test } from '@playwright/test';

test('7 cards, 3 com link ao vivo, 4 "em breve", sem href vazio', async ({ page }) => {
  await page.goto('/pt');
  await expect(page.getByTestId('project-card')).toHaveCount(7);
  await expect(page.getByTestId('project-link')).toHaveCount(3);
  await expect(page.getByTestId('project-soon')).toHaveCount(4);
  const hrefs = await page.getByTestId('project-link').evaluateAll((els) => els.map((e) => e.getAttribute('href')));
  expect(hrefs.sort()).toEqual([
    'https://www.dra-angelicabatista.com.br',
    'https://www.estherduartenutri.com.br',
    'https://www.evelynrafaelanutri.com.br',
  ]);
});

test('links externos abrem em nova aba com rel seguro', async ({ page }) => {
  await page.goto('/pt');
  for (const link of await page.getByTestId('project-link').all()) {
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);
  }
});

test('nenhuma imagem de projeto quebrada (print ou placeholder)', async ({ page }) => {
  await page.goto('/pt');
  await page.locator('#projects').scrollIntoViewIfNeeded();
  await page.waitForLoadState('networkidle');
  const broken = await page.locator('[data-testid="project-card"] img').evaluateAll((imgs) =>
    imgs.filter((i) => (i as HTMLImageElement).complete && (i as HTMLImageElement).naturalWidth === 0).length,
  );
  expect(broken).toBe(0);
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx playwright test tests/e2e/projects.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Implementar componentes**

`components/sections/project-card.tsx`:
```tsx
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@/content/projects';
import { hasShot } from '@/lib/shots';

interface ProjectCardProps {
  project: Project;
  niche: string;
  description: string;
  soonLabel: string;
  visitLabel: string;
  tagLabels: readonly string[];
}

export function ProjectCard({ project, niche, description, soonLabel, visitLabel, tagLabels }: ProjectCardProps) {
  const shot = hasShot(project.id);

  return (
    <article
      data-testid="project-card"
      className="group flex flex-col border border-zinc-200 transition-all duration-200 ease-in-out hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
        {shot ? (
          <Image
            src={`/projects/${project.id}.jpg`}
            alt={project.name}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover object-top"
          />
        ) : (
          <div className="flex size-full items-center justify-center font-mono text-sm text-zinc-500">
            {project.number}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <p className="font-mono text-xs uppercase tracking-wide text-zinc-500">
          {project.number} · {niche}
        </p>
        <h3 className="text-2xl font-semibold tracking-tight">{project.name}</h3>
        <p className="leading-relaxed text-zinc-500">{description}</p>
        <ul className="flex flex-wrap gap-2">
          {tagLabels.map((label) => (
            <li key={label}>
              <Badge variant="outline" className="border-zinc-200 font-normal dark:border-zinc-800">
                {label}
              </Badge>
            </li>
          ))}
        </ul>
        <p className="font-mono text-xs text-zinc-500">{project.stack.join(' · ')}</p>
        <div className="mt-auto pt-2">
          {project.url ? (
            <a
              data-testid="project-link"
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-orange-600 transition-all duration-200 ease-in-out hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:text-orange-500"
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

`components/sections/projects.tsx`:
```tsx
import { getTranslations } from 'next-intl/server';
import { SectionHeading } from '@/components/section-heading';
import { ProjectCard } from '@/components/sections/project-card';
import { projects } from '@/content/projects';

export async function ProjectsSection() {
  const t = await getTranslations('projects');
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading id="projects" title={t('title')} intro={t('intro')} />
      <div className="mt-16 grid gap-8 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            niche={t(`items.${project.id}.niche`)}
            description={t(`items.${project.id}.description`)}
            soonLabel={t('soon')}
            visitLabel={t('visit')}
            tagLabels={project.tags.map((tag) => t(`tags.${tag}`))}
          />
        ))}
      </div>
    </section>
  );
}
```

`app/[locale]/page.tsx`: adicionar `<ProjectsSection />` após a timeline.

- [ ] **Step 4: Script de prints**

`scripts/shots.ts`:
```ts
import { spawn, type ChildProcess } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { chromium, type Browser } from '@playwright/test';

interface Target {
  id: string;
  dir: string;
  live: string | null;
  port: number;
}

const devRoot = path.join(os.homedir(), 'DevWeb');
const landings = path.join(devRoot, 'landings');
const outDir = path.join(process.cwd(), 'public', 'projects');

const targets: readonly Target[] = [
  { id: 'charles', dir: path.join(landings, '001 - LP CharlesV'), live: null, port: 3101 },
  { id: 'alianca', dir: path.join(landings, '002 - LP AliancaM'), live: null, port: 3102 },
  { id: 'evelyn', dir: path.join(landings, '003 - LP Evelyn'), live: 'https://www.evelynrafaelanutri.com.br', port: 3103 },
  { id: 'cecilia', dir: path.join(landings, '004 - LP Cecilia Fontoura'), live: null, port: 3104 },
  { id: 'esther', dir: path.join(landings, '005 - LP Esther Duarte'), live: 'https://www.estherduartenutri.com.br', port: 3105 },
  { id: 'angelica', dir: path.join(landings, '006 - LP Angelica'), live: 'https://www.dra-angelicabatista.com.br', port: 3106 },
  { id: 'winner', dir: path.join(devRoot, 'winner-tech'), live: null, port: 3107 },
];

async function waitFor(url: string, ms = 90_000): Promise<boolean> {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {
      /* servidor ainda subindo */
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

async function capture(browser: Browser, url: string, file: string): Promise<void> {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45_000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: file, type: 'jpeg', quality: 82 });
  } finally {
    await page.close();
  }
}

async function viaLocal(browser: Browser, target: Target, file: string): Promise<void> {
  const child: ChildProcess = spawn('npm', ['run', 'dev', '--', '-p', String(target.port)], {
    cwd: target.dir,
    stdio: 'ignore',
    detached: true,
  });
  try {
    const url = `http://localhost:${target.port}`;
    if (!(await waitFor(url))) throw new Error('dev server timeout');
    await capture(browser, url, file);
  } finally {
    if (child.pid) process.kill(-child.pid);
  }
}

async function main(): Promise<void> {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch();
  const failed: string[] = [];

  for (const target of targets) {
    const file = path.join(outDir, `${target.id}.jpg`);
    try {
      if (!target.live) throw new Error('sem URL ao vivo');
      await capture(browser, target.live, file);
      console.log(`ok   ${target.id} (ao vivo)`);
      continue;
    } catch (liveError) {
      console.warn(`warn ${target.id}: ao vivo falhou (${String(liveError)}), tentando local`);
    }
    try {
      await viaLocal(browser, target, file);
      console.log(`ok   ${target.id} (local)`);
    } catch (localError) {
      failed.push(target.id);
      console.warn(`FAIL ${target.id}: ${String(localError)}. Print anterior mantido, se existir.`);
    }
  }

  await browser.close();
  if (failed.length > 0) console.warn(`Sem print novo: ${failed.join(', ')}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
```

- [ ] **Step 5: Gerar prints e confirmar as tags**

Run: `npm run shots`
Expected: `public/projects/*.jpg` para os 7 (ou aviso `Sem print novo: ...`; placeholder cobre).

Confirmar `tags` de cada projeto contra o código do repo antes de publicar:
```bash
cd "/Users/user/DevWeb/landings"
grep -rlE "gtag|GA_|googletagmanager|GTM" "001 - LP CharlesV/src" "002 - LP AliancaM/src" "005 - LP Esther Duarte/app" "006 - LP Angelica/app" 2>/dev/null | head
```
Remover de `content/projects.ts` qualquer tag que o repo não sustente (ex.: `cookies`, `ga4`, `seo`), e deixar só o verificável.

- [ ] **Step 6: Rodar e ver passar**

Run: `npx tsc --noEmit && npm run lint && npm test && npx playwright test tests/e2e/projects.spec.ts`
Expected: PASS. Para validar o placeholder: `mv public/projects/charles.jpg /tmp/` → rebuild → card `001` mostra número, sem imagem quebrada; devolver o arquivo.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: projects section and screenshot script"
```

---

### Task 6: Stack, contato, rodapé

**Files:**
- Create: `components/sections/stack.tsx`, `components/sections/contact.tsx`, `components/sections/footer.tsx`, `public/curriculo-eduardo-dias.pdf`
- Modify: `app/[locale]/page.tsx`
- Test: `tests/e2e/contact.spec.ts`

**Interfaces:**
- Consumes: `stackUsing/stackLearning/stackBasic`, `socials`, `Social`, chaves `stack.*`, `contact.*`, `footer.*`.
- Produces: `StackSection()`, `ContactSection()`, `Footer()`. Test id `social-link`.

- [ ] **Step 1: Escrever e2e que falha**

`tests/e2e/contact.spec.ts`:
```ts
import { expect, test } from '@playwright/test';

test('contato: 5 redes com hrefs corretos e currículo baixável', async ({ page, request }) => {
  await page.goto('/pt');
  const links = page.getByTestId('social-link');
  await expect(links).toHaveCount(5);
  const hrefs = await links.evaluateAll((els) => els.map((e) => e.getAttribute('href')));
  expect(hrefs).toEqual([
    'mailto:dududiaspf@gmail.com',
    'https://www.linkedin.com/in/eduardo-dias-8a924131a',
    'https://github.com/edudiaspf18',
    'https://www.instagram.com/dudu_diaspf/',
    'https://wa.me/5562994267841',
  ]);
  const resume = page.getByRole('link', { name: 'Baixar currículo' });
  await expect(resume).toHaveAttribute('href', '/curriculo-eduardo-dias.pdf');
  const res = await request.get('/curriculo-eduardo-dias.pdf');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('pdf');
});

test('stack: separa "uso" de "estudando"', async ({ page }) => {
  await page.goto('/pt');
  await expect(page.getByText('Estudando agora')).toBeVisible();
  await expect(page.getByText('TypeScript')).toBeVisible();
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx playwright test tests/e2e/contact.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Implementar**

Copiar o currículo (nome sem acento/espaço):
```bash
cp "Currículo - Eduardo Dias.pdf" public/curriculo-eduardo-dias.pdf
```
Nota: o PDF atual lista "Técnico de Informática (FAB)" e "Auxiliar de TI (BAAN)" separados; a timeline trata como um único cargo. Substituir o arquivo quando o currículo for corrigido.

`components/sections/stack.tsx`:
```tsx
import { getTranslations } from 'next-intl/server';
import { SectionHeading } from '@/components/section-heading';
import { Badge } from '@/components/ui/badge';
import { stackBasic, stackLearning, stackUsing } from '@/content/stack';

interface GroupProps {
  title: string;
  items: readonly string[];
  accent?: boolean;
}

function Group({ title, items, accent = false }: GroupProps) {
  return (
    <div className="border-t border-zinc-200 pt-6 dark:border-zinc-800">
      <h3 className="text-sm font-medium text-zinc-500">{title}</h3>
      <ul className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item}>
            <Badge
              variant="outline"
              className={
                accent
                  ? 'border-orange-600 font-normal text-orange-600 dark:border-orange-500 dark:text-orange-500'
                  : 'border-zinc-200 font-normal dark:border-zinc-800'
              }
            >
              {item}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function StackSection() {
  const t = await getTranslations('stack');
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading id="stack" title={t('title')} />
      <div className="mt-16 grid gap-8 md:grid-cols-3">
        <Group title={t('using')} items={stackUsing} />
        <Group title={t('learning')} items={stackLearning} accent />
        <Group title={t('basic')} items={stackBasic} />
      </div>
      <div className="mt-12 border-t border-zinc-200 pt-6 text-sm text-zinc-500 dark:border-zinc-800">
        <p className="font-medium">{t('extras')}</p>
        <p className="mt-2">{t('scrum')}</p>
        <p>{t('languages')}</p>
      </div>
    </section>
  );
}
```

`components/sections/contact.tsx`:
```tsx
import { ArrowUpRight, Download } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { SectionHeading } from '@/components/section-heading';
import { buttonVariants } from '@/components/ui/button';
import { socials } from '@/content/socials';
import { cn } from '@/lib/utils';

export async function ContactSection() {
  const t = await getTranslations('contact');
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading id="contact" title={t('title')} intro={t('subtitle')} />
      <ul className="mt-16 divide-y divide-zinc-200 border-y border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        {socials.map((social) => (
          <li key={social.id}>
            <a
              data-testid="social-link"
              href={social.href}
              {...(social.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="flex items-center justify-between py-5 text-lg font-medium tracking-tight transition-all duration-200 ease-in-out hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:hover:text-orange-500"
            >
              {social.label}
              <ArrowUpRight className="size-5 text-zinc-500" />
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex flex-wrap items-center gap-6">
        <a
          href="/curriculo-eduardo-dias.pdf"
          download
          className={cn(
            buttonVariants({ size: 'lg' }),
            'bg-zinc-950 text-zinc-50 transition-all duration-200 ease-in-out hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200',
          )}
        >
          <Download className="size-4" />
          {t('resume')}
        </a>
        <p className="text-sm text-zinc-500">{t('location')}</p>
      </div>
    </section>
  );
}
```

`components/sections/footer.tsx`:
```tsx
import { getTranslations } from 'next-intl/server';

export async function Footer() {
  const t = await getTranslations('footer');
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-6 py-8 text-sm text-zinc-500">
        <p>{t('rights')}</p>
        <p>{t('built')}</p>
      </div>
    </footer>
  );
}
```

`app/[locale]/page.tsx`: ordem final `Hero, TimelineSection, ProjectsSection, StackSection, ContactSection, Footer`.

- [ ] **Step 4: Rodar e ver passar**

Run: `npx tsc --noEmit && npm run lint && npx playwright test tests/e2e/contact.spec.ts tests/e2e/layout.spec.ts`
Expected: PASS (inclui overflow em 375px com as novas seções).

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: stack, contact, footer, resume"
```

---

### Task 7: SEO (metadata, JSON-LD, sitemap, robots, OG)

**Files:**
- Create: `app/sitemap.ts`, `app/robots.ts`, `app/[locale]/opengraph-image.tsx`
- Modify: `app/[locale]/page.tsx` (adicionar `generateMetadata` + JSON-LD)
- Test: `tests/e2e/seo.spec.ts`

**Interfaces:**
- Consumes: `siteUrl`, `routing`, `socials`, chaves `meta.*`.
- Produces: `/sitemap.xml`, `/robots.txt`, `/pt/opengraph-image`, `/en/opengraph-image`.

- [ ] **Step 1: Escrever e2e que falha**

`tests/e2e/seo.spec.ts`:
```ts
import { expect, test } from '@playwright/test';

test('metadata por idioma, canonical e hreflang', async ({ page }) => {
  await page.goto('/en');
  await expect(page).toHaveTitle(/AI Engineer in training/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/en$/);
  await expect(page.locator('link[rel="alternate"][hreflang="pt"]')).toHaveCount(1);
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
});

test('JSON-LD Person válido', async ({ page }) => {
  await page.goto('/pt');
  const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
  const data = JSON.parse(raw ?? '{}') as { '@type': string; name: string; sameAs: string[] };
  expect(data['@type']).toBe('Person');
  expect(data.name).toBe('Eduardo Dias');
  expect(data.sameAs).toContain('https://github.com/edudiaspf18');
});

test('sitemap, robots e og image respondem', async ({ request }) => {
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  expect(xml).toContain('/pt');
  expect(xml).toContain('/en');
  expect((await request.get('/robots.txt')).status()).toBe(200);
  const og = await request.get('/pt/opengraph-image');
  expect(og.status()).toBe(200);
  expect(og.headers()['content-type']).toContain('image/png');
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx playwright test tests/e2e/seo.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Implementar**

`app/sitemap.ts`:
```ts
import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { siteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `${siteUrl}/${l}`]));
  return routing.locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    lastModified: new Date(),
    alternates: { languages },
  }));
}
```

`app/robots.ts`:
```ts
import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
```

`app/[locale]/opengraph-image.tsx`:
```tsx
import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface OgProps {
  params: Promise<{ locale: string }>;
}

export default async function OpengraphImage({ params }: OgProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          background: '#09090b',
          color: '#fafafa',
        }}
      >
        <div style={{ fontSize: 28, color: '#ea580c' }}>{t('eyebrow')}</div>
        <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>{t('title')}</div>
      </div>
    ),
    size,
  );
}
```

`app/[locale]/page.tsx` final:
```tsx
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ContactSection } from '@/components/sections/contact';
import { Footer } from '@/components/sections/footer';
import { Hero } from '@/components/sections/hero';
import { ProjectsSection } from '@/components/sections/projects';
import { StackSection } from '@/components/sections/stack';
import { TimelineSection } from '@/components/sections/timeline';
import { socials } from '@/content/socials';
import { routing } from '@/i18n/routing';
import { siteUrl } from '@/lib/site';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    metadataBase: new URL(siteUrl),
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}`])),
    },
    openGraph: { title: t('title'), description: t('description'), locale, type: 'website' },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'meta' });

  const personLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Eduardo Dias',
    url: `${siteUrl}/${locale}`,
    jobTitle: locale === 'pt' ? 'AI Engineer em formação' : 'AI Engineer in training',
    description: t('description'),
    address: { '@type': 'PostalAddress', addressLocality: 'Anápolis', addressRegion: 'GO', addressCountry: 'BR' },
    sameAs: socials.filter((s) => s.href.startsWith('http') && !s.href.includes('wa.me')).map((s) => s.href),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd).replace(/</g, '\\u003c') }}
      />
      <Hero />
      <TimelineSection />
      <ProjectsSection />
      <StackSection />
      <ContactSection />
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx tsc --noEmit && npm run lint && npx playwright test tests/e2e/seo.spec.ts`
Expected: PASS. Se `getTranslations({ locale })` no `opengraph-image` falhar com `next-intl`, ler `locale` e importar `messages/${locale}.json` direto.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: seo metadata, json-ld, sitemap, robots, og image"
```

---

### Task 8: Verificação final

**Files:**
- Modify: apenas o que falhar.

- [ ] **Step 1: Suíte completa**

Run:
```bash
npm run lint && npm run typecheck && npm test && npm run e2e
```
Expected: tudo PASS, zero erro de console.

- [ ] **Step 2: Lighthouse (alvo ≥ 95 em Performance, Accessibility, Best Practices, SEO)**

```bash
npm run build && npx next start -p 3100 &
npx lighthouse http://localhost:3100/pt --only-categories=performance,accessibility,best-practices,seo --quiet --chrome-flags="--headless" --output=json --output-path=/private/tmp/claude-501/-Users-user-DevWeb-Sites-portifolio/5450f64e-7bed-4e2f-aef9-9a1046bfc76e/scratchpad/lh-pt.json
```
Ler as 4 notas do JSON. Se < 95: corrigir (contraste do `text-zinc-500` sobre branco costuma passar; conferir `Badge secondary`, tamanho de imagens, `priority` no print do 1º card) e repetir. Repetir para `/en`. Matar o servidor depois.

- [ ] **Step 3: Checagem visual manual**

Abrir `npm run dev`, conferir em 375px, 768px e 1440px, claro e escuro: hero, linha do tempo (linha laranja desenha ao rolar), cards, contato. Reportar ao usuário o que viu, sem afirmar além do verificado.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "chore: final verification fixes"
```

- [ ] **Step 5: Pendências ao usuário**

Informar: URLs ao vivo de 001, 002, 004, winner-tech (editar `url` em `content/projects.ts`); definir `NEXT_PUBLIC_SITE_URL` no deploy; trocar o PDF do currículo se corrigido (FAB/BAAN); confirmar cor de destaque laranja.
