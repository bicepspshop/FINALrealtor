"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/ui/theme/theme-toggle"
import { ThemeImage } from "@/components/ui/theme/theme-image"
import { resetPassword } from "./actions"
import { Alert, AlertDescription } from "@/components/ui/alert"

const formSchema = z.object({
  password: z.string().min(8, {
    message: "Пароль должен содержать не менее 8 символов",
  }),
  confirmPassword: z.string().min(8, {
    message: "Подтверждение пароля должно содержать не менее 8 символов",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
})

export default function ResetPasswordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [tokenError, setTokenError] = useState(false)
  const [success, setSuccess] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  // Проверяем наличие токена при загрузке страницы
  useEffect(() => {
    const token = searchParams.get("token")
    if (!token) {
      setTokenError(true)
    }
  }, [searchParams])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const token = searchParams.get("token")
      
      if (!token) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Отсутствует токен для сброса пароля",
        })
        setTokenError(true)
        return
      }

      const result = await resetPassword(token, values.password)

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: result.error,
        })
      } else {
        setSuccess(true)
        toast({
          title: "Пароль изменен",
          description: "Ваш пароль был успешно изменен",
        })
        
        // Перенаправление на страницу входа через 3 секунды
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      }
    } catch (error) {
      console.error("ResetPasswordPage: Непредвиденная ошибка:", error)
      toast({
        variant: "destructive",
        title: "Что-то пошло не так",
        description: "Пожалуйста, попробуйте позже.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex theme-transition">
      <div className="w-full md:w-1/2 bg-gradient-luxury dark:bg-gradient-silver flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 theme-transition">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-dark-graphite p-8 shadow-elegant dark:shadow-elegant-dark rounded-sm animate-fade-in-up theme-transition">
            <div className="text-center mb-8">
              <div className="flex justify-end mb-2">
                <ThemeToggle />
              </div>
              <Link href="/" className="inline-block mb-6">
                <h1 className="text-2xl font-serif font-medium tracking-tight text-luxury-black dark:text-moonstone dark:royal-accent theme-transition">
                  РиелторПро
                </h1>
              </Link>
              <h2 className="text-3xl font-display font-medium mb-2 text-luxury-black dark:text-white theme-transition">
                Смена пароля
              </h2>
              <div className="w-16 h-0.5 bg-luxury-gold dark:bg-luxury-royalBlue mx-auto mb-4 theme-transition"></div>
              <p className="text-sm text-luxury-black/70 dark:text-white/70 theme-transition">
                Установите новый пароль для вашего аккаунта
              </p>
            </div>

            {tokenError ? (
              <Alert className="bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/30 mb-6">
                <AlertDescription className="text-red-800 dark:text-red-400">
                  Ссылка для сброса пароля недействительна или срок её действия истек. Пожалуйста, запросите новую ссылку.
                </AlertDescription>
              </Alert>
            ) : success ? (
              <div className="text-center">
                <div className="mb-6 p-4 rounded-sm bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30">
                  <p className="text-green-800 dark:text-green-400">
                    Ваш пароль был успешно изменен!
                  </p>
                </div>
                <p className="text-luxury-black/70 dark:text-white/70 mb-6 text-sm theme-transition">
                  Вы будете перенаправлены на страницу входа...
                </p>
                <Link href="/login">
                  <Button 
                    className="bg-luxury-black dark:bg-luxury-royalBlue dark:text-white hover:bg-black dark:hover:bg-luxury-royalBlueMuted text-white py-6 theme-transition" 
                    animation="scale"
                  >
                    Перейти к входу
                  </Button>
                </Link>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-luxury-black/80 dark:text-white/80 font-medium theme-transition">
                          Новый пароль
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="password"
                            placeholder="********" 
                            className="rounded-sm border-gray-200 dark:border-dark-slate dark:bg-dark-slate dark:text-white dark:placeholder:text-white/60 focus-visible:ring-luxury-gold/50 dark:focus-visible:ring-luxury-royalBlue/50 py-5 theme-transition"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 dark:text-error theme-transition" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-luxury-black/80 dark:text-white/80 font-medium theme-transition">
                          Подтвердите пароль
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="password"
                            placeholder="********" 
                            className="rounded-sm border-gray-200 dark:border-dark-slate dark:bg-dark-slate dark:text-white dark:placeholder:text-white/60 focus-visible:ring-luxury-gold/50 dark:focus-visible:ring-luxury-royalBlue/50 py-5 theme-transition"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 dark:text-error theme-transition" />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-luxury-black dark:bg-luxury-royalBlue dark:text-white hover:bg-black dark:hover:bg-luxury-royalBlueMuted text-white py-6 mt-6 theme-transition" 
                    disabled={isLoading}
                    animation="scale"
                  >
                    {isLoading ? "Сохранение..." : "Сохранить новый пароль"}
                  </Button>
                </form>
              </Form>
            )}
            
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-dark-slate text-center theme-transition">
              <p className="text-luxury-black/70 dark:text-white/70 text-sm theme-transition">
                Вспомнили пароль?{" "}
                <Link href="/login" className="font-medium text-luxury-gold dark:text-blue-400 hover:text-luxury-gold/80 dark:hover:text-blue-300 transition-colors theme-transition">
                  Войти
                </Link>
              </p>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <Link href="/" className="text-xs text-gray-400 dark:text-moonstone/70 hover:text-luxury-gold dark:hover:text-luxury-royalBlue transition-colors theme-transition">
              Вернуться на главную
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden md:block w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-l from-black/70 to-black/40 dark:from-black/90 dark:to-black/70 z-10 theme-transition"></div>
          <ThemeImage 
            lightSrc="/images/house6.png"
            darkSrc="/images/flat4.png"
            alt="Недвижимость премиум-класса" 
            fill 
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 p-12 h-full flex flex-col justify-center items-end text-right">
          <h2 className="text-4xl font-serif font-medium mb-6 text-white leading-tight text-shadow-md animate-fade-in-up max-w-lg">
            Обновите ваш пароль
          </h2>
          <div className="w-16 h-1 bg-luxury-gold dark:bg-luxury-royalBlue mb-6 ml-auto animate-fade-in-up theme-transition" style={{animationDelay: '100ms'}}></div>
          <p className="text-lg text-white/90 mb-8 max-w-md leading-relaxed animate-fade-in-up" style={{animationDelay: '200ms'}}>
            Создайте новый, надежный пароль для защиты вашего аккаунта и вернитесь к работе.
          </p>
        </div>
      </div>
    </div>
  )
}