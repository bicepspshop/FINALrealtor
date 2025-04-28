import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "./login-form";

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  }
  return <LoginForm />;
}

// --- Move the existing login form code to app/login/login-form.tsx as a client component ---
