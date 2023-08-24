import  axios  from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import '../Styles/planDetail.css'
import '../Styles/contact.css'
import { AuthContext } from '../Context/AuthProvider';

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
    const [price, setprice] = useState();
    const [ iata , setIata] = useState();

// so the step is i will demand the data from plandetail page and then i will send that data for bookinginitiate
// when booking is initiate then payment part should be forwarded
    // const user =  useContext(AuthContext);
    // const user = useContext(AuthContext);
    // const plan = useContext(PlanContext);
    // const setplan = useContext(PlanContext);
    // const id = useContext(PlanContext);
    // const review = useContext(PlanContext);
    // const rate = useContext(PlanContext);



 
    useEffect(async () => {
        const bookings = await axios.get("http://localhost:3000/api/v1/booking/");
        console.log(bookings.data.slice(-1)[0]);
        setarr(bookings.data.slice(-1)[0]);
    }, [])

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
   
const handleClick1 = async () => {

 
const bookings = await axios.get(`http://localhost:3000/api/v1/booking/${id}`);
console.log(bookings.length);
setarr(bookings.data);

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
                <button className="btn">
                        PayNow        
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