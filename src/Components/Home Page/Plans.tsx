import React, { useEffect, useState } from 'react';
import '../Styles/plan.css';
import axios from 'axios';
import { API_V1, mediaUrl } from '../../utils/apiBase';
import { displayPlanName, planImagePlaceholder, planPricing } from '../../utils/planDisplay';
import { filterVegetarianPlans } from '../../utils/vegFilter';
import { Link } from 'react-router-dom';
import SubHeading from '../Genrich/SubHeading';

function Plans() {
  const [arr, arrset] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function getBookingDataById() {
      try {
        const data = await axios.get(`${API_V1}/plan/sortByRating`);
        if (isMounted) {
          arrset(filterVegetarianPlans(data.data.plans || []).slice(0, 3));
        }
      } catch (err: any) {
        console.log(err);
      }
    }
    getBookingDataById();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="app__specialMenu flex__center section__padding tasting-plans" id="menu">
      <div className="app__specialMenu-title">
        <SubHeading title="Vegetarian menu that fits your palate" />
        <h1 className="headtext__cormorant">Start Eating Healthy Today</h1>
        <Link to="/allPlans#cinema" className="app__plans-play-link">
          Play the tasting menu
        </Link>
      </div>

      <div className="tasting-plans__grid">
        {arr.map((ele: any, key: any) => {
          const pricing = planPricing(ele);
          return (
            <article className="tasting-card" key={ele._id || key}>
              <Link to={ele._id ? `/planDetails/${ele._id}` : '/allPlans'} className="tasting-card__media">
                <img
                  src={mediaUrl(ele.image)}
                  alt={displayPlanName(ele)}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = planImagePlaceholder(ele);
                  }}
                />
              </Link>
              <div className="tasting-card__body">
                <h3 className="tasting-card__name">{displayPlanName(ele)}</h3>
                <div className="tasting-card__price">
                  <span className="tasting-card__amount">₹{pricing.salePrice}</span>
                  <span className="tasting-card__per">/month</span>
                </div>
                <p className="tasting-card__sub">
                  That&apos;s only ₹{(pricing.salePrice / Math.max(ele.duration || 30, 1)).toFixed(0)} per meal
                </p>
                <ul className="tasting-card__features">
                  <li>{ele.duration || 30} meals in plan</li>
                  <li>
                    {pricing.hasDeal
                      ? `${pricing.percentOff}% off`
                      : 'Pure vegetarian'}
                  </li>
                  <li>{ele.ratingsAverage || ele.averageRating || 4.5}★ rated</li>
                </ul>
                <Link
                  to={ele._id ? `/planDetails/${ele._id}` : '/allPlans'}
                  className="tasting-card__cta"
                >
                  I&apos;m Hungry
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {arr.length === 0 && (
        <p className="p__opensans" style={{ color: 'var(--color-grey)' }}>
          Loading plans...
        </p>
      )}
    </div>
  );
}

export default Plans;
