import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import '../Styles/planDetail.css';
import '../Styles/contact.css';
import { useAuth } from '../Context/AuthProvider';
import moment from 'moment';

const BDS = moment().format('YYYY-MM-DD HH:mm:ss');

function PlanDetail(planId) {
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState({});
  const [plan, setPlan] = useState({});
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState("");
  const [rate, setRate] = useState();
  const { user } = useAuth();
  const history = useHistory();

  useEffect(() => {
    async function loadingTimer() {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }

    async function getPlanData() {
      try {
        const planResponse = await axios.get(`https://foodappbackend-lk5m.onrender.com/api/v1/plan/${id}`);
        const planData = planResponse.data.plan;
        setImage(planData.image);
        delete planData._id;
        delete planData.__v;
        delete planData.reviews;
        delete planData.averageRating;
        delete planData.image;
        setPlan(planData);

        const reviewResponse = await axios.get("https://foodappbackend-lk5m.onrender.com/api/v1/review/");
        setReviews(reviewResponse.data.reviews);
      } catch (error) {
        console.error('Error fetching plan or reviews:', error);
      }
    }

    loadingTimer();
    getPlanData();
  }, [id]);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const handleClick = async () => {
    if (!user || !user.user || !user.user._id) {
      alert("User is not logged in or user information is missing.");
      return;
    }

    try {
      console.log("User ID:", user.user._id);
      const data = await axios.post("https://foodappbackend-lk5m.onrender.com/api/v1/review/", {
        "description": review,
        "rating": rate,
        "user": user.user._id,
        "plan": id,
      });

      alert("Review submitted successfully", data);

      const reviewResponse = await axios.get("https://foodappbackend-lk5m.onrender.com/api/v1/review/");
      setReviews(reviewResponse.data.reviews);
    } catch (error) {
      alert("Error submitting review: " + error.message);
      console.error("Error details:", error);
    }
  };

  const handleClick1 = async () => {
    try {
      const plans = await axios.get(`https://foodappbackend-lk5m.onrender.com/api/v1/plan/${id}`);

      const data = await axios.post("https://foodappbackend-lk5m.onrender.com/api/v1/booking/", {
        "bookedAt": BDS,
        "priceAtThatTime": plans.data.plan.price,
        "user": user.user._id,
        "plan": plans.data.plan._id,
        "status": "pending",
      });

      setBooking(data);
      alert("Plan is successfully booked", data);
    } catch (error) {
      console.error('Error booking plan:', error);
    }
  };

  const routeChange = () => {
    history.push('/booking1');
  };

  return (
    <div className="pDetailBox">
      <div className='h1Box'>
        <h1 className='h1'>PLAN DETAILS</h1>
        <div className="line"></div>
      </div>
      <div className="planDetailBox">
        <div className='app__gallery-images1'>
          <div className="app__gallery-images_container1">
            {Object.keys(plan).map((ele, key) => (
              <div className='entryBox' key={key}>
                <div className="entryText">{capitalizeFirstLetter(ele)}</div>
                <div className="input">{capitalizeFirstLetter(plan[ele].toString())}</div>
              </div>
            ))}
          </div>
          <img src={`https://foodappbackend-lk5m.onrender.com/` + image}
            height={200}
            width={320}
            alt="Plan"
          />
        </div>
        <div className='GoToBooking'>
          <li>
            <button className="btn" onClick={() => {
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
          <input type="text" value={review} onChange={(e) => setReview(e.target.value)} />
          <select name="" id="" className="select" onChange={(e) => setRate(e.target.value)}>
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
        {reviews.map((ele, key) => (
          <div className="reviewsCard" key={key}>
            <div className="pdreviews">
              <div className="pdrdetail">
                <h3>{ele.user.name}</h3>
                <div className="input">{ele.description}</div>
              </div>
              <div className='rate'>
                <label htmlFor="star5" title="text">{ele.rating}</label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlanDetail;
