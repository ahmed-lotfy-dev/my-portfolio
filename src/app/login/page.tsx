import Section from "@/src/components/ui/Section"
import SignInForm from "@/src/components/auth/SignInForm"

export const metadata = {
  title: "Login",
}
console.log(process.env.NEXT_PUBLIC_BASE_URL)
export default function LoginPage() {
  return (
    <Section id="login">
      <div className="container ">
        <div className="mx-auto max-w-3xl text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Sign in
          </h1>
          <p className="mt-10 text-lg text-muted-foreground">
            If your trust me signin with google if not
          </p>
          <p className="mt-3 text-md text-muted-foreground">
            user email: test@gmail.com
          </p>
          <p className="mt-3 text-md text-muted-foreground">
            user email: testpassword
          </p>
        </div>
        <SignInForm />
      </div>
    </Section>
  )
}
