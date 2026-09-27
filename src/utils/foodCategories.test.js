import { FOOD_CATEGORIES, getCategoryMeta, planDisplayIcon } from './foodCategories';

describe('foodCategories', () => {
  it('defines 5 categories with distinct icons', () => {
    expect(FOOD_CATEGORIES).toHaveLength(5);
    const icons = FOOD_CATEGORIES.map((c) => c.icon);
    expect(new Set(icons).size).toBe(5);
  });

  it('getCategoryMeta returns known category', () => {
    expect(getCategoryMeta('chinese').icon).toBe('🥡');
    expect(getCategoryMeta('chinese').label).toBe('Chinese');
  });

  it('planDisplayIcon prefers plan.icon then category', () => {
    expect(planDisplayIcon({ icon: '🍕', category: 'chinese' })).toBe('🍕');
    expect(planDisplayIcon({ category: 'dessert' })).toBe('🍰');
    expect(planDisplayIcon({})).toBeTruthy();
  });
});
