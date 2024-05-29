import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../Styles/planDetail.css';
import '../Styles/contact.css';
import '../Styles/loading.css';
import '../Styles/Booking.module.css'
import { useHistory } from 'react-router-dom';
import moment from 'moment';

const BDS = moment().format('YYYY-MM-DD HH:mm:ss');

function Booking() {
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState();
    const [booking, setBooking] = useState({});
    const [price, setPrice] = useState();
    const [bookedAt, setBookedAt] = useState();
    const history = useHistory();

    useEffect(() => {
        async function loadingTimer() {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        }

        async function getBookingData() {
            const timer = setTimeout(async () => {
                const bookings = await axios.get("https://foodappbackend-lk5m.onrender.com/api/v1/booking/");
                const bookingData = bookings.data.slice(-1)[0];
                delete bookingData["_id"];
                delete bookingData["__v"];
                delete bookingData["status"];
                setBooking(bookingData);
                setImage(bookingData.planDetails.image);
                setPrice(bookingData.planDetails.price);
                setBookedAt(bookingData.bookedAt);
            }, 1000);
            return () => clearTimeout(timer);
        }

        loadingTimer();
        getBookingData();
    }, []);

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

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
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }

        const bookings = await axios.get("https://foodappbackend-lk5m.onrender.com/api/v1/booking/");

        const result = await axios.post("https://foodappbackend-lk5m.onrender.com/api/v1/booking/", {
            "bookedAt": BDS,
            "priceAtThatTime": bookings.data.slice(-1)[0].priceAtThatTime,
            "user": bookings.data.slice(-1)[0].user,
            "plan": bookings.data.slice(-1)[0].plan,
            "status": "pending"
        });

        if (!result) {
            alert("Server error. Are you online?");
            return;
        }
        
        const { data: { key } } = await axios.get("https://foodappbackend-lk5m.onrender.com/api/getkey");

        const { amount, id: order_id, currency } = result.data;

        const options = {
            key: key,
            amount: amount.toString(),
            currency: currency,
            name: "Jayesh Kumar",
            description: "Test Transaction",
            image: "",
            order_id: order_id,
            handler: async function (response) {
                const data = {
                    orderCreationId: order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpaySignature: response.razorpay_signature,
                };

                const result = await axios.post("https://foodappbackend-lk5m.onrender.com/api/v1/booking/verification", data);

                alert(result.data.msg);

                if (result.data.msg === 'success') {
                    history.push('/paymentsuccess');
                } else if (result.data.msg === 'failure') {
                    history.push('/paymentFailure');
                }
            },
            theme: {
                color: "#61dafb",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    }

    return (
        <>
            {loading ? (
                <div className="spinner-container">
                    <div className="loading-spinner"></div>
                </div>
            ) : (
                <div className="reviewImg">
                    <div className="reviewCard">
                        <div className='h1Box'>
                            <h1 className='h1'>BOOK NOW</h1>
                            <div className="line"></div>
                        </div>
                        <div className="planDetailBox1">
                            <div className='planDetail'>
                                <div className="loginBox">
                                    <div className='entryBox'>
                                        <div className="entryText"></div>
                                        <div className="imageBox"><img src={`https://foodappbackend-lk5m.onrender.com/${image}`} alt="Plan" /></div>
                                    </div>
                                    <div className='entryBox'>
                                        <div className="entryText">Price</div>
                                        <div className="input">{price}</div>
                                    </div>
                                    <div className='entryBox'>
                                        <div className="entryText">Booked At</div>
                                        <div className="input">{capitalizeFirstLetter(moment(bookedAt).format('YYYY-MM-DD HH:mm:ss'))}</div>
                                    </div>
                                </div>
                                
                            </div>
                            <div className="buttonContainer">
                                    <button className="btn" onClick={displayRazorpay}>
                                        Pay Now
                                    </button>
                                </div>
                        </div>
                       
                    </div>
                </div>
            )}
        </>
    )
}

export default Booking;
