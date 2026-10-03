import React, { useState } from 'react';
import axios from 'axios';
import { API_V1, mediaUrl } from '../../utils/apiBase';
import '../Styles/contact.css';
import SubHeading from '../Genrich/SubHeading';

const INITIAL_FORM = {
  name: '',
  email: '',
  source: 'friends',
  message: '',
};

const CONTACT_BG = 'uploads/user-plans/naan-curry/naan-curry-01.png';

function Contact() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleChange = (field) => (e) => {
    setForm((prev: any) => ({ ...prev, [field]: e.target.value }));
    if (status.text) setStatus({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', text: '' });
    setSubmitting(true);

    try {
      const res = await axios.post(`${API_V1}/contact/send`, {
        name: form.name,
        email: form.email,
        source: form.source,
        message: form.message,
      });
      setStatus({ type: 'success', text: res.data.result });
      setForm(INITIAL_FORM);
    } catch (err: any) {
      setStatus({
        type: 'error',
        text:
          err.response?.data?.result ||
          'Could not send your message. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="contact-atelier" id="contact">
      <div
        className="contact-atelier__bg"
        style={{ backgroundImage: `url(${mediaUrl(CONTACT_BG)})` }}
        aria-hidden="true"
      />
      <div className="contact-atelier__scrim" aria-hidden="true" />

      <div className="contact-atelier__grid">
        <div className="contact-atelier__info">
          <SubHeading title="Contact" />
          <h1 className="headtext__cormorant contact-title">Find Us</h1>
          <p className="p__opensans contact-atelier__addr">FoodApp HQ · Healthy Meals Lane</p>
          <div className="contact-hours-card">
            <p className="contact-hours-card__title">Opening Hours</p>
            <ul className="contact-hours-card__list">
              <li>
                <span>Mon – Fri</span>
                <span>10:00 am – 2:00 am</span>
              </li>
              <li>
                <span>Sat – Sun</span>
                <span>10:00 am – 3:00 am</span>
              </li>
            </ul>
          </div>
        </div>

        <form className="contact-form contact-atelier__form" onSubmit={handleSubmit}>
          <h2 className="contact-atelier__form-title">Write us</h2>
          <div className="entry">
            <div className="entry-text p__opensans">Name</div>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange('name')}
              required
            />
          </div>
          <div className="entry">
            <div className="entry-text p__opensans">Email</div>
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange('email')}
              required
            />
          </div>
          <div className="entry">
            <label className="entry-text p__opensans" htmlFor="contact-source">
              How did you find us
            </label>
            <select
              id="contact-source"
              name="source"
              className="select"
              value={form.source}
              onChange={handleChange('source')}
            >
              <option value="friends">Friends</option>
              <option value="search">Search</option>
              <option value="advertisement">Advertisement</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="textBox">
            <div className="entry-text p__opensans">Drop us a line</div>
            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange('message')}
              required
            />
          </div>
          {status.text && (
            <p className={`contact-form-status contact-form-status--${status.type}`}>
              {status.text}
            </p>
          )}
          <button type="submit" className="custom__button" disabled={submitting}>
            {submitting ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Contact;
