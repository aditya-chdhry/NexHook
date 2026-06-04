import { useEffect, useRef } from 'react';

export default function Cursor() {
  const curRef  = useRef(null);
  const ringRef = useRef(null);
  const pos     = useRef({ cx:0, cy:0, rx:0, ry:0 });
  const raf     = useRef(null);

  useEffect(() => {
    const c = curRef.current;
    const r = ringRef.current;
    if (!c || !r) return;

    const move = (e) => {
      pos.current.cx = e.clientX;
      pos.current.cy = e.clientY;
      c.style.left = e.clientX + 'px';
      c.style.top  = e.clientY + 'px';
    };

    const loop = () => {
      pos.current.rx += (pos.current.cx - pos.current.rx) * 0.12;
      pos.current.ry += (pos.current.cy - pos.current.ry) * 0.12;
      r.style.left = pos.current.rx + 'px';
      r.style.top  = pos.current.ry + 'px';
      raf.current = requestAnimationFrame(loop);
    };

    document.addEventListener('mousemove', move);
    raf.current = requestAnimationFrame(loop);

    const grow = () => { c.style.width='18px'; c.style.height='18px'; r.style.width='50px'; r.style.height='50px'; };
    const shrink = () => { c.style.width='9px'; c.style.height='9px'; r.style.width='32px'; r.style.height='32px'; };

    const attachHover = () => {
      document.querySelectorAll('a, button, .port-card, .team-card, .svc-card, .review-card')
        .forEach(el => { el.addEventListener('mouseenter', grow); el.addEventListener('mouseleave', shrink); });
    };
    attachHover();
    const mo = new MutationObserver(attachHover);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', move);
      cancelAnimationFrame(raf.current);
      mo.disconnect();
    };
  }, []);

  return (
    <>
      <div className="cursor" ref={curRef} />
      <div className="cursor-ring" ref={ringRef} />
    </>
  );
}
