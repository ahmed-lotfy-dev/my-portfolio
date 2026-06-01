"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

/**
 * Beautiful 404 Not Found page.
 *
 * Design philosophy: A 404 is not a failure -- it is a moment
 * of exploration. The user ventured somewhere unexpected.
 * Make that feel intentional, atmospheric, and guide them home.
 *
 * Inspired by: Linear, Vercel, Stripe -- companies that treat
 * every screen as a design opportunity.
 */
export default function NotFound() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  return (
    <div className="notfound-page">
      {/* Deep atmospheric background */}
      <div className="notfound-ambient">
        <div className="notfound-orb notfound-orb-1" />
        <div className="notfound-orb notfound-orb-2" />
        <div className="notfound-orb notfound-orb-3" />
      </div>

      {/* Star field */}
      <div className="notfound-stars">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="notfound-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="notfound-content">
        {/* Large 404 with planet */}
        <div className="notfound-code">
          <span className="notfound-code-digit">4</span>
          <div className="notfound-code-planet">
            <div className="notfound-code-planet-ring" />
            <div className="notfound-code-planet-core" />
          </div>
          <span className="notfound-code-digit">4</span>
        </div>

        <h1 className="notfound-title">
          {locale === "ar" ? "ضائع في الفضاء" : "Lost in Space"}
        </h1>
        <p className="notfound-subtitle">
          {locale === "ar"
            ? "هذه الصفحة انجرفت إلى الفضاء العميق."
            : "This page drifted off into deep space."}
          <br />
          {locale === "ar"
            ? "ربما انتقلت، أو لم تكن موجودة أصلاً."
            : "It might have moved, or never existed."}
        </p>

        <div className="notfound-actions">
          <Link href={`/${locale}`} className="btn btn-primary">
            {locale === "ar" ? "العودة إلى الصفحة الرئيسية" : "Return Home"}
          </Link>
          <button className="btn btn-ghost" onClick={() => window.history.back()}>
            {locale === "ar" ? "الرجوع للخلف" : "Go Back"}
          </button>
        </div>

        <div className="notfound-suggestions">
          <span className="notfound-suggestions-label">
            {locale === "ar" ? "أو جرب:" : "Or try:"}
          </span>
          <div className="notfound-suggestions-links">
            <Link href={`/${locale}`} className="notfound-suggestion-link">Home</Link>
            <Link href={`/${locale}/about`} className="notfound-suggestion-link">About</Link>
            <Link href={`/${locale}/projects`} className="notfound-suggestion-link">Projects</Link>
            <Link href={`/${locale}/contact`} className="notfound-suggestion-link">Contact</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
