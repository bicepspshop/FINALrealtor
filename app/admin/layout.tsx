import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerClient } from "@/lib/supabase"

export const metadata: Metadata = {
  title: "Панель администратора | РиелторПро",
  description: "Административная панель управления сайтом РиелторПро.",
}

// Server-side authentication check
async function getUser() {
  const supabase = getServerClient();
  
  try {
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return null;
    }
    
    // Check user's role
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, is_admin')
      .eq('id', session.user.id)
      .single();
    
    if (userError || !user) {
      return null;
    }
    
    // Only return the user if they are an admin
    return user.is_admin === true ? user : null;
  } catch (error) {
    console.error("Error in admin auth check:", error);
    return null;
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if user is authenticated and is an admin
  const user = await getUser();
  
  // If not authenticated or not an admin, redirect to login
  if (!user) {
    redirect('/login');
  }
  
  return (
    <>
      {children}
    </>
  )
} 