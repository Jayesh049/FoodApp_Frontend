import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { CartItem } from "../../types/models";

type CartContextValue = {
  cart: CartItem[];
  isCartOpen: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getTotalWithDiscount: () => number;
  getTotalSavings: () => number;
  toggleCart: () => void;
  closeCart: () => void;
  openCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

function lineTotal(item: CartItem): number {
  return (Number(item.price) || 0) * (Number(item.quantity) || 0);
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("foodAppCart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        /* ignore bad cart json */
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("foodAppCart", JSON.stringify(cart));
  }, [cart]);

  const persistBookingMirror = (newCart: CartItem[]) => {
    localStorage.setItem("cartData", JSON.stringify(newCart));
    const totalPrice = newCart.reduce((total, cartItem) => total + lineTotal(cartItem), 0);
    localStorage.setItem("totalPrice", totalPrice.toString());
  };

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem._id === item._id);
      let newCart: CartItem[];

      if (existingItem) {
        newCart = prevCart.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        newCart = [...prevCart, { ...item, quantity: 1 }];
      }

      persistBookingMirror(newCart);
      return newCart;
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item._id !== itemId);
      persistBookingMirror(newCart);
      return newCart;
    });
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart((prevCart) => {
      const newCart = prevCart.map((item) =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      );
      persistBookingMirror(newCart);
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cartData");
    localStorage.removeItem("totalPrice");
  };

  const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0);

  const getTotalPrice = () => cart.reduce((total, item) => total + lineTotal(item), 0);

  const getTotalWithDiscount = () =>
    cart.reduce((total, item) => {
      const itemPrice = lineTotal(item);
      const discount = item.discount || 0;
      const discountedPrice = itemPrice - (itemPrice * discount) / 100;
      return total + discountedPrice;
    }, 0);

  const getTotalSavings = () => getTotalPrice() - getTotalWithDiscount();

  const toggleCart = () => setIsCartOpen((prev) => !prev);
  const closeCart = () => setIsCartOpen(false);
  const openCart = () => setIsCartOpen(true);

  const value: CartContextValue = {
    cart,
    isCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getTotalWithDiscount,
    getTotalSavings,
    toggleCart,
    closeCart,
    openCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
