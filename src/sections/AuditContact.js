import { useState, useEffect, useRef } from 'react';
import { addLeadFromForm } from '../admin/adminData';
import './AuditContact.css';

/*
  ╔══════════════════════════════════════════════════════════════╗
  ║         HOW TO RECEIVE FORM DATA IN YOUR EMAIL               ║
  ╠══════════════════════════════════════════════════════════════╣
  ║  1. Go to https://formspree.io  → Sign up FREE               ║
  ║  2. Click "+ New Form"                                        ║
  ║  3. Enter YOUR email address                                  ║
  ║  4. Copy the Form ID  (looks like: xpwzabcd)                 ║
  ║  5. Replace  YOUR_FORM_ID  below  with that ID               ║
  ║                                                              ║
  ║  ✅ Done! Every submission will land in your inbox.           ║
  ║                                                              ║
  ║  GOOGLE SHEETS (optional):                                    ║
  ║  Connect Formspree → Google Sheets via Zapier (free tier)    ║
  ║  zapier.com  →  Trigger: Formspree  →  Action: Google Sheets ║
  ╚══════════════════════════════════════════════════════════════╝
*/
const FORMSPREE_ID = 'xdaydolg';

const AUDIT_POINTS = [
  { icon: '🔍', title: 'Website & SEO Audit',   desc: "We'll analyse your site speed, SEO health, and UX gaps live on the call." },
  { icon: '📊', title: 'Competitor Analysis',   desc: 'See exactly what your top 3 competitors are doing better and how to beat them.' },
  { icon: '🗺️', title: 'Clear Action Plan',     desc: 'Walk away with a prioritised roadmap — even if you don\'t work with us.' },
  { icon: '💬', title: 'Have a Query? Just Ask', desc: 'Not ready for an audit? Use the form to ask anything. We reply within 4 hours.' },
];

