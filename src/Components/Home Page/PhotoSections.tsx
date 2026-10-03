import React from 'react';
import { Link } from 'react-router-dom';
import { mediaUrl } from '../../utils/apiBase';
import SubHeading from '../Genrich/SubHeading';
import '../Styles/photoHero.css';

const LOOKBOOK = [
  { name: 'Paneer Tikka', src: 'uploads/user-plans/paneer-tikka/paneer-tikka-01.png' },
  { name: 'Masala Dosa', src: 'uploads/user-plans/masala-dosa/masala-dosa-01.png' },
  { name: 'Malai Paneer', src: 'uploads/user-plans/malai-paneer/malai-paneer-01.png' },
  { name: 'Chhole Bhature', src: 'uploads/user-plans/chhole-bhature/chhole-bhature-01.png' },
  { name: 'Fruit Chaat', src: 'uploads/user-plans/fruit-chaat/fruit-chaat-01.png' },
  { name: 'Naan Curry', src: 'uploads/user-plans/naan-curry/naan-curry-01.png' },
  { name: 'Mix Veg', src: 'uploads/user-plans/mix-veg/mix-veg-01.png' },
  { name: 'Veg Salad', src: 'uploads/user-plans/veg-salad/veg-salad-01.png' },
];

/** Photo promise strip — replaces ThreeStatsSection backdrop. */
export function PhotoPromise() {
  return (
    <section className="photo-promise">
      <div
        className="photo-promise__bg"
        style={{
          backgroundImage: `url(${mediaUrl('uploads/user-plans/malai-paneer/malai-paneer-01.png')})`,
        }}
        aria-hidden="true"
      />
      <div className="photo-promise__scrim" aria-hidden="true" />
      <div className="photo-promise__inner">
        <SubHeading title="Our promise" />
        <div className="photo-promise__grid">
          <div className="photo-promise__block">
            <h2 className="photo-promise__number">365 Days/Year</h2>
            <p className="photo-promise__desc">
              Never cook again. Subscription coverage up to a full year of plated vegetarian meals.
            </p>
          </div>
          <div className="photo-promise__divider" aria-hidden="true" />
          <div className="photo-promise__block photo-promise__block--right">
            <h2 className="photo-promise__number">100% Vegetarian</h2>
            <p className="photo-promise__desc">
              Fresh, organic, local produce — good for you and the table you share.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Horizontal dish lookbook — replaces Three Intro + Galleries. */
export function DishLookbook({ title = 'The lookbook', subtitle = 'Eight plates. One kitchen.' }: any) {
  return (
    <section className="dish-lookbook">
      <div className="dish-lookbook__header">
        <SubHeading title={title} />
        <h2 className="headtext__cormorant dish-lookbook__title">{subtitle}</h2>
        <Link to="/allPlans#cinema" className="dish-lookbook__cta">
          Play the tasting menu
        </Link>
      </div>
      <div className="dish-lookbook__rail">
        {LOOKBOOK.map((dish: any) => (
          <Link
            key={dish.name}
            to="/allPlans#cinema"
            className="dish-lookbook__card"
          >
            <img src={mediaUrl(dish.src)} alt={dish.name} loading="lazy" />
            <span className="dish-lookbook__name">{dish.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default DishLookbook;
