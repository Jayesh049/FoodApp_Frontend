import React, { useEffect, useState } from 'react';

const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'features', label: 'Features' },
  { id: 'steps', label: 'Steps' },
  { id: 'intro', label: 'Lookbook' },
  { id: 'awards', label: 'Awards' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'suggestions', label: 'AI' },
  { id: 'menu', label: 'Plans' },
  { id: 'contact', label: 'Contact' },
  { id: 'newsletter', label: 'Newsletter' },
];

function HomeSectionNav() {
  const [activeId, setActiveId] = useState('home');

  useEffect(() => {
    const elements = SECTIONS.map((s: any) => document.getElementById(s.id)).filter(Boolean);
    if (elements.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry: any) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
            setActiveId(entry.target.id);
          }
        });
      },
      { threshold: [0.45, 0.6] }
    );

    elements.forEach((el: any) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className="home-section-nav" aria-label="Page sections">
      {SECTIONS.map((section: any) => (
        <button
          key={section.id}
          type="button"
          className={`home-section-nav__dot${activeId === section.id ? ' is-active' : ''}`}
          onClick={() => scrollTo(section.id)}
          aria-label={section.label}
          title={section.label}
        />
      ))}
    </nav>
  );
}

export default HomeSectionNav;
