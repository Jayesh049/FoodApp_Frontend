const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const gotoOpts = { waitUntil: 'domcontentloaded', timeout: 60000 };

test.describe('Accessibility (axe)', () => {
  for (const path of ['/', '/allPlans', '/login']) {
    test(`no critical/serious axe violations on ${path}`, async ({ page }) => {
      await page.goto(path, gotoOpts);
      await page.waitForTimeout(1500);

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      const severe = results.violations.filter((v) =>
        ['critical', 'serious'].includes(v.impact)
      );

      expect(
        severe,
        severe.map((v) => `${v.id}: ${v.help} (${v.nodes.length} nodes)`).join('\n')
      ).toEqual([]);
    });
  }
});
