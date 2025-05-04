import type React from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ClientAuthProvider } from "@/components/client-auth-provider"
import { OfflineAlert } from "@/components/offline-alert"
import { ThemeScript } from "@/components/theme-script"
import { initializeStorage } from "@/lib/storage"
import { initializeFaqStorage } from "@/lib/faq-storage"

export const metadata = {
  title: "РиелторПро",
  description: "Manage and share property collections with clients",
    generator: 'v0.dev'
}

// Initialize storage buckets
initializeStorage().catch(console.error)
initializeFaqStorage().catch(console.error)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'dark';
                if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {
                // If localStorage fails, default to dark
                document.documentElement.classList.add('dark');
              }
            `
          }}
          type="text/javascript"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className="min-h-screen w-full overflow-x-hidden">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ClientAuthProvider>
            <ThemeScript />
            {children}
            <Toaster />
            <OfflineAlert />
          </ClientAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
