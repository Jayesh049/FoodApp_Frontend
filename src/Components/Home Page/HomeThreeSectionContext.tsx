import React, { createContext, useContext, useEffect, useState } from 'react';

const HomeThreeSectionContext = createContext('home');

const ACTIVE_THRESHOLD = 0.4;

export function HomeThreeSectionProvider({ children, ready = true }: any) {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    if (!ready) return undefined;

    const sections = Array.from(document.querySelectorAll('.home-snap-section[id]'));
    if (!sections.length) return undefined;

    const ratios = new Map([['home', 1]]);

    const pickActive = () => {
      let bestId = 'home';
      let bestRatio = ratios.get('home') || 0;

      ratios.forEach((ratio, id) => {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = id;
        }
      });

      if (bestRatio >= ACTIVE_THRESHOLD) {
        setActiveSection(bestId);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry: any) => {
          const { id } = entry.target;
          if (!id) return;

          if (entry.intersectionRatio < 0.05) {
            ratios.delete(id);
          } else {
            ratios.set(id, entry.intersectionRatio);
          }
        });
        pickActive();
      },
      { threshold: [0, 0.05, 0.15, 0.25, 0.4, 0.55, 0.7, 0.85, 1] }
    );

    sections.forEach((section: any) => observer.observe(section));
    pickActive();

    return () => observer.disconnect();
  }, [ready]);

  return (
    <HomeThreeSectionContext.Provider value={activeSection}>
      {children}
    </HomeThreeSectionContext.Provider>
  );
}

export function useActiveThreeSection(sectionId) {
  const activeSection = useContext(HomeThreeSectionContext);
  if (!sectionId) return true;
  return activeSection === sectionId;
}

export default HomeThreeSectionContext;
