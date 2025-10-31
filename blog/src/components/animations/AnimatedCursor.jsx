import { useEffect, useRef, useState } from 'react';

// AnimatedCursor - lightweight custom cursor with a dot and a trailing ring
// - Disables itself on touch devices and when prefers-reduced-motion is set
// - Enlarges on interactive elements (links, buttons, tabs, action buttons)
// - Subtle click pulse
export default function AnimatedCursor({ color = '255, 255, 255', ringColor = '102, 126, 234' }) {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const rafId = useRef(0);
  const [enabled, setEnabled] = useState(true);
  const [isHover, setIsHover] = useState(false);
  const [isDown, setIsDown] = useState(false);

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (isTouch || mq.matches) {
      setEnabled(false);
      return;
    }

    const move = (e) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }
    };

    const down = () => setIsDown(true);
    const up = () => setIsDown(false);

    const hoverTargets = 'a, button, [role="button"], .tab, .mod-btn, .btn, .header-btn, .btn-create, .btn-post-action';
    const onOver = (e) => {
      if (e.target.closest(hoverTargets)) setIsHover(true);
    };
    const onOut = (e) => {
      if (e.target.closest(hoverTargets)) setIsHover(false);
    };

    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mousedown', down, { passive: true });
    window.addEventListener('mouseup', up, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mouseout', onOut, { passive: true });

    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.15;
      ring.current.y += (pos.current.y - ring.current.y) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`;
        ringRef.current.style.opacity = '1';
      }
      rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mouseout', onOut);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="animated-cursor" aria-hidden="true">
      <div
        ref={ringRef}
        className={`cursor-ring${isHover ? ' is-hover' : ''}${isDown ? ' is-down' : ''}`}
        style={{
          borderColor: `rgba(${ringColor}, 0.8)`,
          boxShadow: `0 0 20px 2px rgba(${ringColor}, 0.25)`,
        }}
      />
      <div
        ref={dotRef}
        className={`cursor-dot${isDown ? ' is-down' : ''}`}
        style={{ backgroundColor: `rgba(${color}, 1)` }}
      />
    </div>
  );
}
