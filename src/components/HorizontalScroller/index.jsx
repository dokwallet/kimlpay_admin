import React, { useRef } from 'react';
import s from './HorizontalScroller.module.css';

const HorizontalScroller = ({ children }) => {
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const animationFrame = useRef(null); // Reference for the animation frame

  // Function to update the scroll position smoothly
  const updateScroll = x => {
    const walk = (x - startX.current) * 2;
    containerRef.current.scrollLeft = scrollLeft.current - walk;
    animationFrame.current = requestAnimationFrame(() => updateScroll(x)); // Continue animation
  };

  // Start dragging
  const onMouseDown = event => {
    isDragging.current = true;
    startX.current = event.clientX;
    scrollLeft.current = containerRef.current.scrollLeft;
  };

  // During dragging, update scroll
  const onMouseMove = event => {
    if (!isDragging.current) return;
    const x = event.clientX;
    cancelAnimationFrame(animationFrame.current); // Cancel previous frame if still active
    updateScroll(x); // Start a new animation frame
  };

  // End dragging
  const onMouseUp = () => {
    isDragging.current = false;
    cancelAnimationFrame(animationFrame.current); // Cancel animation when dragging ends
  };

  // Prevent dragging when leaving the area
  const onMouseLeave = () => {
    isDragging.current = false;
    cancelAnimationFrame(animationFrame.current); // Cancel animation when leaving
  };

  return (
    <div
      className={s.scrollContainer}
      ref={containerRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}>
      {children}
    </div>
  );
};

export default HorizontalScroller;
