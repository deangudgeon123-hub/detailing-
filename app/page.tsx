import ScrollDetail from './ScrollDetail';

const services = [
  ['Signature Detail', 'A complete exterior and interior reset with careful decontamination, deep cleaning and a refined finish.'],
  ['Paint Enhancement', 'Gloss focused machine polishing to reduce light defects and restore depth, clarity and reflection.'],
  ['Interior Detail', 'Deep cleaning across leather, plastics, trim, carpets and high touch areas with a factory fresh finish.'],
];

export default function Home() {
  return (
    <main>
      <header className="siteHeader">
        <a className="mark" href="#top" aria-label="Obsidian Auto Detail home">
          <span>O</span>
          <div><strong>OBSIDIAN</strong><small>AUTO DETAIL</small></div>
        </a>
        <nav>
          <a href="#experience">Experience</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="bookButton" href="#contact">Book a detail</a>
      </header>

      <div id="top" />
      <ScrollDetail />

      <section className="manifesto shell">
        <span className="eyebrow">THE STANDARD</span>
        <div>
          <h2>Your car should feel expensive every time you get in.</h2>
          <p>Obsidian is a concept for a detailing studio built around precision, presentation and the details that separate a quick clean from a proper finish.</p>
        </div>
      </section>

      <section className="services" id="services">
        <div className="shell servicesHead">
          <span className="eyebrow light">DETAILING SERVICES</span>
          <h2>Built around the finish.</h2>
        </div>
        <div className="shell serviceGrid">
          {services.map(([title, text], index) => (
            <article key={title}>
              <span>0{index + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
              <b>↗</b>
            </article>
          ))}
        </div>
      </section>

      <section className="quality shell">
        <div className="qualityNumber">01</div>
        <div className="qualityCopy">
          <span className="eyebrow">WHY IT FEELS DIFFERENT</span>
          <h2>No rushed jobs.<br />No missed details.</h2>
          <p>Every stage is approached deliberately, from the first rinse through to the final wipe down. The goal is not just a cleaner car. It is a finish that changes how the car feels.</p>
        </div>
        <div className="qualityList">
          <div><span>01</span><p>Paint safe wash process</p></div>
          <div><span>02</span><p>Professional grade products</p></div>
          <div><span>03</span><p>Interior and exterior precision</p></div>
          <div><span>04</span><p>Finish inspected before handover</p></div>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="contactGlow" />
        <div className="shell contactInner">
          <span className="eyebrow light">READY WHEN YOU ARE</span>
          <h2>Make the car feel<br />new again.</h2>
          <p>Tell us what you drive and what level of finish you are looking for.</p>
          <a href="mailto:hello@example.com">Request a booking <span>↗</span></a>
        </div>
      </section>

      <footer className="footer shell">
        <div className="mark footerMark">
          <span>O</span>
          <div><strong>OBSIDIAN</strong><small>AUTO DETAIL</small></div>
        </div>
        <p>Premium automotive detailing concept.</p>
        <span>Concept · 2026</span>
      </footer>
    </main>
  );
}
