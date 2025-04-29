import type React from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ClientAuthProvider } from "@/components/client-auth-provider"
import { OfflineAlert } from "@/components/offline-alert"
import { ThemeScript } from "@/components/theme-script"
import { initializeStorage } from "@/lib/storage"

// Get Supabase URL from environment variable
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// Extract domain for preconnect
const supabaseDomain = supabaseUrl ? new URL(supabaseUrl).origin : '';

export const metadata = {
  title: "РиелторПро",
  description: "Manage and share property collections with clients",
  generator: 'v0.dev'
}

// Initialize storage bucket
initializeStorage().catch(console.error)

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
        
        {/* Resource Hints for Performance Optimization */}
        {/* Preconnect to Supabase */}
        <link rel="preconnect" href={supabaseDomain} />
        <link rel="dns-prefetch" href={supabaseDomain} />
        
        {/* Preload essential fonts */}
        <link 
          rel="preload" 
          href="/fonts/inter-var.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
        />
        
        {/* Cache control headers */}
        <meta httpEquiv="Cache-Control" content="public, max-age=3600" />
      </head>
      <body>
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
