import { NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { 
      propertyId, 
      collectionId,
      authorName, 
      authorEmail,
      content,
      positionX,
      positionY,
      honeypot 
    } = data
    
    // Simple bot detection with honeypot
    if (honeypot) {
      console.log("Bot detected with honeypot field")
      return NextResponse.json({ success: true }) // Silently accept but discard
    }
    
    const supabase = getServerClient()
    
    // Insert the comment - no rate limit checking
    const { data: comment, error } = await supabase
      .from('property_comments')
      .insert({
        property_id: propertyId,
        collection_id: collectionId,
        author_name: authorName,
        author_email: authorEmail,
        content: content,
        position_x: positionX,
        position_y: positionY,
        is_approved: true // Auto-approve comments
      })
      .select('id')
      .single()
      
    if (error) {
      console.error("Error adding comment:", error)
      return NextResponse.json({ success: false, error: "Не удалось добавить комментарий" }, { status: 500 })
    }
    
    return NextResponse.json({ success: true, commentId: comment.id })
  } catch (error) {
    console.error("Unexpected error in comment API:", error)
    return NextResponse.json({ success: false, error: "Произошла ошибка" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const propertyId = url.searchParams.get('propertyId')
  const collectionId = url.searchParams.get('collectionId')
  
  if (!propertyId && !collectionId) {
    return NextResponse.json({ success: false, error: "Требуется ID объекта или коллекции" }, { status: 400 })
  }
  
  try {
    const supabase = getServerClient()
    
    let query = supabase
      .from('property_comments')
      .select('*')
      .order('created_at', { ascending: true })
      .eq('is_approved', true)
    
    if (propertyId) {
      query = query.eq('property_id', propertyId)
    }
    
    if (collectionId) {
      query = query.eq('collection_id', collectionId)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error("Error fetching comments:", error)
      return NextResponse.json({ success: false, error: "Не удалось загрузить комментарии" }, { status: 500 })
    }
    
    return NextResponse.json({ success: true, comments: data })
  } catch (error) {
    console.error("Unexpected error in comment API:", error)
    return NextResponse.json({ success: false, error: "Произошла ошибка" }, { status: 500 })
  }
}