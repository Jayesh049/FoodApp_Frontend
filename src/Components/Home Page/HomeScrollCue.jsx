import React from 'react';

function HomeScrollCue({ targetId = 'features' }) {
  const scrollToNext = () => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <button
      type="button"
      className="home-scroll-cue"
      onClick={scrollToNext}
      aria-label="Scroll to next section"
    >
      <span className="home-scroll-cue__chevron">⌄</span>
      <span className="home-scroll-cue__label">Scroll</span>
    </button>
  );
}

export default HomeScrollCue;
