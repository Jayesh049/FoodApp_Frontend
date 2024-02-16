import  axios  from 'axios';
import React, { useEffect, useState } from 'react';
import '../Styles/planDetail.css'
import '../Styles/contact.css'
import '../Styles/loading.css'
import { useHistory } from 'react-router-dom';
import moment from 'moment';



const BDS = moment().format('YYYY-MM-DD HH:mm:ss')

function Booking () {
 
 
    const[loading , setLoading] = useState(false);
    const [booking ,setbooking] = useState({}) 
    const history = useHistory();

  
  
    useEffect(() => {
        async function loadingTimer(){
            setLoading(true);
            setTimeout(() => {
          setLoading(false);
        }, 2000);
        }
        async function getBookingData(){
            const timer = setTimeout(async() => {
                const bookings = await axios.get("https://foodappbackend-lk5m.onrender.com/api/v1/booking/");
                delete bookings.data.slice(-1)[0]["_id"];
                delete bookings.data.slice(-1)[0]["__v"];
                delete bookings.data.slice(-1)[0]["status"];
                setbooking(bookings.data.slice(-1)[0]);
        
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
            const res = await loadScript(
                "https://checkout.razorpay.com/v1/checkout.js"
            );
    
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
                "status":"pending"
            })

            
    
            if (!result) {
                alert("Server error. Are you online?");
                return;
            }
            const { data: { key } } = await axios.get("https://foodappbackend-lk5m.onrender.com/api/getkey")
        
    

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

                    if(result.data.msg === 'success'){
                        history.push('/paymentsuccess');            
                    }else if(result.data.msg === 'failure'){
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
        
        

   
    return (<>
        {loading  ? (
           <div className="spinner-container">
           <div className="loading-spinner">
           </div>
           </div>
      ) :(
        <div className="reviewImg">
            <div className="reviewCard">
                <div className='h1Box'>
                    <h1 className='h1'>BOOK NOW</h1>
                    <div className="line"></div>
                </div>
                <div className="planDetailBox1">
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
                        <div className='GoToBooking'>
                    
                </div>
                
                </div>

                
                <button className="btn"  onClick={displayRazorpay}>
                        PayNow        
                    </button>
            </div>
          
                
                    </div>
                    
                
            </div>
      )
        }
    </>
)}
        
export default Booking