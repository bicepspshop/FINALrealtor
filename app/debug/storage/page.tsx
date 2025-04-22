"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { NavBar } from "@/components/nav-bar"
import { ArrowLeft, Check, X, RefreshCw, Database, Upload, FileText } from "lucide-react"

export default function StorageDebugPage() {
  const [verifying, setVerifying] = useState(false)
  const [setting, setSetting] = useState(false)
  const [verifyResults, setVerifyResults] = useState<any>(null)
  const [setupResults, setSetupResults] = useState<any>(null)
  const [testUploadResult, setTestUploadResult] = useState<{status: string, message: string} | null>(null)
  
  async function verifyStorage() {
    setVerifying(true)
    try {
      const res = await fetch("/api/storage/verify")
      const data = await res.json()
      setVerifyResults(data)
    } catch (error) {
      console.error("Verification failed:", error)
      setVerifyResults({ success: false, error: "Verification request failed" })
    } finally {
      setVerifying(false)
    }
  }
  
  async function setupStorage() {
    setSetting(true)
    try {
      const res = await fetch("/api/storage/setup", { method: "POST" })
      const data = await res.json()
      setSetupResults(data)
    } catch (error) {
      console.error("Setup failed:", error)
      setSetupResults({ success: false, error: "Setup request failed" })
    } finally {
      setSetting(false)
    }
  }
  
  async function testUpload() {
    setTestUploadResult({ status: "loading", message: "Тестирование загрузки..." })
    try {
      // Create a test file
      const testFile = new File(["test content"], "test-upload.txt", { type: "text/plain" })
      
      // Upload file to all buckets to test
      const buckets = ["property-images", "collection-covers", "avatars"]
      const results = []
      
      for (const bucket of buckets) {
        const formData = new FormData()
        formData.append("file", testFile)
        formData.append("bucket", bucket)
        
        try {
          const res = await fetch(`/api/storage/test-upload?bucket=${bucket}`, {
            method: "POST",
            body: formData
          })
          
          const data = await res.json()
          results.push({
            bucket,
            success: data.success,
            message: data.message || data.error
          })
        } catch (error) {
          results.push({
            bucket,
            success: false,
            message: `Request failed: ${error}`
          })
        }
      }
      
      const allSuccessful = results.every(r => r.success)
      
      setTestUploadResult({
        status: allSuccessful ? "success" : "error",
        message: allSuccessful 
          ? "Все тесты загрузки успешны" 
          : `Некоторые тесты не прошли: ${results.filter(r => !r.success).map(r => r.bucket).join(', ')}`
      })
      
      // Include detailed results in console
      console.log("Test upload results:", results)
      
    } catch (error) {
      console.error("Test upload failed:", error)
      setTestUploadResult({
        status: "error",
        message: `Ошибка тестирования: ${error}`
      })
    }
  }
  
  // Automatically verify on load
  useEffect(() => {
    verifyStorage()
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-dark-charcoal dark:to-dark-slate theme-transition">
      <NavBar userName="Администратор" />
      
      <main className="flex-1 container-luxury py-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-serif font-medium text-luxury-black dark:text-white theme-transition">Диагностика хранилища</h1>
            <div className="w-20 h-0.5 bg-luxury-gold dark:bg-luxury-royalBlue mt-2 mb-3 theme-transition"></div>
            <p className="text-luxury-black/60 dark:text-white/60 theme-transition">Проверка и настройка Supabase Storage</p>
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
              <CardTitle className="text-xl font-serif text-luxury-black dark:text-white theme-transition">Проверка хранилища</CardTitle>
              <CardDescription className="text-luxury-black/60 dark:text-white/60 theme-transition">
                Проверить наличие и доступность бакетов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={verifyStorage} 
                disabled={verifying}
                className="w-full bg-luxury-gold dark:bg-luxury-royalBlue text-white flex items-center justify-center gap-2 theme-transition"
              >
                {verifying ? (
                  <>
                    <RefreshCw className="animate-spin h-4 w-4" />
                    <span>Проверка...</span>
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4" />
                    <span>Проверить хранилище</span>
                  </>
                )}
              </Button>
              
              {verifyResults && (
                <div className="mt-4">
                  <Alert variant={verifyResults.success ? "default" : "destructive"} className="mb-4">
                    {verifyResults.success ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                    <AlertTitle>{verifyResults.success ? "Проверка выполнена" : "Ошибка проверки"}</AlertTitle>
                    <AlertDescription>
                      {verifyResults.message || (verifyResults.success ? "Результаты проверки ниже" : "Не удалось выполнить проверку")}
                    </AlertDescription>
                  </Alert>
                  
                  {verifyResults.results && (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto p-2 border border-gray-100 dark:border-dark-slate rounded-sm">
                      {verifyResults.results.map((result: any, index: number) => (
                        <div 
                          key={index} 
                          className="p-3 rounded-sm bg-gray-50 dark:bg-dark-slate border-l-4 border-l-4 theme-transition"
                          style={{
                            borderLeftColor: 
                              result.status === "ok" ? "#22c55e" : 
                              result.status === "created" ? "#3b82f6" : 
                              result.status === "warning" ? "#f59e0b" : 
                              "#ef4444"
                          }}
                        >
                          <p className="font-medium text-luxury-black dark:text-white text-sm theme-transition">
                            {result.bucket}
                          </p>
                          <p className="text-sm text-luxury-black/70 dark:text-white/70 theme-transition">
                            {result.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-dark-graphite border-gray-100 dark:border-dark-slate shadow-elegant dark:shadow-elegant-dark theme-transition">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-serif text-luxury-black dark:text-white theme-transition">Настройка хранилища</CardTitle>
              <CardDescription className="text-luxury-black/60 dark:text-white/60 theme-transition">
                Создать необходимые бакеты и настроить политики
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={setupStorage} 
                disabled={setting}
                className="w-full bg-luxury-black dark:bg-dark-slate hover:bg-black text-white flex items-center justify-center gap-2 theme-transition"
              >
                {setting ? (
                  <>
                    <RefreshCw className="animate-spin h-4 w-4" />
                    <span>Настройка...</span>
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    <span>Настроить хранилище</span>
                  </>
                )}
              </Button>
              
              {setupResults && (
                <div className="mt-4">
                  <Alert variant={setupResults.success ? "default" : "destructive"} className="mb-4">
                    {setupResults.success ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                    <AlertTitle>{setupResults.success ? "Настройка выполнена" : "Ошибка настройки"}</AlertTitle>
                    <AlertDescription>
                      {setupResults.message || (setupResults.success ? "Результаты настройки ниже" : "Не удалось выполнить настройку")}
                      {setupResults.note && <p className="mt-2 text-amber-600 dark:text-amber-400">{setupResults.note}</p>}
                    </AlertDescription>
                  </Alert>
                  
                  {setupResults.results && (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto p-2 border border-gray-100 dark:border-dark-slate rounded-sm">
                      {setupResults.results.map((result: any, index: number) => (
                        <div 
                          key={index} 
                          className="p-3 rounded-sm bg-gray-50 dark:bg-dark-slate border-l-4 theme-transition"
                          style={{
                            borderLeftColor: 
                              result.status === "success" ? "#22c55e" : 
                              result.status === "created" ? "#3b82f6" : 
                              result.status === "exists" ? "#8b5cf6" :
                              result.status === "warning" ? "#f59e0b" : 
                              "#ef4444"
                          }}
                        >
                          <p className="font-medium text-luxury-black dark:text-white text-sm theme-transition">
                            {result.bucket} - {result.status}
                          </p>
                          <p className="text-sm text-luxury-black/70 dark:text-white/70 theme-transition">
                            {result.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Card className="bg-white dark:bg-dark-graphite border-gray-100 dark:border-dark-slate shadow-elegant dark:shadow-elegant-dark theme-transition mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-serif text-luxury-black dark:text-white theme-transition">Тест загрузки файла</CardTitle>
            <CardDescription className="text-luxury-black/60 dark:text-white/60 theme-transition">
              Попробовать загрузить тестовый файл во все бакеты
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testUpload} 
              disabled={testUploadResult?.status === "loading"}
              className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
            >
              {testUploadResult?.status === "loading" ? (
                <>
                  <RefreshCw className="animate-spin h-4 w-4" />
                  <span>Тестирование...</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  <span>Тест загрузки</span>
                </>
              )}
            </Button>
            
            {testUploadResult && testUploadResult.status !== "loading" && (
              <Alert 
                variant={testUploadResult.status === "success" ? "default" : "destructive"} 
                className="mt-4"
              >
                {testUploadResult.status === "success" ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4" />
                )}
                <AlertTitle>
                  {testUploadResult.status === "success" ? "Тест пройден" : "Тест не пройден"}
                </AlertTitle>
                <AlertDescription>
                  {testUploadResult.message}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
        
        <div className="bg-white dark:bg-dark-graphite border border-gray-100 dark:border-dark-slate rounded-sm p-6 shadow-elegant dark:shadow-elegant-dark theme-transition">
          <h2 className="text-xl font-serif text-luxury-black dark:text-white mb-4 theme-transition">Инструкции по настройке политик в Supabase</h2>
          
          <div className="space-y-4 text-luxury-black/80 dark:text-white/80 theme-transition">
            <p>
              Для корректной работы загрузки файлов необходимо настроить правильные политики доступа в панели управления Supabase:
            </p>
            
            <ol className="list-decimal ml-6 space-y-2">
              <li>Войдите в панель управления Supabase</li>
              <li>Перейдите в раздел Storage</li>
              <li>Для каждого бакета (property-images, collection-covers, avatars) настройте следующие политики:</li>
            </ol>
            
            <div className="bg-gray-50 dark:bg-dark-slate p-4 rounded-sm border border-gray-100 dark:border-dark-slate theme-transition">
              <p className="font-medium mb-2">Политики для публичного чтения (SELECT):</p>
              <pre className="bg-gray-100 dark:bg-dark-charcoal p-3 rounded-sm text-sm overflow-x-auto theme-transition">
                <code>bucket_id = '[ИМЯ_БАКЕТА]'</code>
              </pre>
              <p className="text-sm mt-2 text-luxury-black/60 dark:text-white/60 theme-transition">
                Это позволит любому пользователю просматривать файлы из бакета.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-dark-slate p-4 rounded-sm border border-gray-100 dark:border-dark-slate theme-transition">
              <p className="font-medium mb-2">Политики для аутентифицированной загрузки (INSERT):</p>
              <pre className="bg-gray-100 dark:bg-dark-charcoal p-3 rounded-sm text-sm overflow-x-auto theme-transition">
                <code>bucket_id = '[ИМЯ_БАКЕТА]' AND auth.role() = 'authenticated'</code>
              </pre>
              <p className="text-sm mt-2 text-luxury-black/60 dark:text-white/60 theme-transition">
                Эта политика разрешит загрузку файлов только аутентифицированным пользователям.
              </p>
            </div>
            
            <Alert className="mt-4">
              <AlertTitle>Важно!</AlertTitle>
              <AlertDescription>
                После настройки политик, перезапустите приложение и проверьте работу загрузки файлов в разделе профиля или при создании коллекции.
              </AlertDescription>
            </Alert>
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