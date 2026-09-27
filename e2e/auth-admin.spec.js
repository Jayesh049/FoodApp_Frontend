const { test, expect } = require('@playwright/test');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../Backend/.env') });

const gotoOpts = { waitUntil: 'domcontentloaded', timeout: 60000 };

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

test.describe('Authenticated admin journey', () => {
  test.beforeEach(() => {
    test.skip(!ADMIN_EMAIL || !ADMIN_PASSWORD, 'ADMIN_EMAIL/ADMIN_PASSWORD not set in Backend/.env');
  });

  test('admin can log in and open AI dashboard', async ({ page }) => {
    await page.goto('/login?next=/admin/rag', gotoOpts);
    await page.locator('input.email, input[type="email"]').first().fill(ADMIN_EMAIL);
    await page.locator('input.password, input[type="password"]').first().fill(ADMIN_PASSWORD);
    await page.locator('button.loginBtn').first().click();

    // Must be the post-login admin success panel — not the "Admin access →" link
    await expect(page.locator('.admin-login-success, .admin-login-success__text').first()).toBeVisible({
      timeout: 30000,
    });
    await expect(page.getByRole('button', { name: /Open Admin AI Dashboard/i })).toBeVisible();

    await page.getByRole('button', { name: /Open Admin AI Dashboard/i }).click();
    await expect(page).toHaveURL(/\/admin\/rag/, { timeout: 15000 });
    await expect(page.locator('.admin-page, .admin-panel, h1.h1').filter({ hasText: /AI Admin/i }).first()).toBeVisible({
      timeout: 30000,
    });
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/jampotom421@gmail\.com/i);
    expect(body).not.toMatch(/Jayesh@123/);
  });

  test('admin login then booking create is authorized (API)', async ({ page, request }) => {
    await page.goto('/login', gotoOpts);
    await page.locator('input.email, input[type="email"]').first().fill(ADMIN_EMAIL);
    await page.locator('input.password, input[type="password"]').first().fill(ADMIN_PASSWORD);
    await page.locator('button.loginBtn').first().click();
    await page.waitForTimeout(2500);

    const token = await page.evaluate(() => {
      const match = document.cookie.match(/(?:^|; )jwt=([^;]*)/);
      return match ? decodeURIComponent(match[1]) : localStorage.getItem('token');
    });

    // js-cookie stores jwt; AuthProvider sets Cookies.set('jwt', res.data.token)
    const cookieJwt = await page.evaluate(() => {
      const raw = document.cookie.split(';').map((c) => c.trim());
      const hit = raw.find((c) => c.startsWith('jwt='));
      return hit ? decodeURIComponent(hit.slice(4)) : '';
    });

    const bearer = cookieJwt || token || '';
    expect(bearer.length).toBeGreaterThan(10);

    const plansRes = await request.get('http://localhost:3000/api/v1/plan/');
    const plansJson = await plansRes.json();
    const plans = plansJson.Allplans || [];
    expect(plans.length).toBeGreaterThan(0);
    const plan = plans[0];

    const bookingRes = await request.post('http://localhost:3000/api/v1/booking/', {
      headers: {
        Authorization: bearer.startsWith('Bearer ') ? bearer : `Bearer ${bearer}`,
        'Content-Type': 'application/json',
      },
      data: {
        price: plan.price || 99,
        cartItems: [{ _id: plan._id, price: plan.price, quantity: 1 }],
      },
    });

    // Razorpay keys may fail order create; auth must not be 401
    expect(bookingRes.status()).not.toBe(401);
    expect(bookingRes.status()).not.toBe(403);
  });
});
