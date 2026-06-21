import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Ahmed Lotfy",
  description: "Privacy policy for Ahmed Lotfy's portfolio website. Learn how we collect, use, and protect your personal data. We use minimal analytics with PostHog and Cloudflare.",
  alternates: {
    canonical: "https://ahmedlotfy.site/en/privacy",
    languages: {
      en: "https://ahmedlotfy.site/en/privacy",
      ar: "https://ahmedlotfy.site/ar/privacy",
      "x-default": "https://ahmedlotfy.site/en/privacy",
    },
  },
  openGraph: {
    title: "Privacy Policy | Ahmed Lotfy",
    description: "Privacy policy for Ahmed Lotfy's portfolio website. Learn how we collect, use, and protect your personal data.",
    url: "https://ahmedlotfy.site/en/privacy",
    siteName: "Ahmed Lotfy Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://ahmedlotfy.site/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ahmed Lotfy – Senior Full-Stack Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Ahmed Lotfy",
    description: "Privacy policy for Ahmed Lotfy's portfolio website.",
    images: ["https://ahmedlotfy.site/og-image.png"],
  },
};

export default function PrivacyPage() {
  return (
    <main className="container mx-auto px-4 pt-28 pb-20 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-muted-foreground leading-7 mb-4">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Overview</h2>
        <p className="text-muted-foreground leading-7 mb-4">
          Ahmed Lotfy ("we," "us," or "our") operates this portfolio website at ahmedlotfy.site.
          This page informs you of our policies regarding the collection, use, and disclosure
          of personal data when you use our website and the choices you have associated with that data.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Data We Collect</h2>
        <p className="text-muted-foreground leading-7 mb-4">
          We collect minimal data necessary for the operation of this website:
        </p>
        <ul className="list-disc pl-6 text-muted-foreground leading-7 mb-4 space-y-2">
          <li><strong>Analytics data:</strong> We use PostHog for privacy-focused analytics. This includes page views, session duration, and general usage patterns. No personally identifiable information is collected.</li>
          <li><strong>Technical data:</strong> Your browser type, operating system, and referring URL may be logged for security and performance monitoring.</li>
          <li><strong>Account data:</strong> If you create an account, we store your email address, display name, and authentication credentials securely using Better Auth.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Data</h2>
        <p className="text-muted-foreground leading-7 mb-4">
          We use the collected data for the following purposes:
        </p>
        <ul className="list-disc pl-6 text-muted-foreground leading-7 mb-4 space-y-2">
          <li>To maintain and improve the website</li>
          <li>To analyze usage patterns and optimize performance</li>
          <li>To respond to your inquiries submitted through the contact form</li>
          <li>To authenticate users who create accounts</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Data Retention</h2>
        <p className="text-muted-foreground leading-7 mb-4">
          Analytics data is retained for a maximum of 13 months. Account data is retained as long as
          your account remains active. You may request deletion of your account and associated data at any time.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Third-Party Services</h2>
        <p className="text-muted-foreground leading-7 mb-4">
          We use the following third-party services:
        </p>
        <ul className="list-disc pl-6 text-muted-foreground leading-7 mb-4 space-y-2">
          <li><strong>PostHog:</strong> For privacy-focused analytics. Their privacy policy is available at posthog.com/privacy.</li>
          <li><strong>Cloudflare:</strong> For CDN, DNS, and security services.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights</h2>
        <p className="text-muted-foreground leading-7 mb-4">
          You have the right to access, update, or delete your personal data. If you have created an
          account, you can manage your data through your account settings. For any privacy-related
          inquiries, please contact us through the contact page.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to This Policy</h2>
        <p className="text-muted-foreground leading-7 mb-4">
          We may update this Privacy Policy from time to time. We will notify you of any changes by
          posting the new policy on this page and updating the "Last updated" date.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact</h2>
        <p className="text-muted-foreground leading-7 mb-4">
          If you have any questions about this Privacy Policy, please reach out through the contact
          form on this website or connect with us on LinkedIn or GitHub.
        </p>
      </div>
    </main>
  );
}
