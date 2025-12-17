import { useState, useEffect } from 'react';

/**
 * Hook to track window scroll position
 * SSR-safe - returns 0 on server
 * Uses passive event listener for better performance
 * 
 * @example
 * const scrollY = useScrollPosition();
 * const isScrolled = scrollY > 100;
 */
export function useScrollPosition(): number {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    // Only runs on client
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    // Set initial position
    handleScroll();

    // Add passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollPosition;
}
