import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-4">Страница не найдена</h2>
      <p className="text-gray-600 mb-6">Запрашиваемая страница не существует или была перемещена.</p>
      <Link href="/">
        <Button>На главную</Button>
      </Link>
    </div>
  )
}
