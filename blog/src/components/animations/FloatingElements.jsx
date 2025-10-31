import { useEffect, useRef } from 'react';
import './FloatingElements.css';

const FloatingElements = ({ count = 20, colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe'] }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear existing elements
    container.innerHTML = '';

    // Create floating elements
    for (let i = 0; i < count; i++) {
      const element = document.createElement('div');
      element.className = 'floating-element';
      
      // Random properties
      const size = Math.random() * 100 + 50;
      const left = Math.random() * 100;
      const animationDuration = Math.random() * 20 + 10;
      const delay = Math.random() * 5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      element.style.width = `${size}px`;
      element.style.height = `${size}px`;
      element.style.left = `${left}%`;
      element.style.animationDuration = `${animationDuration}s`;
      element.style.animationDelay = `${delay}s`;
      element.style.background = `radial-gradient(circle, ${color}40, transparent)`;
      
      container.appendChild(element);
    }
  }, [count, colors]);

  return <div ref={containerRef} className="floating-elements-container" />;
};

export default FloatingElements;
