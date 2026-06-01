"use client";

/**
 * UpdatingStatus -- reusable inline "being updated" indicator.
 *
 * Usage:
 *   <UpdatingStatus message="Redesigning this section" />
 *   <UpdatingStatus compact />
 */
interface UpdatingStatusProps {
  message?: string;
  compact?: boolean;
}

export function UpdatingStatus({
  message = "Were working on this",
  compact = false,
}: UpdatingStatusProps) {
  if (compact) {
    return (
      <span className="updating-status updating-status--compact">
        <span className="updating-status-dot" />
        <span className="updating-status-text">Updating</span>
      </span>
    );
  }

  return (
    <div className="updating-status">
      <div className="updating-status-glow" />
      <div className="updating-status-icon">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="8" stroke="var(--color-primary)" strokeWidth="1.5" opacity="0.3" />
          <path d="M10 4V10L14 12" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <div className="updating-status-body">
        <span className="updating-status-label">Being Updated</span>
        <span className="updating-status-message">{message}</span>
      </div>
    </div>
  );
}
