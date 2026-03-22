import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for Ahmed Shoman portfolio.",
};

export default function TermsPage() {
  return (
    <main className="container mx-auto px-4 pt-28 pb-20 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
      <p className="text-muted-foreground leading-7">
        By using this website, you agree to use the content for personal and
        informational purposes. All content and code samples remain owned by
        their respective authors.
      </p>
    </main>
  );
}
