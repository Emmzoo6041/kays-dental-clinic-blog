import { AuthForm } from "@/components/AuthForm";

export default function Signup() {
  return (
    <section className="mx-auto max-w-md px-5 py-20">
      <h1 className="font-display text-4xl font-semibold mb-2">Create an account</h1>
      <p className="text-ink/70 mb-8">
        It takes a minute. You&apos;ll be able to comment and get clinic updates.
      </p>
      <AuthForm mode="signup" />
    </section>
  );
}
