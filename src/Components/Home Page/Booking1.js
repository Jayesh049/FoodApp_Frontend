import  axios  from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import '../Styles/planDetail.css'
import '../Styles/contact.css'
import { AuthContext } from '../Context/AuthProvider';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import Razorpay from 'razorpay';

import  AuthProvider, { useAuth } from '../Context/AuthProvider';
import  { usePlan } from '../PlanDetail Page/PlanDetail';
import { Link } from "react-router-dom";
import moment from 'moment';


import { PlanContext } from '../PlanDetail Page/PlanDetail';

const BDS = moment().format('YYYY-MM-DD HH:mm:ss')

function Booking () {
    const [plan, setplan] = useState({})
    const { id } = useParams();
    
    const [booking ,setbooking] = useState({}) 
    const [arr, setarr] = useState();
    const [review, setreview] = useState("");
    const [rate, setrate] = useState();
    const user = useAuth();
    const prevLocation = useLocation();
    const [ iata , setIata] = useState();
    const history = useHistory();
// so the step is i will demand the data from plandetail page and then i will send that data for bookinginitiate

// when booking is initiate then payment part should be forwarded

    useEffect(async() => {
        const timer = setTimeout(async() => {
        console.log('This will run after 5 second!')
        const bookings = await axios.get("http://localhost:3000/api/v1/booking/");
        delete bookings.data.slice(-1)[0]["_id"];
        // delete bookings.data.slice(-1)[0]["user"];
        delete bookings.data.slice(-1)[0]["__v"];
        // delete bookings.data.slice(-1)[0]["plan"];
        console.log(bookings.data.slice(-1)[0]);
        console.log(bookings.data.slice(-1)[0].plan);
        console.log(bookings.data.slice(-1)[0].user);
        console.log(bookings.data.slice(-1)[0].priceAtThatTime);
        setbooking(bookings.data.slice(-1)[0]);

        
        // const plans = await axios.get(`http://localhost:3000/api/v1/plan/${plan}` );
        //     console.log(plans);
            // console.log(plans.data.plan._id);
            // console.log(plans.data);
        
        }, 1000);
        return () => clearTimeout(timer);
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
            const res = await loadScript(
                "https://checkout.razorpay.com/v1/checkout.js"
            );
    
            if (!res) {
                alert("Razorpay SDK failed to load. Are you online?");
                return;
            }
    
            const bookings = await axios.get("http://localhost:3000/api/v1/booking/");
    
            // creating a new order
            const result = await axios.post("http://localhost:3000/api/v1/booking/", {
                "bookedAt": BDS,
                "priceAtThatTime": bookings.data.slice(-1)[0].priceAtThatTime,
                "user": bookings.data.slice(-1)[0].user,
                "plan": bookings.data.slice(-1)[0].plan,
                "status":"pending"
            })
    
            if (!result) {
                alert("Server error. Are you online?");
                return;
            }
            const { data: { key } } = await axios.get("http://www.localhost:3000/api/getkey")
        //         console.log(key)
    
            // Getting the order details back
            const { amount, id: order_id, currency } = result.data;
    
            const options = {
                key: key, // Enter the Key ID generated from the Dashboard
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
                    console.log(data)
                    const result = await axios.post("http://localhost:3000/api/v1/booking/verification", data);
    
                    alert(result.data.msg);
                },
                
                theme: {
                    color: "#61dafb",
                },
            };
        
            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        
            history.push('/paymentsuccess');   
        }
        
        
        const routeChange = () =>{  
            
          }


   
    return (
        <div className="reviewImg">
            <div className="reviewCard">
                <div className='h1Box'>
                    <h1 className='h1'>BOOK NOW</h1>
                    <div className="line"></div>
                </div>
                <div className="planDetailBox">
                <div className='planDetail'>
                    <div className="loginBox">
                        {
                            Object.keys(booking).map((ele, key) => (
                                <div className='entryBox' key={key}>
                                    <div className="entryText">{capitalizeFirstLetter(ele)}</div>
                                   
                                    <div className=" input">{capitalizeFirstLetter(booking[ele]?.toString())}</div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
          
                <div className='GoToBooking'>
                <button className="btn"  onClick={displayRazorpay}>
                        PayNow        
                    </button>
                    <li onClick={routeChange} /></div>
                    </div>
                    
                
            </div>
        
        
    )
}
export default Booking