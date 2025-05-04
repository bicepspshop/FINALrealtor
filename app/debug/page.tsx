"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NavBar } from "@/components/nav-bar"
import { ArrowLeft, Database, Upload, Home, Users, Settings, User } from "lucide-react"

export default function DebugPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-dark-charcoal dark:to-dark-slate theme-transition">
      <NavBar userName="Администратор" />
      
      <main className="flex-1 container-luxury py-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-serif font-medium text-luxury-black dark:text-white theme-transition">Инструменты отладки</h1>
            <div className="w-20 h-0.5 bg-luxury-gold dark:bg-luxury-royalBlue mt-2 mb-3 theme-transition"></div>
            <p className="text-luxury-black/60 dark:text-white/60 theme-transition">Системные инструменты для диагностики и устранения проблем</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" className="border-luxury-black/20 dark:border-luxury-royalBlue/40 hover:bg-luxury-black/5 dark:hover:bg-luxury-royalBlue/10 hover:border-luxury-black/30 dark:hover:border-luxury-royalBlue/60 rounded-sm flex items-center gap-2 dark:text-white theme-transition" animation="scale">
              <ArrowLeft size={16} />
              Вернуться в панель управления
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/debug/storage">
            <Card className="bg-white dark:bg-dark-graphite border-gray-100 dark:border-dark-slate shadow-elegant dark:shadow-elegant-dark hover:shadow-xl dark:hover:shadow-[0_25px_50px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1 group theme-transition">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-serif text-luxury-black dark:text-white flex items-center gap-2 group-hover:text-luxury-gold dark:group-hover:text-luxury-royalBlue transition-colors theme-transition">
                  <Database className="h-5 w-5" />
                  <span>Диагностика хранилища</span>
                </CardTitle>
                <CardDescription className="text-luxury-black/60 dark:text-white/60 theme-transition">
                  Проверка и настройка Supabase Storage
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-luxury-black/70 dark:text-white/70 theme-transition">
                  Инструменты для диагностики и устранения проблем с загрузкой изображений в Supabase Storage. Позволяет проверить наличие и настроить необходимые бакеты.
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/debug/auth">
            <Card className="bg-white dark:bg-dark-graphite border-gray-100 dark:border-dark-slate shadow-elegant dark:shadow-elegant-dark hover:shadow-xl dark:hover:shadow-[0_25px_50px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1 group theme-transition">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-serif text-luxury-black dark:text-white flex items-center gap-2 group-hover:text-luxury-gold dark:group-hover:text-luxury-royalBlue transition-colors theme-transition">
                  <User className="h-5 w-5" />
                  <span>Диагностика авторизации</span>
                </CardTitle>
                <CardDescription className="text-luxury-black/60 dark:text-white/60 theme-transition">
                  Проверка сессии и прав доступа
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-luxury-black/70 dark:text-white/70 theme-transition">
                  Инструменты для проверки статуса авторизации пользователя и тестирования прав доступа. Позволяет проверить корректность авторизации и проблемы с загрузкой файлов.
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/v0-debug">
            <Card className="bg-white dark:bg-dark-graphite border-gray-100 dark:border-dark-slate shadow-elegant dark:shadow-elegant-dark hover:shadow-xl dark:hover:shadow-[0_25px_50px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1 group theme-transition">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-serif text-luxury-black dark:text-white flex items-center gap-2 group-hover:text-luxury-gold dark:group-hover:text-luxury-royalBlue transition-colors theme-transition">
                  <Settings className="h-5 w-5" />
                  <span>Отладка v0</span>
                </CardTitle>
                <CardDescription className="text-luxury-black/60 dark:text-white/60 theme-transition">
                  Инструменты отладки для платформы v0
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-luxury-black/70 dark:text-white/70 theme-transition">
                  Диагностика и отладка функций платформы v0. Включает проверку сессии, аутентификации и других системных компонентов.
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/dashboard">
            <Card className="bg-white dark:bg-dark-graphite border-gray-100 dark:border-dark-slate shadow-elegant dark:shadow-elegant-dark hover:shadow-xl dark:hover:shadow-[0_25px_50px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1 group theme-transition">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-serif text-luxury-black dark:text-white flex items-center gap-2 group-hover:text-luxury-gold dark:group-hover:text-luxury-royalBlue transition-colors theme-transition">
                  <Home className="h-5 w-5" />
                  <span>Панель управления</span>
                </CardTitle>
                <CardDescription className="text-luxury-black/60 dark:text-white/60 theme-transition">
                  Вернуться в основной интерфейс
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-luxury-black/70 dark:text-white/70 theme-transition">
                  Перейти в панель управления для работы с коллекциями и объектами недвижимости в обычном режиме.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
        
        <div className="mt-10 bg-white dark:bg-dark-graphite border border-gray-100 dark:border-dark-slate rounded-sm p-6 shadow-elegant dark:shadow-elegant-dark theme-transition">
          <h2 className="text-xl font-serif text-luxury-black dark:text-white mb-4 theme-transition">Устранение проблем с загрузкой изображений</h2>
          
          <div className="space-y-4 text-luxury-black/80 dark:text-white/80 theme-transition">
            <p>
              Если у вас возникают проблемы с загрузкой изображений, выполните следующие действия:
            </p>
            
            <ol className="list-decimal ml-6 space-y-3">
              <li>
                <p className="font-medium text-luxury-black dark:text-white theme-transition">Проверьте авторизацию</p>
                <p className="text-sm mt-1">Убедитесь, что вы вошли в систему и имеете действующую сессию. Воспользуйтесь инструментом <Link href="/debug/auth" className="text-luxury-gold dark:text-luxury-royalBlue hover:underline theme-transition">диагностики авторизации</Link>.</p>
              </li>
              
              <li>
                <p className="font-medium text-luxury-black dark:text-white theme-transition">Проверьте настройки хранилища</p>
                <p className="text-sm mt-1">Убедитесь, что все необходимые бакеты созданы в Supabase Storage и имеют правильные политики доступа. Воспользуйтесь инструментом <Link href="/debug/storage" className="text-luxury-gold dark:text-luxury-royalBlue hover:underline theme-transition">диагностики хранилища</Link>.</p>
              </li>
              
              <li>
                <p className="font-medium text-luxury-black dark:text-white theme-transition">Обновите политики доступа в Supabase</p>
                <p className="text-sm mt-1">В панели управления Supabase для бакетов <code className="bg-gray-100 dark:bg-dark-slate px-1 py-0.5 rounded theme-transition">avatars</code> и <code className="bg-gray-100 dark:bg-dark-slate px-1 py-0.5 rounded theme-transition">collection-covers</code> должны быть настроены правильные политики доступа:</p>
                <ul className="list-disc ml-6 mt-2 space-y-2 text-sm">
                  <li>Политика для SELECT (чтение): <code className="bg-gray-100 dark:bg-dark-slate px-1 py-0.5 rounded theme-transition">bucket_id = '[ИМЯ_БАКЕТА]'</code></li>
                  <li>Политика для INSERT (загрузка): <code className="bg-gray-100 dark:bg-dark-slate px-1 py-0.5 rounded theme-transition">bucket_id = '[ИМЯ_БАКЕТА]' AND auth.role() = 'authenticated'</code></li>
                </ul>
              </li>
              
              <li>
                <p className="font-medium text-luxury-black dark:text-white theme-transition">Проверьте ограничения на файлы</p>
                <p className="text-sm mt-1">Убедитесь, что загружаемые файлы соответствуют ограничениям:</p>
                <ul className="list-disc ml-6 mt-2 space-y-2 text-sm">
                  <li>Максимальный размер: 5 МБ для аватаров и обложек коллекций, 10 МБ для изображений недвижимости</li>
                  <li>Поддерживаемые форматы: JPEG, PNG, WEBP, GIF</li>
                </ul>
              </li>
            </ol>
            
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-sm">
              <p className="text-blue-800 dark:text-blue-300 font-medium">Примечание:</p>
              <p className="text-blue-700 dark:text-blue-400 text-sm mt-1">
                Приложение автоматически переключится на серверную загрузку, если клиентская загрузка не работает. Это позволяет обойти проблемы с политиками доступа в Supabase.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-luxury-black dark:bg-dark-charcoal py-10 text-white/60 mt-auto border-t border-white/5 dark:border-dark-slate theme-transition">
        <div className="container-luxury flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <h2 className="text-xl font-serif text-white mr-2 theme-transition">РиелторПро</h2>
            <span className="text-sm dark:text-white/60 theme-transition">• Отладка</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/agreement" className="text-white/80 hover:text-luxury-gold dark:hover:text-luxury-royalBlue transition-colors duration-300 theme-transition">
              Пользовательское соглашение
            </Link>
            <Link href="/requisites" className="text-white/80 hover:text-luxury-gold dark:hover:text-luxury-royalBlue transition-colors duration-300 theme-transition">
              Реквизиты
            </Link>
            <p className="dark:text-white/60 theme-transition">&copy; {new Date().getFullYear()} Все права защищены</p>
          </div>
        </div>
      </footer>
    </div>
  )
}