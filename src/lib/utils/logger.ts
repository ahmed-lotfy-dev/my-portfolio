/**
 * Logger utility for development and production environments
 * Prevents console.log pollution in production while maintaining error tracking
 */

type LogLevel = "info" | "warn" | "error" | "debug";

const isDevelopment = process.env.NODE_ENV === "development";

export const logger = {
  /**
   * Log informational messages (development only)
   */
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.log("[INFO]", ...args);
    }
  },

  /**
   * Log warning messages (development only)
   */
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn("[WARN]", ...args);
    }
  },

  /**
   * Log error messages (always logged, can be sent to error tracking service)
   */
  error: (...args: any[]) => {
    console.error("[ERROR]", ...args);
    // TODO: In production, send to error tracking service (Sentry, LogRocket, etc.)
    // if (!isDevelopment) {
    //   Sentry.captureException(args[0])
    // }
  },

  /**
   * Log debug messages (development only)
   */
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug("[DEBUG]", ...args);
    }
  },
};
