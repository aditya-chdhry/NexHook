import { useState, useEffect, useRef } from 'react';
import './Process.css';

const STEPS = [
  { n:'01', title:'Discovery Call',      desc:'30-min call to understand your goals, audience, and budget before we write a single line of code.' },
  { n:'02', title:'Strategy & Proposal', desc:'Detailed scope doc with tech stack, timeline, and fixed pricing. No hidden costs ever.' },
  { n:'03', title:'Design',              desc:'Wireframes then hi-fi mockups in Figma. We iterate until you love it before building anything.' },
  { n:'04', title:'Development',         desc:'Clean, documented code with weekly demos. You\'re never left wondering what\'s happening.' },
  { n:'05', title:'Testing & QA',        desc:'Cross-device, cross-browser testing. We break it ourselves so users never do.' },
  { n:'06', title:'Launch & Support',    desc:'Smooth go-live, training, and ongoing support so you scale with confidence.' },
];

export default function Process() {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.index);
            setActiveStep(idx);
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0.1 }
    );

    stepRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="section-wrap-alt" id="process">
      <div className="eyebrow rev">How It Works</div>
      <h2 className="sec-title rev">Our <span>6-Step Delivery</span> Process</h2>
      <p className="sec-sub rev">No surprises. No missed deadlines. Just a clear, repeatable process that gets you live on time.</p>

      <div className="proc-timeline">
        {/* Vertical line */}
        <div className="proc-line">
          <div
            className="proc-line-fill"
            style={{ height: `${((activeStep) / (STEPS.length - 1)) * 100}%` }}
          />
        </div>

        {STEPS.map((s, i) => (
          <div
            className={`proc-tl-step${i <= activeStep ? ' active' : ''}`}
            key={s.n}
            ref={(el) => (stepRefs.current[i] = el)}
            data-index={i}
          >
            <div className="proc-tl-marker">
              <span className="proc-tl-num">{s.n}</span>
            </div>
            <div className="proc-tl-content">
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
