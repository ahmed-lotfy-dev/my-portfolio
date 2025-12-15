/**
 * Server-side authentication middleware utilities
 * Centralizes admin authorization checks across server actions
 */

import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";

/**
 * Standard error response for unauthorized access
 * Optional error field for validation errors
 */
export type AuthErrorResponse = {
  isAuthorized: false;
  success: false;
  message: string;
  error?: any; // Optional, for validation errors
};

/**
 * Successful authorization result
 */
export type AuthSuccessResponse = {
  isAuthorized: true;
  user: any;
};

/**
 * Combined authorization result type
 */
export type AuthResult = AuthSuccessResponse | AuthErrorResponse;

/**
 * Checks if the current user has ADMIN role
 * Returns standardized error response if not authorized
 * 
 * @param customMessage - Optional custom error message
 * @returns Authorization result with user data or error
 * 
 * @example
 * ```ts
 * export async function deleteProject(id: string) {
 *   const authResult = await requireAdmin();
 *   if (!authResult.isAuthorized) {
 *     return authResult; // Returns error response
 *   }
 *   
 *   const user = authResult.user;
 *   // ... proceed with deletion
 * }
 * ```
 */
export async function requireAdmin(
  customMessage?: string
): Promise<AuthResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (user?.role !== "ADMIN") {
    return {
      isAuthorized: false,
      success: false,
      message: customMessage || "You don't have privilege to perform this action.",
    };
  }

  return {
    isAuthorized: true,
    user,
  };
}

/**
 * Type guard to check if auth result is successful
 */
export function isAuthorized(
  result: AuthResult
): result is AuthSuccessResponse {
  return "isAuthorized" in result && result.isAuthorized === true;
}
