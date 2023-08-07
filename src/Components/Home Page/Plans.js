import React, { useEffect, useState } from 'react';
import '../Styles/plan.css';
import Tick from '../Images/check-mark.png'
import axios from 'axios';
import { Link } from 'react-router-dom';

function Plans() {
    const [arr, arrset] = useState([]);

    useEffect(async () => {
        try {
            const data = await axios.get("http://localhost:3000/api/v1/plan/sortByRating");
            arrset(data.data.plans);
            console.log("This is the plan " ,data.data.plans);
        } catch (err) {
            console.log(err);
        }
    }, [])

    return (
        <div className='plansCard'>
            <div className='h1Box'>
                <h1 className='h1'>START EATING HEALTHY TODAY</h1>
                <div className="line"></div>
            </div>
            <div className='planDetails'>
                {arr && arr?.map((ele, key) =>
                    <div className='pCard' key={key}>
                        <h3 className='h3'>{ele.name}</h3>
                        <div className='pCard1'>
                            <div className='priceBox'>
                                <div className='price'>Rs {ele.price}</div>
                                <div className="duration">/month</div>
                            </div>
                            <p className="point">That’s only {ele.price /80} $ per meal</p>
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
                        <button className='btn'>I'm Hungry</button>
                    </div>
                )}
            </div>
        
        </div>
    )
}

export default Plans
