import React, { useEffect, useState } from 'react'
import '../Styles/allplans.css';
import Tick from '../Images/check-mark.png'
import axios from 'axios';
import { Link } from 'react-router-dom';

function AllPlans() {
    const [arr, arrset] = useState([]);
    const [image , setImage] = useState();
    useEffect(async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/v1/plan/");
            //res mangwaya aur data ke saath Allplans function
            // console.log(res.data.Allplans[arr.length -1].image);
            arrset(res.data.Allplans);
            setImage(res.data.Allplans[arr.length -1].image);
        } catch (err) {
            console.log(err);
        }
    }, [])
    return (
        <div className='allplansCard'>
            <div className='h1Box'>
                <h1 className='h1'>START EATING HEALTHY TODAY</h1>
                <div className="line"></div>
            </div>
            <div className='allplanDetails'>
                <div className='planDetails'>
                    {arr && arr?.map((ele, key) =>
                        <div className='apCard' key={key}>
                            <h1 className='h1'>{ele.name}</h1>
                            < img src={`http://localhost:3000/`+ ele.image}
                                height={200}
                                width={200}
                            />
                            <div className='pCard1'>
                                <div className='priceBox'>
                                    <div className='price'>Rs {ele.price}</div>
                                    <div className="duration">/month</div>
                                </div>
                                <p className="point">That’s only {Math.floor(ele.price/ele.duration)}$ per meal</p>
                            </div>

                            <div className='pCard2'>
                                <div className='ppoints'>
                                    <img src={Tick} alt='' className='img' />
                                    <p className='point'>{ele.duration} meal every day</p>
                                </div>
                                <div className='ppoints'>
                                    <img src={Tick} alt='' className='img' />
                                    <p className='point'>{ele.discount} discount available.</p>
                                </div>
                                <div className='ppoints'>
                                    <img src={Tick} alt='' className='img' />
                                    <p className='point'>{ele.ratingsAverage} rated meal.</p>
                                </div>
                            </div>

                            <button className='btn'> <Link to={`/planDetail/${ele._id}`} >I'm Hungry</Link></button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}
export default AllPlans;
