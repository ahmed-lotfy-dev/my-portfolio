import { useState, useEffect } from 'react';

/**
 * Hook to detect if code is running on client
 * Returns false during SSR, true after hydration
 * 
 * Useful for:
 * - Conditionally rendering client-only features
 * - Avoiding hydration mismatches
 * - Safely accessing browser APIs
 * 
 * @example
 * const isClient = useIsClient();
 * 
 * if (!isClient) return <Skeleton />;
 * return <ClientOnlyComponent />;
 */
export function useIsClient(): boolean {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This only runs on client after hydration
    setIsClient(true);
  }, []);

  return isClient;
}
