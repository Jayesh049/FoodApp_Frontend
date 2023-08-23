// import  axios  from 'axios';
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router';
// import '../Styles/planDetail.css'
// import '../Styles/contact.css'
// import  { useAuth } from '../Context/AuthProvider';
// import { Link } from "react-router-dom";
// import moment from 'moment'

// // first get the data and then set the data and then post the data this is how we will do this

// const BDS = moment().format('YYYY-MM-DD HH:mm:ss')
// // const endDateStr = moment().format('YYYY-MM-DD HH:mm:ss') 
// function BookingDetail() {

//   const [booking ,setbooking] = useState({}) 
//   const {id } = useParams();
//   const [arr, setarr] = useState();
//   const [review, setreview] = useState("");
//   const [price, setprice] = useState();
//   const user = useAuth();
  
//   useEffect(async () => {
        
//     const data = await axios.get(`http://localhost:3000/api/v1/booking/${id}`)
//     console.log("bookingDetail" ,data);
//     delete data.data.booking["_id"] ;
//   console.log("bookingDetail" ,data.data );
//     delete data.data["__v"]  ;
//     setbooking(data.data.booking)
//     console.log(data.data.booking);


//     const bookings = await axios.get("http://localhost:3000/api/v1/booking/" +id);
//     console.log("I am getting data from the booking from backend" ,bookings);
//     setarr(bookings)

// }, [])

// // console.log(rate);
// const handleClick = async () => {
//     // editing this post scenario
//     console.log("this is user from  authcontext" ,user.user._id);
//     console.log(123645);
//     // console.log(rate);

//                 let data = await axios.post("http://localhost:3000/api/v1/booking/", {
//                     "bookedAt": BDS,
//                     "description": review,
//                     "priceAtThatTime": price,
//                     "user": user.user._id,
//                     "plan": id,
//                     // "description":review
// })
// alert("this is " ,data);
// console.log("data is here" , data)

//     const bookings = await axios.get("http://localhost:3000/api/v1/booking/" );
//     console.log(bookings);
//     setarr(bookings.data);
// }



//   return (
//     <div>booking</div>
//   )
// }

// export default  BookingDetail
