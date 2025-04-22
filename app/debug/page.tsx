import { cookies } from "next/headers"
import { getSession } from "@/lib/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function DebugPage() {
  console.log("DebugPage: Начало загрузки страницы отладки")

  const cookieStore = cookies()
  const authCookie = cookieStore.get("auth-token")
  console.log("DebugPage: Найден cookie auth-token:", authCookie ? "Да" : "Нет")

  const session = await getSession()
  console.log("DebugPage: Получена сессия:", session ? "Да" : "Нет")

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Отладка аутентификации</h1>

      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-xl font-semibold mb-2">Cookie авторизации</h2>
        {authCookie ? (
          <pre className="bg-gray-100 p-2 rounded">
            {JSON.stringify(
              {
                name: authCookie.name,
                value: authCookie.value.substring(0, 5) + "...",
                path: authCookie.path,
                expires: authCookie.expires,
                sameSite: authCookie.sameSite,
              },
              null,
              2,
            )}
          </pre>
        ) : (
          <p className="text-red-500">Cookie авторизации не найден</p>
        )}
      </div>

      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-xl font-semibold mb-2">Сессия</h2>
        {session ? (
          <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(session, null, 2)}</pre>
        ) : (
          <p className="text-red-500">Сессия не найдена</p>
        )}
      </div>

      <div className="flex gap-4 mt-4">
        <Link href="/login">
          <Button variant="outline">Перейти на страницу входа</Button>
        </Link>
        <Link href="/dashboard">
          <Button>Перейти в панель управления</Button>
        </Link>
      </div>
    </div>
  )
}
