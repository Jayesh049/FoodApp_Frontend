import React from 'react';
import { useCart } from './CartProvider';
import { BsX, BsPlus, BsDash, BsTrash } from 'react-icons/bs';
import { useHistory } from 'react-router-dom';
import { mediaUrl } from '../../utils/apiBase';
import { displayPlanName, planImagePlaceholder } from '../../utils/planDisplay';
import '../Styles/cart.css';

function CartSidebar() {
    const {
        cart,
        isCartOpen,
        closeCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getTotalItems,
        getTotalPrice,
        getTotalWithDiscount,
        getTotalSavings
    } = useCart();

    const history = useHistory();

    const handleCheckout = () => {
        if (cart.length === 0) {
            alert('Your cart is empty! Add some items first.');
            return;
        }
        
        // Store cart data for booking page
        localStorage.setItem('cartData', JSON.stringify(cart));
        localStorage.setItem('totalPrice', getTotalWithDiscount().toString());
        
        // Close cart and navigate to booking
        closeCart();
        history.push('/booking1');
    };

    if (!isCartOpen) return null;

    return (
        <div className="cart-sidebar-overlay" onClick={closeCart}>
            <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="cart-header">
                    <h3 className="cart-title">Your Cart</h3>
                    <button className="cart-close" onClick={closeCart}>
                        <BsX />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="cart-content">
                    {cart.length === 0 ? (
                        <div className="cart-empty" data-testid="cart-empty">
                            <div className="cart-empty-icon" aria-hidden="true">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
                                    <path d="M6 6h15l-1.5 9h-12z" />
                                    <circle cx="9" cy="20" r="1" />
                                    <circle cx="18" cy="20" r="1" />
                                    <path d="M6 6L5 3H2" />
                                </svg>
                            </div>
                            <p className="cart-empty-text">Your cart is empty</p>
                            <p className="cart-empty-subtext">Add a meal plan to get started</p>
                        </div>
                    ) : (
                        <div className="cart-items">
                            {cart.map((item) => (
                                <div className="cart-item" key={item._id}>
                                    <div className="cart-item-image">
                                        <img 
                                            src={mediaUrl(item.image)} 
                                            alt={displayPlanName(item)}
                                            onError={(e) => {
                                              e.currentTarget.onerror = null;
                                              e.currentTarget.src = planImagePlaceholder(item);
                                            }}
                                        />
                                    </div>
                                    
                                    <div className="cart-item-details">
                                        <h4 className="cart-item-name">{displayPlanName(item)}</h4>
                                        <p className="cart-item-price">₹{item.price}</p>
                                        {item.discount > 0 && (
                                            <p className="cart-item-discount">
                                                {item.discount}% OFF
                                            </p>
                                        )}
                                    </div>

                                    <div className="cart-item-controls">
                                        <div className="quantity-controls">
                                            <button 
                                                className="quantity-btn"
                                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                            >
                                                <BsDash />
                                            </button>
                                            <span className="quantity">{item.quantity}</span>
                                            <button 
                                                className="quantity-btn"
                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                            >
                                                <BsPlus />
                                            </button>
                                        </div>
                                        
                                        <button 
                                            className="remove-btn"
                                            onClick={() => removeFromCart(item._id)}
                                        >
                                            <BsTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-summary">
                            <div className="summary-row">
                                <span>Items ({getTotalItems()})</span>
                                <span>₹{getTotalPrice()}</span>
                            </div>
                            
                            {getTotalSavings() > 0 && (
                                <div className="summary-row discount">
                                    <span>Discount</span>
                                    <span>-₹{getTotalSavings().toFixed(2)}</span>
                                </div>
                            )}
                            
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>₹{getTotalWithDiscount().toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="cart-actions">
                            <button className="clear-cart-btn" onClick={clearCart}>
                                Clear Cart
                            </button>
                            <button className="checkout-btn" onClick={handleCheckout}>
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CartSidebar;
