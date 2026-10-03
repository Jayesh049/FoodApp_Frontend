import React, { useEffect, useRef } from 'react';

function HomeScrollSection({ id,
  className = '',
  ariaLabel,
  fill = false,
  initialVisible = false,
  children, }: any) {
  const sectionRef = useRef<any>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;

    if (initialVisible) {
      el.classList.add('is-visible');
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry: any) => {
          if (entry.isIntersecting) {
            el.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.45 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [initialVisible]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`home-snap-section ${fill ? 'home-snap-section--fill' : ''} ${className}`.trim()}
      aria-label={ariaLabel}
    >
      <div className="home-snap-section__inner">{children}</div>
    </section>
  );
}

export default HomeScrollSection;
