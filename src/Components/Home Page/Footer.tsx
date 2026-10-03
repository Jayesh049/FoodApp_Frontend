import React from 'react';
import { FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';
import spoon from '../../assets/genrich/spoon.svg';
import FooterOverlay from '../Genrich/FooterOverlay';
import '../Styles/footer.css';

function Footer() {
  return (
    <div className="app__footer section__padding">
      <div className="footer-ambient-bg" aria-hidden="true" />
      <FooterOverlay />
      <div className="app__footer-links">
        <div className="app__footer-links_contact">
          <h1 className="app__footer-headtext">Contact us</h1>
          <p className="p__opensans">FoodApp HQ, Healthy Meals Lane</p>
          <p className="p__opensans">+1 212-344-1230</p>
          <p className="p__opensans">support@foodapp.com</p>
        </div>

        <div className="app__footer-links_logo">
          <span className="app__brand-logo app__brand-logo--footer">FoodApp</span>
          <p className="p__opensans">"The best way to find yourself is to lose yourself in the service of others."</p>
          <img src={spoon} alt="" className="spoon__img" style={{ marginTop: 15 }} />
          <div className="app__footer-links_icons">
            <FiFacebook />
            <FiTwitter />
            <FiInstagram />
          </div>
        </div>

        <div className="app__footer-links_work">
          <h1 className="app__footer-headtext">Working Hours</h1>
          <p className="p__opensans">Mon – Fri: 10:00 am – 2:00 am</p>
          <p className="p__opensans">Sat – Sun: 10:00 am – 3:00 am</p>
        </div>
      </div>

      <div className="footer__copyright">
        <p className="p__opensans">2026 FoodApp. All Rights reserved.</p>
      </div>
    </div>
  );
}

export default Footer;
