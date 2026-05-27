import { AuthForm } from "@/components/AuthForm";

export default function Login() {
  return (
    <section className="mx-auto max-w-md px-5 py-20">
      <h1 className="font-display text-4xl font-semibold mb-2">Welcome back</h1>
      <p className="text-ink/70 mb-8">Log in to comment and manage your account.</p>
      <AuthForm mode="login" />
    </section>
  );
}
