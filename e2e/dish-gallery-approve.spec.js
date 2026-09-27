/**
 * Playwright approval gate for one dish's 5 gallery shots.
 *
 * Env:
 *   DISH_SLUG=paneer-butter-masala
 *   DISH_UPLOADS_ROOT=absolute path to Backend/uploads (optional)
 *
 * Pass criteria (automated "ok"):
 * - all 5 images exist and decode
 * - each ≥ 512×512 natural size
 * - each file ≥ 25KB
 * - mean brightness in mid range (not blank black/white)
 * - center crop has color variance (not flat solid)
 * - pairwise pixel hash differs (no duplicate shots)
 */
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SLUG = process.env.DISH_SLUG || 'paneer-butter-masala';
const UPLOADS =
  process.env.DISH_UPLOADS_ROOT ||
  path.resolve(__dirname, '../../Backend/uploads');
const DIR = path.join(UPLOADS, 'dishes', SLUG);
const SHOTS = ['01', '02', '03', '04', '05'];

function dHashFromRgba(data, w, h) {
  // 8x8 average hash from RGBA Uint8ClampedArray
  const size = 8;
  const blockW = Math.max(1, Math.floor(w / size));
  const blockH = Math.max(1, Math.floor(h / size));
  const cells = [];
  for (let by = 0; by < size; by += 1) {
    for (let bx = 0; bx < size; bx += 1) {
      let sum = 0;
      let n = 0;
      const x0 = bx * blockW;
      const y0 = by * blockH;
      for (let y = y0; y < Math.min(h, y0 + blockH); y += 1) {
        for (let x = x0; x < Math.min(w, x0 + blockW); x += 1) {
          const i = (y * w + x) * 4;
          sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          n += 1;
        }
      }
      cells.push(n ? sum / n : 0);
    }
  }
  const avg = cells.reduce((a, b) => a + b, 0) / cells.length;
  return cells.map((v) => (v >= avg ? '1' : '0')).join('');
}

function hamming(a, b) {
  let d = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i += 1) if (a[i] !== b[i]) d += 1;
  return d;
}

test.describe(`Dish gallery approve: ${SLUG}`, () => {
  test('5 shots pass quality gate', async ({ page }) => {
    expect(fs.existsSync(DIR), `missing dir ${DIR}`).toBeTruthy();

    const metas = [];
    const hashes = [];

    for (const shot of SHOTS) {
      const file = path.join(DIR, `${SLUG}-${shot}.png`);
      const altJpeg = path.join(DIR, `${SLUG}-${shot}.jpg`);
      const useFile = fs.existsSync(file)
        ? file
        : fs.existsSync(altJpeg)
          ? altJpeg
          : file;

      expect(fs.existsSync(useFile), `missing ${useFile}`).toBeTruthy();
      const buf = fs.readFileSync(useFile);
      expect(buf.length, `${shot} too small`).toBeGreaterThan(25_000);
      const isPng = buf[0] === 0x89 && buf[1] === 0x50;
      const isJpeg = buf[0] === 0xff && buf[1] === 0xd8;
      expect(isPng || isJpeg, `${shot} not png/jpeg`).toBeTruthy();

      const mime = isJpeg ? 'image/jpeg' : 'image/png';
      const dataUrl = `data:${mime};base64,${buf.toString('base64')}`;

      const stats = await page.evaluate(async (url) => {
        const img = new Image();
        img.src = url;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = () => reject(new Error('decode failed'));
        });
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const { data } = ctx.getImageData(0, 0, w, h);
        let sum = 0;
        let sumSq = 0;
        const n = data.length / 4;
        for (let i = 0; i < data.length; i += 4) {
          const y = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          sum += y;
          sumSq += y * y;
        }
        const mean = sum / n;
        const variance = sumSq / n - mean * mean;
        // center crop variance
        const cw = Math.floor(w * 0.5);
        const ch = Math.floor(h * 0.5);
        const cx = Math.floor(w * 0.25);
        const cy = Math.floor(h * 0.25);
        const center = ctx.getImageData(cx, cy, cw, ch).data;
        let cSum = 0;
        let cSumSq = 0;
        const cn = center.length / 4;
        for (let i = 0; i < center.length; i += 4) {
          const y = 0.299 * center[i] + 0.587 * center[i + 1] + 0.114 * center[i + 2];
          cSum += y;
          cSumSq += y * y;
        }
        const cMean = cSum / cn;
        const cVar = cSumSq / cn - cMean * cMean;
        return { w, h, mean, variance, cVar, rgba: Array.from(data) };
      }, dataUrl);

      expect(stats.w, `${shot} width`).toBeGreaterThanOrEqual(512);
      expect(stats.h, `${shot} height`).toBeGreaterThanOrEqual(512);
      expect(stats.mean, `${shot} too dark/blank`).toBeGreaterThan(12);
      expect(stats.mean, `${shot} too bright/blank`).toBeLessThan(245);
      expect(stats.variance, `${shot} flat image`).toBeGreaterThan(80);
      expect(stats.cVar, `${shot} flat center`).toBeGreaterThan(40);

      const hash = dHashFromRgba(
        Uint8ClampedArray.from(stats.rgba),
        stats.w,
        stats.h
      );
      hashes.push(hash);
      metas.push({
        shot,
        w: stats.w,
        h: stats.h,
        meanBright: Math.round(stats.mean),
        variance: Math.round(stats.variance),
        bytes: buf.length,
      });
    }

    for (let i = 0; i < hashes.length; i += 1) {
      for (let j = i + 1; j < hashes.length; j += 1) {
        const dist = hamming(hashes[i], hashes[j]);
        expect(dist, `shots ${SHOTS[i]} and ${SHOTS[j]} too similar`).toBeGreaterThan(3);
      }
    }

    // eslint-disable-next-line no-console
    console.log(JSON.stringify({ status: 'APPROVED', slug: SLUG, shots: metas }));
  });
});
