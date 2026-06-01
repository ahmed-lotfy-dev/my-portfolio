"use client";

/**
 * Full-screen maintenance mode page.
 * Shown when FEATURE_FLAGS contains {"maintenance":true}.
 *
 * Design: Atmospheric, on-brand with the Emile Kwalski dark warm theme.
 * Not an error -- a deliberate pause. Like a workshop with the door closed.
 */
export default function MaintenancePage() {
  return (
    <div className="maintenance-page">
      {/* Ambient background orbs */}
      <div className="maintenance-ambient">
        <div className="maintenance-orb maintenance-orb-1" />
        <div className="maintenance-orb maintenance-orb-2" />
        <div className="maintenance-orb maintenance-orb-3" />
      </div>

      {/* Content */}
      <div className="maintenance-content">
        {/* Icon */}
        <div className="maintenance-icon">
          <div className="maintenance-icon-pulse" />
          <div className="maintenance-icon-inner">
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="26" cy="26" r="24" stroke="var(--color-primary)" strokeWidth="1" opacity="0.15" />
              <circle cx="26" cy="26" r="18" stroke="var(--color-primary)" strokeWidth="1" opacity="0.1" />
              <path d="M26 16V28L32 32" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              <circle cx="26" cy="26" r="3" fill="var(--color-primary)" opacity="0.9" />
              <circle cx="26" cy="26" r="1.5" fill="var(--color-background)" />
              {/* Gear marks */}
              <line x1="26" y1="10" x2="26" y2="14" stroke="var(--color-primary)" strokeWidth="1" opacity="0.2" />
              <line x1="26" y1="38" x2="26" y2="42" stroke="var(--color-primary)" strokeWidth="1" opacity="0.2" />
              <line x1="10" y1="26" x2="14" y2="26" stroke="var(--color-primary)" strokeWidth="1" opacity="0.2" />
              <line x1="38" y1="26" x2="42" y2="26" stroke="var(--color-primary)" strokeWidth="1" opacity="0.2" />
            </svg>
          </div>
        </div>

        <h1 className="maintenance-title">Were Working On It</h1>
        <p className="maintenance-subtitle">
          Were upgrading our systems to serve you better.
          <br />
          All your data is safe. Check back shortly.
        </p>

        {/* Progress bar */}
        <div className="maintenance-progress">
          <div className="maintenance-progress-bar">
            <div className="maintenance-progress-fill" />
          </div>
          <span className="maintenance-progress-label">Estimated time: a few minutes</span>
        </div>

        {/* Footer signature */}
        <div className="maintenance-footer">
          <div className="maintenance-signature">
            <span className="maintenance-footer-dot" />
            <span className="maintenance-footer-text">Ahmed Shoman</span>
            <span className="maintenance-footer-separator" />
            <span className="maintenance-footer-text">Full-Stack Engineer</span>
          </div>
        </div>
      </div>
    </div>
  );
}
