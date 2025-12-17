import { useEffect, useRef } from 'react';

/**
 * Generic hook for window event listeners
 * SSR-safe - no-op on server
 * Uses ref to avoid unnecessary re-renders when handler changes
 * 
 * @param eventName - Window event name
 * @param handler - Event handler function
 * @param options - AddEventListener options
 * 
 * @example
 * useEventListener('keydown', (e) => {
 *   if (e.key === 'Escape') closeModal();
 * });
 * 
 * useEventListener('scroll', handleScroll, { passive: true });
 */
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions
) {
  // Store handler in ref to avoid re-running effect when handler changes
  const savedHandler = useRef(handler);

  // Update ref when handler changes
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    // Only runs on client
    if (typeof window === 'undefined') return;

    // Create event listener that calls the latest handler
    const eventListener = (event: WindowEventMap[K]) => {
      savedHandler.current(event);
    };

    // Add event listener
    window.addEventListener(eventName, eventListener, options);

    // Cleanup
    return () => {
      window.removeEventListener(eventName, eventListener, options);
    };
  }, [eventName, options]); // Re-run if eventName or options change
}
