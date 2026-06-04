import { useState } from 'react';
import './Team.css';

const TEAM = [
  { img:'/images/aditya.jpg', name:'Aditya Chaudhary',   role:'Founder & CEO',          bio:'Builds and ships digital products with a strong focus on execution, clarity, and scalability. Leads NexHook with a product-first mindset — turning ideas into structured, high-performing solutions without unnecessary complexity. Focused on delivering real business outcomes through clean systems, smart architecture, and fast iteration.', skills:['React','Node.js','Product Strategy','System Design','Growth Thinking'], grad:'linear-gradient(135deg,#2459e7,#1e3fa8)', li:'https://www.linkedin.com/in/aditya-chdhry', tw:'https://www.x.com/adityaachdhry' },
  { img:'/images/devansh.jpg', name:'Devansh Awasthi',    role:'Lead UI/UX Designer',    bio:'Designs interfaces that are not just visually clean but built for usability and conversion. Focuses on creating intuitive user journeys backed by research, wireframing, and rapid prototyping. Believes great design is simple, purposeful, and measurable.', skills:['Figma','Prototyping','User Flows','Design Systems','UX Research'], grad:'linear-gradient(135deg,#0e40c4,#1e3fa8)', li:'https://www.linkedin.com/in/devansh-awasthi-74526422b' },
  { img:'/images/harsh.jpg', name:'Harsh Upadhyay',    role:'Mobile App Developer',   bio:'Builds high-performance mobile applications with smooth UI and efficient architecture. Focuses on clean code, seamless user experience, and scalable app structure. Works on delivering apps that feel fast, responsive, and reliable from the first interaction.', skills:['Flutter','React Native','Firebase','API Integration','Performance Optimization'], grad:'linear-gradient(135deg,#1e6bff,#0e40c4)', li:'https://www.linkedin.com/in/harsh-upadhyay518' },
  { init:'KS', name:'Kshitij Sahu',  role:'Backend Engineer',       bio:'Designs robust backend systems that are secure, scalable, and efficient. Focuses on building APIs and databases that handle real-world load with consistency. Ensures every product has a strong technical foundation behind the scenes.', skills:['Node.js','PostgreSQL','REST APIs','AWS','System Architecture'], grad:'linear-gradient(135deg,#0a30a8,#06205c)', li:'#' },
  { img:'/images/arun.jpg', name:'Arun Parashar',    role:'SEO & Growth Lead',      bio:'Drives growth through data, search visibility, and conversion-focused strategies. Works on building strong digital presence from the ground up — from technical SEO to content systems that rank and convert. Focused on measurable growth, not vanity metrics.', skills:['Google Search Console','Google Analytics','Technical SEO','Keyword Research','On-Page SEO','Content Strategy','Ahrefs / SEMrush'], grad:'linear-gradient(135deg,#2952d9,#1a3cb0)', li:'https://www.linkedin.com/in/arun-parashar-847672266/' },
];

export default function Team() {
  const [lightbox, setLightbox] = useState(null);

  const openLightbox = (member) => {
    if (member.img) {
      setLightbox(member);
      document.body.style.overflow = 'hidden';
    }
  };

  const closeLightbox = () => {
    setLightbox(null);
    document.body.style.overflow = '';
  };

  return (
    <section className="section-wrap" id="team">
      <div className="eyebrow rev">The People</div>
      <h2 className="sec-title rev">Meet the <span>Team Behind</span> Your Project</h2>
      <p className="sec-sub rev">Not an agency of faceless contractors. We're a tight team of specialists — you'll know exactly who's building your product.</p>
      <div className="team-grid">
        {TEAM.map((m, i) => (
          <div className={`team-card rev d${(i % 5) + 1}`} key={m.name}>
            {m.img ? (
              <div
                className="member-av-photo"
                style={{ background: m.grad }}
                onClick={() => openLightbox(m)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && openLightbox(m)}
                title={`View ${m.name}'s photo`}
              >
                <img src={m.img} alt={m.name} className="member-photo" />
              </div>
            ) : (
              <div className="member-av" style={{ background: m.grad }}>{m.init}</div>
            )}
            <div className="member-name">{m.name}</div>
            <div className="member-role">{m.role}</div>
            <p className="member-bio">{m.bio}</p>
            <div className="member-skills-label">Skills / Tools:</div>
            <div className="member-tags">
              {m.skills.map(s => <span className="m-tag" key={s}>{s}</span>)}
            </div>
            <div className="member-socials">
              {m.li && <a href={m.li} target="_blank" rel="noopener noreferrer" className="soc-link">👔 LinkedIn</a>}
              {m.tw && <a href={m.tw} target="_blank" rel="noopener noreferrer" className="soc-link">🐦 Twitter</a>}
              {m.dr && <a href={m.dr} target="_blank" rel="noopener noreferrer" className="soc-link">🎨 Dribbble</a>}
              {m.gh && <a href={m.gh} target="_blank" rel="noopener noreferrer" className="soc-link">🐙 GitHub</a>}
            </div>
          </div>
        ))}
      </div>

      {/* Image Lightbox */}
      {lightbox && (
        <div className="team-lightbox-overlay" onClick={closeLightbox}>
          <div className="team-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox} aria-label="Close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <img src={lightbox.img} alt={lightbox.name} className="lightbox-img" />
            <div className="lightbox-info">
              <h3>{lightbox.name}</h3>
              <p>{lightbox.role}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
