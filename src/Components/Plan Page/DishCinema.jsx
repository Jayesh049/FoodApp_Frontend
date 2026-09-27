import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { mediaUrl } from '../../utils/apiBase';
import { displayPlanName, planImagePlaceholder, planPricing } from '../../utils/planDisplay';
import '../Styles/dishCinema.css';

const DISH_INTERVAL_MS = 4000;

/**
 * Full-bleed Dish Cinema — Play/Pause cycles plans with crossfade.
 */
function DishCinema({
  plans = [],
  onPlayStory,
  onAddToCart,
}) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [fadeKey, setFadeKey] = useState(0);
  const timerRef = useRef(null);

  const count = plans.length;
  const plan = count ? plans[index % count] : null;
  const pricing = plan ? planPricing(plan) : null;

  const goTo = useCallback(
    (next) => {
      if (!count) return;
      const n = ((next % count) + count) % count;
      setIndex(n);
      setFadeKey((k) => k + 1);
    },
    [count]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (!playing || count < 2) {
      if (timerRef.current) clearInterval(timerRef.current);
      return undefined;
    }
    timerRef.current = setInterval(() => {
      setIndex((i) => {
        setFadeKey((k) => k + 1);
        return (i + 1) % count;
      });
    }, DISH_INTERVAL_MS);
    return () => clearInterval(timerRef.current);
  }, [playing, count]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.target && ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setPlaying((p) => !p);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        setPlaying(false);
        next();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setPlaying(false);
        prev();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  if (!plan) return null;

  const cover = plan.image || (plan.images && plan.images[0]);
  const src = mediaUrl(cover);

  return (
    <section
      id="cinema"
      className="dish-cinema"
      aria-label="Dish cinema"
      onMouseEnter={() => {
        /* hover does not force pause — only Play/Pause control */
      }}
    >
      <div className="dish-cinema__stage">
        <img
          key={fadeKey}
          className="dish-cinema__image dish-cinema__image--ken"
          src={src}
          alt={displayPlanName(plan)}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = planImagePlaceholder(plan);
          }}
        />
        <div className="dish-cinema__scrim" aria-hidden="true" />

        <div className="dish-cinema__overlay">
          <p className="dish-cinema__eyebrow">Tasting menu · Play to browse</p>
          <h2 className="dish-cinema__title">{displayPlanName(plan)}</h2>
          {plan.description && (
            <p className="dish-cinema__desc">{plan.description}</p>
          )}
          <div className="dish-cinema__meta">
            {pricing && (
              <span className="dish-cinema__price">₹{pricing.salePrice}</span>
            )}
            {pricing?.hasDeal && (
              <span className="dish-cinema__list">₹{pricing.listPrice}</span>
            )}
            <span className="dish-cinema__count">
              {index + 1} / {count}
            </span>
          </div>

          <div className="dish-cinema__controls">
            <button
              type="button"
              className="dish-cinema__nav"
              onClick={() => {
                setPlaying(false);
                prev();
              }}
              aria-label="Previous dish"
            >
              ‹
            </button>
            <button
              type="button"
              className={`dish-cinema__play ${playing ? 'is-playing' : ''}`}
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? 'Pause' : 'Play dishes'}
            >
              {playing ? '❚❚' : '▶'}
            </button>
            <button
              type="button"
              className="dish-cinema__nav"
              onClick={() => {
                setPlaying(false);
                next();
              }}
              aria-label="Next dish"
            >
              ›
            </button>
          </div>

          <div className="dish-cinema__actions">
            <button
              type="button"
              className="dish-cinema__btn dish-cinema__btn--gold"
              onClick={() => {
                setPlaying(false);
                onPlayStory?.(plan);
              }}
            >
              Play story
            </button>
            {plan._id && (
              <Link
                to={`/planDetails/${plan._id}`}
                className="dish-cinema__btn dish-cinema__btn--ghost"
                onClick={() => setPlaying(false)}
              >
                Details
              </Link>
            )}
            <button
              type="button"
              className="dish-cinema__btn dish-cinema__btn--ghost"
              onClick={() => onAddToCart?.(plan)}
            >
              Add to cart
            </button>
          </div>
        </div>

        <div className="dish-cinema__dots" role="tablist" aria-label="Dishes">
          {plans.map((p, i) => (
            <button
              key={p._id || p.name || i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={displayPlanName(p)}
              className={`dish-cinema__dot ${i === index ? 'is-active' : ''}`}
              onClick={() => {
                setPlaying(false);
                goTo(i);
              }}
            />
          ))}
        </div>

        <div className="dish-cinema__strip" role="group" aria-label="Dish thumbnails">
          {plans.map((p, i) => (
            <button
              key={`strip-${p._id || i}`}
              type="button"
              className={`dish-cinema__thumb ${i === index ? 'is-active' : ''}`}
              aria-label={displayPlanName(p)}
              aria-current={i === index ? 'true' : undefined}
              onClick={() => {
                setPlaying(false);
                goTo(i);
              }}
            >
              <img
                src={mediaUrl(p.image || (p.images && p.images[0]))}
                alt=""
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = planImagePlaceholder(p);
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DishCinema;
