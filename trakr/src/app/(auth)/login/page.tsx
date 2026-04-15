import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-deep">
      <div className="w-full max-w-sm space-y-8 px-4">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold tracking-tight">Trakr</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to your account</p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-accent-ai hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
