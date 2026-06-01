"use client";

import { useState } from "react";
import { useFlags } from "@/src/providers/feature-flags";
import { UpdatingStatus } from "@/src/components/shared/UpdatingStatus";

/**
 * Feature Flags management page.
 * View and manage feature flags configured via .env.
 *
 * Design: Clean dashboard layout matching the portfolio's
 * Emile Kwalski warm-dark aesthetic.
 */
export default function FeatureFlagsPage() {
  const { flags, maintenance } = useFlags();
  const [search, setSearch] = useState("");

  const flagEntries = Object.entries(flags)
    .filter(([key]) => key.toLowerCase().includes(search.toLowerCase()))
    .sort(([a], [b]) => a.localeCompare(b));

  const activeCount = Object.values(flags).filter(Boolean).length;
  const totalCount = Object.keys(flags).length;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* Page Header */}
        <div className="ff-header">
          <div>
            <h1 className="ff-title">Feature Flags</h1>
            <p className="ff-subtitle">Control feature availability across environments</p>
          </div>
        </div>

        {/* Maintenance Banner */}
        {maintenance && (
          <div className="ff-banner ff-banner--warning">
            <div className="ff-banner-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="var(--color-primary)" strokeWidth="1.5" />
                <path d="M10 6V11" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="10" cy="14" r="1" fill="var(--color-primary)" />
              </svg>
            </div>
            <div className="ff-banner-content">
              <strong>Maintenance Mode Active</strong>
              <span>All visitors are seeing the maintenance page</span>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="ff-stats">
          <div className="ff-stat">
            <div className="ff-stat-icon ff-stat-icon--total">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
            <span className="ff-stat-value">{totalCount}</span>
            <span className="ff-stat-label">Total Flags</span>
          </div>
          <div className="ff-stat">
            <div className="ff-stat-icon ff-stat-icon--active">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7 10L9 12L13 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="ff-stat-value ff-stat-value--active">{activeCount}</span>
            <span className="ff-stat-label">Active</span>
          </div>
          <div className="ff-stat">
            <div className="ff-stat-icon ff-stat-icon--inactive">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 8L12 12M12 8L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="ff-stat-value ff-stat-value--inactive">{totalCount - activeCount}</span>
            <span className="ff-stat-label">Inactive</span>
          </div>
          <div className="ff-stat">
            <div className="ff-stat-icon ff-stat-icon--source">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 4H16V14H4L2 16V4H4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M6 7H14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
                <path d="M6 10H11" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
              </svg>
            </div>
            <span className="ff-stat-value ff-stat-value--source">.env</span>
            <span className="ff-stat-label">Source</span>
          </div>
        </div>

        {/* Info Banner */}
        <div className="ff-banner ff-banner--info">
          <div className="ff-banner-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="var(--color-primary)" strokeWidth="1.2" />
              <path d="M8 7V11" stroke="var(--color-primary)" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="8" cy="5" r="0.8" fill="var(--color-primary)" />
            </svg>
          </div>
          <div className="ff-banner-content">
            Flags are configured via the <code className="ff-code">FEATURE_FLAGS</code> environment variable as a JSON object. Changes require a server restart.
          </div>
        </div>

        {/* Updating Status */}
        <div className="ff-updating">
          <UpdatingStatus message="Adding API-based flag management soon" compact />
        </div>

        {/* Search */}
        <div className="ff-search">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search flags..."
            className="ff-search-input"
          />
        </div>

        {/* Flags Table */}
        <div className="ff-table-card">
          {flagEntries.length > 0 ? (
            <div className="ff-table">
              <div className="ff-table-header">
                <div className="ff-table-col ff-table-col--flag">Flag</div>
                <div className="ff-table-col ff-table-col--status">Status</div>
                <div className="ff-table-col ff-table-col--type">Type</div>
              </div>
              {flagEntries.map(([key, value]) => (
                <div key={key} className="ff-table-row">
                  <div className="ff-table-col ff-table-col--flag">
                    <code className="ff-flag-key">{key}</code>
                  </div>
                  <div className="ff-table-col ff-table-col--status">
                    <span className={`ff-status ${value ? "ff-status--active" : "ff-status--inactive"}`}>
                      <span className="ff-status-dot" />
                      {value ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="ff-table-col ff-table-col--type">
                    <span className={`ff-type ${key === "maintenance" ? "ff-type--kill" : "ff-type--feature"}`}>
                      {key === "maintenance" ? "Kill Switch" : "Feature"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="ff-empty">
              <span className="ff-empty-icon">🏳️</span>
              <p>{search ? "No flags match your search" : "No feature flags configured"}</p>
              <p className="ff-empty-hint">Add FEATURE_FLAGS to your .env file to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
