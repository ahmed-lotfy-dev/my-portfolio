import Section from "@/src/components/ui/Section"
import SignUpForm from "@/src/components/features/auth/SignUpForm"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Ahmed Lotfy",
  description: "Create an account on Ahmed Lotfy's portfolio site to manage and publish content.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Sign Up | Ahmed Lotfy",
    description: "Create an account on Ahmed Lotfy's portfolio site.",
    url: "https://ahmedlotfy.site/en/signup",
    siteName: "Ahmed Lotfy Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Sign Up | Ahmed Lotfy",
    description: "Create an account on Ahmed Lotfy's portfolio site.",
  },
}

export default function SignUpPage() {
  return (
    <main>
      <Section id="signup">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Create account
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Join to publish and manage your content.
            </p>
          </div>
          <SignUpForm />
        </div>
      </Section>
    </main>
  )
}
