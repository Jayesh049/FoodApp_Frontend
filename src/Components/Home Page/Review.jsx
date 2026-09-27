import React, { useEffect, useState } from 'react';
import Star from '../Images/star.png';
import '../Styles/review.css';
import axios from 'axios';
import { API_V1 } from '../../utils/apiBase';
import SubHeading from '../Genrich/SubHeading';

function Review() {
  const [arr, setarr] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function fetchReviews() {
      try {
        const data = await axios.get(`${API_V1}/review/best3`);
        if (isMounted && data.data.reviews) {
          setarr(data.data.reviews);
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetchReviews();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="app__reviews app__bg section__padding">
      <div className="app__reviews-title">
        <SubHeading title="What our customers say" />
        <h1 className="headtext__cormorant">Reviews</h1>
      </div>
      <div className="app__reviews-grid">
        {arr && arr?.map((ele, key) => (
          <div className="app__review-card" key={key}>
            <h3 className="p__cormorant">{ele.user?.name || 'Anonymous'}</h3>
            <p className="p__opensans app__review-text">
              {ele.review || ele.description || 'No review available'}
            </p>
            <p className="p__opensans app__review-plan">Plan: {ele.plan?.name || 'Unknown Plan'}</p>
            <div className="app__review-stars">
              {Array.from(Array(ele.rating || 0).keys()).map((star, starKey) => (
                <img key={starKey} alt="" src={Star} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Review;
