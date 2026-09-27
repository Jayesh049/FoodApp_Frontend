import React, { useState } from 'react';
import SubHeading from './SubHeading';
import './Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setStatus('Please enter a valid email address.');
      return;
    }
    const subs = JSON.parse(localStorage.getItem('newsletterSubs') || '[]');
    if (!subs.includes(email.trim().toLowerCase())) {
      subs.push(email.trim().toLowerCase());
      localStorage.setItem('newsletterSubs', JSON.stringify(subs));
    }
    setStatus('Subscribed! You will receive our latest updates.');
    setEmail('');
  };

  return (
    <div className="app__newsletter">
      <div className="app__newsletter-heading">
        <SubHeading title="Newsletter" />
        <h1 className="headtext__cormorant">Subscribe to Our Newsletter</h1>
        <p className="p__opensans">And never miss latest updates!</p>
      </div>

      <form className="app__newsletter-input flex__center" onSubmit={handleSubscribe}>
        <input
          type="email"
          placeholder="Enter your e-mail address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="custom__button">Subscribe</button>
      </form>
      {status && <p className="app__newsletter-status p__opensans">{status}</p>}
    </div>
  );
};

export default Newsletter;
