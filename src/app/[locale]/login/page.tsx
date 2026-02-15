import Section from "@/src/components/ui/Section"
import SignInForm from "@/src/components/features/auth/SignInForm"

export const metadata = {
  title: "Login",
}

export default function LoginPage() {
  return (
    <Section id="login">
      <div className="container mx-auto mt-20">
        <div className="mx-auto max-w-3xl text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Login
          </h1>
        </div>
        <SignInForm />
      </div>
    </Section>
  )
}
