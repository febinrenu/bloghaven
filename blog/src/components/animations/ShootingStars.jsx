import { useEffect, useRef } from 'react';
import './ShootingStars.css';

const ShootingStars = ({ count = 10 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createStar = () => {
      const star = document.createElement('div');
      star.className = 'shooting-star';
      
      // Random starting position (top area)
      const startX = Math.random() * 100;
      const startY = Math.random() * 50;
      
      star.style.left = `${startX}%`;
      star.style.top = `${startY}%`;
      
      // Random animation duration
      const duration = Math.random() * 2 + 1;
      star.style.animationDuration = `${duration}s`;
      
      container.appendChild(star);
      
      // Remove star after animation
      setTimeout(() => {
        star.remove();
      }, duration * 1000);
    };

    // Create stars at intervals
    const interval = setInterval(() => {
      createStar();
    }, 3000 / count);

    // Initial stars
    for (let i = 0; i < count; i++) {
      setTimeout(() => createStar(), i * (3000 / count));
    }

    return () => clearInterval(interval);
  }, [count]);

  return <div ref={containerRef} className="shooting-stars-container" />;
};

export default ShootingStars;
