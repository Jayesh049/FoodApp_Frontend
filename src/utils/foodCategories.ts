import type { FoodCategoryMeta, Plan } from "../types/models";

export const FOOD_CATEGORIES: FoodCategoryMeta[] = [
  { id: "north_indian", label: "North Indian", icon: "🍛", color: "#E8B86D" },
  { id: "south_indian", label: "South Indian", icon: "🥘", color: "#7CB342" },
  { id: "chinese", label: "Chinese", icon: "🥡", color: "#EF5350" },
  { id: "dessert", label: "Desserts", icon: "🍰", color: "#F48FB1" },
  { id: "beverages", label: "Beverages", icon: "🥤", color: "#4FC3F7" },
];

export const CATEGORY_BY_ID: Record<string, FoodCategoryMeta> = Object.fromEntries(
  FOOD_CATEGORIES.map((c) => [c.id, c])
);

export function getCategoryMeta(categoryId?: string | null): FoodCategoryMeta {
  return (
    (categoryId && CATEGORY_BY_ID[categoryId]) || {
      id: "north_indian",
      label: "Food",
      icon: "🍽️",
      color: "#DCCA87",
    }
  );
}

export function planDisplayIcon(plan?: Pick<Plan, "icon" | "category"> | null): string {
  if (plan?.icon) return plan.icon;
  return getCategoryMeta(plan?.category).icon;
}
