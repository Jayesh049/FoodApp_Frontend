import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_V1, mediaUrl } from '../../utils/apiBase';
import '../Styles/planDetail.css';
import '../Styles/contact.css';
import ReviewForm from './ReviewForm';

function PlanDetail() {
  const [image, setImage] = useState();
  const [plan, setPlan] = useState({});
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function getPlanData() {
      try {
        const planResponse = await axios.get(`${API_V1}/plan/${id}`);
        const planData = planResponse.data.plan;
        setImage(planData.image);
        
        setPlan(planData);

        const reviewResponse = await axios.get(`${API_V1}/review/`);
        setReviews(reviewResponse.data.reviews);
      } catch (error) {
        console.error('Error fetching plan or reviews:', error);
      }
    }

    getPlanData();
  }, [id]);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
            {Object.keys(plan)
              .filter(key => !['_id', '__v', 'reviews', 'averageRating', 'image', 'images'].includes(key))
              .map((ele, key) => (
                <div className='entryBox' key={key}>
                  <div className="entryText">{capitalizeFirstLetter(ele)}</div>
                  <div className="input">{capitalizeFirstLetter(plan[ele].toString())}</div>
                </div>
              ))}
          </div>
          <img src={mediaUrl(image)}
            height={200}
            width={320}
            alt="Plan"
          />
        </div>
      </div>

      <ReviewForm planId={id} reviews={reviews} />
      
    </div>
  );
}

export default PlanDetail;
