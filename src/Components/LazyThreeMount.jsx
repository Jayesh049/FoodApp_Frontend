import React, { useEffect, useRef, useState } from 'react';

/**
 * Mount Three.js children only while the section is in/near the viewport.
 * Unmounting releases WebGL contexts (browser limit ~8).
 */
function LazyThreeMount({ children, className = '', style = {}, rootMargin = '80px' }) {
  const hostRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.08, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={hostRef} className={className} style={{ width: '100%', height: '100%', ...style }}>
      {visible ? children : null}
    </div>
  );
}

export default LazyThreeMount;
