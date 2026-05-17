import { useState } from 'react';
import { useForm } from 'react-hook-form';
import '../css/contact.css';

export default function ContactPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = data => {
    console.log('Contact form submission:', data);
    setSubmitted(true);
    reset();
  };

  return (
    <main>
      <div className="contact-hero">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you — reach out for quotes, bookings, or any questions</p>
      </div>

      <section className="section">
        <div className="container contact-layout">
          {/* Form */}
          <div className="contact-form-wrap">
            <h2>Send Us a Message</h2>
            {submitted ? (
              <div className="success-banner">
                ✅ Thank you! We'll get back to you within 24 hours.
                <button className="btn btn-tertiary btn-sm mt-16" onClick={() => setSubmitted(false)}>
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    className={errors.name ? 'error' : ''}
                    {...register('name', { required: 'Name is required' })}
                  />
                  {errors.name && <span className="error-msg">{errors.name.message}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className={errors.email ? 'error' : ''}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                    })}
                  />
                  {errors.email && <span className="error-msg">{errors.email.message}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input id="phone" type="tel" placeholder="+234 800 000 0000" {...register('phone')} />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Tell us about your event or ask any question..."
                    className={errors.message ? 'error' : ''}
                    {...register('message', { required: 'Message is required', minLength: { value: 10, message: 'Please write at least 10 characters' } })}
                  />
                  {errors.message && <span className="error-msg">{errors.message.message}</span>}
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div className="contact-info">
            <h2>Get In Touch</h2>
            <ul className="info-list">
              <li>
                <span className="info-icon">📍</span>
                <div>
                  <strong>Address</strong>
                  <p>Lagos, Nigeria</p>
                </div>
              </li>
              <li>
                <span className="info-icon">📞</span>
                <div>
                  <strong>Phone</strong>
                  <p><a href="tel:+2348023938469">+234 802 393 8469</a></p>
                </div>
              </li>
              <li>
                <span className="info-icon">✉️</span>
                <div>
                  <strong>Email</strong>
                  <p><a href="mailto:bkventure07@yahoo.com">bkventure07@yahoo.com</a></p>
                </div>
              </li>
              <li>
                <span className="info-icon">🕐</span>
                <div>
                  <strong>Business Hours</strong>
                  <p>Mon–Fri: 8AM–6PM</p>
                  <p>Sat: 9AM–4PM</p>
                  <p>Sun: Closed</p>
                </div>
              </li>
            </ul>

            <div className="social-contact">
              <h5>Follow Us</h5>
              <div className="social-row">
                <a href="#" aria-label="Facebook" className="social-btn">📘 Facebook</a>
                <a href="#" aria-label="Instagram" className="social-btn">📸 Instagram</a>
                <a href="#" aria-label="WhatsApp" className="social-btn">💬 WhatsApp</a>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="container">
          <div className="map-wrap">
            <iframe
              title="BK Option Ventures Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.9972686040355!2d3.3228972!3d6.522026100000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8e8bccbd2d83%3A0xe7717019ef25df67!2s20%20Daddy%20Adediran%20St%2C%20Isaga%20Tedo%2C%20Lagos%20102214%2C%20Lagos!5e0!3m2!1sen!2sng!4v1779051791256!5m2!1sen!2sng"
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: '8px' }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
