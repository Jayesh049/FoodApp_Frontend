import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SubHeading from '../Genrich/SubHeading';
import HomeScrollSection from './HomeScrollSection';
import { API_V1, mediaUrl } from '../../utils/apiBase';
import { displayPlanName, planImagePlaceholder } from '../../utils/planDisplay';
import '../Styles/dynamicSections.css';

function PlanCard({ plan }: any) {
  const imageSrc = plan.image
    ? mediaUrl(plan.image)
    : null;

  return (
    <Link to={`/planDetails/${plan._id}`} className="dynamic-section-card">
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={displayPlanName(plan)}
          className="dynamic-section-card__img"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = planImagePlaceholder(plan);
          }}
        />
      ) : (
        <div className="dynamic-section-card__img dynamic-section-card__img--fallback" aria-hidden="true" />
      )}
      <div className="dynamic-section-card__body">
        <h3 className="dynamic-section-card__title">{displayPlanName(plan)}</h3>
        <p className="dynamic-section-card__price">₹{plan.price}</p>
      </div>
    </Link>
  );
}

function SectionContent({ section, plans }: any) {
  const linkedPlans = (section.planIds || [])
    .map((id: any) => {
      const idStr = String(id?._id || id);
      return plans.find((p: any) => String(p._id) === idStr);
    })
    .filter(Boolean);

  if (section.type === 'banner') {
    return (
      <div className="dynamic-section-banner">
        {section.subtitle && <SubHeading title={section.subtitle} />}
        <h2 className="headtext__cormorant dynamic-section-banner__title">{section.title}</h2>
        {section.description && <p className="p__opensans dynamic-section-banner__desc">{section.description}</p>}
        <Link to={section.ctaUrl || '/allPlans'} className="custom__button">
          {section.ctaLabel || 'View Plans'}
        </Link>
      </div>
    );
  }

  if (section.type === 'hero') {
    return (
      <div className="dynamic-section-hero">
        {section.subtitle && <SubHeading title={section.subtitle} />}
        <h2 className="headtext__cormorant">{section.title}</h2>
        {section.description && <p className="p__opensans">{section.description}</p>}
        {section.imagePaths?.length > 0 && (
          <div className="dynamic-section-hero__images">
            {section.imagePaths.map((src: any) => (
              <img key={src} src={mediaUrl(src)} alt="" />
            ))}
          </div>
        )}
      </div>
    );
  }

  const displayPlans = linkedPlans.length > 0 ? linkedPlans : plans.slice(0, 3);

  return (
    <div className={`dynamic-section-${section.type}`}>
      <div className="dynamic-section-header">
        {section.subtitle && <SubHeading title={section.subtitle} />}
        <h2 className="headtext__cormorant">{section.title}</h2>
        {section.description && <p className="p__opensans dynamic-section-desc">{section.description}</p>}
      </div>
      <div className={section.type === 'carousel' ? 'dynamic-section-carousel' : 'dynamic-section-grid'}>
        {displayPlans.map((plan: any) => (
          <PlanCard key={plan._id} plan={plan} />
        ))}
      </div>
      {section.ctaLabel && (
        <div className="dynamic-section-cta">
          <Link to={section.ctaUrl || '/allPlans'} className="custom__button custom__button-outline">
            {section.ctaLabel}
          </Link>
        </div>
      )}
    </div>
  );
}

function DynamicHomeSections() {
  const [sections, setSections] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [secRes, planRes] = await Promise.all([
          axios.get(`${API_V1}/sections/`),
          axios.get(`${API_V1}/plan/`, { params: { diet: 'veg' } }),
        ]);
        if (!mounted) return;
        setSections(secRes.data.sections || []);
        setPlans(planRes.data.Allplans || []);
      } catch (err: any) {
        console.error('Dynamic sections load failed:', err);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  if (sections.length === 0) return null;

  return sections.map((section: any) => (
    <HomeScrollSection
      key={section._id}
      id={`section-${section.key}`}
      className="home-snap-section--dynamic"
      ariaLabel={section.title}
    >
      <SectionContent section={section} plans={plans} />
    </HomeScrollSection>
  ));
}

export default DynamicHomeSections;
