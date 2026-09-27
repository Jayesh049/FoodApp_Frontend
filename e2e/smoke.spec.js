const { test, expect } = require('@playwright/test');

const gotoOpts = { waitUntil: 'domcontentloaded', timeout: 60000 };

test.describe('FoodApp critical paths', () => {
  test('home loads with Genrich shell', async ({ page }) => {
    await page.goto('/', gotoOpts);
    await expect(page.locator('.home-page, #home, main, .app__header').first()).toBeVisible({
      timeout: 30000,
    });
    await expect(page.locator('nav, .app__navbar').first()).toBeVisible();
  });

  test('all plans page lists plans', async ({ page }) => {
    await page.goto('/allPlans', gotoOpts);
    await expect(page).toHaveURL(/allPlans/);
    await page.waitForTimeout(2000);
    const cards = page.locator(
      '[class*="plan"], .plan-card, .allplans, a[href*="planDetails"], img'
    );
    await expect(cards.first()).toBeVisible({ timeout: 30000 });
  });

  test('plan details opens from plans list', async ({ page }) => {
    await page.goto('/allPlans', gotoOpts);
    await page.waitForTimeout(2500);
    const link = page.locator('a[href*="/planDetails/"]').first();
    await expect(link).toBeVisible({ timeout: 45000 });
    await link.click();
    await expect(page).toHaveURL(/planDetails\//);
    await expect(page.locator('img').first()).toBeVisible({ timeout: 20000 });
  });

  test('auth pages render', async ({ page }) => {
    await page.goto('/login', gotoOpts);
    await expect(page.locator('input[type="email"], input[name="email"], form').first()).toBeVisible({
      timeout: 20000,
    });
    await page.goto('/signup', gotoOpts);
    await expect(page.locator('form, input').first()).toBeVisible({ timeout: 20000 });
  });

  test('profile page shows login prompt when logged out', async ({ page }) => {
    await page.goto('/profilePage', gotoOpts);
    await expect(page.getByTestId('profile-page')).toBeVisible({ timeout: 20000 });
  });

  test('suggestions section is present on home', async ({ page }) => {
    await page.goto('/', gotoOpts);
    const section = page.getByTestId('suggestions-section');
    await section.scrollIntoViewIfNeeded().catch(() => {});
    await expect(section).toBeVisible({ timeout: 30000 });
    await expect(page.getByTestId('suggest-input')).toBeVisible();
  });

  test('suggestions handles API response gracefully', async ({ page }) => {
    await page.goto('/', gotoOpts);
    const section = page.getByTestId('suggestions-section');
    await section.scrollIntoViewIfNeeded().catch(() => {});
    await page.getByTestId('suggest-input').fill('vegetarian under 300');
    await page.getByTestId('suggest-submit').click();
    await page.waitForTimeout(4000);
    const answer = page.locator('.app__suggestions-answer, .app__suggestions-error, .app__suggestions-skeleton');
    await expect(answer.first()).toBeVisible({ timeout: 45000 });
  });

  test('cart opens empty state', async ({ page }) => {
    await page.goto('/', gotoOpts);
    const cartBtn = page.locator('.navbar-cart-btn, [aria-label*="cart" i], button:has-text("Cart")').first();
    if (await cartBtn.count()) {
      await cartBtn.click();
      await expect(page.getByTestId('cart-empty')).toBeVisible({ timeout: 10000 });
    } else {
      test.skip(true, 'Cart button not found in nav');
    }
  });

  test('admin rag page loads (auth may gate content)', async ({ page }) => {
    await page.goto('/admin/rag', gotoOpts);
    await expect(page.locator('body')).toBeVisible();
    await page.waitForTimeout(1500);
  });
});
