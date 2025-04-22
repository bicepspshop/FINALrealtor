import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 })
    }
    
    return NextResponse.json({ 
      user: {
        id: session.id,
        name: session.name,
        email: session.email
      }
    })
  } catch (error) {
    console.error("Error in session API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
