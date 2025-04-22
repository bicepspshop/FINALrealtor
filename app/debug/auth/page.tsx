"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { NavBar } from "@/components/nav-bar"
import { ArrowLeft, Check, X, RefreshCw, User, FileText, Upload } from "lucide-react"
import { getBrowserClient } from "@/lib/supabase"

export default function AuthDebugPage() {
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [testUploadResult, setTestUploadResult] = useState<{success: boolean, url?: string, error?: string} | null>(null)
  const [uploadLoading, setUploadLoading] = useState(false)
  const supabase = getBrowserClient()
  
  useEffect(() => {
    async function checkSession() {
      setLoading(true)
      try {
        // Get session from Supabase auth
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error("Error getting session:", sessionError)
          setSessionInfo({ error: sessionError.message })
          return
        }
        
        if (!session) {
          setSessionInfo({ noSession: true })
          return
        }
        
        // Get user profile info from DB
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
          
        if (userError) {
          console.error("Error getting user data:", userError)
        }
        
        setSessionInfo({
          session: {
            id: session.user.id,
            email: session.user.email,
            role: session.user.role,
            accessToken: `${session.access_token.substring(0, 10)}...`,
            expiresAt: new Date(session.expires_at! * 1000).toLocaleString(),
          },
          user: userData || null
        })
      } catch (error) {
        console.error("Error checking session:", error)
        setSessionInfo({ error: String(error) })
      } finally {
        setLoading(false)
      }
    }
    
    checkSession()
  }, [supabase])
  
  async function handleTestUpload() {
    setUploadLoading(true)
    setTestUploadResult(null)
    
    try {
      // Create a test file
      const testContent = JSON.stringify({ test: true, timestamp: Date.now() })
      const testFile = new File([testContent], "auth-test.json", { type: "application/json" })
      
      // Create FormData
      const formData = new FormData()
      formData.append('file', testFile)
      formData.append('bucket', 'avatars')  // Use avatars for testing
      
      // Upload via the server endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      const result = await response.json()
      
      if (result.success) {
        setTestUploadResult({
          success: true,
          url: result.url
        })
      } else {
        setTestUploadResult({
          success: false,
          error: result.error
        })
      }
    } catch (error) {
      console.error("Test upload error:", error)
      setTestUploadResult({
        success: false,
        error: String(error)
      })
    } finally {
      setUploadLoading(false)
    }
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-dark-charcoal dark:to-dark-slate theme-transition">
      <NavBar userName="Отладка" />
      
      <main className="flex-1 container-luxury py-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-serif font-medium text-luxury-black dark:text-white theme-transition">Диагностика авторизации</h1>
            <div className="w-20 h-0.5 bg-luxury-gold dark:bg-luxury-royalBlue mt-2 mb-3 theme-transition"></div>
            <p className="text-luxury-black/60 dark:text-white/60 theme-transition">Проверка сессии и прав доступа к хранилищу</p>
          </div>
          <Link href="/debug">
            <Button variant="outline" className="border-luxury-black/20 dark:border-luxury-royalBlue/40 hover:bg-luxury-black/5 dark:hover:bg-luxury-royalBlue/10 hover:border-luxury-black/30 dark:hover:border-luxury-royalBlue/60 rounded-sm flex items-center gap-2 dark:text-white theme-transition" animation="scale">
              <ArrowLeft size={16} />
              К инструментам отладки
            </Button>
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-white dark:bg-dark-graphite border-gray-100 dark:border-dark-slate shadow-elegant dark:shadow-elegant-dark theme-transition">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-serif text-luxury-black dark:text-white theme-transition flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>Информация о сессии</span>
              </CardTitle>
              <CardDescription className="text-luxury-black/60 dark:text-white/60 theme-transition">
                Данные текущей сессии пользователя
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="animate-spin h-8 w-8 text-luxury-gold dark:text-luxury-royalBlue theme-transition" />
                </div>
              ) : sessionInfo?.error ? (
                <Alert variant="destructive" className="mb-4">
                  <X className="h-4 w-4" />
                  <AlertTitle>Ошибка при получении данных сессии</AlertTitle>
                  <AlertDescription>{sessionInfo.error}</AlertDescription>
                </Alert>
              ) : sessionInfo?.noSession ? (
                <Alert variant="warning" className="mb-4 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800/30 theme-transition">
                  <AlertTitle className="text-amber-700 dark:text-amber-500 theme-transition">Нет активной сессии</AlertTitle>
                  <AlertDescription className="text-amber-700/80 dark:text-amber-500/90 theme-transition">
                    Пользователь не авторизован. Сначала войдите в систему.
                  </AlertDescription>
                  <div className="mt-4">
                    <Link href="/login">
                      <Button variant="outline" className="bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 border-amber-200 dark:border-amber-800/50 hover:bg-amber-100 dark:hover:bg-amber-900/50 theme-transition">
                        Перейти на страницу входа
                      </Button>
                    </Link>
                  </div>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <Alert variant="default" className="mb-4 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800/30 theme-transition">
                    <Check className="h-4 w-4 text-green-600 dark:text-green-500 theme-transition" />
                    <AlertTitle className="text-green-700 dark:text-green-500 theme-transition">Пользователь авторизован</AlertTitle>
                    <AlertDescription className="text-green-700/80 dark:text-green-500/90 theme-transition">
                      Активная сессия найдена для пользователя {sessionInfo?.session?.email}
                    </AlertDescription>
                  </Alert>
                  
                  <div className="bg-gray-50 dark:bg-dark-slate p-4 rounded-sm border border-gray-100 dark:border-dark-slate overflow-hidden theme-transition">
                    <h3 className="font-medium mb-2 text-luxury-black dark:text-white theme-transition">Данные сессии:</h3>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {sessionInfo?.session && Object.entries(sessionInfo.session).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-[120px_1fr] gap-2 py-1 border-b border-gray-100 dark:border-dark-slate theme-transition">
                          <span className="text-sm font-medium text-luxury-black/70 dark:text-white/70 theme-transition">{key}:</span>
                          <span className="text-sm text-luxury-black dark:text-white break-all theme-transition">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {sessionInfo?.user && (
                    <div className="bg-gray-50 dark:bg-dark-slate p-4 rounded-sm border border-gray-100 dark:border-dark-slate overflow-hidden theme-transition">
                      <h3 className="font-medium mb-2 text-luxury-black dark:text-white theme-transition">Данные профиля:</h3>
                      <div className="space-y-2 max-h-[200px] overflow-y-auto">
                        {Object.entries(sessionInfo.user).map(([key, value]) => (
                          <div key={key} className="grid grid-cols-[120px_1fr] gap-2 py-1 border-b border-gray-100 dark:border-dark-slate theme-transition">
                            <span className="text-sm font-medium text-luxury-black/70 dark:text-white/70 theme-transition">{key}:</span>
                            <span className="text-sm text-luxury-black dark:text-white break-all theme-transition">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-dark-graphite border-gray-100 dark:border-dark-slate shadow-elegant dark:shadow-elegant-dark theme-transition">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-serif text-luxury-black dark:text-white theme-transition flex items-center gap-2">
                <Upload className="h-5 w-5" />
                <span>Тест загрузки файла</span>
              </CardTitle>
              <CardDescription className="text-luxury-black/60 dark:text-white/60 theme-transition">
                Проверка прав доступа на загрузку в хранилище
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleTestUpload} 
                disabled={uploadLoading || loading || sessionInfo?.noSession || sessionInfo?.error}
                className="w-full bg-luxury-gold dark:bg-luxury-royalBlue text-white flex items-center justify-center gap-2 theme-transition mb-4"
              >
                {uploadLoading ? (
                  <>
                    <RefreshCw className="animate-spin h-4 w-4" />
                    <span>Тестирование...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Проверить загрузку в хранилище</span>
                  </>
                )}
              </Button>
              
              {testUploadResult && (
                <Alert 
                  variant={testUploadResult.success ? "default" : "destructive"} 
                  className={`mb-4 ${testUploadResult.success ? 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800/30' : ''} theme-transition`}
                >
                  {testUploadResult.success ? (
                    <Check className="h-4 w-4 text-green-600 dark:text-green-500 theme-transition" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                  <AlertTitle className={testUploadResult.success ? 'text-green-700 dark:text-green-500' : ''}>
                    {testUploadResult.success ? "Загрузка успешна" : "Ошибка загрузки"}
                  </AlertTitle>
                  <AlertDescription className={testUploadResult.success ? 'text-green-700/80 dark:text-green-500/90' : ''}>
                    {testUploadResult.success 
                      ? "Тестовый файл успешно загружен в хранилище" 
                      : testUploadResult.error
                    }
                  </AlertDescription>
                  
                  {testUploadResult.success && testUploadResult.url && (
                    <div className="mt-4 p-3 bg-white dark:bg-dark-slate rounded-sm border border-green-200 dark:border-green-800/50 break-all">
                      <p className="text-sm font-medium mb-1 text-luxury-black dark:text-white theme-transition">URL загруженного файла:</p>
                      <a 
                        href={testUploadResult.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-luxury-gold dark:text-luxury-royalBlue hover:underline theme-transition"
                      >
                        {testUploadResult.url}
                      </a>
                    </div>
                  )}
                </Alert>
              )}
              
              <div className="bg-gray-50 dark:bg-dark-slate p-4 rounded-sm border border-gray-100 dark:border-dark-slate theme-transition">
                <h3 className="font-medium mb-2 text-luxury-black dark:text-white theme-transition">Возможные проблемы с загрузкой:</h3>
                <ul className="space-y-2 text-sm text-luxury-black/70 dark:text-white/70 theme-transition">
                  <li className="flex items-start gap-2">
                    <span className="text-luxury-gold dark:text-luxury-royalBlue theme-transition">•</span>
                    <span>Отсутствие активной сессии пользователя</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-luxury-gold dark:text-luxury-royalBlue theme-transition">•</span>
                    <span>Отсутствие нужных прав в политиках доступа бакетов</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-luxury-gold dark:text-luxury-royalBlue theme-transition">•</span>
                    <span>Истекший токен доступа</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-luxury-gold dark:text-luxury-royalBlue theme-transition">•</span>
                    <span>Отсутствие нужных бакетов в хранилище</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-white dark:bg-dark-graphite border border-gray-100 dark:border-dark-slate rounded-sm p-6 shadow-elegant dark:shadow-elegant-dark theme-transition">
          <h2 className="text-xl font-serif text-luxury-black dark:text-white mb-4 theme-transition">Действия для устранения проблем с загрузкой</h2>
          
          <div className="space-y-4 text-luxury-black/80 dark:text-white/80 theme-transition">
            <ol className="list-decimal ml-6 space-y-3">
              <li>
                <p className="font-medium text-luxury-black dark:text-white theme-transition">Проверьте сессию авторизации</p>
                <p className="text-sm mt-1">Убедитесь, что вы авторизованы в системе и сессия активна. Если нет, выйдите и войдите снова.</p>
              </li>
              
              <li>
                <p className="font-medium text-luxury-black dark:text-white theme-transition">Проверьте политики хранилища</p>
                <p className="text-sm mt-1">В Supabase Dashboard для каждого бакета (avatars, collection-covers) настройте следующие политики:</p>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-dark-slate p-3 rounded-sm border border-gray-100 dark:border-dark-slate theme-transition">
                    <p className="text-sm font-medium mb-1">Политика для SELECT (чтение):</p>
                    <pre className="bg-gray-100 dark:bg-dark-charcoal p-2 rounded-sm text-xs overflow-x-auto theme-transition">
                      <code>bucket_id = '[ИМЯ_БАКЕТА]'</code>
                    </pre>
                  </div>
                  <div className="bg-gray-50 dark:bg-dark-slate p-3 rounded-sm border border-gray-100 dark:border-dark-slate theme-transition">
                    <p className="text-sm font-medium mb-1">Политика для INSERT (загрузка):</p>
                    <pre className="bg-gray-100 dark:bg-dark-charcoal p-2 rounded-sm text-xs overflow-x-auto theme-transition">
                      <code>bucket_id = '[ИМЯ_БАКЕТА]' AND auth.role() = 'authenticated'</code>
                    </pre>
                  </div>
                </div>
              </li>
              
              <li>
                <p className="font-medium text-luxury-black dark:text-white theme-transition">Проверьте создание бакетов</p>
                <p className="text-sm mt-1">Убедитесь, что все необходимые бакеты созданы в хранилище Supabase. Перейдите на страницу <Link href="/debug/storage" className="text-luxury-gold dark:text-luxury-royalBlue hover:underline theme-transition">диагностики хранилища</Link> для проверки.</p>
              </li>
              
              <li>
                <p className="font-medium text-luxury-black dark:text-white theme-transition">Используйте серверную загрузку</p>
                <p className="text-sm mt-1">Если ничего не помогает, приложение автоматически переключится на загрузку через серверный API. Текущая реализация уже использует этот подход.</p>
              </li>
            </ol>
          </div>
        </div>
      </main>
      
      <footer className="bg-luxury-black dark:bg-dark-charcoal py-10 text-white/60 mt-auto border-t border-white/5 dark:border-dark-slate theme-transition">
        <div className="container-luxury flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <h2 className="text-xl font-serif text-white mr-2 theme-transition">РиелторПро</h2>
            <span className="text-sm dark:text-white/60 theme-transition">• Отладка</span>
          </div>
          <p className="dark:text-white/60 theme-transition">&copy; {new Date().getFullYear()} Все права защищены</p>
        </div>
      </footer>
    </div>
  )
}