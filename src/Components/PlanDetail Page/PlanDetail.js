import  axios  from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router';
import '../Styles/planDetail.css'
import '../Styles/contact.css'
import  { useAuth } from '../Context/AuthProvider';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
const BDS = moment().format('YYYY-MM-DD HH:mm:ss')
export const PlanContext = React.createContext();

export function usePlan() {
    return useContext(PlanContext)
}

function PlanDetail({children }) {
    const [image , setImage] = useState();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [booking ,setbooking] = useState({})   

    const [plan, setplan] = useState({})
    const { id } = useParams();
    const [arr, setarr] = useState();
    const [review, setreview] = useState("");
    const [rate, setrate] = useState();
    const { user } = useAuth();


    useEffect( () => {
        async function loadingTimer(){
                setLoading(true);
                setTimeout(() => {
                setLoading(false);
            }, 2000);
            }
        async function getPlanData() {
            const data = await axios.get(`https://foodappbackend-lk5m.onrender.com/api/v1/plan/${id}`)
            setImage(data.data.plan.image);
            delete data.data.plan["_id"]
            delete data.data.plan["__v"]
            delete data.data.plan["reviews"];
            delete data.data.plan["averageRating"];
            delete data.data.plan.image;
            setplan(data.data.plan)


            const reviews = await axios.get("https://foodappbackend-lk5m.onrender.com/api/v1/review/");
            setarr(reviews.data.reviews);
            console.log(reviews.data.reviews);

        }
        loadingTimer();
        getPlanData();

    }, [])
  
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    const handleClick = async () => {
        console.log(123645);
        
        let data = await axios.post("https://foodappbackend-lk5m.onrender.com/api/v1/review/", {
            "description": review,
            "rating": rate,
            "user": user.user._id,
            "plan": id,
    })
    alert("this is " ,data);

        const reviews = await axios.get("https://foodappbackend-lk5m.onrender.com/api/getReview/" + id);
        setarr(reviews.data.reviews);
    }
    const handleDelete = async() =>{
        try{
            let data = await axios.delete("https://foodappbackend-lk5m.onrender.com/api/v1/review/", {
                        "description": review,
                        "rating": rate,
                        "user": user.user._id,
                        "plan": id,


            });
            console.log(data);
            alert(data);
        }
        catch(err){
            alert(err);
        }
    }
    const handleClick1 = async () => {

        const plans = await axios.get(`https://foodappbackend-lk5m.onrender.com/api/v1/plan/${id}` );


        const data = await axios.post("https://foodappbackend-lk5m.onrender.com/api/v1/booking/", {
                "bookedAt": BDS,
                "priceAtThatTime": plans.data.plan.price,
                "user": user,
                "plan": plans.data.plan._id,
                "status":"pending"
            })
            setbooking(data);
            console.log(user._id);
            alert("Plan is succesfully booked",data);

        }

    const routeChange = () =>{  
        history.push('/booking1');
      }

    return (
        <div className="pDetailBox">
            <div className='h1Box'>
                <h1 className='h1'>PLAN DETAILS</h1>
                <div className="line"></div>
            </div>
            <div className="planDetailBox">
                <div className='app__gallery-images1'>
                    <div className="app__gallery-images_container1">
                        {
                            Object.keys(plan).map((ele, key) => (
                                <div className='entryBox' key={key}>
                                    <div className="entryText">{capitalizeFirstLetter(ele)}</div>
                                    <div className=" input">{capitalizeFirstLetter(plan[ele].toString())}</div>
                              
                                </div>
                                
                            ))
                        }
                        
                    </div>
                    < img src={`https://foodappbackend-lk5m.onrender.com/`+ image}
                                height={200}
                                width={320}
                            /> 
                </div>
                <div className='GoToBooking'>
                    <li>
                    <button className="btn" onClick={()=>{
                        handleClick1();
                        routeChange();
                    }}>
                        Book Now        
                    </button> 
                   </li>
                    </div>

            </div>

            <div className='reviewBox'>
                <div className="reviewEnrty">
                    <input type="text" value={review} onChange={(e) => setreview(e.target.value)} />
                    <select name="" id="" className="select" onChange={(e) => { setrate(e.target.value) }}>
                        <option value="5">5 Excellent</option>
                        <option value="4">4 Very Good</option>
                        <option value="3">3 Good</option>
                        <option value="2">2 Poor</option>
                        <option value="1">1 Very Poor</option>
                    </select>
                    <button className="btn" onClick={handleClick}>
                        Submit
                    </button>
                </div>
                {
                    arr && arr?.map((ele, key) => (
                        <div className="reviewsCard" key={key}>
                            <div className="pdreviews">
                                <div className="pdrdetail">
                                    <h3>{ele.user.name}</h3>
                                    <div className="input"> {ele.review}</div>
                                </div>
                                <div className='rate'>
                                    {
                                        <label htmlFor="star5" title="text">{ele.rating}</label>

                                    }
                                </div>
                            </div>

                            <div className='rcBtn'>
                                <button className="showMoreBtn btn" onClick={handleDelete}>Delete</button>
                            </div>
                        </div>
                    ))
                }

            </div>
        </div>
    )
}

export default PlanDetail
