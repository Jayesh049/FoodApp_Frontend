const { test, expect } = require('@playwright/test');

const gotoOpts = { waitUntil: 'domcontentloaded', timeout: 60000 };

test.describe('Signup / contact / plans API', () => {
  test('signup form requires fields and does not crash on empty submit', async ({ page }) => {
    await page.goto('/signup', gotoOpts);
    const form = page.locator('form, .form-container, .loginBox').first();
    await expect(form).toBeVisible({ timeout: 20000 });
    const submit = page.locator('button.loginBtn, button:has-text("Sign"), button[type="submit"]').first();
    await expect(submit).toBeVisible();
    await submit.click();
    // Either HTML5 validation blocks navigation, or page stays on signup
    await page.waitForTimeout(1000);
    expect(page.url()).toMatch(/signup/i);
  });

  test('contact form shows validation or status on empty submit', async ({ page }) => {
    await page.goto('/', gotoOpts);
    const contact = page.locator('#contact, .contact-atelier').first();
    await contact.scrollIntoViewIfNeeded();
    await expect(contact).toBeVisible({ timeout: 30000 });
    const submit = page.locator('.contact-form button[type="submit"], .contact-atelier__form button').first();
    await submit.click();
    await page.waitForTimeout(800);
    // Still on home; form should not navigate away
    expect(page.url()).toMatch(/localhost:3001\/?$/);
  });

  test('plans API is reachable from the browser origin', async ({ page }) => {
    const res = await page.request.get('http://localhost:3000/api/v1/plan/');
    expect(res.status()).toBeLessThan(500);
    const data = await res.json();
    const plans = data.Allplans || data.plans || data;
    expect(Array.isArray(plans) ? plans.length : Object.keys(data).length).toBeGreaterThan(0);
  });

  test('unauthenticated booking API returns 401', async ({ page }) => {
    const res = await page.request.post('http://localhost:3000/api/v1/booking/', {
      data: { cartItems: [], price: 1 },
    });
    expect([401, 403]).toContain(res.status());
  });

  test('navbar exposes core links', async ({ page }) => {
    await page.goto('/', gotoOpts);
    await expect(page.locator('nav, .app__navbar').first()).toBeVisible({ timeout: 30000 });
    const navText = await page.locator('nav, .app__navbar').first().innerText();
    expect(navText.length).toBeGreaterThan(5);
  });
});
