import React, { useEffect, useState } from 'react';
import { BsInstagram , BsArrowLeftShort ,BsArrowRightShort } from 'react-icons/bs';

import '../Styles/allplans.css';
import Tick from '../Images/check-mark.png'
import axios from 'axios';
import { Link } from 'react-router-dom';

function AllPlans() {
    const [arr, arrset] = useState([]);
    const [image , setImage] = useState();
    const scrollRef = React.useRef(null);

    const scroll = (direction) => {
      const { current } = scrollRef;
  
      if(direction === 'left') {
        current.scrollLeft -= 1200;
      }else {
        current.scrollLeft += 1200;
      }
    }
    useEffect(async () => {
        try {
            const res = await axios.get("https://foodappbackend-lk5m.onrender.com/api/v1/plan/");
            
            arrset(res.data.Allplans);
            setImage(res.data.Allplans[arr.length -1].image);
        } catch (err) {
        }
    }, [])
    return (
        <div className='app__gallery flex__center'>
            <div className='h1Box'>
                <h1 className='h1'>START EATING HEALTHY TODAY</h1>
                <div className="line"></div>
            </div>
            <div className='allplanDetails'>
            <div className="app__gallery-images">

                <div className='app__gallery-images_container' ref={scrollRef}>
                    {arr && arr?.map((ele, key) =>
                        <div className='apCard' key={key}>
                             
                            <h1 className='h1'>{ele.name}</h1>
                            <div className="app__gallery-images_card ">
                            < img src={`https://foodappbackend-lk5m.onrender.com/`+ ele.image}
                                height={200}
                                width={200}
                            />
                                
                            </div>
                            
   
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

                            <button className='btn-plan'> <Link to={`/planDetail/${ele._id}`} >I'm Hungry</Link></button>
                        </div>
                    )}

                </div>
                <div className="app__gallery-images_arrows">
                            <BsArrowLeftShort className="gallery__arrow-icon" onClick={() => scroll('left')} />
                            <BsArrowRightShort className="gallery__arrow-icon" onClick={() => scroll('right')} />
                            </div>
            </div>
        </div>
        </div>
    )
}
export default AllPlans;
