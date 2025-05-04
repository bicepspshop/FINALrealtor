"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { NavBar } from "@/components/nav-bar"
import { useToast } from "@/hooks/use-toast"
import { updateProfile, getProfile } from "./actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Check, User, ArrowLeft, Upload, X } from "lucide-react"
import { getBrowserClient } from "@/lib/supabase"
import { uploadAvatar } from "@/lib/upload"

// Define schema for form validation
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Имя должно содержать не менее 2 символов.",
  }),
  phone: z.string().min(5, {
    message: "Телефон должен содержать не менее 5 символов.",
  }),
  description: z.string().optional(),
});

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState<{ id: string; name: string; email: string }>()
  const [initialLoadError, setInitialLoadError] = useState<string | null>(null)
  const [isFixingSchema, setIsFixingSchema] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(null)
  const supabase = getBrowserClient()

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      description: "",
    },
  })

  // Handle avatar file change
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Размер файла не должен превышать 5MB",
        });
        return;
      }
      
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Поддерживаются только JPEG, PNG, WEBP и GIF",
        });
        return;
      }
      
      setAvatarFile(file);
      
      // Create a preview URL for the file
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  }

  // Remove avatar
  const handleRemoveAvatar = () => {
    setAvatarFile(null)
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview)
      setAvatarPreview(null)
    }
  }

  // Function to handle avatar upload using server-side API
  const handleAvatarUpload = async (file: File): Promise<string | null> => {
    try {
      if (!user?.id) {
        toast({
          variant: "destructive",
          title: "Ошибка загрузки",
          description: "Не удалось определить ID пользователя",
        });
        return null;
      }
      
      // Create form data for upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'avatars');
      
      // Send to server-side API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (!result.success) {
        console.error("Server upload failed:", result.error);
        toast({
          variant: "destructive",
          title: "Ошибка загрузки",
          description: `Не удалось загрузить изображение: ${result.error}`,
        });
        return null;
      }
      
      console.log("Avatar upload successful via server:", result.url);
      return result.url;
    } catch (error) {
      console.error("Ошибка при загрузке аватара:", error);
      toast({
        variant: "destructive",
        title: "Ошибка загрузки",
        description: "Произошла непредвиденная ошибка при загрузке изображения",
      });
      return null;
    }
  }

  // Get user session and profile data
  useEffect(() => {
    async function fetchUserData() {
      try {
        // Get user from cookie/session
        const response = await fetch("/api/auth/session")
        const sessionData = await response.json()
        
        if (!sessionData || !sessionData.user) {
          router.push("/login")
          return
        }
        
        setUser(sessionData.user)
        
        // Get user profile
        const profileResult = await getProfile(sessionData.user.id)
        
        if (profileResult.success && profileResult.profile) {
          form.reset({
            name: profileResult.profile.name || "",
            phone: profileResult.profile.phone || "",
            description: profileResult.profile.description || "",
          })
          
          // Set current avatar URL
          if (profileResult.profile.avatar_url) {
            setCurrentAvatarUrl(profileResult.profile.avatar_url)
          }
        } else {
          setInitialLoadError(profileResult.error || "Не удалось загрузить данные профиля")
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error)
        setInitialLoadError("Произошла ошибка при загрузке данных профиля")
      } finally {
        setLoading(false)
      }
    }
    
    fetchUserData()
  }, [router, form])

  // Submit form handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return
    
    setIsSubmitting(true)
    setSuccessMessage(null)
    
    try {
      let avatarUrl = currentAvatarUrl
      
      // If a new avatar file was selected, upload it
      if (avatarFile) {
        const uploadedUrl = await handleAvatarUpload(avatarFile)
        if (uploadedUrl) {
          avatarUrl = uploadedUrl
        }
      }
      
      const result = await updateProfile(user.id, {
        ...values,
        avatar_url: avatarUrl
      })
      
      if (result.success) {
        toast({
          title: "Профиль обновлен",
          description: "Ваш профиль был успешно обновлен",
        })
        setSuccessMessage("Профиль успешно обновлен")
        
        // Update the current avatar URL state
        if (avatarUrl !== currentAvatarUrl) {
          setCurrentAvatarUrl(avatarUrl)
        }
        
        // Clear the temporary preview if we uploaded successfully
        if (avatarFile) {
          setAvatarFile(null)
          if (avatarPreview) {
            URL.revokeObjectURL(avatarPreview)
            setAvatarPreview(null)
          }
        }
      } else {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: result.error || "Не удалось обновить профиль",
        })
      }
    } catch (error) {
      console.error("Ошибка при обновлении профиля:", error)
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Произошла ошибка при обновлении профиля",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // If loading, show loading indicator
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-dark-charcoal dark:to-dark-slate theme-transition">
        <NavBar userName={user?.name || "Загрузка..."} />
        <main className="flex-1 container-luxury py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Загрузка профиля...</CardTitle>
            </CardHeader>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-dark-charcoal dark:to-dark-slate theme-transition">
      <NavBar userName={user?.name || "Пользователь"} />
      
      <main className="flex-1 container-luxury py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-medium text-luxury-black dark:text-white theme-transition">Профиль риелтора</h1>
            <div className="w-20 h-0.5 bg-luxury-gold dark:bg-luxury-royalBlue mt-2 mb-3 theme-transition"></div>
            <p className="text-luxury-black/60 dark:text-white/60 theme-transition">Управление личной информацией</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" className="border-luxury-black/20 dark:border-luxury-royalBlue/40 hover:bg-luxury-black/5 dark:hover:bg-luxury-royalBlue/10 hover:border-luxury-black/30 dark:hover:border-luxury-royalBlue/60 rounded-sm flex items-center gap-2 dark:text-white theme-transition" animation="scale">
              <ArrowLeft size={16} />
              Назад к коллекциям
            </Button>
          </Link>
        </div>
        
        {initialLoadError && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Ошибка загрузки</AlertTitle>
            <AlertDescription>{initialLoadError}</AlertDescription>
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="bg-white text-red-600 border-red-200 hover:bg-red-50" 
                onClick={async () => {
                  setIsFixingSchema(true);
                  try {
                    const response = await fetch('/api/update-schema');
                    const data = await response.json();
                    if (data.success) {
                      toast({
                        title: "Успех",
                        description: "База данных успешно обновлена. Обновите страницу.",
                      });
                      setTimeout(() => window.location.reload(), 1500);
                    } else {
                      toast({
                        variant: "destructive",
                        title: "Ошибка",
                        description: data.message || "Не удалось обновить базу данных",
                      });
                    }
                  } catch (error) {
                    console.error("Ошибка при обновлении базы данных:", error);
                    toast({
                      variant: "destructive",
                      title: "Ошибка",
                      description: "Произошла ошибка при обновлении базы данных",
                    });
                  } finally {
                    setIsFixingSchema(false);
                  }
                }}
                disabled={isFixingSchema}
              >
                {isFixingSchema ? "Обновление..." : "Обновить структуру базы данных"}
              </Button>
            </div>
          </Alert>
        )}
        
        {successMessage && (
          <Alert className="mb-8 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800/30">
            <Check className="h-4 w-4 text-green-600 dark:text-green-500" />
            <AlertTitle className="text-green-700 dark:text-green-500">Успешно</AlertTitle>
            <AlertDescription className="text-green-700/80 dark:text-green-500/90">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}
        
        <Card className="max-w-md mx-auto bg-white dark:bg-dark-graphite border-gray-100 dark:border-dark-slate shadow-elegant dark:shadow-elegant-dark theme-transition">
          <CardHeader className="pb-6">
            {/* Avatar Upload Section */}
            <div className="flex flex-col items-center mb-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 dark:border-dark-slate bg-gray-50 dark:bg-dark-slate flex items-center justify-center theme-transition">
                  {avatarPreview ? (
                    <Image 
                      src={avatarPreview} 
                      alt="Аватар" 
                      width={96} 
                      height={96} 
                      className="w-full h-full object-cover" 
                    />
                  ) : currentAvatarUrl ? (
                    <Image 
                      src={currentAvatarUrl} 
                      alt="Аватар" 
                      width={96} 
                      height={96} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <User className="h-12 w-12 text-luxury-gold dark:text-luxury-royalBlue theme-transition" />
                  )}
                </div>
                
                <div className="absolute bottom-0 right-0 flex gap-1">
                  <label className="flex items-center justify-center w-8 h-8 rounded-full bg-luxury-gold dark:bg-luxury-royalBlue text-white cursor-pointer shadow-md theme-transition">
                    <Upload size={14} />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </label>
                  
                  {(avatarPreview || currentAvatarUrl) && (
                    <button 
                      onClick={handleRemoveAvatar}
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white shadow-md"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
              
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 theme-transition">
                Загрузите фото профиля
              </p>
            </div>
            
            <CardTitle className="text-center text-2xl font-serif text-luxury-black dark:text-white theme-transition">Личная информация</CardTitle>
            <CardDescription className="text-center text-luxury-black/60 dark:text-white/60 theme-transition">
              Обновите свои контактные данные
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-luxury-black dark:text-white font-medium theme-transition">Имя</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Иван"
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-luxury-black dark:text-white font-medium theme-transition">Телефон</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+7 (900) 123-45-67"
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-luxury-black dark:text-white font-medium theme-transition">О себе</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Расскажите о своем опыте работы и специализации..."
                          className="rounded-sm border-gray-200 dark:border-dark-slate dark:bg-dark-slate dark:text-white dark:placeholder:text-white/60 focus-visible:ring-luxury-gold/50 dark:focus-visible:ring-luxury-royalBlue/50 py-3 min-h-[120px] theme-transition"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 dark:text-error theme-transition" />
                    </FormItem>
                  )}
                />
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-luxury-gold dark:bg-luxury-royalBlue text-luxury-black dark:text-white hover:bg-luxury-gold/90 dark:hover:bg-luxury-royalBlue/90 font-medium py-6 theme-transition"
                  animation="scale"
                >
                  {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
      
      <footer className="bg-luxury-black dark:bg-dark-charcoal py-10 text-white/60 mt-auto border-t border-white/5 dark:border-dark-slate theme-transition">
        <div className="container-luxury flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <h2 className="text-xl font-serif text-white mr-2 theme-transition">РиелторПро</h2>
            <span className="text-sm dark:text-white/60 theme-transition">• Платформа для риелторов</span>
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
