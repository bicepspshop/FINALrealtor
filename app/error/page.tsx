import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ErrorPage({
  searchParams,
}: {
  searchParams: { message?: string }
}) {
  const errorMessage = searchParams.message || "Произошла непредвиденная ошибка"

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-4">Что-то пошло не так</h2>
      <p className="text-gray-600 mb-6">{errorMessage}</p>
      <div className="flex flex-col gap-4">
        <Link href="/dashboard">
          <Button className="w-full">Вернуться на главную</Button>
        </Link>
        <Link href="/debug">
          <Button variant="outline" className="w-full">
            Отладка аутентификации
          </Button>
        </Link>
      </div>
    </div>
  )
}
