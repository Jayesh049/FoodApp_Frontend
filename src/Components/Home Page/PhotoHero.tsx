import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { mediaUrl } from '../../utils/apiBase';
import HomeScrollCue from './HomeScrollCue';
import '../Styles/photoHero.css';

/** Strongest plates for hero rotation (user-plans covers). */
export const HERO_DISH_SLIDES = [
  {
    name: 'Paneer Tikka',
    src: 'uploads/user-plans/paneer-tikka/paneer-tikka-01.png',
  },
  {
    name: 'Masala Dosa',
    src: 'uploads/user-plans/masala-dosa/masala-dosa-01.png',
  },
  {
    name: 'Malai Paneer',
    src: 'uploads/user-plans/malai-paneer/malai-paneer-01.png',
  },
  {
    name: 'Chhole Bhature',
    src: 'uploads/user-plans/chhole-bhature/chhole-bhature-01.png',
  },
];

const INTERVAL_MS = 5000;

/**
 * Full-bleed photography hero — no Three.js.
 */
function PhotoHero() {
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    if (HERO_DISH_SLIDES.length < 2) return undefined;
    const id = setInterval(() => {
      setIndex((i: any) => (i + 1) % HERO_DISH_SLIDES.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const slide = HERO_DISH_SLIDES[index];

  return (
    <section className="photo-hero" aria-label="Hero">
      <div className="photo-hero__stage" aria-hidden="true">
        {HERO_DISH_SLIDES.map((s: any, i: any) => (
          <img
            key={s.src}
            className={`photo-hero__img ${i === index ? 'is-active' : ''}`}
            src={mediaUrl(s.src)}
            alt=""
          />
        ))}
        <div className="photo-hero__scrim" />
      </div>

      <div className="photo-hero__overlay">
        <p className="photo-hero__brand">FOODAPP</p>
        <p className="photo-hero__eyebrow">Vegetarian kitchen · Plated for you</p>
        <h1 className="photo-hero__title">Vegetarian tables, plated for you</h1>
        <p className="photo-hero__desc">
          Real dishes from our kitchen. Play the tasting menu, pick a plan, eat well—
          without cooking again tonight.
        </p>
        <div className="photo-hero__actions">
          <Link to="/allPlans#cinema" className="photo-hero__btn photo-hero__btn--solid">
            Book Now
          </Link>
          <Link to="/allPlans#cinema" className="photo-hero__btn photo-hero__btn--ghost">
            Play the kitchen
          </Link>
        </div>
        <p className="photo-hero__now">Now plating · {slide.name}</p>
      </div>

      <HomeScrollCue targetId="features" />
    </section>
  );
}

export default PhotoHero;
