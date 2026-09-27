/**
 * Headed live bug hunt — opens a visible browser, audits /allPlans + journey,
 * prints BUG/OK lines, saves annotated screenshots.
 * Usage: node scripts/live-bug-hunt.mjs
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'e2e-screenshots');
const BASE = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3001';
const API = process.env.API_ORIGIN || 'http://localhost:3000';
const CODE_RE = /\b(NI|SI|CH|DS|BV)\d{3}\b/i;
const NON_VEG_RE =
  /\b(chicken|mutton|fish|egg|prawn|shrimp|lamb|beef|pork|kebab|biryani|sushi|ramen|wonton|dumpling)\b/i;


fs.mkdirSync(OUT, { recursive: true });

const bugs = [];
const oks = [];

function bug(msg) {
  bugs.push(msg);
  console.log(`BUG: ${msg}`);
}
function ok(msg) {
  oks.push(msg);
  console.log(`OK:  ${msg}`);
}

async function waitApi() {
  for (let i = 0; i < 30; i += 1) {
    try {
      const r = await fetch(`${API}/api/v1/plan/`);
      if (r.ok) return true;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

console.log('--- Live bug hunt starting ---');
console.log(`FE ${BASE} | BE ${API}`);

const apiUp = await waitApi();
if (!apiUp) {
  bug('Backend API not reachable on :3000 — plans cannot load');
} else {
  ok('Backend API reachable');
  const data = await fetch(`${API}/api/v1/plan/?diet=veg`).then((r) => r.json());
  const plans = data?.Allplans || data?.data || data?.plans || data || [];
  const list = Array.isArray(plans) ? plans : [];
  ok(`API returned ${list.length} veg plans`);
  const nonVeg = list.filter((p) => NON_VEG_RE.test(p.name || ''));
  if (nonVeg.length) {
    bug(`${nonVeg.length} non-veg plans leaked through diet=veg`);
    nonVeg.slice(0, 5).forEach((p) => console.log(`     - ${p.name}`));
  } else {
    ok('diet=veg API has no chicken/biryani/kebab names');
  }

  const byImage = new Map();
  for (const p of list.slice(0, 200)) {
    const img = p.image || (p.images && p.images[0]) || '';
    if (!img) {
      bug(`Plan "${p.name}" has empty image`);
      continue;
    }
    if (!byImage.has(img)) byImage.set(img, []);
    byImage.get(img).push(p.name);
  }
  for (const [img, names] of byImage) {
    const bases = new Set(
      names.map((n) => String(n).replace(/\s+(NI|SI|CH|DS|BV)\d{3}$/i, '').trim().toLowerCase())
    );
    if (bases.size > 1 && names.length >= 2) {
      bug(`Same image reused across different dishes: ${img} → ${[...bases].slice(0, 4).join(' | ')}`);
    }
  }

  const coded = list.filter((p) => CODE_RE.test(p.name || '')).length;
  ok(`DB still has ${coded} coded names (expected; UI must strip them)`);

  const legacyPortrait = list.filter((p) => {
    const img = String(p.image || '');
    return /uploads\/\d+\.png$/i.test(img) && !/dishes\//i.test(img);
  });
  if (legacyPortrait.length) {
    bug(`${legacyPortrait.length} plans still use legacy uploads/*.png (likely portraits)`);
    legacyPortrait.slice(0, 5).forEach((p) => console.log(`     - ${p.name}: ${p.image}`));
  } else {
    ok('No legacy root uploads/*.png on sampled plans');
  }
}

const browser = await chromium.launch({
  headless: false,
  slowMo: 120,
});
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

try {
  console.log('\n--- UI: /allPlans ---');
  await page.goto(`${BASE}/allPlans`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(1500);

  let cards = page.locator('[data-testid="plan-card"], .food-item-card');
  try {
    await cards.first().waitFor({ timeout: 25000 });
  } catch {
    bug('No plan cards rendered on /allPlans within 25s');
    await page.screenshot({ path: path.join(OUT, 'bug-allPlans-empty.png'), fullPage: false });
  }

  const count = await cards.count();
  if (count === 0) {
    bug('Plan card count is 0');
  } else {
    ok(`${count} plan cards visible`);
  }

  const checkN = Math.min(count, 12);
  const srcByTitle = [];
  for (let i = 0; i < checkN; i += 1) {
    const card = cards.nth(i);
    const title = (await card.locator('.food-name').innerText().catch(() => '')).trim();
    if (!title) bug(`Card ${i} missing title`);
    else if (CODE_RE.test(title)) bug(`Card ${i} still shows inventory code: "${title}"`);
    else if (NON_VEG_RE.test(title)) bug(`Card ${i} shows non-veg dish: "${title}"`);
    else ok(`Card ${i} clean veg title: "${title}"`);

    const box = await card.locator('.food-name').boundingBox().catch(() => null);
    if (box && box.height < 18) bug(`Card ${i} title height suspiciously small (clipped?)`);

    const img = card.locator('img.food-image').first();
    const meta = await img
      .evaluate((el) => ({
        w: el.naturalWidth,
        h: el.naturalHeight,
        src: el.currentSrc || el.src,
      }))
      .catch(() => null);
    if (!meta || meta.w <= 0) bug(`Card ${i} "${title}" image failed to load`);
    else if (/uploads\/\d+\.png/i.test(meta.src) && !/dishes\//i.test(meta.src)) {
      bug(`Card ${i} "${title}" still uses legacy portrait path: ${meta.src}`);
    } else {
      ok(`Card ${i} image loaded (${meta.w}x${meta.h})`);
    }
    if (meta?.src) srcByTitle.push({ title, src: meta.src });
  }

  // Duplicate image among different clean titles on first page
  const bySrc = new Map();
  for (const row of srcByTitle) {
    if (!bySrc.has(row.src)) bySrc.set(row.src, []);
    bySrc.get(row.src).push(row.title);
  }
  for (const [src, titles] of bySrc) {
    const uniq = [...new Set(titles.map((t) => t.toLowerCase()))];
    if (uniq.length > 1) {
      bug(`Visible cards share one image for different dishes: ${uniq.join(' vs ')}`);
      console.log(`     src: ${src.slice(0, 120)}`);
    }
  }

  await page.screenshot({ path: path.join(OUT, 'live-hunt-allPlans.png'), fullPage: false });
  console.log('saved live-hunt-allPlans.png');

  console.log('\n--- UI: plan details ---');
  const detailLink = page.locator('a[href*="/planDetails/"]').first();
  if ((await detailLink.count()) === 0) {
    bug('No plan detail links on page');
  } else {
    await detailLink.click();
    await page.waitForURL(/planDetails\//, { timeout: 30000 });
    await page.waitForTimeout(1200);
    const titleEl = page.locator('.plan-title, h1').first();
    const detailTitle = (await titleEl.innerText().catch(() => '')).trim();
    if (!detailTitle) bug('Plan details missing title');
    else if (CODE_RE.test(detailTitle)) bug(`Details title has code: "${detailTitle}"`);
    else ok(`Details clean title: "${detailTitle}"`);

    const priceText = (await page.locator('.plan-price, .price, [class*="price"]').first().innerText().catch(() => '')).trim();
    if (priceText && /₹\s*\d+/.test(priceText) && priceText.includes('₹') && !/\d/.test(priceText.replace(/₹\s*\d+[^\d]*/, ''))) {
      // strikethrough only — soft check
      const hasStrike = await page.locator('.plan-price s, .plan-price del, s, del').count();
      if (hasStrike > 0) {
        const body = await page.locator('body').innerText();
        const rupees = body.match(/₹\s*\d+/g) || [];
        if (rupees.length < 2) bug(`Details shows strikethrough price but no clear sale price (saw: ${priceText})`);
      }
    }

    await page.screenshot({ path: path.join(OUT, 'live-hunt-details.png'), fullPage: false });
    console.log('saved live-hunt-details.png');
  }

  console.log('\n--- UI: cart journey ---');
  await page.goto(`${BASE}/allPlans`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('.add-to-cart-item, [data-testid="plan-card"]', { timeout: 45000 });
  await page.locator('.add-to-cart-item').first().click();
  await page.waitForTimeout(600);
  await page.locator('.navbar-cart-btn').first().click();
  await page.waitForTimeout(800);
  const cartVisible = await page.locator('.cart-overlay, .cart-sidebar, [class*="cart"]').first().isVisible().catch(() => false);
  if (!cartVisible) bug('Cart UI did not open after add-to-cart');
  else ok('Cart opened after add');
  await page.screenshot({ path: path.join(OUT, 'live-hunt-cart.png'), fullPage: false });

  console.log('\n--- UI: home ---');
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(1500);
  const knife = await page.locator('text=/knife/i').count();
  const wine = await page.locator('canvas').count();
  ok(`Home loaded (canvas count=${wine})`);
  await page.screenshot({ path: path.join(OUT, 'live-hunt-home.png'), fullPage: false });

  // Leave browser open briefly so user can watch final state
  await page.goto(`${BASE}/allPlans`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);
} catch (err) {
  bug(`Crash during UI hunt: ${err.message}`);
  console.error(err);
} finally {
  console.log('\n========== SUMMARY ==========');
  console.log(`OK: ${oks.length}  BUGS: ${bugs.length}`);
  bugs.forEach((b, i) => console.log(`  ${i + 1}. ${b}`));
  fs.writeFileSync(
    path.join(OUT, 'live-hunt-report.json'),
    JSON.stringify({ oks, bugs, at: new Date().toISOString() }, null, 2)
  );
  await browser.close();
  process.exitCode = bugs.length ? 1 : 0;
}
