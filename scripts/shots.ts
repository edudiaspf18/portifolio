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
