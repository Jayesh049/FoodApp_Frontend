import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('foodAppCart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (error) {
                console.error('Error loading cart from localStorage:', error);
            }
        }
    }, []);

    // Save cart to localStorage whenever cart changes
    useEffect(() => {
        localStorage.setItem('foodAppCart', JSON.stringify(cart));
    }, [cart]);

    // Add item to cart
    const addToCart = (item) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(cartItem => cartItem._id === item._id);
            let newCart;
            
            if (existingItem) {
                // If item already exists, increase quantity
                newCart = prevCart.map(cartItem =>
                    cartItem._id === item._id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            } else {
                // If item doesn't exist, add it with quantity 1
                newCart = [...prevCart, { ...item, quantity: 1 }];
            }
            
            // Also store in localStorage for Booking1 page
            localStorage.setItem('cartData', JSON.stringify(newCart));
            const totalPrice = newCart.reduce((total, cartItem) => total + (cartItem.price * cartItem.quantity), 0);
            localStorage.setItem('totalPrice', totalPrice.toString());
            
            return newCart;
        });
    };

    // Remove item from cart
    const removeFromCart = (itemId) => {
        setCart(prevCart => {
            const newCart = prevCart.filter(item => item._id !== itemId);
            
            // Also update localStorage for Booking1 page
            localStorage.setItem('cartData', JSON.stringify(newCart));
            const totalPrice = newCart.reduce((total, cartItem) => total + (cartItem.price * cartItem.quantity), 0);
            localStorage.setItem('totalPrice', totalPrice.toString());
            
            return newCart;
        });
    };

    // Update item quantity
    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(itemId);
            return;
        }

        setCart(prevCart => {
            const newCart = prevCart.map(item =>
                item._id === itemId
                    ? { ...item, quantity: newQuantity }
                    : item
            );
            
            // Also update localStorage for Booking1 page
            localStorage.setItem('cartData', JSON.stringify(newCart));
            const totalPrice = newCart.reduce((total, cartItem) => total + (cartItem.price * cartItem.quantity), 0);
            localStorage.setItem('totalPrice', totalPrice.toString());
            
            return newCart;
        });
    };

    // Clear entire cart
    const clearCart = () => {
        setCart([]);
        // Also clear localStorage for Booking1 page
        localStorage.removeItem('cartData');
        localStorage.removeItem('totalPrice');
    };

    // Calculate total items in cart
    const getTotalItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    // Calculate total price
    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    // Calculate total with discount
    const getTotalWithDiscount = () => {
        return cart.reduce((total, item) => {
            const itemPrice = item.price * item.quantity;
            const discount = item.discount || 0;
            const discountedPrice = itemPrice - (itemPrice * discount / 100);
            return total + discountedPrice;
        }, 0);
    };

    // Calculate total savings
    const getTotalSavings = () => {
        return getTotalPrice() - getTotalWithDiscount();
    };

    // Toggle cart visibility
    const toggleCart = () => {
        setIsCartOpen(prev => !prev);
    };

    // Close cart
    const closeCart = () => {
        setIsCartOpen(false);
    };

    // Open cart
    const openCart = () => {
        setIsCartOpen(true);
    };

    const value = {
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
        openCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
