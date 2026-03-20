import Section from "@/src/components/ui/Section"
import SignUpForm from "@/src/components/features/auth/SignUpForm"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up",
  robots: {
    index: false,
    follow: false,
  },
}

export default function SignUpPage() {
  return (
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
  )
}
