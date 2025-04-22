import { NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    // Using server client which has higher permissions
    const supabase = getServerClient()
    
    // Execute raw SQL to add phone column if it doesn't exist
    const { data, error } = await supabase.rpc('add_phone_column_if_not_exists')
    
    if (error) {
      console.error("Error updating schema:", error)
      
      // Try direct SQL if the RPC function is not available
      const { error: sqlError } = await supabase.from('users').rpc('alter_users_add_phone')
      
      if (sqlError) {
        return NextResponse.json({ 
          success: false, 
          error: error.message + " | " + sqlError.message,
          message: "Could not update schema. Please run this SQL in Supabase SQL editor: ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(255);"
        }, { status: 500 })
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Schema updated successfully" 
    })
  } catch (error) {
    console.error("Error in update-schema API:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Internal server error",
      message: "Please run this SQL in Supabase SQL editor: ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(255);"
    }, { status: 500 })
  }
}
