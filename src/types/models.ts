export type FoodCategoryId =
  | "north_indian"
  | "south_indian"
  | "chinese"
  | "dessert"
  | "beverages"
  | string;

export interface FoodCategoryMeta {
  id: FoodCategoryId;
  label: string;
  icon: string;
  color: string;
}

export interface Plan {
  _id: string;
  name: string;
  description?: string;
  price: number;
  discount?: number;
  duration?: number;
  category?: FoodCategoryId;
  icon?: string;
  image?: string;
  images?: string[];
  video?: string;
  averageRating?: number;
  reviews?: string[] | Review[];
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role?: "user" | "admin" | string;
  pic?: string;
  phonenumber?: string;
  address?: string;
  bookings?: string[];
}

export interface Review {
  _id?: string;
  rating: number;
  description?: string;
  review?: string;
  createdAt?: string;
  user?: User | string;
  plan?: Plan | string;
}

export interface CartItem {
  _id: string;
  name?: string;
  price?: number;
  discount?: number;
  quantity: number;
  image?: string;
  images?: string[];
  category?: FoodCategoryId;
  plan?: string;
}

export interface PlanPricing {
  listPrice: number;
  salePrice: number;
  hasDeal: boolean;
  savings: number;
  percentOff: number;
}
