const { test, expect } = require('@playwright/test');

const gotoOpts = { waitUntil: 'domcontentloaded', timeout: 60000 };

const ROUTES = [
  '/',
  '/allPlans',
  '/login',
  '/signup',
  '/profilePage',
  '/forgetPassword',
  '/admin/rag',
  '/admin/plans',
  '/admin/sections',
];

test.describe('Console error crawl', () => {
  for (const route of ROUTES) {
    test(`no severe page errors on ${route}`, async ({ page }) => {
      const pageErrors = [];
      const failedRequests = [];

      page.on('pageerror', (err) => pageErrors.push(String(err && err.message ? err.message : err)));
      page.on('requestfailed', (req) => {
        const url = req.url();
        // Ignore chrome-extension / favicon noise
        if (/favicon|chrome-extension|hot-update/.test(url)) return;
        failedRequests.push(`${req.failure()?.errorText || 'fail'} ${url}`);
      });

      await page.goto(route, gotoOpts);
      await page.waitForTimeout(2500);

      // Filter known non-fatal noise
      const severe = pageErrors.filter(
        (m) =>
          !/ResizeObserver|Script error\.|Non-Error promise rejection/i.test(m) &&
          !/Loading chunk/i.test(m)
      );

      const apiFails = failedRequests.filter((f) => /localhost:3000\/api/.test(f));

      expect(severe, `pageerrors: ${severe.join(' | ')}`).toEqual([]);
      expect(apiFails, `api fails: ${apiFails.join(' | ')}`).toEqual([]);
    });
  }
});
