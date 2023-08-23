import  axios  from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import '../Styles/planDetail.css'
import '../Styles/contact.css'
import  { useAuth } from '../Context/AuthProvider';
import  { usePlan } from '../PlanDetail Page/PlanDetail';
import { Link } from "react-router-dom";
import moment from 'moment';



const BDS = moment().format('YYYY-MM-DD HH:mm:ss')

function Booking () {

    const [booking ,setbooking] = useState({}) 
    // const {id}  = useParams();
    const [arr, setarr] = useState();
    // const [review, setreview] = useState("");
    const [price, setprice] = useState();
    // const user = useAuth();
    const plan = usePlan();
    const user = usePlan();
    
    const id = usePlan();
    // const arr = useParams();
    const review = usePlan();
    const rate = usePlan();
    const setplan= usePlan()
    
    
  
   
const handleClick = async () => {
    console.log("the booking user is" , id);
    console.log("the booking plan is" , setplan);
const data = await axios.post("http://localhost:3000/api/v1/booking/", {
    "bookedAt": BDS,
    "description": review,
    "priceAtThatTime": price,
    "user": user.user._id,
    "plan": id,
    // "description":review
})

console.log( "postorder" ,data);
alert("data");
const bookings = await axios.get(`http://localhost:3000/api/v1/booking/${id}`);
console.log(bookings);
setarr(bookings.data);

}
    return (
        <div className="reviewImg">
            <div className="reviewCard">
                <div className='h1Box'>
                    <h1 className='h1'>BOOKINGS</h1>
                    <div className="line"></div>
                </div>
                <div className='GoToBooking'>
                <button className="btn" onClick={handleClick}>
                        Submit
                    </button>
                    {/* <li><Link to="/booking">
                        <button className='btn'>Pay Now</button> 
                        </Link></li>
                                 */}
                            </div>
                    </div>
                    
                
            </div>
        
        
    )
}
export default Booking