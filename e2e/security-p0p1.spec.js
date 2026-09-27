const { test, expect } = require('@playwright/test');

const gotoOpts = { waitUntil: 'domcontentloaded', timeout: 60000 };

test.describe('P0/P1 security regressions', () => {
  test('admin login form does not autofill credentials', async ({ page }) => {
    await page.goto('/login?next=/admin/rag', gotoOpts);
    const email = page.locator('input[type="email"], input[name="email"], input.email').first();
    const password = page.locator('input[type="password"]').first();
    await expect(email).toBeVisible({ timeout: 20000 });
    await expect(email).toHaveValue('');
    await expect(password).toHaveValue('');
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/jampotom421@gmail\.com/i);
    expect(body).not.toMatch(/pre-filled/i);
    expect(body).not.toMatch(/Jayesh@123/);
  });

  test('wrong password shows login error', async ({ page }) => {
    await page.goto('/login', gotoOpts);
    await page.locator('input[type="email"], input[name="email"]').first().fill('nobody@example.com');
    await page.locator('input[type="password"]').first().fill('WrongPass123!');
    await page.locator('button[type="submit"], .loginBtn, button:has-text("Log")').first().click();
    await expect(page.locator('.error, .form-error, .auth-error, p').filter({ hasText: /fail|match|not found|password|verify/i }).first()).toBeVisible({
      timeout: 20000,
    });
  });

  test('admin rag redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/admin/rag', gotoOpts);
    await page.waitForTimeout(2000);
    const url = page.url();
    const onLogin = /\/login/.test(url);
    const gated =
      (await page.locator('text=/login|sign in|admin access|not authorized/i').count()) > 0;
    expect(onLogin || gated).toBeTruthy();
  });

  test('admin pages must not expose hardcoded admin password or email autofill hints with password', async ({
    page,
  }) => {
    await page.goto('/admin/rag', gotoOpts);
    await page.waitForTimeout(1500);
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/Jayesh@123/);
    // Password autofill string must never appear in DOM
    expect(body).not.toMatch(/setPassword\(/);
  });

  test('admin rag UI must not hardcode a personal admin email in help text', async ({ page }) => {
    await page.goto('/admin/rag', gotoOpts);
    await page.waitForTimeout(1500);
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/jampotom421@gmail\.com/i);
  });

  test('booking checkout requires login when cart has items', async ({ page }) => {
    await page.goto('/allPlans', gotoOpts);
    await page.waitForSelector('.add-to-cart-item, [data-testid="plan-card"]', { timeout: 45000 });
    const addBtn = page.locator('.add-to-cart-item').first();
    await expect(addBtn).toBeVisible({ timeout: 15000 });
    await addBtn.click();

    await page.goto('/booking1', gotoOpts);
    // RequireAuth should send anonymous users to login with next=
    await expect(page).toHaveURL(/\/login/, { timeout: 20000 });
    expect(page.url()).toMatch(/next=/);
  });
});

test.describe('Contact + navigation', () => {
  test('home contact section is reachable and form fields render', async ({ page }) => {
    await page.goto('/', gotoOpts);
    const contact = page.locator('#contact, .contact-atelier, section.contact-atelier').first();
    await contact.scrollIntoViewIfNeeded().catch(() => {});
    await expect(contact).toBeVisible({ timeout: 30000 });
    await expect(page.locator('.contact-form input, .contact-atelier__form input').first()).toBeVisible({
      timeout: 15000,
    });
  });

  test('forget password page renders', async ({ page }) => {
    await page.goto('/forgetPassword', gotoOpts);
    await expect(page.locator('form, input').first()).toBeVisible({ timeout: 20000 });
  });
});
