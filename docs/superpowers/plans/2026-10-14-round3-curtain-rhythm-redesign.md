# Rodada 3 — cortina, ritmo, trajetória, projetos (6), contato, ênfase e stack — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplicar o feedback da rodada 3: cortina de abertura com o monograma, menos espaço morto, trajetória em duas colunas, 6 projetos (Winner e Caminu de volta, Caminu como acadêmico) com animação nova, contato com botões e órbita de redes, medalhões de ênfase, stack com ícone + nome em três grupos (com C) e hero sem "foco em Claude".

**Architecture:** Mesma base (Next 16 RSC, Tailwind v4, next-intl, motion, Playwright). Cortina em CSS + script inline (sem `useEffect`). Logos via `content/stack-icons.ts` gerado (Simple Icons) com um `linkedin` desenhado à mão; `content/stack.ts` estruturado com referência a ícone `si`/`lucide`. Componentes de seção continuam Server Components; client só em parallax do card, botão de copiar e-mail e os já existentes.

**Tech Stack:** inalterada (+ nenhum pacote novo; `simple-icons` já é devDependency).

**Spec:** `docs/superpowers/specs/2026-10-14-round3-curtain-rhythm-redesign-design.md`

**Working dir / branch:** `/Users/user/DevWeb/Sites/portifolio`, branch `feat/about-motion` (continua).

## Global Constraints