export default function AuditContact() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', company:'', service:'', message:'' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const [activePt, setActivePt] = useState(0);
  const ptRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.index);
            setActivePt(idx);
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0.1 }
    );

    ptRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  /* ── Validation helpers ── */
  const validateName = (val) => {
    if (!val.trim()) return 'Name is required';
    if (!/^[A-Za-z\s.'-]+$/.test(val)) return 'Name can only contain letters';
    if (val.trim().length < 2) return 'Name must be at least 2 characters';
    return '';
  };

  const validateEmail = (val) => {
    if (!val.trim()) return 'Email is required';
    // Must have valid format with a proper domain (at least one dot after @)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(val)) return 'Enter a valid email (e.g. you@company.com)';
    return '';
  };

  const validatePhone = (val) => {
    if (!val.trim()) return 'Phone number is required';
    // Strip spaces, dashes, +91 prefix
    const digits = val.replace(/[\s\-+()]/g, '');
    // If starts with 91 and has 12 digits, or just 10 digits
    const cleaned = digits.startsWith('91') && digits.length === 12 ? digits.slice(2) : digits;
    if (!/^\d{10}$/.test(cleaned)) return 'Enter a valid 10-digit phone number';
    return '';
  };

  const validateCompany = (val) => {
    if (!val.trim()) return 'Company name is required';
    return '';
  };

  /* ── Input handlers with real-time filtering ── */
  const handleNameChange = (e) => {
    const val = e.target.value;
    // Only allow letters, spaces, dots, hyphens, apostrophes
    if (val === '' || /^[A-Za-z\s.'-]*$/.test(val)) {
      setForm({ ...form, name: val });
      if (errors.name) setErrors({ ...errors, name: '' });
    }
  };

  const handleEmailChange = (e) => {
    setForm({ ...form, email: e.target.value });
    if (errors.email) setErrors({ ...errors, email: '' });
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value;
    // Only allow digits, spaces, +, -, ()
    if (val === '' || /^[\d\s+\-()]*$/.test(val)) {
      setForm({ ...form, phone: val });
      if (errors.phone) setErrors({ ...errors, phone: '' });
    }
  };

  const handleCompanyChange = (e) => {
    setForm({ ...form, company: e.target.value });
    if (errors.company) setErrors({ ...errors, company: '' });
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  /* ── Blur validation (show error when user leaves field) ── */
  const handleBlur = (field) => {
    let err = '';
    if (field === 'name') err = validateName(form.name);
    if (field === 'email') err = validateEmail(form.email);
    if (field === 'phone') err = validatePhone(form.phone);
    if (field === 'company') err = validateCompany(form.company);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      phone: validatePhone(form.phone),
      company: validateCompany(form.company),
    };

    setErrors(newErrors);

    // If any errors, don't submit
    if (Object.values(newErrors).some(err => err)) return;

    setStatus('loading');
    const formData = new FormData(e.target);

    try {
      // 1. Wait only for local DB save
      await addLeadFromForm({
        name:    form.name,
        email:   form.email,
        phone:   form.phone,
        company: form.company,
        service: form.service,
        message: form.message,
      });

      // 2. Submit to Formspree in the background (non-blocking)
      fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData,
      }).catch(err => {
        console.error('Background Formspree submission failed:', err);
      });

      setStatus('success');
      setForm({ name: '', email: '', phone: '', company: '', service: '', message: '' });
      setErrors({});
    } catch (err) {
      console.error('Lead database save failed, attempting background Formspree recovery:', err);
      
      // Fallback: Send to Formspree even if DB save fails
      fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData,
      }).catch(fErr => {
        console.error('Background Formspree recovery failed:', fErr);
      });

      setStatus('success');
      setForm({ name: '', email: '', phone: '', company: '', service: '', message: '' });
      setErrors({});
    }
  };

  return (
    <section className="section-wrap" id="audit">
      <div className="audit-wrap">

        {/* Left — value props / vertical timeline */}
        <div className="audit-left">
          <div className="eyebrow rev">Free Audit Call</div>
          <h2 className="sec-title rev">Book a <span>Free 30-Min</span><br />Strategy Call</h2>
          <p className="sec-sub rev">
            No sales pressure. Just an honest look at your current digital presence
            and a clear action plan to improve it.
          </p>

          <div className="audit-timeline-container">
            {/* Left timeline vertical line */}
            <div className="audit-timeline-line">
              <div
                className="audit-timeline-fill"
                style={{ height: `${((activePt) / (AUDIT_POINTS.length - 1)) * 100}%` }}
              />
            </div>

            <div className="audit-points">
              {AUDIT_POINTS.map((pt, i) => (
                <div
                  className={`audit-pt${i <= activePt ? ' active' : ''}`}
                  key={pt.title}
                  ref={(el) => (ptRefs.current[i] = el)}
                  data-index={i}
                >
                  <div className="audit-ico">
                    <span>{pt.icon}</span>
                  </div>
                  <div className="audit-pt-content">
                    <h4>{pt.title}</h4>
                    <p>{pt.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div className="audit-form-box rev d2">
          <h3>Book Your Free Call / Send a Query</h3>
          <p>Fill in your details and we'll reach out within <strong>4 hours</strong> to confirm your slot.</p>

          {status === 'success' ? (
            <div className="success-msg">
              <div className="success-icon">🎉</div>
              <h4>We got your message!</h4>
              <p>Expect a reply from our team within 4 hours. Check your inbox (and spam folder just in case).</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-row-2">
                <div className="fg">
                  <label>Full Name *</label>
                  <input
                    name="name"
                    type="text"
                    className={`form-inp${errors.name ? ' inp-error' : ''}`}
                    placeholder="Rahul Sharma"
                    value={form.name}
                    onChange={handleNameChange}
                    onBlur={() => handleBlur('name')}
                    required
                  />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>
                <div className="fg">
                  <label>Email Address *</label>
                  <input
                    name="email"
                    type="email"
                    className={`form-inp${errors.email ? ' inp-error' : ''}`}
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={handleEmailChange}
                    onBlur={() => handleBlur('email')}
                    required
                  />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>
              </div>
              <div className="form-row-2">
                <div className="fg">
                  <label>Phone / WhatsApp *</label>
                  <input
                    name="phone"
                    type="tel"
                    className={`form-inp${errors.phone ? ' inp-error' : ''}`}
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={handlePhoneChange}
                    onBlur={() => handleBlur('phone')}
                    required
                    maxLength={15}
                  />
                  {errors.phone && <span className="field-error">{errors.phone}</span>}
                </div>
                <div className="fg">
                  <label>Company / Brand *</label>
                  <input
                    name="company"
                    type="text"
                    className={`form-inp${errors.company ? ' inp-error' : ''}`}
                    placeholder="Your Company"
                    value={form.company}
                    onChange={handleCompanyChange}
                    onBlur={() => handleBlur('company')}
                    required
                  />
                  {errors.company && <span className="field-error">{errors.company}</span>}
                </div>
              </div>
              <div className="fg">
                <label>What do you need? *</label>
                <select name="service" className="form-inp" value={form.service} onChange={handleChange} required>
                  <option value="" disabled>Select a service</option>
                  <option>Video Editing</option>
                  <option>Graphic Designing</option>
                  <option>Social Media Management</option>
                  <option>Website Development</option>
                  <option>Mobile App</option>
                  <option>E-Commerce Store</option>
                  <option>SaaS / Web App</option>
                  <option>UI/UX Design</option>
                  <option>SEO &amp; Growth</option>
                  <option>Free Audit Call</option>
                  <option>Other / Just a Query</option>
                </select>
              </div>
              <div className="fg">
                <label>Tell us more</label>
                <textarea name="message" className="form-inp" placeholder="Describe your project, timeline, budget, or any question..." value={form.message} onChange={handleChange} rows={4} />
              </div>

              <input type="hidden" name="_subject" value="🚀 New NexHook Lead / Audit Request" />

              <button
                type="submit"
                className="form-submit"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Sending…' : 'Send Message & Book Call →'}
              </button>

              {status === 'error' && (
                <p className="form-error">Something went wrong. Please try again or email us directly.</p>
              )}
              <p className="form-note">🔒 Your details are safe. We never share your data. Ever.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
