import React, { useEffect, useState } from 'react';
import '../Styles/booking1.css';
import { useHistory } from 'react-router-dom';
import { useCart } from '../Cart/CartProvider';
import { useAuth } from '../Context/AuthProvider';
import { BsArrowLeft } from 'react-icons/bs';
import moment from 'moment';
import axios from 'axios';
import { API_ORIGIN, API_V1, mediaUrl } from '../../utils/apiBase';
import { getAuthHeaders } from '../../utils/apiAuth';
import { displayPlanName, planImagePlaceholder } from '../../utils/planDisplay';

function Booking() {
    const [loading, setLoading] = useState(false);
    const { cart, getTotalWithDiscount, clearCart } = useCart();
    const { user } = useAuth();
    const history = useHistory();
    const plansScrollRef = React.useRef(null);

    useEffect(() => {
        // Get cart data from localStorage
        const storedCartData = localStorage.getItem('cartData');
        
        if (storedCartData) {
            const parsedData = JSON.parse(storedCartData);
            
            if (parsedData.length === 0) {
                alert("No items in cart. Please add some items first.");
                history.push('/allPlans');
                return;
            }
        } else {
            alert("No items in cart. Please add some items first.");
            history.push('/allPlans');
            return;
        }

        async function loadingTimer() {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        }

        loadingTimer();
    }, [history]);

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const scrollPlans = (direction) => {
        const container = plansScrollRef.current;
        if (container) {
            const scrollAmount = 320; // Width of one card + gap
            if (direction === 'left') {
                container.scrollLeft -= scrollAmount;
            } else {
                container.scrollLeft += scrollAmount;
            }
        }
    };

    const bookedAt = moment().format('YYYY-MM-DD HH:mm:ss');
    const orderTotal = getTotalWithDiscount();

    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }

    async function displayRazorpay() {
        console.log("Starting payment process...");
        console.log("Cart items:", cart);
        console.log("User:", user);
        
        // Check if user is logged in
        if (!user) {
            alert("Please login to continue with payment.");
            history.push('/login');
            return;
        }

        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }

        try {
            if (cart.length === 0) {
                alert("No items in cart. Please add some items first.");
                return;
            }

            const totalPrice = getTotalWithDiscount();
            
            // ✅ FIXED: Send cartItems array and use correct port
            const paymentData = {
            "bookedAt": bookedAt,
                "price": totalPrice,
                "priceAtThatTime": totalPrice,
                "cartItems": cart,
            "status": "pending"
            };
            
            console.log("Sending payment data:", paymentData);
            
            const result = await axios.post(`${API_V1}/booking/`, paymentData, {
                headers: getAuthHeaders(),
            });

        if (!result) {
            alert("Server error. Are you online?");
            return;
        }
        
            console.log("Booking created successfully:", result.data);

            const createdBookings = result.data.bookings || [];
            const bookingIds = createdBookings.map((b) => b._id);
            const cartSnapshot = [...cart];
            
            // ✅ FIXED: Use correct port 3000
            const { data: { key } } = await axios.get(`${API_ORIGIN}/api/getkey`);

        const { amount, id: order_id, currency } = result.data;

        const options = {
            key: key,
            amount: amount.toString(),
            currency: currency,
                name: "FoodApp",
                description: "Food Order Payment",
            image: "",
            order_id: order_id,
            handler: async function (response) {
                    console.log("Payment response:", response);
                    
                const data = {
                    orderCreationId: order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpaySignature: response.razorpay_signature,
                    bookingIds,
                };

                    console.log("Verification data:", data);

                    try {
                        // ✅ FIXED: Use correct port 3000
                        const verifyResult = await axios.post(
                          `${API_V1}/booking/verification`,
                          data,
                          { headers: getAuthHeaders() }
                        );
                        console.log("Verification result:", verifyResult.data);

                alert(verifyResult.data.msg);

                if (verifyResult.data.msg === 'success') {
                            clearCart();
                            history.push('/review', {
                              plans: cartSnapshot,
                              bookingIds,
                            });
                } else if (verifyResult.data.msg === 'failure') {
                    history.push('/paymentFailure');
                        }
                    } catch (error) {
                        console.error("Payment verification error:", error);
                        alert("Payment verification failed. Please contact support.");
                }
            },
            theme: {
                color: "#DCCA87",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        } catch (error) {
            console.error('Error in payment process:', error);
            alert("Error processing payment. Please try again.");
        }
    }

    return (
        <>
            {loading ? (
                <div className="spinner-container">
                    <div className="loading-spinner"></div>
                </div>
            ) : (
                <div className="booking-page">
                    <div className="booking-container">
                        {/* Header Section */}
                        <div className="booking-header">
                            <div className="header-controls">
                                <button 
                                    className="back-button custom__button" 
                                    onClick={() => {
                                        if (history.length > 1) {
                                            history.goBack();
                                        } else {
                                            history.push('/allPlans');
                                        }
                                    }}
                                    title="Go back to previous page"
                                >
                                    <BsArrowLeft className="back-icon" />
                                    Back
                                </button>
                            </div>
                            <h1 className="booking-title">Complete Your Booking</h1>
                            <p className="booking-subtitle">Review your plan details and proceed to payment</p>
                        </div>

                        {/* Main Content */}
                        <div className="booking-content">
                        {/* Plan Details Section */}
                        <div className="plan-details-section">
                            <div className="plans-header">
                                <h2 className="plans-title">Your Selected Plans ({cart.length})</h2>
                                {cart.length > 3 && (
                                    <div className="scroll-controls">
                                        <button 
                                            className="scroll-btn scroll-left" 
                                            onClick={() => scrollPlans('left')}
                                        >
                                            ‹
                                        </button>
                                        <button 
                                            className="scroll-btn scroll-right" 
                                            onClick={() => scrollPlans('right')}
                                        >
                                            ›
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            <div className="plans-container" ref={plansScrollRef}>
                                <div className="plans-grid">
                                    {cart.map((item, index) => (
                                        <div className="plan-card" key={item._id}>
                                            <div className="plan-image-container">
                                                <img 
                                                    src={mediaUrl(item.image)} 
                                                    alt={displayPlanName(item)} 
                                                    className="plan-image"
                                                    onError={(e) => {
                                                      e.currentTarget.onerror = null;
                                                      e.currentTarget.src = planImagePlaceholder(item);
                                                    }}
                                                />
                                                <div className="plan-rating">
                                                    <span className="rating-star">★</span>
                                                    <span className="rating-value">{item.ratingsAverage || 4.5}</span>
                                                </div>
                                                <div className="plan-badge">Plan {index + 1}</div>
                                                <div className="quantity-badge">Qty: {item.quantity}</div>
                                            </div>
                                            
                                            <div className="plan-info">
                                                <h3 className="plan-name">{displayPlanName(item)}</h3>
                                                <p className="plan-price">₹{item.price}</p>
                                                
                                                <div className="plan-details">
                                                    <div className="detail-row">
                                                        <span className="detail-label">Duration:</span>
                                                        <span className="detail-value">{item.duration || 30} days</span>
                                                    </div>
                                                    <div className="detail-row">
                                                        <span className="detail-label">Discount:</span>
                                                        <span className="detail-value discount">{item.discount || 0}% OFF</span>
                                                    </div>
                                                    <div className="detail-row">
                                                        <span className="detail-label">Item Total:</span>
                                                        <span className="detail-value total">₹{(item.price * item.quantity).toFixed(2)}</span>
                                                    </div>
                                                </div>
                        </div>
                                    </div>
                                    ))}
                                    </div>
                                    </div>
                                </div>
                                
                            {/* Booking Summary Section */}
                            <div className="booking-summary-section">
                                <div className="summary-card">
                                    <h3 className="summary-title">Booking Summary</h3>
                                    
                                    <div className="summary-details">
                                        {/* Show all cart items */}
                                        {cart.map((item, index) => (
                                            <div className="summary-item" key={item._id}>
                                                <span className="summary-label">{displayPlanName(item)} (Qty: {item.quantity})</span>
                                                <span className="summary-value">₹{(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                        
                                        <div className="summary-item">
                                            <span className="summary-label">Booking Date</span>
                                            <span className="summary-value">
                                                {capitalizeFirstLetter(moment(bookedAt).format('MMMM DD, YYYY'))}
                                            </span>
                                        </div>
                                        
                                        <div className="summary-item">
                                            <span className="summary-label">Booking Time</span>
                                            <span className="summary-value">
                                                {moment(bookedAt).format('HH:mm:ss')}
                                            </span>
                        </div>
                                        
                                        <div className="summary-item">
                                            <span className="summary-label">Total Items</span>
                                            <span className="summary-value">{cart.reduce((total, item) => total + item.quantity, 0)}</span>
                                    </div>
                                        
                                        <div className="summary-item total">
                                            <span className="summary-label">Total Amount</span>
                                            <span className="summary-value total-amount">₹{orderTotal}</span>
                                    </div>
                                    </div>
                                </div>
                                
                                {/* Payment Section */}
                                <div className="payment-section">
                                    <div className="payment-methods">
                                        <h4 className="payment-title">Payment Method</h4>
                                        <div className="payment-option selected">
                                            <div className="payment-icon">💳</div>
                                            <div className="payment-info">
                                                <span className="payment-name">Razorpay</span>
                                                <span className="payment-desc">Secure payment gateway</span>
                                            </div>
                                            <div className="payment-check">✓</div>
                                        </div>
                            </div>
                                    
                                    <button className="pay-now-btn custom__button" onClick={displayRazorpay}>
                                        <span className="btn-text">Pay ₹{orderTotal}</span>
                                        <span className="btn-icon">→</span>
                                    </button>
                                </div>
                        </div>
                        </div>
                    </div>
                </div>
            )}
            
        </>
    )
}

export default Booking;
