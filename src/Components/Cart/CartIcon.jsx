import React from 'react';
import { useCart } from './CartProvider';
import { BsCart3 } from 'react-icons/bs';
import '../Styles/cart.css';

function CartIcon() {
    const { getTotalItems, toggleCart } = useCart();
    const totalItems = getTotalItems();

    return (
        <button className="cart-icon" onClick={toggleCart}>
            <BsCart3 className="cart-icon-svg" />
            {totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
            )}
        </button>
    );
}

export default CartIcon;
