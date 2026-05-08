import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Ahmed Lotfy portfolio.",
};

export default function PrivacyPage() {
  return (
    <main className="container mx-auto px-4 pt-28 pb-20 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-muted-foreground leading-7">
        This website collects minimal analytics and operational data to improve
        the site experience. No sensitive personal data is sold to third
        parties.
      </p>
    </main>
  );
}
