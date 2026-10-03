import React, { useCallback, useEffect, useRef, useState } from 'react';
import { mediaUrl } from '../../utils/apiBase';
import { displayPlanName, planImagePlaceholder, planPricing } from '../../utils/planDisplay';
import '../Styles/dishCinema.css';

const FRAME_MS = 3000;

/**
 * Fullscreen story player — autoplay through a plan's images[].
 */
function DishStoryPlayer({ plan, onClose, onAddToCart, onEnded }: any) {
  const frames = (() => {
    if (!plan) return [];
    if (Array.isArray(plan.images) && plan.images.length) return plan.images;
    if (plan.image) return [plan.image];
    return [];
  })();

  const [frame, setFrame] = useState<number>(0);
  const [paused, setPaused] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const rafRef = useRef<any>(null);
  const startRef = useRef(0);
  const remainRef = useRef(FRAME_MS);

  const close = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const advance = useCallback(() => {
    setFrame((f: any) => {
      if (f + 1 >= frames.length) {
        onEnded?.(plan);
        onClose?.();
        return f;
      }
      return f + 1;
    });
    setProgress(0);
    remainRef.current = FRAME_MS;
    startRef.current = performance.now();
  }, [frames.length, onClose, onEnded, plan]);

  useEffect(() => {
    setFrame(0);
    setProgress(0);
    setPaused(false);
    remainRef.current = FRAME_MS;
    startRef.current = performance.now();
  }, [plan?._id]);

  useEffect(() => {
    if (!frames.length || paused) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return undefined;
    }

    startRef.current = performance.now();
    const tick = (now) => {
      const elapsed = now - startRef.current;
      const ratio = Math.min(1, elapsed / remainRef.current);
      setProgress(ratio);
      if (ratio >= 1) {
        remainRef.current = FRAME_MS;
        advance();
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const elapsed = performance.now() - startRef.current;
      remainRef.current = Math.max(200, remainRef.current - elapsed);
    };
  }, [frame, paused, frames.length, advance]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Escape') close();
      if (e.code === 'Space') {
        e.preventDefault();
        setPaused((p: any) => !p);
      }
      if (e.code === 'ArrowRight') {
        e.preventDefault();
        remainRef.current = FRAME_MS;
        advance();
      }
      if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setFrame((f: any) => Math.max(0, f - 1));
        setProgress(0);
        remainRef.current = FRAME_MS;
        startRef.current = performance.now();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [advance, close]);

  if (!plan || !frames.length) return null;

  const pricing = planPricing(plan);
  const src = mediaUrl(frames[frame]);

  return (
    <div className="dish-story" role="dialog" aria-modal="true" aria-label="Dish story">
      <div className="dish-story__bars">
        {frames.map((_: any, i: any) => (
          <div key={i} className="dish-story__bar">
            <div
              className="dish-story__bar-fill"
              style={{
                width:
                  i < frame ? '100%' : i === frame ? `${progress * 100}%` : '0%',
              }}
            />
          </div>
        ))}
      </div>

      <button type="button" className="dish-story__close" onClick={close} aria-label="Close">
        ×
      </button>

      <img
        className="dish-story__image"
        src={src}
        alt={`${displayPlanName(plan)} ${frame + 1}`}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = planImagePlaceholder(plan);
        }}
      />

      <button
        type="button"
        className="dish-story__hit dish-story__hit--left"
        aria-label="Previous photo"
        onClick={() => {
          setFrame((f: any) => Math.max(0, f - 1));
          setProgress(0);
          remainRef.current = FRAME_MS;
          startRef.current = performance.now();
        }}
      />
      <button
        type="button"
        className="dish-story__hit dish-story__hit--right"
        aria-label="Next photo"
        onClick={() => {
          remainRef.current = FRAME_MS;
          advance();
        }}
      />

      <div className="dish-story__footer">
        <div>
          <h3 className="dish-story__title">{displayPlanName(plan)}</h3>
          <p className="dish-story__sub">
            ₹{pricing.salePrice} · {frame + 1}/{frames.length}
            {paused ? ' · Paused' : ''}
          </p>
        </div>
        <div className="dish-story__footer-actions">
          <button
            type="button"
            className="dish-cinema__btn dish-cinema__btn--ghost"
            onClick={() => setPaused((p: any) => !p)}
          >
            {paused ? 'Resume' : 'Pause'}
          </button>
          <button
            type="button"
            className="dish-cinema__btn dish-cinema__btn--gold"
            onClick={() => onAddToCart?.(plan)}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default DishStoryPlayer;
