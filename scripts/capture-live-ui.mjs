/**
 * Capture live UI screenshots for review after fixes.
 * Usage: node scripts/capture-live-ui.mjs
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'e2e-screenshots');
const BASE = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3001';

fs.mkdirSync(OUT, { recursive: true });

async function shot(page, name, url, prep) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  if (prep) await prep(page);
  await page.waitForTimeout(2000);
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log('saved', file);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

try {
  await shot(page, '01-allPlans', `${BASE}/allPlans`, async (p) => {
    await p.waitForSelector('.food-item-card, [data-testid="plan-card"]', { timeout: 45000 });
  });
  await shot(page, '02-planDetails', `${BASE}/allPlans`, async (p) => {
    await p.waitForSelector('a[href*="/planDetails/"]', { timeout: 45000 });
    await p.locator('a[href*="/planDetails/"]').first().click();
    await p.waitForURL(/planDetails\//, { timeout: 30000 });
    await p.waitForTimeout(1500);
  });
  await shot(page, '03-home', `${BASE}/`, async (p) => {
    await p.waitForSelector('nav, .app__navbar', { timeout: 30000 });
  });
  await shot(page, '04-profile', `${BASE}/profilePage`, async (p) => {
    await p.waitForSelector('[data-testid="profile-page"]', { timeout: 20000 });
  });
  await shot(page, '05-cart-empty', `${BASE}/allPlans`, async (p) => {
    await p.waitForSelector('.navbar-cart-btn', { timeout: 20000 });
    await p.locator('.navbar-cart-btn').first().click();
    await p.waitForTimeout(800);
  });
  console.log('done');
} catch (err) {
  console.error(err);
  process.exitCode = 1;
} finally {
  await browser.close();
}
