import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Помощь и FAQ | РиелторПро",
  description: "Руководство по использованию платформы РиелторПро для риелторов и специалистов по недвижимости.",
}

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
} 