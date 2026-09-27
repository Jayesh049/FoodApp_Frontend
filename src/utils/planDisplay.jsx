import { getCategoryMeta } from './foodCategories';

/** Inventory suffixes: NI001, SI012 (and font lookalikes). */
const CODE_SUFFIX = /\s+(NI|SI|CH|DS|BV)\d{3}$/i;
const CODE_ANYWHERE = /\s+(NI|SI|CH|DS|BV)\d{3}\b/gi;

/** Strip inventory codes like "NI001" for customer-facing titles. */
export function displayPlanName(planOrName) {
  const raw =
    typeof planOrName === 'string'
      ? planOrName
      : planOrName?.name || '';
  let cleaned = String(raw).replace(CODE_SUFFIX, '').replace(CODE_ANYWHERE, '').trim();
  cleaned = cleaned.replace(/\s+[A-Z]{2}\d{3}$/i, '').trim();
  return cleaned || String(raw).trim();
}

export function planCategoryLabel(plan) {
  if (!plan) return '';
  const meta = getCategoryMeta(plan.category);
  return meta?.label || plan.category || '';
}

/**
 * Pricing helper. Catalog mixes two shapes:
 * - percent off when discount is a small number (≤ 90), e.g. 10 → 10% OFF
 * - absolute sale price when discount is a large amount (< price but > 90)
 */
export function planPricing(plan) {
  const listPrice = Number(plan?.price) || 0;
  const raw = Number(plan?.discount);
  if (!Number.isFinite(raw) || raw <= 0 || raw >= listPrice || listPrice <= 0) {
    return {
      listPrice,
      salePrice: listPrice,
      hasDeal: false,
      savings: 0,
      percentOff: 0,
    };
  }

  const asPercent = raw <= 90;
  const percentOff = asPercent
    ? Math.round(raw)
    : Math.round(((listPrice - raw) / listPrice) * 100);
  const salePrice = asPercent
    ? Math.round(listPrice * (1 - raw / 100))
    : Math.round(raw);
  const savings = Math.max(0, listPrice - salePrice);

  return {
    listPrice,
    salePrice,
    hasDeal: savings > 0,
    savings,
    percentOff,
  };
}

/** Escape text for embedding inside an SVG (whole SVG is URI-encoded once). */
function escapeSvgText(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** SVG data-URI food placeholder tinted by category color. */
export function planImagePlaceholder(plan) {
  const meta = getCategoryMeta(plan?.category);
  const color = (meta?.color || '#DCCA87').replace('#', '');
  const label = escapeSvgText((displayPlanName(plan) || 'Meal').slice(0, 18));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480">
  <rect width="640" height="480" fill="#0c0c0c"/>
  <rect x="24" y="24" width="592" height="432" fill="none" stroke="#${color}" stroke-width="2" opacity="0.7"/>
  <circle cx="320" cy="200" r="72" fill="#${color}" opacity="0.25"/>
  <text x="320" y="340" text-anchor="middle" fill="#DCCA87" font-family="Georgia, serif" font-size="28">${label}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function hasInventoryCode(name) {
  return /\b(NI|SI|CH|DS|BV)\d{3}\b/i.test(String(name || ''));
}
