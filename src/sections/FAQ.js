import { useState } from 'react';
import './FAQ.css';

const FAQS = [
  {
    q: 'How long does a typical website project take?',
    a: 'A standard 5–10 page business website takes 2–3 weeks. A custom web app or e-commerce store typically takes 6–10 weeks. We give you an exact timeline in the proposal, and we stick to it.',
    related: [
      { q: 'What if I need the project done urgently?', a: 'We offer expedited delivery for an additional fee. Depending on scope, we can fast-track projects to deliver within 1–2 weeks with a dedicated team.' },
      { q: 'Do you work on weekends to meet deadlines?', a: 'When needed, yes. Our team is flexible and committed to meeting every deadline we agree upon — no excuses.' },
      { q: 'What happens if you miss the deadline?', a: 'It rarely happens, but if we do, we offer a discount on the final invoice. We hold ourselves accountable to every timeline we commit to.' },
      { q: 'Can I track the progress of my project?', a: 'Absolutely. We share a project board (Notion/Trello) with you where you can see real-time progress, milestones, and upcoming tasks.' },
      { q: 'How many revisions are included?', a: 'We include 2–3 rounds of revisions at each milestone. We make sure you are 100% happy before moving to the next phase.' },
    ],
  },
  {
    q: 'Do I get the full source code after delivery?',
    a: 'Yes, always. You own 100% of the code, design files, and all assets. We hand over everything via GitHub or a zipped folder — your choice.',
    related: [
      { q: 'Can I hire another developer to continue the work?', a: 'Yes, the code is fully yours. We write clean, well-documented code so any developer can pick it up and continue without issues.' },
      { q: 'Do you use any proprietary tools I can\'t access?', a: 'No. We use industry-standard open-source technologies. You will never be locked into any tool or platform that you don\'t control.' },
      { q: 'Will you help with hosting and deployment?', a: 'Yes, we handle deployment to your preferred hosting platform (Vercel, AWS, DigitalOcean, etc.) and guide you through managing it.' },
      { q: 'Do you provide documentation for the code?', a: 'Every project comes with a README and inline documentation. For complex projects, we also provide a short walkthrough video explaining the codebase.' },
    ],
  },
  {
    q: "What's your payment structure?",
    a: 'We work on a 50% upfront, 50% on delivery model for most projects. For larger projects (₹2L+) we offer milestone-based payments. No surprise invoices.',
    related: [
      { q: 'Do you accept international payments?', a: 'Yes, we accept payments via Wise, PayPal, Stripe, and bank transfers in USD, GBP, EUR, and INR.' },
      { q: 'Can I pay in installments for large projects?', a: 'Absolutely. For projects above ₹2L, we break payments into 3–4 milestones so you pay as we deliver.' },
      { q: 'Is there a refund policy?', a: 'We offer a full refund if we haven\'t started development. After work begins, refunds are prorated based on the work completed.' },
      { q: 'Do you charge for initial consultation?', a: 'No, the initial consultation and project scoping call is completely free. You only pay once we agree on the scope and you decide to move forward.' },
      { q: 'Are there any hidden costs?', a: 'Never. Our proposal includes everything — design, development, testing, deployment. We clearly mention if anything (like hosting or domain) is extra.' },
    ],
  },
  {
    q: 'Do you provide support after the project launches?',
    a: 'Every project includes a 30-day free support window after launch. We also offer retainer plans for ongoing maintenance, updates, and new feature development.',
    related: [
      { q: 'What does the 30-day support cover?', a: 'Bug fixes, minor text/image changes, and any issues that arise from the original scope. It does not cover new feature development.' },
      { q: 'How much do retainer plans cost?', a: 'Retainer plans start at ₹15,000/month for basic maintenance and go up based on the hours and scope of work you need.' },
      { q: 'Can I reach you for emergencies after hours?', a: 'Yes, retainer clients get priority support with a dedicated WhatsApp line for urgent issues that need immediate attention.' },
      { q: 'Do you handle server and hosting maintenance?', a: 'Yes, we can manage your servers, handle updates, SSL renewals, backups, and security patches as part of the retainer plan.' },
    ],
  },
  {
    q: 'Can I see the design before you build anything?',
    a: 'Absolutely. We always design first in Figma, share a clickable prototype, and only move to development once you\'re completely happy with how it looks and flows.',
    related: [
      { q: 'What tools do you use for design?', a: 'We primarily use Figma for UI/UX design. For branding and illustrations, we use Adobe Illustrator and Photoshop.' },
      { q: 'Can I request changes to the design?', a: 'Of course. We include 2–3 revision rounds in the design phase. We iterate until you love every pixel.' },
      { q: 'Do you do user research before designing?', a: 'For larger projects, yes. We study your target audience, competitors, and industry trends to create designs that actually convert.' },
      { q: 'Will the design be mobile-responsive?', a: 'Always. Every design we create is fully responsive across desktop, tablet, and mobile devices from day one.' },
      { q: 'Can I provide my own design for development?', a: 'Yes, if you already have a Figma/Sketch/XD file, we can directly start development from your design. We\'ll review it and suggest improvements if needed.' },
      { q: 'Do you create brand identity and logos too?', a: 'Yes, we offer complete brand identity packages including logo design, color palette, typography, and brand guidelines.' },
    ],
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);
  const [openSub, setOpenSub] = useState({});

  const toggle = (i) => {
    setOpen(open === i ? null : i);
    // Reset sub-questions when closing a main question
    if (open === i) setOpenSub({});
  };

  const toggleSub = (parentIdx, subIdx) => {
    const key = `${parentIdx}-${subIdx}`;
    setOpenSub((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section className="section-wrap-alt" id="faq" style={{ textAlign: 'center' }}>
      <div className="eyebrow rev" style={{ justifyContent: 'center' }}>FAQ</div>
      <h2 className="sec-title rev" style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>Questions We <span>Get Asked</span> Most</h2>
      <div className="faq-list">
        {FAQS.map((f, i) => (
          <div className={`faq-item ${open === i ? 'open' : ''}`} key={i}>
            <button className="faq-q" onClick={() => toggle(i)}>
              {f.q}
              <span className="faq-icon">{open === i ? '−' : '+'}</span>
            </button>
            <div className="faq-body">
              <p>{f.a}</p>

              {/* Related questions */}
              {f.related && f.related.length > 0 && (
                <div className="faq-related">
                  <div className="faq-related-label">Related Questions</div>
                  {f.related.map((sub, j) => {
                    const isSubOpen = openSub[`${i}-${j}`];
                    return (
                      <div className={`faq-sub-item ${isSubOpen ? 'open' : ''}`} key={j}>
                        <button className="faq-sub-q" onClick={() => toggleSub(i, j)}>
                          {sub.q}
                          <span className="faq-sub-icon">{isSubOpen ? '−' : '+'}</span>
                        </button>
                        <div className="faq-sub-body">
                          <p>{sub.a}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
