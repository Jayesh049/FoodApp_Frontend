import React, { useEffect, useState } from 'react';
import Fast from '../Images/fast.png';
import Capture from '../Images/Capture.jpg';
import Review from './Review';
import SuggestionsSection from './SuggestionsSection';
import Plans from './Plans';
import Contact from './Contact';
import SubHeading from '../Genrich/SubHeading';
import HomeScrollSection from './HomeScrollSection';
import HomeSectionNav from './HomeSectionNav';
import DynamicHomeSections from './DynamicHomeSections';
import Newsletter from '../Genrich/Newsletter';
import PhotoHero from './PhotoHero';
import { PhotoPromise, DishLookbook } from './PhotoSections';
import { mediaUrl } from '../../utils/apiBase';
import '../Styles/home.css';
import '../Styles/homeScroll.css';
import '../Styles/photoHero.css';

function Home() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    document.documentElement.classList.add('home-scroll-snap');
    document.body.classList.add('home-scroll-snap');
    const timer = setTimeout(() => setLoading(false), 300);
    return () => {
      clearTimeout(timer);
      document.documentElement.classList.remove('home-scroll-snap');
      document.body.classList.remove('home-scroll-snap');
    };
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="home-page">
      <HomeSectionNav />

      <HomeScrollSection id="home" className="home-snap-section--hero" fill initialVisible ariaLabel="Hero">
        <PhotoHero />
      </HomeScrollSection>

      <HomeScrollSection id="features" className="home-snap-section--features" fill ariaLabel="Features">
        <PhotoPromise />
      </HomeScrollSection>

      <HomeScrollSection id="steps" className="home-snap-section--steps" ariaLabel="Steps">
        <div className="app__steps section__padding">
          <div className="app__steps-title">
            <SubHeading title="How it works" />
            <h1 className="headtext__cormorant">Steps To Follow</h1>
          </div>
          <div className="app__steps-content app__wrapper">
            <div className="app__wrapper_img">
              <img src={Capture} alt="steps" />
            </div>
            <div className="app__wrapper_info app__steps-list">
              <div className="app__step-item">
                <span className="app__step-num">1</span>
                <p className="p__opensans">Choose the subscription plan that best fits your needs and sign up today.</p>
              </div>
              <div className="app__step-item">
                <span className="app__step-num">2</span>
                <p className="p__opensans">Order your delicious meal using our mobile app or website. Or you can even call us!</p>
              </div>
              <div className="app__step-item">
                <span className="app__step-num">3</span>
                <p className="p__opensans">Enjoy your meal after less than 20 minutes. See you the next time!</p>
              </div>
              <div className="app__step-feature">
                <img src={Fast} alt="fast delivery" className="feature-icon" />
                <h3 className="p__cormorant">30 Minutes Or Free</h3>
                <p className="p__opensans">Super healthy meals delivered right to your home.</p>
              </div>
            </div>
          </div>
        </div>
      </HomeScrollSection>

      <HomeScrollSection id="intro" className="home-snap-section--intro" fill ariaLabel="Lookbook">
        <DishLookbook title="Our story" subtitle="Eight plates. One kitchen." />
      </HomeScrollSection>

      <HomeScrollSection id="awards" className="home-snap-section--awards" ariaLabel="Awards">
        <section className="awards-photo">
          <div
            className="awards-photo__bg"
            style={{
              backgroundImage: `url(${mediaUrl('uploads/user-plans/paneer-tikka/paneer-tikka-01.png')})`,
            }}
            aria-hidden="true"
          />
          <div className="awards-photo__scrim" aria-hidden="true" />
          <div className="awards-photo__inner">
            <div className="home-awards-header">
              <SubHeading title="Awards & recognition" />
              <h2 className="headtext__cormorant home-awards-header__title">Our Laurels</h2>
            </div>
            <div className="awards-photo__row">
              <ul className="home-awards-list">
                <li>Best Healthy Meal Delivery</li>
                <li>Customer Choice — Fresh Ingredients</li>
                <li>Culinary Innovation Award</li>
              </ul>
              <p className="p__opensans awards-photo__copy">
                Recognized for excellence in healthy meal delivery, customer satisfaction, and culinary innovation.
              </p>
              <div className="awards-photo__mark" aria-hidden="true">
                <span className="awards-photo__fa">FA</span>
                <span className="awards-photo__caption">Est. excellence</span>
              </div>
            </div>
          </div>
        </section>
      </HomeScrollSection>

      <HomeScrollSection id="reviews" className="home-snap-section--reviews" ariaLabel="Reviews">
        <Review />
      </HomeScrollSection>

      <HomeScrollSection id="suggestions" className="home-snap-section--suggestions" ariaLabel="AI suggestions">
        <SuggestionsSection />
      </HomeScrollSection>

      <DynamicHomeSections />

      <HomeScrollSection id="menu" className="home-snap-section--plans" ariaLabel="Plans">
        <Plans />
      </HomeScrollSection>

      <HomeScrollSection id="contact" className="home-snap-section--contact" ariaLabel="Contact">
        <Contact />
      </HomeScrollSection>

      <HomeScrollSection id="newsletter" className="home-snap-section--newsletter" ariaLabel="Newsletter">
        <Newsletter />
      </HomeScrollSection>
    </div>
  );
}

export default Home;
