/**
 * Gera public/projects/<id>.jpg.
 * Tenta o site ao vivo; se falhar (ou nao houver URL), sobe `npm run dev` DENTRO do projeto irmao.
 * Aviso: isso pode criar/atualizar `.next/` e arquivos gerados nos projetos irmaos
 * (next-env.d.ts, tsbuildinfo). Nenhum codigo-fonte e editado.
 * Raiz dos irmaos: env SHOTS_ROOT (padrao ~/DevWeb).
 */
import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { chromium, type Browser } from '@playwright/test';

interface Target {
  id: string;
  dir: string;
  live: string | null;
  port: number;
}

const devRoot = process.env.SHOTS_ROOT ?? path.join(os.homedir(), 'DevWeb');
const landings = path.join(devRoot, 'landings');
const outDir = path.join(process.cwd(), 'public', 'projects');

const targets: readonly Target[] = [
  { id: 'charles', dir: path.join(landings, '001 - LP CharlesV'), live: null, port: 3101 },
  { id: 'alianca', dir: path.join(landings, '002 - LP AliancaM'), live: null, port: 3102 },
  { id: 'cecilia', dir: path.join(landings, '004 - LP Cecilia Fontoura'), live: null, port: 3104 },
  { id: 'winner', dir: path.join(devRoot, 'winner-tech'), live: null, port: 3107 },
  { id: 'esther', dir: path.join(landings, '005 - LP Esther Duarte'), live: 'https://www.estherduartenutri.com.br', port: 3105 },
  { id: 'laco', dir: path.join(devRoot, 'posto marinheiro', 'apps', 'web'), live: null, port: 3108 },
  // WordPress local: precisa de `bin/serve` rodando no projeto (porta 8088); staging pede senha.
  { id: 'ellora', dir: path.join(devRoot, 'projetos no wordpress', 'ellora collection'), live: 'http://localhost:8088', port: 8088 },
];

const onlyIdx = process.argv.indexOf('--only');
const onlyId = onlyIdx >= 0 ? process.argv[onlyIdx + 1] : undefined;
if (onlyIdx >= 0 && (!onlyId || onlyId.startsWith('--'))) {
  console.error('--only requer um id (ex: --only esther)');
  process.exit(1);
}
const selected = onlyId ? targets.filter((t) => t.id === onlyId) : targets;
if (onlyId && selected.length === 0) {
  console.error(`--only: id desconhecido "${onlyId}"`);
  process.exit(1);
}

const children = new Set<ChildProcess>();

function killGroup(child: ChildProcess, signal: NodeJS.Signals): void {
  if (!child.pid) return;
  try {
    process.kill(-child.pid, signal);
  } catch {
    /* ESRCH: ja encerrado */
  }
}

async function stopChild(child: ChildProcess): Promise<void> {
  killGroup(child, 'SIGTERM');
  await new Promise((r) => setTimeout(r, 1500));
  killGroup(child, 'SIGKILL');
  children.delete(child);
}

function killAllSync(): void {
  for (const child of children) killGroup(child, 'SIGKILL');
}

process.on('exit', killAllSync);
for (const sig of ['SIGINT', 'SIGTERM'] as const) {
  process.on(sig, () => {
    killAllSync();
    process.exit(130);
  });
}

function portIsFree(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const probe = net.createServer();
    probe.once('error', () => resolve(false));
    probe.listen(port, () => probe.close(() => resolve(true)));
  });
}

async function waitFor(url: string, exited: () => string | null, ms = 90_000): Promise<void> {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    const reason = exited();
    if (reason) throw new Error(reason);
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      /* servidor ainda subindo */
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error('dev server timeout');
}

// Esconde o indicador do Next so na pagina fotografada; nada e escrito no repo alvo.
const hideDevIndicator = 'nextjs-portal { display: none !important; }';

async function capture(browser: Browser, url: string, file: string): Promise<void> {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 45_000 });
    if (!response?.ok()) throw new Error(`HTTP ${response?.status() ?? 'sem resposta'} em ${url}`);
    await page.addStyleTag({ content: hideDevIndicator });
    // Banner de cookies: em dev ele aparece so apos hidratacao (pode passar de 2s). Espera ate 8s.
    const consent = page
      .locator('button, a, [role="button"]')
      .filter({ hasText: /^\s*(recusar|rejeitar|aceitar|reject|decline|accept)/i })
      .first();
    try {
      await consent.waitFor({ state: 'visible', timeout: 8_000 });
      await consent.click({ timeout: 3_000 });
      await consent.waitFor({ state: 'hidden', timeout: 3_000 });
    } catch {
      /* sem banner de cookies */
    }
    await page.waitForTimeout(3000); // deixa animacoes de entrada terminarem
    await page.screenshot({ path: file, type: 'jpeg', quality: 82 });
  } finally {
    await page.close();
  }
}

async function viaLocal(browser: Browser, target: Target, file: string): Promise<void> {
  if (!existsSync(target.dir)) throw new Error(`diretorio inexistente: ${target.dir}`);
  if (!(await portIsFree(target.port))) {
    throw new Error(`porta ${target.port} ja esta em uso; libere antes de rodar`);
  }
  const child: ChildProcess = spawn('npm', ['run', 'dev', '--', '-p', String(target.port)], {
    cwd: target.dir,
    stdio: 'ignore',
    detached: true,
  });
  children.add(child);
  let exitReason: string | null = null;
  child.once('exit', (code, signal) => {
    exitReason = `dev server encerrou (code=${String(code)} signal=${String(signal)})`;
  });
  child.once('error', (err) => {
    exitReason = `falha ao iniciar dev server: ${err.message}`;
  });
  try {
    const url = `http://localhost:${target.port}`;
    await waitFor(url, () => exitReason);
    await capture(browser, url, file);
  } finally {
    await stopChild(child);
  }
}

async function main(): Promise<void> {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch();
  const failed: string[] = [];
  const missing: string[] = [];

  try {
    for (const target of selected) {
      const file = path.join(outDir, `${target.id}.jpg`);
      if (target.live) {
        try {
          await capture(browser, target.live, file);
          console.log(`ok   ${target.id} (ao vivo)`);
          continue;
        } catch (liveError) {
          console.warn(`warn ${target.id}: ao vivo falhou (${String(liveError)}), tentando local`);
        }
      }
      try {
        await viaLocal(browser, target, file);
        console.log(`ok   ${target.id} (local)`);
      } catch (localError) {
        failed.push(target.id);
        if (!existsSync(file)) missing.push(target.id);
        console.warn(`FAIL ${target.id}: ${String(localError)}. Print anterior mantido, se existir.`);
      }
    }
  } finally {
    await browser.close();
  }

  if (failed.length > 0) console.warn(`Sem print novo: ${failed.join(', ')}`);
  if (missing.length > 0) {
    console.error(`Sem nenhum print: ${missing.join(', ')}`);
    process.exitCode = 1;
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
