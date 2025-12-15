/**
 * Client-side admin authorization hook
 * Provides reusable admin check with automatic error notifications
 */

"use client";

import { authClient } from "@/src/lib/auth-client";
import { notify } from "@/src/lib/utils/toast";

interface UseAdminCheckReturn {
  /** Whether the current user is an admin */
  isAdmin: boolean;
  /** Whether session is still loading */
  isLoading: boolean;
  /** 
   * Check if user is admin and show error toast if not
   * Returns true if admin, false otherwise
   * Useful for early-return patterns in event handlers
   */
  requireAdmin: (customMessage?: string) => boolean;
}

/**
 * Hook for client-side admin authorization checks
 * 
 * @returns Object with isAdmin flag and requireAdmin function
 * 
 * @example Simple usage
 * ```tsx
 * const { isAdmin } = useAdminCheck();
 * 
 * return (
 *   <div>
 *     {isAdmin && <Button>Admin Only Action</Button>}
 *   </div>
 * );
 * ```
 * 
 * @example With requireAdmin helper
 * ```tsx
 * const { requireAdmin } = useAdminCheck();
 * 
 * const handleDelete = async (id: string) => {
 *   if (!requireAdmin()) return; // Shows toast and returns if not admin
 *   
 *   // Proceed with deletion
 *   await deleteAction(id);
 * };
 * ```
 */
export function useAdminCheck(): UseAdminCheckReturn {
  const { data: session, isPending } = authClient.useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const requireAdmin = (customMessage?: string): boolean => {
    if (!isAdmin) {
      notify(
        customMessage || "You have no privileges to perform this action",
        false
      );
      return false;
    }
    return true;
  };

  return {
    isAdmin,
    isLoading: isPending,
    requireAdmin,
  };
}
