import '../css/about.css';

const team = [
  { name: 'Benjamin K.', title: 'Founder & CEO', emoji: '👨‍💼' },
  { name: 'Kemi A.', title: 'Operations Manager', emoji: '👩‍💼' },
  { name: 'Tunde O.', title: 'Logistics Coordinator', emoji: '👨‍🔧' },
  { name: 'Ngozi E.', title: 'Customer Relations', emoji: '👩‍💻' },
];

const differentiators = [
  'All equipment cleaned and inspected before every delivery',
  'Professional setup and takedown — you focus on your guests',
  'On-time delivery guaranteed across Lagos State',
  'Flexible packages for any budget and event size',
  'Dedicated customer support before, during, and after your event',
];

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <div className="about-hero">
        <div className="about-hero-overlay">
          <h1>About BK Option Ventures</h1>
          <p>Serving Lagos with pride since 2018</p>
        </div>
      </div>

      {/* Our Story */}
      {/*<section className="section">*/}
      {/*  <div className="container about-story">*/}
      {/*    <h2 className="section-title">Our Story</h2>*/}
      {/*    <div className="story-body">*/}
      {/*      <p>*/}
      {/*        BK Option Ventures was founded in 2018 with a simple mission: to make high-quality*/}
      {/*        event equipment accessible and affordable for every Lagos family and business.*/}
      {/*        What started as a small operation with a handful of canopies and chairs has grown*/}
      {/*        into one of the most trusted event equipment suppliers in the state.*/}
      {/*      </p>*/}
      {/*      <p>*/}
      {/*        Today we serve hundreds of clients annually — from birthday parties and weddings*/}
      {/*        to corporate retreats and community events. Our fleet now includes premium canopies,*/}
      {/*        banquet chairs, round and rectangular tables, industrial fans, and air conditioner*/}
      {/*        units, all maintained to the highest standards.*/}
      {/*      </p>*/}
      {/*      <p>*/}
      {/*        Our team understands that every event is unique. That's why we offer personalised*/}
      {/*        consultations, same-day quotes, and flexible packages tailored to your exact needs.*/}
      {/*      </p>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</section>*/}

      {/* Mission & Vision */}
      <section className="section mv-section">
        <div className="container">
          <h2 className="section-title">Mission & Vision</h2>
          <div className="mv-grid">
            <div className="mv-card">
              <div className="mv-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>
                To deliver reliable, high-quality event equipment with professional service that
                exceeds our clients' expectations, making every event a memorable success.
              </p>
            </div>
            <div className="mv-card">
              <div className="mv-icon">🌟</div>
              <h3>Our Vision</h3>
              <p>
                To be Nigeria's most trusted event equipment company, known for integrity,
                innovation, and an unwavering commitment to customer satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section why-about-section">
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>
          <ul className="differentiators">
            {differentiators.map((d, i) => (
              <li key={i}><span className="check">✓</span> {d}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
