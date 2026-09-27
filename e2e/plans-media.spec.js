const { test, expect } = require('@playwright/test');

const CODE_RE = /\b(NI|SI|CH|DS|BV)\d{3}\b/i;
const NON_VEG_RE = /\b(chicken|mutton|fish|biryani|kebab|sushi|ramen)\b/i;
const gotoOpts = { waitUntil: 'domcontentloaded', timeout: 60000 };

test.describe('Plans media & names (user POV)', () => {
  test('allPlans cards show clean titles and loaded food images', async ({ page }) => {
    await page.goto('/allPlans', gotoOpts);
    // Retry once if HMR left the grid empty
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        await page.waitForSelector('[data-testid="plan-card"]', { timeout: 30000 });
        break;
      } catch (err) {
        if (attempt === 1) throw err;
        await page.reload({ waitUntil: 'domcontentloaded' });
      }
    }
    await page.waitForTimeout(1000);

    const cards = page.locator('[data-testid="plan-card"], .food-item-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    const visible = Math.min(count, 12);

    for (let i = 0; i < visible; i += 1) {
      const card = cards.nth(i);
      const title = (await card.locator('.food-name').innerText()).trim();
      expect(title.length).toBeGreaterThan(0);
      expect(title).not.toMatch(CODE_RE);
      expect(title).not.toMatch(NON_VEG_RE);

      const img = card.locator('img.food-image').first();
      await expect(img).toBeVisible({ timeout: 15000 });
      const natural = await img.evaluate((el) => ({
        w: el.naturalWidth,
        h: el.naturalHeight,
        src: el.currentSrc || el.src,
      }));
      expect(natural.w).toBeGreaterThan(0);
      expect(natural.src).toMatch(/dishes|data:image\/svg|\.jpe?g|\.png/i);
    }

    const imgs = await page.locator('.food-item-card img.food-image').evaluateAll((nodes) =>
      nodes.slice(0, 3).map((n) => n.currentSrc || n.src)
    );
    if (imgs.length >= 3) {
      const allSame = imgs.every((s) => s === imgs[0]);
      expect(allSame).toBeFalsy();
    }
  });

  test('plan details shows clean name and image', async ({ page }) => {
    await page.goto('/allPlans', gotoOpts);
    await page.waitForSelector('a[href*="/planDetails/"]', { timeout: 45000 });
    await page.locator('a[href*="/planDetails/"]').first().click();
    await expect(page).toHaveURL(/planDetails\//);
    const title = page.locator('.plan-title, h1').first();
    await expect(title).toBeVisible({ timeout: 20000 });
    const text = (await title.innerText()).trim();
    expect(text).not.toMatch(CODE_RE);
    const img = page.locator('.main-image, img').first();
    await expect(img).toBeVisible();
  });
});

test.describe('Full user journey', () => {
  test('home → plans → details → cart', async ({ page }) => {
    await page.goto('/', gotoOpts);
    await expect(page.locator('nav, .app__navbar').first()).toBeVisible({ timeout: 30000 });

    await page.goto('/allPlans', gotoOpts);
    await page.waitForSelector('.food-item-card, [data-testid="plan-card"]', { timeout: 45000 });

    const addBtn = page.locator('.add-to-cart-item').first();
    await expect(addBtn).toBeVisible({ timeout: 15000 });
    await addBtn.click();

    const cartBtn = page.locator('.navbar-cart-btn').first();
    await cartBtn.click();
    await expect(page.locator('.cart-sidebar, .cart-item').first()).toBeVisible({ timeout: 10000 });

    await page.locator('.cart-close').click();
    await expect(page.locator('.cart-sidebar-overlay')).toHaveCount(0, { timeout: 10000 });

    await page.locator('a[href*="/planDetails/"]').first().click();
    await expect(page).toHaveURL(/planDetails\//, { timeout: 20000 });
  });

  test('auth and profile surfaces', async ({ page }) => {
    await page.goto('/login', gotoOpts);
    await expect(page.locator('form, input').first()).toBeVisible({ timeout: 20000 });
    await page.goto('/signup', gotoOpts);
    await expect(page.locator('form, input').first()).toBeVisible({ timeout: 20000 });
    await page.goto('/profilePage', gotoOpts);
    await expect(page.getByTestId('profile-page')).toBeVisible({ timeout: 20000 });
  });
});
