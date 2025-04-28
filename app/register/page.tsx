import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import RegisterForm from "./register-form";

export default async function RegisterPage() {
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  }
  return <RegisterForm />;
}

// --- Move the existing registration form code to app/register/register-form.tsx as a client component ---
