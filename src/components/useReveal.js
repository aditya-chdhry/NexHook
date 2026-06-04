import { useEffect } from 'react';

export default function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.rev');
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    els.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('vis');
      else obs.observe(el);
    });
    return () => obs.disconnect();
  });
}
