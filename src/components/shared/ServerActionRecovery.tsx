"use client";

import { useEffect } from "react";

const STALE_SERVER_ACTION_MESSAGE = "Failed to find Server Action";
const RECOVERY_KEY = "server-action-recovery-attempted";

function isStaleServerActionMessage(value: unknown) {
  if (typeof value === "string") {
    return value.includes(STALE_SERVER_ACTION_MESSAGE);
  }

  if (
    value &&
    typeof value === "object" &&
    "message" in value &&
    typeof (value as { message?: unknown }).message === "string"
  ) {
    return (value as { message: string }).message.includes(
      STALE_SERVER_ACTION_MESSAGE,
    );
  }

  return false;
}

function recoverFromStaleDeployment() {
  if (typeof window === "undefined") {
    return;
  }

  const hasRetried = window.sessionStorage.getItem(RECOVERY_KEY) === "1";

  if (hasRetried) {
    window.sessionStorage.removeItem(RECOVERY_KEY);
    window.location.replace(window.location.href);
    return;
  }

  window.sessionStorage.setItem(RECOVERY_KEY, "1");
  window.location.reload();
}

export default function ServerActionRecovery() {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.sessionStorage.removeItem(RECOVERY_KEY);

    const handleWindowError = (event: ErrorEvent) => {
      if (
        isStaleServerActionMessage(event.message) ||
        isStaleServerActionMessage(event.error)
      ) {
        event.preventDefault();
        recoverFromStaleDeployment();
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (isStaleServerActionMessage(event.reason)) {
        event.preventDefault();
        recoverFromStaleDeployment();
      }
    };

    window.addEventListener("error", handleWindowError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleWindowError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return null;
}
