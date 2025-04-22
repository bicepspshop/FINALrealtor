import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  // Очищаем cookie с токеном авторизации
  cookies().delete("auth-token")

  return NextResponse.json({ success: true })
}
