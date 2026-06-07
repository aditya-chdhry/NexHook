import { useState, useEffect } from 'react';
import { addLeadFromForm } from '../admin/adminData';
import './AuditModal.css';

const FORMSPREE_ID = 'xdaydolg';

export default function AuditModal({ isOpen, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', service: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  // Escape key handler to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  /* ── Validation helpers ── */
  const validateName = (val) => {
    if (!val.trim()) return 'Name is required';
    if (!/^[A-Za-z\s.'-]+$/.test(val)) return 'Name can only contain letters';
    if (val.trim().length < 2) return 'Name must be at least 2 characters';
    return '';
  };

  const validateEmail = (val) => {
    if (!val.trim()) return 'Email is required';
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(val)) return 'Enter a valid email (e.g. you@company.com)';
    return '';
  };

  const validatePhone = (val) => {
    if (!val.trim()) return 'Phone number is required';
    const digits = val.replace(/[\s\-+()]/g, '');
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

    const newErrors = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      phone: validatePhone(form.phone),
      company: validateCompany(form.company),
    };

    setErrors(newErrors);

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

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('audit-modal-backdrop')) {
      onClose();
    }
  };

  return (
    <div className="audit-modal-backdrop" onClick={handleBackdropClick}>
      <div className="audit-modal-container">
        <button className="audit-modal-close" onClick={onClose} aria-label="Close modal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="audit-modal-header">
          <div className="eyebrow">Free Audit Call</div>
          <h3>Book Your Free Call</h3>
          <p>Fill in your details and we'll reach out within <strong>4 hours</strong> to confirm your slot.</p>
        </div>

        {status === 'success' ? (
          <div className="success-msg">
            <div className="success-icon">🎉</div>
            <h4>We got your message!</h4>
            <p>Expect a reply from our team within 4 hours. Check your inbox (and spam folder just in case).</p>
            <button className="form-submit" style={{ marginTop: '24px' }} onClick={onClose}>Close Window</button>
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
              <textarea name="message" className="form-inp" placeholder="Describe your project, timeline, budget, or any question..." value={form.message} onChange={handleChange} rows={3} />
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
  );
}
