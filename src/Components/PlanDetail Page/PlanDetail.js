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
//custom hook that allows components to access context data
export function usePlan() {
    return useContext(PlanContext)
}

function PlanDetail({ children }) {
    
    const history = useHistory();
    const [plan, setplan] = useState({})
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [arr, setarr] = useState();
    const [review, setreview] = useState("");
    const [rate, setrate] = useState();
    const user = useAuth();
    const [booking ,setbooking] = useState({})   
    // const [data1, setData1] = useState([]);
    // let order = "";
    
    useEffect( () => {
        async function loadingTimer(){
                setLoading(true);
                setTimeout(() => {
                setLoading(false);
            }, 2000);
            }
        async function getPlanData() {
            const data = await axios.get(`https://foodappbackend-lk5m.onrender.com/api/v1/plan/${id}`)
            
            delete data.data.plan["_id"] ;
            delete data.data.plan["__v"]  ;
            delete data.data.plan["reviews"];
            delete data.data.plan["averageRating"];
            setplan(data.data.plan)
            

            const reviews = await axios.get("https://foodappbackend-lk5m.onrender.com/api/v1/review/");
            setarr(reviews.data.reviews)
        }
        loadingTimer();
        getPlanData();

    }, [])

    

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    const handleClick = async () => {
        // editing this post scenario
        
        

                    let data = await axios.post("https://foodappbackend-lk5m.onrender.com/api/v1/review/", {
                        "description": review,
                        "rating": rate,
                        "user": user.user._id,
                        "plan": id,
                        // "description":review
    })



    alert("this is " ,data);
    

        const reviews = await axios.get("https://foodappbackend-lk5m.onrender.com/api/v1/review/" );
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
                "user": user.user._id,
                "plan": plans.data.plan._id,
                "status":"pending"
            })
            setbooking(data);
            
            alert("Plan is succesfully booked",data);
             
        }

        const routeChange = () =>{  
            history.push('/booking1');
          }
      


    
    const value = {
        user:user,
        planid:id,
        review:arr,
        rate:plan.price,
    }
    
    return (<>
    
    {loading  ? (
        <div className="spinner-container">
        <div className="loading-spinner">
        </div>
        </div>
    ):(<>

    
        <div className="pDetailBox">
            <div className='h1Box'>
                <h1 className='h1'>PLAN DETAILS</h1>
                <div className="line"></div>
            </div>
            <div className="planDetailBox">
                <div className='planDetail'>
                    <div className="loginBox">
                        {
                            Object.keys(plan).map((ele, key) => (
                                <div className='entryBox' key={key}>
                                    <div className="entryText">{capitalizeFirstLetter(ele)}</div>
                                   
                                    <div className=" input">{capitalizeFirstLetter(plan[ele]?.toString())}</div>
                                </div>
                            ))
                        }
                    </div>
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
{/* ab mai yaha par booknow karta hu toh mere paas saare plan ke details aajane chahiye then uss details ko booking ke saath aage forward kar deng auth context ka use karke */}
                    
            <div className='reviewBox'>
            <h1 className='h1'>Reviews</h1>
                <div className="line"></div>
                <div className="reviewEnrty">
                    
                    <input type="text" value={review} onChange={(e) => setreview(e.target.value)} />
                    <select name="" id="" className="select" onChange={(e) =>  setrate(e.target.value) }>
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
                                    <div className="input"> {ele.description}</div>
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

        <div>
        < PlanContext.Provider value={value}>
            {children}
            
        </PlanContext.Provider >
                
        </div>
        </>
    )
    }
    </>
    )
}

export default PlanDetail
