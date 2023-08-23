import  axios  from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import '../Styles/planDetail.css'
import '../Styles/contact.css'
import  { useAuth } from '../Context/AuthProvider';
import { Link } from "react-router-dom";
import moment from 'moment'

// first get the data and then set the data and then post the data this is how we will do this

const BDS = moment().format('YYYY-MM-DD HH:mm:ss')
// const endDateStr = moment().format('YYYY-MM-DD HH:mm:ss') 
function BookingDetail() {

  const [booking ,setbooking] = useState({}) 
  const {id } = useParams();
  const [arr, setarr] = useState();
  const [review, setreview] = useState("");
  const [price, setprice] = useState();
  const user = useAuth();
  const status = useAuth();
  

  useEffect(async () => {
        
    const data = await axios.get(`http://localhost:3000/api/v1/booking/${id}`)
    console.log("bookingDetail" ,data.data.booking);
    delete data.data.booking["_id"] ;
    delete data.data.booking["__v"]  ;
    console.log('this is status' ,data.data.booking.status);
    setbooking(data.data.booking)
    


    const bookings = await axios.get("http://localhost:3000/api/v1/booking/"+ id);
    setarr(bookings.data.booking)
    console.log("I am getting data from the booking from backend" ,bookings.data.booking._id);

}, [])




const handleClick = async () => {
    console.log("the booking user is" , user.user._id);
    console.log("the booking plan is" , id);
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
                    <div className="planDetailBox">
                    <div className='planDetail'>
                    <div className="loginBox">
                        {
                            Object.keys(booking).map((ele, key) => (
                                <div className='entryBox' key={key}>
                                    <div className="entryText">{(ele)}</div>
                                   
                                    <div className=" input">{(booking[ele]?.toString())}</div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            
            <div className='reviewBox'>
                <div className="reviewEnrty">
                    {/* <input type="text" value={price} onChange={(e) => setprice(e.target.value)} />
                    <select name="" id="" className="select" onChange={(e) =>  setprice(e.target.value ) }>
                        <option value="1">1 </option>
                        <option value="2">2 </option>
                        <option value="3">3 </option>
                        <option value="4">4 </option>
                        <option value="5">5 </option>
                    </select> */}
                    {/* <select price */}
                    <button className="btn" onClick={handleClick}>
                        Submit
                    </button>
                </div>
                {/* {
                    arr && arr?.map((ele, key) => (
                        <div className="reviewsCard" key={key}>
                            <div className="pdreviews">
                                <div className="pdrdetail">
                                    <h3>{ele.user.name}</h3>
                                    <div className="input"> {ele.price}</div>
                                </div>
                                <div className='rate'>
                                    {
                                        <label htmlFor="star5" title="text">{ele.status}</label>

                                    } */}
                                {/* </div> */}
                            </div>

                            {/* <div className='rcBtn'>
                                <button className="showMoreBtn btn" onClick={handleDelete}>Delete</button>
                            </div> */}
                        {/* </div> */}
                    {/* )) */}
                {/* } */}

            {/* </div> */}
                    
                </div>
            </div>
        )
    }
  
export default  BookingDetail