- Server Components por padrão; `'use client'` só com estado/eventos (`CopyEmailButton`, parallax do card, os já existentes). **Sem `useEffect`.** Nunca `any`. Só Tailwind (exceções em `app/globals.css`: tokens, `@theme`, `@keyframes`, `bg-dots`). lucide + logos Simple Icons (exceção estendida: órbita do Sobre, medalhões, Stack, fichas do Contato, currículo), sempre `currentColor`. `hover:`/`focus-visible:` (nunca `focus:`) + `transition-all duration-200 ease-in-out` (exceções de duração já registradas). Base quente + UM laranja; sem gradiente, glow, sombra, bouncy. Reduced-motion e sem JS: tudo visível (`motion-reduce:`/`noscript:` com `!`). pt/en com chaves idênticas.
- Fatos fixos: e-mail `dududiaspf@gmail.com`; WhatsApp `https://wa.me/5562994267841`; LinkedIn `https://www.linkedin.com/in/eduardo-dias-8a924131a`; GitHub `https://github.com/edudiaspf18`; Instagram `https://www.instagram.com/dudu_diaspf/`. Projetos (ordem/numeração): 01 Charles Veículos, 02 Aliança Móveis, 03 Dra. Cecília Fontoura, 04 Esther Duarte (única URL: `https://www.estherduartenutri.com.br`), 05 Winner Tech (site institucional; print via `shots.ts` do irmão `~/DevWeb/winner-tech`; URL `null`), 06 Caminu (acadêmico, React Native, sem link, sem print; ilustração SVG). Caminu: app de roteiros de viagem com IA integrada; sugere destinos e pontos turísticos; acessível para PcD; pet friendly; roteiros fora do comum; projeto da faculdade (UniEVANGÉLICA).
- Hero: `hero.role` = "AI Engineer em formação." / "AI Engineer in training." (sem Claude); `meta.description` sem Claude. Sobre, órbita, Stack e perfil do currículo mantêm Claude.
- Stack final (ids): using: html5, css3, javascript, tailwind, shadcn, figma, claudecode, seo, ga4, gtm · learning: typescript, react, nextjs, reactnative, claudeapi, agentsdk · basic: wordpress, php, powerbi, office, c (nota "visto nos primeiros períodos da faculdade").
- Como rodar: `NEXT_PUBLIC_SITE_URL=http://localhost:3100 npm run build && NEXT_PUBLIC_SITE_URL=http://localhost:3100 npx next start -p 3100`; Playwright com cópia temporária da config sem `webServer` (apagar depois); `npm run resume` quando o conteúdo do currículo mudar; matar a porta 3100 ao final; não tocar `foto perfil/` nem o PDF original da raiz.
- Commits terminam com `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

## Review Focus

1. Cortina: não bloqueia interação depois de terminar; não aparece na 2ª navegação da mesma sessão; reduced-motion curta; sem JS termina oculta; não estoura CLS (overlay `fixed`). (Task 2)
2. Resíduos do Caminu no Sobre e do `featured`/`stat-sites`; projetos exatamente 6 com numeração 01–06; `shots.ts` volta a ter `winner`. (Task 1)
3. Reduced-motion/sem JS: reveal circular dos cards, borda SVG, medalhões, órbita do contato, parallax do card — tudo visível. (Tasks 4–6)
4. Copiar e-mail: sucesso mostra "Copiado"; falha abre `mailto:`; teclado (Enter/Espaço) funciona; `aria-live`. (Task 6)
5. 375/768/1024/1440 sem overflow: medalhões com snap, fichas de contato em linha, timeline com ano acima do conteúdo em `< md`, grade da stack. (Tasks 3, 5, 6, 7)

## File Structure

```
app/globals.css                         keyframes: curtain-left/right, mono-in, card-circle; (orbit mantidos)
app/[locale]/(site)/layout.tsx          <IntroCurtain /> + script inline
components/intro-curtain.tsx            overlay CSS (server)
components/sections/timeline-client.tsx, timeline.tsx     grade ano | conteúdo
components/sections/project-card.tsx, projects.tsx, project-frame.tsx (borda SVG), project-art-caminu.tsx, project-media.tsx (parallax, client)
components/sections/contact.tsx, contact-orbit.tsx, copy-email-button.tsx (client)
components/sections/emphasis-medallions.tsx (substitui emphasis-list.tsx)
components/sections/stack.tsx, stack-item.tsx, tech-icon.tsx (resolve si/lucide)
components/sections/about.tsx, hero.tsx
content/projects.ts, stack.ts, stack-icons.ts (gerado), emphasis.ts
scripts/gen-stack-icons.ts, scripts/shots.ts
messages/pt.json, en.json
tests/unit/stack.test.ts, content.test.ts (ajuste), stack-icons.test.ts (ajuste)
tests/e2e/round3.spec.ts (novo) + ajustes em about/projects/motion/contact/hero/seo/timeline specs
```

---

### Task 1: Conteúdo e limpeza — 6 projetos, Caminu fora do Sobre, hero/meta sem Claude, ritmo

**Files:**
- Modify: `content/projects.ts`, `scripts/shots.ts`, `components/sections/about.tsx` (remove `CaminuCard`), `components/sections/hero.tsx` (role sem keyword), `app/[locale]/curriculo/page.tsx` (linha de cargo), `messages/pt.json`, `messages/en.json`, todas as `sections/*.tsx` (`py-24`→`py-16 md:py-20`, `mt-16`→`mt-12`, `mt-24`→`mt-16`), `tests/unit/content.test.ts`, `tests/e2e/{projects,motion,about,hero,seo,round2}.spec.ts`
- Delete: `components/sections/caminu-card.tsx`
- Create: `tests/e2e/round3.spec.ts` (primeiros testes)

**Interfaces:**
- Produces: `ProjectId = 'charles'|'alianca'|'cecilia'|'esther'|'winner'|'caminu'`; `interface Project { id; number: '01'..'06'; name; url: string|null; stack; tags; kind: 'landing'|'site'|'academic'; hasImage: boolean }`; mensagens `projects.items.{winner,caminu}`, `projects.academic` ("Projeto acadêmico · UniEVANGÉLICA" / "Academic project · UniEVANGÉLICA"), `projects.kinds.{landing,site,academic}`; `hero.role` sem keyword; `about.body3` novo.

- [ ] **Step 1: Testes que falham**
  - `tests/unit/content.test.ts`: ids = `['charles','alianca','cecilia','esther','winner','caminu']`, numbers `['01','02','03','04','05','06']`, só `esther` com URL, `kind` por id (`landing`×4, `site`, `academic`), `hasImage` false só em `caminu`; mensagens `projects.items.<id>.{niche,description}` para os 6 em pt e en; `projects.academic` presente.
  - `tests/e2e/round3.spec.ts` (iniciar):
    ```ts
    import { expect, test } from '@playwright/test';

    test('hero e meta sem "foco em Claude"', async ({ page }) => {
      await page.goto('/pt');
      await expect(page.getByTestId('hero-role')).toHaveText(/^AI Engineer em formação\.$/);
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description).not.toMatch(/Claude/);
      await page.goto('/en');
      await expect(page.getByTestId('hero-role')).toHaveText(/^AI Engineer in training\.$/);
    });

    test('sobre não tem mais o card do Caminu; projetos tem 6 cards numerados', async ({ page }) => {
      await page.goto('/pt');
      await expect(page.getByTestId('caminu-card')).toHaveCount(0);
      await expect(page.locator('section:has(#about)')).toContainText('Caminu');
      const cards = page.getByTestId('project-card');
      await expect(cards).toHaveCount(6);
      await expect(cards.nth(0)).toContainText('01');
      await expect(cards.nth(5)).toContainText('06');
      await expect(cards.nth(5)).toContainText('Projeto acadêmico');
      await expect(cards.nth(5).locator('a')).toHaveCount(0);
      await expect(page.getByTestId('project-link')).toHaveCount(1);
    });

    test('ritmo: vão entre seções ≤ 160px em 1440', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/pt');
      const ids = ['about', 'timeline', 'projects', 'stack', 'contact'];
      const sections = page.locator('main > section');
      const count = await sections.count();
      expect(count).toBeGreaterThanOrEqual(ids.length);
      for (let i = 1; i < count; i += 1) {
        const prev = await sections.nth(i - 1).boundingBox();
        const next = await sections.nth(i).boundingBox();
        if (!prev || !next) continue;
        expect(next.y - (prev.y + prev.height)).toBeLessThanOrEqual(0);
      }
      for (const id of ids) {
        const gap = await page.evaluate((sel) => {
          const h = document.getElementById(sel);
          const section = h?.closest('section');
          const prev = section?.previousElementSibling as HTMLElement | null;
          if (!h || !section) return 0;
          const prevBottom = prev ? prev.getBoundingClientRect().bottom : 0;
          const lastBlock = prev ? Array.from(prev.querySelectorAll<HTMLElement>(':scope > *')).pop() : null;
          const contentBottom = lastBlock ? lastBlock.getBoundingClientRect().bottom : prevBottom;
          return h.getBoundingClientRect().top - contentBottom;
        }, id);
        expect(gap).toBeLessThanOrEqual(160);
      }
    });
    ```
  - Ajustar `projects.spec.ts` (6 cards; `img + placeholder === 6`; 1 link; 5 soon badges? **Não**: cards `site`/`academic` sem URL mostram "Em breve" apenas se `kind !== 'academic'`; Caminu mostra "Projeto acadêmico" no lugar da badge; então `project-soon` = 4), `motion.spec.ts` (índices: esther agora `nth(3)`), `about.spec.ts`/`round2.spec.ts` (remover asserts do `caminu-card`; manter "Caminu" citado no Sobre), `hero.spec.ts` (role sem Claude), `seo.spec.ts` (description sem Claude, se assertado).

- [ ] **Step 2: Rodar e ver falhar** — `npm test` e `npx playwright test tests/e2e/round3.spec.ts tests/e2e/projects.spec.ts`. Expected: FAIL.

- [ ] **Step 3: Implementar**
  - `content/projects.ts`:
    ```ts
    export type ProjectId = 'charles' | 'alianca' | 'cecilia' | 'esther' | 'winner' | 'caminu';
    export type ProjectTag = 'seo' | 'ga4' | 'gtm' | 'whatsapp' | 'cookies' | 'ai' | 'a11y';
    export type ProjectKind = 'landing' | 'site' | 'academic';

    export interface Project {
      id: ProjectId;
      number: string;
      name: string;
      url: string | null;
      stack: readonly string[];
      tags: readonly ProjectTag[];
      kind: ProjectKind;
      hasImage: boolean;
    }

    const web = ['Next.js', 'React', 'TypeScript', 'Tailwind'] as const;

    export const projects: readonly Project[] = [
      { id: 'charles', number: '01', name: 'Charles Veículos', url: null, stack: [...web, 'shadcn/ui'], tags: ['seo', 'ga4', 'whatsapp'], kind: 'landing', hasImage: true },
      { id: 'alianca', number: '02', name: 'Aliança Móveis', url: null, stack: [...web, 'Playwright'], tags: ['gtm'], kind: 'landing', hasImage: true },
      { id: 'cecilia', number: '03', name: 'Dra. Cecília Fontoura', url: null, stack: [...web, 'Playwright'], tags: ['whatsapp'], kind: 'landing', hasImage: true },
      { id: 'esther', number: '04', name: 'Esther Duarte', url: 'https://www.estherduartenutri.com.br', stack: [...web], tags: ['seo', 'ga4', 'cookies', 'whatsapp'], kind: 'landing', hasImage: true },
      { id: 'winner', number: '05', name: 'Winner Tech', url: null, stack: [...web], tags: ['seo', 'whatsapp'], kind: 'site', hasImage: true },
      { id: 'caminu', number: '06', name: 'Caminu', url: null, stack: ['React Native', 'TypeScript', 'IA'], tags: ['ai', 'a11y'], kind: 'academic', hasImage: false },
    ];
    ```
    `hasImage` só diz se o card tenta carregar `/projects/<id>.jpg` (continua passando por `hasShot` em runtime; Caminu nunca tenta).
  - `scripts/shots.ts`: adicionar `{ id: 'winner', dir: path.join(devRoot, 'winner-tech'), live: null, port: 3107 }`; rodar `npm run shots -- --only winner` (sobe `next dev` no irmão; matar ao final) e commitar `public/projects/winner.jpg`.
  - Mensagens: `projects.items.winner` = PT `{ niche: "Institucional · Winner Tech", description: "Site que apresenta os sistemas Zelo, Alfa, Lume e Laço e a oferta de sites sob medida." }` / EN `{ niche: "Corporate · Winner Tech", description: "Site presenting the Zelo, Alfa, Lume and Laço systems and the custom website offer." }`; `projects.items.caminu` = PT `{ niche: "App de viagens com IA · React Native", description: "Monta o roteiro da viagem com IA integrada: sugere destinos e pontos turísticos, é acessível para PcD, pet friendly e foge do mais do mesmo." }` / EN `{ niche: "AI travel app · React Native", description: "Plans the trip itinerary with built-in AI: suggests destinations and sights, is accessible for people with disabilities, pet friendly and avoids the usual routes." }`; `projects.academic` = "Projeto acadêmico · UniEVANGÉLICA" / "Academic project · UniEVANGÉLICA"; `projects.tags.ai` = "IA" / "AI", `projects.tags.a11y` = "Acessibilidade" / "Accessibility". Remover `about.caminu.*`; `about.body3` = PT "Agora meu foco é AI Engineering, com Claude. Estou no 5º período de Engenharia de Software e desenvolvo um projeto acadêmico em React Native, o Caminu (veja em Projetos)." / EN "Now my focus is AI Engineering, with Claude. I'm in the 5th term of Software Engineering and building an academic React Native project, Caminu (see Projects)." `hero.role` = "AI Engineer em formação" / "AI Engineer in training" (o ponto vem do componente), remover `hero.roleKeyword`; `meta.description` = PT "Portfólio de Eduardo Dias: AI Engineer em formação, landing pages de alta conversão e SEO. Anápolis, GO." / EN "Eduardo Dias' portfolio: AI Engineer in training, high-conversion landing pages and SEO. Anápolis, Brazil."
  - `components/sections/hero.tsx`: `<p data-testid="hero-role" …>{t('role')}<span className="text-signal">.</span></p>`. `app/[locale]/curriculo/page.tsx`: linha do cargo = `{th('role')}.` (sem `<em>`).
  - `components/sections/about.tsx`: remover import/uso do `CaminuCard`; apagar `caminu-card.tsx`.
  - `project-card.tsx`: badge "Em breve" só quando `project.kind !== 'academic' && !project.url`; para `academic`, renderizar `<span data-testid="project-academic" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{academicLabel}</span>` (nova prop `academicLabel`); `shot = project.hasImage && hasShot(project.id)`. `projects.tsx`: grade `grid gap-8 md:grid-cols-2 lg:grid-cols-3`, passa `academicLabel={t('academic')}`.
  - Ritmo: nas seções `py-24` → `py-16 md:py-20`; `mt-16` → `mt-12`; `about.tsx` `mt-24` → `mt-16`; `footer` `py-8` → `py-6`.

- [ ] **Step 4: Verificar** — `npm run lint && npm run typecheck && npm test`; rebuild; `npm run resume` (cargo mudou); Playwright inteiro. Expected: PASS. `grep -rniE "caminu-card|roleKeyword|featured|stat-sites" app components content messages tests` vazio.

- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat(content): six projects with Winner and academic Caminu, hero without Claude focus, tighter rhythm"`

---

### Task 2: Cortina de abertura

**Files:**
- Create: `components/intro-curtain.tsx`
- Modify: `app/globals.css` (keyframes), `app/[locale]/(site)/layout.tsx`, `messages/*.json` (`intro.label`), `tests/e2e/round3.spec.ts`

**Interfaces:**
- Produces: `IntroCurtain({ label })` (server), script inline que define `data-intro="seen"` no `<html>` quando `sessionStorage['intro-seen']` existe; classes `animate-curtain-left`, `animate-curtain-right`, `animate-mono-in`. Test ids: `intro-curtain`.

- [ ] **Step 1: Testes que falham** (`round3.spec.ts`):
  ```ts
  test('cortina: aparece no primeiro carregamento, some, e não repete na sessão', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto('/pt');
    const curtain = page.getByTestId('intro-curtain');
    await expect(curtain).toBeAttached();
    expect(await page.locator('html').getAttribute('data-intro')).not.toBe('seen');
    await expect(curtain).toHaveCSS('visibility', 'hidden', { timeout: 3000 });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.goto('/pt#projects');
    expect(await page.locator('html').getAttribute('data-intro')).toBe('seen');
    await expect(page.getByTestId('intro-curtain')).toHaveCSS('display', 'none');
    await ctx.close();
  });

  test('cortina: reduced motion termina em menos de 600ms; sem JS termina oculta', async ({ browser }) => {
    const reduced = await browser.newContext({ reducedMotion: 'reduce' });
    const p1 = await reduced.newPage();
    const started = Date.now();
    await p1.goto('/pt');
    await expect(p1.getByTestId('intro-curtain')).toHaveCSS('visibility', 'hidden', { timeout: 1500 });
    expect(Date.now() - started).toBeLessThan(2500);
    await reduced.close();
    const nojs = await browser.newContext({ javaScriptEnabled: false });
    const p2 = await nojs.newPage();
    await p2.goto('/pt');
    await expect(p2.getByTestId('intro-curtain')).toHaveCSS('visibility', 'hidden', { timeout: 3000 });
    await nojs.close();
  });
  ```
  Também: `layout.spec.ts` (console sem erros) continua; o teste de CLS não existe, mas o overlay é `fixed`.

- [ ] **Step 2: Rodar e ver falhar.**

- [ ] **Step 3: Implementar**
  - `app/globals.css` (dentro de `@theme inline`):
    ```css
    --animate-curtain-left: curtain-left 0.7s cubic-bezier(0.76, 0, 0.24, 1) 0.75s forwards;
    --animate-curtain-right: curtain-right 0.7s cubic-bezier(0.76, 0, 0.24, 1) 0.75s forwards;
    --animate-mono-in: mono-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    --animate-curtain-hide: curtain-hide 0.01s linear 1.45s forwards;
    --animate-curtain-fade: curtain-fade 0.3s ease-out 0.1s forwards;
    @keyframes curtain-left { to { transform: translateX(-100%); } }
    @keyframes curtain-right { to { transform: translateX(100%); } }
    @keyframes mono-in { from { opacity: 0; transform: scale(0.92); } 60% { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(1.04); } }
    @keyframes curtain-hide { to { visibility: hidden; } }
    @keyframes curtain-fade { to { opacity: 0; visibility: hidden; } }
    ```
  - `components/intro-curtain.tsx`:
    ```tsx
    interface IntroCurtainProps {
      label: string;
    }

    // Cortina em CSS puro: roda sem JS; o script inline do layout marca data-intro="seen" na 2ª navegação da sessão.
    export function IntroCurtain({ label }: IntroCurtainProps) {
      return (
        <div
          data-testid="intro-curtain"
          role="presentation"
          aria-label={label}
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[60] animate-curtain-hide motion-reduce:animate-curtain-fade [html[data-intro=seen]_&]:hidden"
        >
          <div className="absolute inset-y-0 left-0 w-1/2 bg-background animate-curtain-left motion-reduce:animate-none" />
          <div className="absolute inset-y-0 right-0 w-1/2 bg-background animate-curtain-right motion-reduce:animate-none" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-mono-in motion-reduce:animate-none">
            <span className="relative flex size-28 items-center justify-center rounded-full border border-foreground font-display text-5xl tracking-tight">
              ED
              <span className="absolute inset-0 animate-orbit [animation-duration:1.2s] motion-reduce:animate-none">
                <span className="absolute left-1/2 top-0 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal" />
              </span>
            </span>
          </div>
        </div>
      );
    }
    ```
    Notas: `pointer-events-none` desde o início garante que nada fica bloqueado; `animate-curtain-hide` leva o container a `visibility:hidden` em 1,45 s. A variante arbitrária `[html[data-intro=seen]_&]:hidden` esconde na 2ª navegação.
  - `app/[locale]/(site)/layout.tsx`: antes do skip link:
    ```tsx
    <script
      dangerouslySetInnerHTML={{
        __html:
          "try{var k='intro-seen';if(sessionStorage.getItem(k)){document.documentElement.dataset.intro='seen'}else{sessionStorage.setItem(k,'1')}}catch(e){}",
      }}
    />
    <IntroCurtain label={t('introLabel')} />
    ```
    (`nav.introLabel` = "Abrindo o site" / "Opening the site". Como o script roda antes da hidratação e só altera `dataset` do `<html>`, usar `suppressHydrationWarning` já presente no `<html>`.)

- [ ] **Step 4: Verificar** — lint/typecheck/unit; rebuild; Playwright inteiro (atenção: outros testes fazem `goto` em contexto novo e verão a cortina; como ela é `pointer-events-none` e some em 1,45 s, cliques imediatos não são bloqueados; se algum teste de screenshot pegar a cortina, aguardar `toHaveCSS('visibility','hidden')`). Ver 1440 claro aos 0,3 s, 0,9 s e 1,6 s (3 screenshots) e `Read`.

- [ ] **Step 5: Commit** — `feat(intro): opening curtain with monogram, once per session`

---

### Task 3: Trajetória em duas colunas (ano | conteúdo), sem vazio à direita

**Files:**
- Modify: `components/sections/timeline-client.tsx`, `components/sections/timeline.tsx`, `content/timeline.ts` (+`year`), `tests/e2e/timeline.spec.ts`, `round3.spec.ts`

**Interfaces:**
- Produces: `TimelineEntry { id; kind; year: string }` (years: techWinner "2020", baan "2021", cpet "2022", frontend "2025", ai "2026", degree "2028"); `TimelineItem` ganha `year`, `index`. Test ids mantidos: `timeline-item`, `timeline-line`; novo `timeline-year`.

- [ ] **Step 1: Testes que falham** (`round3.spec.ts`):
  ```ts
  test('trajetória: anos em coluna e conteúdo ocupa a largura', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/pt');
    const items = page.getByTestId('timeline-item');
    await expect(items).toHaveCount(6);
    await expect(page.getByTestId('timeline-year')).toHaveText(['2020', '2021', '2022', '2025', '2026', '2028']);
    const section = await page.locator('section:has(#timeline)').boundingBox();
    const content = await items.first().locator('[data-testid="timeline-content"]').boundingBox();
    expect(content && section && content.width / section.width).toBeGreaterThanOrEqual(0.6);
    expect(content && section && content.x + content.width).toBeGreaterThanOrEqual((section?.x ?? 0) + (section?.width ?? 0) * 0.9);
  });
  ```
  `timeline.spec.ts` existente continua (ordem, reveal, reduced-motion, no-JS).

- [ ] **Step 2: Rodar e ver falhar.**

- [ ] **Step 3: Implementar** — `content/timeline.ts` ganha `year` por item. `timeline.tsx`: remover `md:ml-[41.666%]`; `TimelineClient` recebe `items` com `year` e `index`. `timeline-client.tsx` (manter `useScroll`/`useSpring`, overrides `motion-reduce:`/`noscript:`, testids): estrutura por item
  ```tsx
  <motion.li data-testid="timeline-item" … className="grid gap-4 py-10 md:grid-cols-12 md:gap-8 …">
    <div className="md:col-span-3">
      <p data-testid="timeline-year" className="font-display text-6xl leading-none tracking-tight md:sticky md:top-28 md:text-7xl">{item.year}</p>
    </div>
    <div data-testid="timeline-content" className="relative border-l border-border pl-8 md:col-span-9 md:pl-12">
      <span aria-hidden className={cn('absolute -left-1.5 top-1.5 size-3 rounded-full border bg-background', milestone ? 'border-signal bg-signal' : 'border-foreground')} />
      <span aria-hidden className="absolute right-0 top-0 hidden size-12 items-center justify-center rounded-full border border-border font-mono text-xs text-muted-foreground md:flex">{String(item.index + 1).padStart(2, '0')}</span>
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{item.period}</p>
      <h3 className="mt-2 font-display text-3xl tracking-tight md:text-4xl">{item.title}</h3>
      <p className="mt-1 text-sm font-medium text-muted-foreground">{item.org}</p>
      <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground md:pr-20">{item.description}</p>
    </div>
  </motion.li>
  ```
  A linha laranja de progresso (`timeline-line`) passa a ficar no wrapper externo alinhada ao `border-l` da coluna de conteúdo: wrapper `relative` com a linha posicionada em `md:left-[calc(25%+0.5rem)]` (3/12 + gap) e `left-0` em mobile; alternativa mais simples e robusta: colocar a linha **dentro da coluna de conteúdo** de cada item não funciona para progresso contínuo, então manter uma única linha no wrapper e alinhar com `grid` espelhado: wrapper também `md:grid md:grid-cols-12` com a linha em `md:col-start-4` via um elemento absoluto dentro de um `div relative md:col-span-9 md:col-start-4` que envolve só a borda. Escolher a abordagem que mantenha `timeline-line` com `scaleY` e passe nos testes; relatar.

- [ ] **Step 4: Verificar** — lint/typecheck/unit; rebuild; Playwright inteiro. Ver 1440 (meio da rolagem, ano sticky) e 375; `Read`; relatar.

- [ ] **Step 5: Commit** — `feat(timeline): year column layout filling the width`

---

### Task 4: Projetos — reveal circular, borda que se desenha, parallax, ilustração do Caminu

**Files:**
- Create: `components/sections/project-frame.tsx` (SVG borda), `components/sections/project-media.tsx` (client: parallax + reveal), `components/sections/project-art-caminu.tsx`
- Modify: `components/sections/project-card.tsx`, `components/sections/projects.tsx`, `app/globals.css` (`card-circle` keyframes se CSS; ou via motion variants), `tests/e2e/{motion,projects}.spec.ts`, `round3.spec.ts`

**Interfaces:**
- Produces: `ProjectFrame()` (SVG `rect rx=32` com `pathLength=1`, `stroke-dasharray 1`, `stroke-dashoffset 1` → `0` em `group-hover` via classe `group-hover:[stroke-dashoffset:0]` + `transition-[stroke-dashoffset] duration-500`); `ProjectMedia({ children })` client com `useScroll` no card (`offset ['start end','end start']`) e `useTransform` → `y` ±10 px; reveal do card: `motion.article` com `initial={{ clipPath: 'circle(0% at 12% 100%)' }}` `whileInView={{ clipPath: 'circle(150% at 12% 100%)' }}` (once), overrides `motion-reduce:[clip-path:none]! noscript:[clip-path:none]!`; `ProjectArtCaminu()` SVG decorativo (3 círculos concêntricos finos + 5 pontos de rota ligados por linha tracejada fina + ponto laranja). Test ids: `project-frame`, `project-art`.

- [ ] **Step 1: Testes que falham** (`round3.spec.ts`):
  ```ts
  test('projetos: reveal circular, borda SVG e ilustração do Caminu', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/pt');
    const cards = page.getByTestId('project-card');
    await cards.first().scrollIntoViewIfNeeded();
    await expect.poll(() => cards.first().evaluate((el) => getComputedStyle(el).clipPath)).toMatch(/none|circle\((1[0-9]{2}|[2-9][0-9]{2})%/);
    await expect(cards.first().getByTestId('project-frame')).toBeAttached();
    await expect(cards.nth(5).getByTestId('project-art')).toBeVisible();
    await expect(cards.nth(5).locator('img')).toHaveCount(0);
    await cards.nth(3).hover();
    await expect.poll(() => cards.nth(3).locator('[data-testid="project-frame"] rect').evaluate((el) => parseFloat(getComputedStyle(el).strokeDashoffset))).toBeLessThan(0.05);
  });

  test('projetos: reduced motion e sem JS mostram todos os cards', async ({ browser }) => {
    for (const options of [{ reducedMotion: 'reduce' as const }, { javaScriptEnabled: false }]) {
      const ctx = await browser.newContext(options);
      const page = await ctx.newPage();
      await page.goto('/pt');
      const cards = page.getByTestId('project-card');
      for (let i = 0; i < 6; i += 1) {
        await expect(cards.nth(i)).toHaveCSS('clip-path', 'none');
      }
      await ctx.close();
    }
  });
  ```
  Em `motion.spec.ts`: remover asserts do zoom/barra do topo se existirem; os testes de Reveal (`xpath=..` opacity) passam a usar o próprio card (clip-path) — ajustar; manter cursor-label (card da Esther agora `nth(3)`).

- [ ] **Step 2: Rodar e ver falhar.**

- [ ] **Step 3: Implementar** — `project-card.tsx` vira `motion.article`? Não: manter `ProjectCard` server e envolver em `ProjectMedia`-like client wrapper `ProjectReveal` que aplica o `clipPath` ao `article` (client component recebendo `children`); `ProjectFrame` absoluto `inset-0 pointer-events-none`:
  ```tsx
  export function ProjectFrame() {
    return (
      <svg aria-hidden data-testid="project-frame" className="pointer-events-none absolute inset-0 size-full text-signal" preserveAspectRatio="none">
        <rect x="0.5" y="0.5" width="calc(100% - 1px)" height="calc(100% - 1px)" rx="32" ry="32" fill="none" stroke="currentColor" strokeWidth="1.5" pathLength={1} strokeDasharray={1} strokeDashoffset={1}
          className="transition-[stroke-dashoffset] duration-500 ease-out group-hover:[stroke-dashoffset:0] group-focus-within:[stroke-dashoffset:0] motion-reduce:transition-none" />
      </svg>
    );
  }
  ```
  (Se `width="calc(...)"` não for aceito em atributo SVG, usar `className="[width:calc(100%-1px)] [height:calc(100%-1px)]"`. Nota: `pathLength` em `rect` é suportado em Chromium/Firefox/Safari recentes.)
  Imagem: remover `group-hover:scale-[1.04]` e a barra do topo; `ProjectMedia` (client) envolve o container da imagem com `style={{ y }}` e o `group-hover:-translate-y-3 transition-transform duration-500 motion-reduce:transform-none`. Caminu: `project.hasImage === false` → `<ProjectArtCaminu />` dentro do container de mídia (`bg-muted`), sem `img`. `projects.tsx`: remover `Reveal` dos cards (o reveal agora é do próprio card) e passar `index` para stagger (`delay = (i % 3) * 0.08`).

- [ ] **Step 4: Verificar** — lint/typecheck/unit; rebuild; Playwright inteiro. Ver Projetos 1440 (após reveal) + hover no card 04, e 375; `Read`; relatar.

- [ ] **Step 5: Commit** — `feat(projects): circular reveal, drawn frame on hover, parallax media, Caminu artwork`

---

### Task 5: Medalhões de ênfase e Stack com ícone + nome (3 grupos, com C)

**Files:**
- Create: `components/sections/emphasis-medallions.tsx`, `components/sections/stack-item.tsx`, `components/sections/tech-icon.tsx`
- Modify: `scripts/gen-stack-icons.ts` (+ ícones; `linkedin` manual), `content/stack-icons.ts` (regenerado), `content/stack.ts` (estruturado), `content/emphasis.ts` (+`iconId`), `components/sections/stack.tsx`, `components/sections/about.tsx` (usa medalhões), `messages/*.json`, `tests/unit/{stack,stack-icons,about-content}.test.ts`, `tests/e2e/{about,round2}.spec.ts`, `round3.spec.ts`
- Delete: `components/sections/emphasis-list.tsx`

**Interfaces:**
- Produces: `TechIconRef = { kind: 'si'; id: string } | { kind: 'lucide'; name: 'Search' | 'ChartColumn' | 'FileText' }`; `StackItem { id; name; icon: TechIconRef; group: 'using'|'learning'|'basic'; note?: 'c' }`; `stackItems: readonly StackItem[]` (21); `TechIcon({ icon, className })` (server: `si` → `<svg><path d/>`, `lucide` → componente por mapa estático); `EmphasisMedallions()`; `StackItemCard({ item, note? })`. `stackIcons` passa a ter ≥ 18 ids: html5, css3, javascript, typescript, react, nextjs, tailwind, figma, claude, c, shadcnui, googleanalytics, googletagmanager, wordpress, php, github, instagram, whatsapp, linkedin (manual). Test ids: `emphasis-medallion`, `stack-group-<group>`, `stack-item`.

- [ ] **Step 1: Testes que falham**
  - `tests/unit/stack.test.ts`: 21 itens; grupos com 10/6/5; todo `icon.kind==='si'` tem `id` em `stackIcons`; `c` tem `note: 'c'` e `stack.notes.c` em pt/en; nomes esperados.
  - `tests/unit/stack-icons.test.ts`: ids incluem os 19 listados; `linkedin.path` não vazio.
  - `round3.spec.ts`:
    ```ts
    test('ênfase: 5 medalhões com descrição visível sem hover', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/pt');
      const medals = page.getByTestId('emphasis-medallion');
      await expect(medals).toHaveCount(5);
      await expect(medals.first()).toContainText('TypeScript');
      await expect(medals.first()).toContainText('aprendendo');
      await expect(medals.first().getByText(/Tipagem estrita/)).toBeVisible();
      await expect(page.getByTestId('emphasis-list')).toHaveCount(0);
    });

    test('stack: três grupos com ícone + nome, C em noções com nota', async ({ page }) => {
      await page.goto('/pt');
      await expect(page.getByTestId('stack-group-using').getByTestId('stack-item')).toHaveCount(10);
      await expect(page.getByTestId('stack-group-learning').getByTestId('stack-item')).toHaveCount(6);
      await expect(page.getByTestId('stack-group-basic').getByTestId('stack-item')).toHaveCount(5);
      const c = page.getByTestId('stack-group-basic').getByTestId('stack-item').filter({ hasText: /^C\b/ });
      await expect(c).toContainText('primeiros períodos');
      await expect(page.getByTestId('stack-item').first().locator('svg')).toHaveCount(1);
    });
    ```
  - Ajustar `about.spec.ts`/`round2.spec.ts`: remover asserts da lista de ênfase (links, `emphasis-list`), manter os da órbita/foto/stats.

- [ ] **Step 2: Rodar e ver falhar.**

- [ ] **Step 3: Implementar**
  - `scripts/gen-stack-icons.ts`: `wanted` += `{ id: 'c', name: 'C', key: 'siC' }, { id: 'shadcnui', name: 'shadcn/ui', key: 'siShadcnui' }, { id: 'googleanalytics', name: 'GA4', key: 'siGoogleanalytics' }, { id: 'googletagmanager', name: 'GTM', key: 'siGoogletagmanager' }, { id: 'wordpress', name: 'WordPress', key: 'siWordpress' }, { id: 'php', name: 'PHP', key: 'siPhp' }, { id: 'github', name: 'GitHub', key: 'siGithub' }, { id: 'instagram', name: 'Instagram', key: 'siInstagram' }, { id: 'whatsapp', name: 'WhatsApp', key: 'siWhatsapp' }`; e um `extra` manual anexado ao final: `{ id: 'linkedin', name: 'LinkedIn', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' }` (glifo "in" simples, desenhado para uso nominativo). `npm run gen:icons`.
  - `content/stack.ts`:
    ```ts
    import type { LucideIcon } from 'lucide-react';
    export type TechIconRef = { kind: 'si'; id: string } | { kind: 'lucide'; name: 'Search' | 'ChartColumn' | 'FileText' };
    export type StackGroup = 'using' | 'learning' | 'basic';
    export interface StackItem { id: string; name: string; icon: TechIconRef; group: StackGroup; note?: 'c' }
    export const stackGroups: readonly StackGroup[] = ['using', 'learning', 'basic'];
    export const stackItems: readonly StackItem[] = [
      { id: 'html5', name: 'HTML5', icon: { kind: 'si', id: 'html5' }, group: 'using' },
      { id: 'css3', name: 'CSS3', icon: { kind: 'si', id: 'css3' }, group: 'using' },
      { id: 'javascript', name: 'JavaScript', icon: { kind: 'si', id: 'javascript' }, group: 'using' },
      { id: 'tailwind', name: 'Tailwind CSS', icon: { kind: 'si', id: 'tailwind' }, group: 'using' },
      { id: 'shadcn', name: 'shadcn/ui', icon: { kind: 'si', id: 'shadcnui' }, group: 'using' },
      { id: 'figma', name: 'Figma', icon: { kind: 'si', id: 'figma' }, group: 'using' },
      { id: 'claudecode', name: 'Claude Code', icon: { kind: 'si', id: 'claude' }, group: 'using' },
      { id: 'seo', name: 'SEO', icon: { kind: 'lucide', name: 'Search' }, group: 'using' },
      { id: 'ga4', name: 'GA4', icon: { kind: 'si', id: 'googleanalytics' }, group: 'using' },
      { id: 'gtm', name: 'GTM', icon: { kind: 'si', id: 'googletagmanager' }, group: 'using' },
      { id: 'typescript', name: 'TypeScript', icon: { kind: 'si', id: 'typescript' }, group: 'learning' },
      { id: 'react', name: 'React', icon: { kind: 'si', id: 'react' }, group: 'learning' },
      { id: 'nextjs', name: 'Next.js', icon: { kind: 'si', id: 'nextjs' }, group: 'learning' },
      { id: 'reactnative', name: 'React Native', icon: { kind: 'si', id: 'react' }, group: 'learning' },
      { id: 'claudeapi', name: 'Claude API', icon: { kind: 'si', id: 'claude' }, group: 'learning' },
      { id: 'agentsdk', name: 'Agent SDK', icon: { kind: 'si', id: 'claude' }, group: 'learning' },
      { id: 'wordpress', name: 'WordPress', icon: { kind: 'si', id: 'wordpress' }, group: 'basic' },
      { id: 'php', name: 'PHP', icon: { kind: 'si', id: 'php' }, group: 'basic' },
      { id: 'powerbi', name: 'Power BI', icon: { kind: 'lucide', name: 'ChartColumn' }, group: 'basic' },
      { id: 'office', name: 'Office', icon: { kind: 'lucide', name: 'FileText' }, group: 'basic' },
      { id: 'c', name: 'C', icon: { kind: 'si', id: 'c' }, group: 'basic', note: 'c' },
    ];
    ```
    (Remover `stackUsing/stackLearning/stackBasic` e seus usos; `LucideIcon` import só se usado.) `tech-icon.tsx`: mapa `{ Search, ChartColumn, FileText }` de `lucide-react` (confirmar nome `ChartColumn` na versão instalada; senão `BarChart3`).
  - Mensagens `stack`: manter `title/using/learning/basic/extras/scrum/languages`; adicionar `intro: { using: "O que uso toda semana em projetos reais.", learning: "O que estou aprendendo agora, com projeto de verdade na mão.", basic: "O que vi na faculdade ou em trabalhos pontuais." }`, `notes: { c: "visto nos primeiros períodos da faculdade" }` (EN: "What I use every week on real projects." / "What I'm learning now, hands-on." / "What I saw at university or in one-off work." / "seen in the first terms at university").
  - `stack.tsx`: três blocos `data-testid="stack-group-<group>"` com título mono, intro, grade `grid grid-cols-3 gap-6 sm:grid-cols-4 lg:grid-cols-6`; `StackItemCard`: `<li data-testid="stack-item" className="flex flex-col items-center gap-3 text-center"><span className="flex size-16 items-center justify-center rounded-full border border-border transition-all duration-200 ease-in-out group-hover:border-foreground"><TechIcon className="size-7" /></span><span className="text-sm">{name}</span>{note && <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{t(`notes.${note}`)}</span>}</li>`. Envolver em `Reveal`.
  - `content/emphasis.ts`: `+ iconId` (typescript, react, nextjs, tailwind, claude). `emphasis-medallions.tsx` (server): `<ul data-testid="emphasis-medallions" className="mt-6 flex snap-x gap-6 overflow-x-auto pb-4 lg:grid lg:grid-cols-5 lg:overflow-visible">` e cada `<li data-testid="emphasis-medallion" className="group snap-center shrink-0 w-56 lg:w-auto flex flex-col items-center text-center">` com medalhão `size-44 rounded-full border border-border flex items-center justify-center transition-all duration-200 ease-in-out group-hover:-translate-y-1 group-hover:border-foreground motion-reduce:group-hover:translate-y-0` contendo `TechIcon size-14`; nome `font-display text-3xl mt-5`; status mono (`text-signal-ink` para learning); descrição `mt-2 text-sm text-muted-foreground` sempre visível. `about.tsx` troca `EmphasisList` por `EmphasisMedallions`; apagar `emphasis-list.tsx`.

- [ ] **Step 4: Verificar** — lint/typecheck/unit; rebuild; Playwright inteiro; ver Sobre (medalhões) e Stack em 1440 e 375; `Read`; relatar (ícones legíveis, nomes embaixo, nota do C, snap no mobile, sem overflow).

- [ ] **Step 5: Commit** — `feat(stack): medallions for emphasis, icon+name stack grid with C; more logos`

---

### Task 6: Contato — botões WhatsApp/E-mail (copiar) e órbita de redes

**Files:**
- Create: `components/sections/contact-orbit.tsx`, `components/sections/copy-email-button.tsx` (client)
- Modify: `components/sections/contact.tsx`, `content/socials.ts` (+`iconId` por rede), `messages/*.json`, `tests/e2e/contact.spec.ts`, `round3.spec.ts`

**Interfaces:**
- Produces: `CopyEmailButton({ email, label, copiedLabel })` (client, `useState`, `navigator.clipboard.writeText`; fallback `window.location.href = 'mailto:'`; `aria-live="polite"`); `ContactOrbit({ label })` (server; fichas-link em órbita 80 s com `stackIcons` ids linkedin/github/instagram/whatsapp; nomes `sr-only`; `target=_blank rel=noopener noreferrer`); `socials` ganha `iconId`. Test ids: `contact-whatsapp`, `contact-email`, `contact-orbit`, `social-link` (mantido nas fichas).

- [ ] **Step 1: Testes que falham** — substituir `contact.spec.ts` (manter o teste do currículo):
  ```ts
  test('contato: botões, cópia de e-mail e fichas de redes', async ({ browser }) => {
    const ctx = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
    const page = await ctx.newPage();
    await page.goto('/pt');
    const section = page.locator('section:has(#contact)');
    await section.scrollIntoViewIfNeeded();
    await expect(page.getByTestId('contact-whatsapp')).toHaveAttribute('href', 'https://wa.me/5562994267841');
    const email = page.getByTestId('contact-email');
    await email.click();
    await expect(email).toContainText('Copiado');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('dududiaspf@gmail.com');
    const links = page.getByTestId('contact-orbit').getByTestId('social-link');
    await expect(links).toHaveCount(4);
    const hrefs = await links.evaluateAll((els) => els.map((e) => e.getAttribute('href')).sort());
    expect(hrefs).toEqual([
      'https://github.com/edudiaspf18',
      'https://wa.me/5562994267841',
      'https://www.instagram.com/dudu_diaspf/',
      'https://www.linkedin.com/in/eduardo-dias-8a924131a',
    ]);
    for (const link of await links.all()) {
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
      await expect(link).toHaveAccessibleName(/LinkedIn|GitHub|Instagram|WhatsApp/);
    }
    await ctx.close();
  });

  test('contato em 375: fichas em linha, sem overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/pt');
    await page.locator('#contact').scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    await expect(page.getByTestId('contact-orbit').getByTestId('social-link')).toHaveCount(4);
  });
  ```

- [ ] **Step 2: Rodar e ver falhar.**

- [ ] **Step 3: Implementar**
  - `copy-email-button.tsx`:
    ```tsx
    'use client';

    import { Check, Copy } from 'lucide-react';
    import { useState } from 'react';
    import { buttonVariants } from '@/components/ui/button';
    import { cn } from '@/lib/utils';

    interface CopyEmailButtonProps {
      email: string;
      label: string;
      copiedLabel: string;
    }

    export function CopyEmailButton({ email, label, copiedLabel }: CopyEmailButtonProps) {
      const [copied, setCopied] = useState(false);

      async function onClick(): Promise<void> {
        try {
          await navigator.clipboard.writeText(email);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          window.location.href = `mailto:${email}`;
        }
      }

      return (
        <button
          type="button"
          data-testid="contact-email"
          onClick={onClick}
          aria-live="polite"
          className={cn(
            buttonVariants({ size: 'lg', variant: 'outline' }),
            'rounded-full border-border transition-all duration-200 ease-in-out hover:border-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          )}
        >
          {copied ? <Check className="size-4 text-signal-ink" /> : <Copy className="size-4" />}
          {copied ? copiedLabel : label}
        </button>
      );
    }
    ```
  - `contact-orbit.tsx` (server): mesmo padrão do `stack-orbit.tsx` (anel `animate-orbit`, fichas `animate-orbit-reverse`, `size-16`), mas cada ficha é `<a data-testid="social-link" href target rel className="group flex size-16 items-center justify-center rounded-full border border-border bg-background transition-all duration-200 ease-in-out hover:border-foreground hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:hover:scale-100">` com `<span className="sr-only">{name}</span>` e o `TechIcon` `si` (ids `linkedin`, `github`, `instagram`, `whatsapp`); centro: e-mail em mono `text-xs`; em `< md`: `flex justify-center gap-4` sem posicionamento absoluto (usar classes responsivas: `md:absolute md:…` nos itens e `md:animate-orbit` no anel). Reduced-motion: `motion-reduce:animate-none`.
  - `contact.tsx`: grid `md:grid-cols-12 gap-12`; col-7: `SectionHeading` já acima; `<a data-testid="contact-whatsapp" href="https://wa.me/5562994267841" target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ size: 'lg' }), 'rounded-full bg-signal text-signal-foreground hover:bg-foreground hover:text-background …')}><MessageCircle className="size-4" />{t('whatsapp')}</a>` + `<CopyEmailButton email="dududiaspf@gmail.com" label={t('email')} copiedLabel={t('copied')} />` + botão do currículo (mantido) + `t('location')`; col-5: `<ContactOrbit label={t('orbitLabel')} />`. Mensagens `contact`: `whatsapp` "Chamar no WhatsApp"/"Message on WhatsApp", `email` "Copiar e-mail"/"Copy e-mail", `copied` "Copiado"/"Copied", `orbitLabel` "Minhas redes"/"My networks". `content/socials.ts`: adicionar `iconId` (linkedin/github/instagram/whatsapp; email sem).

- [ ] **Step 4: Verificar** — lint/typecheck/unit; rebuild; Playwright inteiro; ver Contato 1440 e 375 + estado "Copiado"; `Read`; relatar.

- [ ] **Step 5: Commit** — `feat(contact): WhatsApp and copy-email buttons with social orbit`

---

### Task 7: Verificação final e entrega

- [ ] **Step 1:** `npm run lint && npm run typecheck && npm test`; rebuild; `npm run resume`; Playwright inteiro. Resíduos: `grep -rniE "caminu-card|emphasis-list|roleKeyword|stackUsing|stackLearning|stackBasic" app components content messages tests` vazio.
- [ ] **Step 2:** Lighthouse `/pt` e `/en` (a11y 100; BP/SEO 100; perf registrar; se a cortina virar o elemento LCP, anotar). Comando como nas rodadas anteriores.
- [ ] **Step 3:** Visual obrigatório (`scratchpad/final8/`, `Read`): cortina (3 instantes), hero 1440 claro/escuro, Sobre (medalhões) 1440 e 375, Trajetória 1440 meio-rolagem e 375, Projetos 1440 (+hover) e 375, Stack 1440 e 375, Contato 1440 (+Copiado) e 375, EN topo, PDFs. Corrigir defeitos reais; relatar o que viu.
- [ ] **Step 4:** Docs: README (cortina, 6 projetos, ícones, contato) e "Divergências" na spec da rodada 3.
- [ ] **Step 5:** Commit `chore: round 3 verification and docs`. Pendências ao usuário: URLs ao vivo (Charles, Aliança, Cecília, Winner), captura do Caminu se quiser trocar a ilustração.
