import { getSession, requireAuth } from "@/lib/auth"
import { getServerClient } from "@/lib/supabase"
import { CommentManagement } from "./comment-management"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { redirect } from "next/navigation"

interface CommentManagementPageProps {
  params: {
    id: string
  }
}

export default async function CommentManagementPage({ params }: CommentManagementPageProps) {
  const session = await requireAuth()
  
  // Check subscription status - redirect to subscription page if expired
  if (session.trialInfo && !session.trialInfo.isActive) {
    console.log("CommentManagementPage: Пробный период истек, перенаправление на страницу подписки")
    redirect("/dashboard/subscription")
  }
  
  const collectionId = params.id
  const supabase = getServerClient()
  
  // Verify ownership of collection
  const { data: collection } = await supabase
    .from("collections")
    .select("id, name")
    .eq("id", collectionId)
    .eq("user_id", session.id)
    .single()
    
  if (!collection) {
    return (
      <div className="p-8 text-center bg-white dark:bg-dark-graphite rounded-sm shadow-elegant dark:shadow-elegant-dark theme-transition">
        <h2 className="text-2xl font-serif font-medium mb-4 dark:text-white theme-transition">Коллекция не найдена</h2>
        <p className="text-[#2C2C2C]/70 dark:text-white/70 mb-8 theme-transition">Эта коллекция не существует или у вас нет к ней доступа.</p>
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[#CBA135] dark:text-luxury-royalBlue hover:underline theme-transition"
        >
          <ChevronLeft size={16} />
          <span>Вернуться к списку коллекций</span>
        </Link>
      </div>
    )
  }
  
  // Fetch all comments for this collection
  const { data: comments } = await supabase
    .from("property_comments")
    .select(`
      id, 
      author_name, 
      author_email, 
      content, 
      position_x, 
      position_y, 
      created_at, 
      is_approved,
      property_id,
      properties (id, address, property_type)
    `)
    .eq("collection_id", collectionId)
    .order("created_at", { ascending: false })
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif font-medium dark:text-white theme-transition">Комментарии</h1>
          <div className="w-16 h-0.5 bg-[#CBA135] dark:bg-luxury-royalBlue mt-2 mb-1 theme-transition"></div>
          <p className="text-[#2C2C2C]/70 dark:text-white/70 theme-transition">
            Коллекция: {collection.name}
          </p>
        </div>
        
        <Link
          href={`/dashboard/collections/${collectionId}`}
          className="inline-flex items-center gap-2 text-[#2C2C2C]/70 dark:text-white/70 hover:text-[#CBA135] dark:hover:text-luxury-royalBlue transition-colors theme-transition"
        >
          <ChevronLeft size={16} />
          <span>Назад к объектам</span>
        </Link>
      </div>
      
      <CommentManagement comments={comments || []} collectionId={collectionId} />
    </div>
  )
}