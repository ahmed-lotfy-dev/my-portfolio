import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Ahmed Lotfy",
  description: "Terms of service for Ahmed Lotfy's portfolio website. By using this site, you agree to these terms governing content use, intellectual property, and limitations of liability.",
  alternates: {
    canonical: "https://ahmedlotfy.site/en/terms",
    languages: {
      en: "https://ahmedlotfy.site/en/terms",
      ar: "https://ahmedlotfy.site/ar/terms",
    },
  },
  openGraph: {
    title: "Terms of Service | Ahmed Lotfy",
    description: "Terms of service for Ahmed Lotfy's portfolio website. Content use, intellectual property, and liability information.",
    url: "https://ahmedlotfy.site/en/terms",
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
    title: "Terms of Service | Ahmed Lotfy",
    description: "Terms of service for Ahmed Lotfy's portfolio website.",
    images: ["https://ahmedlotfy.site/og-image.png"],
  },
};

export default function TermsPage() {
  return (
    <main className="container mx-auto px-4 pt-28 pb-20 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-muted-foreground leading-7 mb-4">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Agreement to Terms</h2>
        <p className="text-muted-foreground leading-7 mb-4">
          By accessing and using this website ("Site"), you accept and agree to be bound by the terms
          and provisions of this agreement. If you do not agree to abide by the above, please do
          not use this Site.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Use License</h2>
        <p className="text-muted-foreground leading-7 mb-4">
          Permission is granted to temporarily view the materials (information or software) on
          Ahmed Lotfy's website for personal, non-commercial transitory viewing only. This is the
          grant of a license, not a transfer of title, and under this license you may not:
        </p>
        <ul className="list-disc pl-6 text-muted-foreground leading-7 mb-4 space-y-2">
          <li>Modify or copy the materials</li>
          <li>Use the materials for any commercial purpose or for any public display</li>
          <li>Attempt to reverse engineer any software contained on the website</li>
          <li>Remove any copyright or other proprietary notations from the materials</li>
        </ul>
        <p className="text-muted-foreground leading-7 mb-4">
          This license shall automatically terminate if you violate any of these restrictions.
          Upon terminating your viewing of these materials, you must destroy any downloaded
          materials in your possession.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Intellectual Property</h2>
        <p className="text-muted-foreground leading-7 mb-4">
          All content published and made available on this Site is the property of Ahmed Lotfy and
          the Site's creators. This includes, but is not limited to, source code, blog posts,
          project descriptions, images, graphics, and design elements. All rights are reserved.
          Code samples provided in blog posts may be used for educational and personal projects
          with proper attribution.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Disclaimer</h2>
        <p className="text-muted-foreground leading-7 mb-4">
          The materials on this website are provided on an "as is" basis. Ahmed Lotfy makes no
          warranties, expressed or implied, and hereby disclaims and negates all other warranties
          including, without limitation, implied warranties or conditions of merchantability,
          fitness for a particular purpose, or non-infringement of intellectual property.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Limitations</h2>
        <p className="text-muted-foreground leading-7 mb-4">
          In no event shall Ahmed Lotfy or its suppliers be liable for any damages (including,
          without limitation, damages for loss of data or profit, or due to business interruption)
          arising out of the use or inability to use the materials on this website.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Accuracy of Materials</h2>
        <p className="text-muted-foreground leading-7 mb-4">
          The materials appearing on this website could include technical, typographical, or
          photographic errors. Ahmed Lotfy does not warrant that any materials on its website
          are accurate, complete, or current. Ahmed Lotfy may make changes to the materials
          contained on its website at any time without notice.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Links</h2>
        <p className="text-muted-foreground leading-7 mb-4">
          Ahmed Lotfy has not reviewed all of the sites linked to its website and is not
          responsible for the contents of any such linked site. The inclusion of any link does
          not imply endorsement by Ahmed Lotfy of the site. Use of any such linked website is
          at the user's own risk.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Modifications</h2>
        <p className="text-muted-foreground leading-7 mb-4">
          Ahmed Lotfy may revise these terms of service for its website at any time without notice.
          By using this website, you are agreeing to be bound by the then current version of
          these terms of service.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact</h2>
        <p className="text-muted-foreground leading-7 mb-4">
          If you have any questions about these terms, please reach out through the contact
          form on this website.
        </p>
      </div>
    </main>
  );
}
