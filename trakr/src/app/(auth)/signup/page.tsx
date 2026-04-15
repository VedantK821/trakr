import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-deep">
      <div className="w-full max-w-sm space-y-8 px-4">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold tracking-tight">Trakr</h1>
          <p className="mt-2 text-sm text-muted-foreground">Create your account</p>
        </div>
        <SignupForm />
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-accent-ai hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
