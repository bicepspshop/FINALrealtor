"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { createCollection } from "./actions"
import { PlusCircle, Upload, X } from "lucide-react"
import { getBrowserClient } from "@/lib/supabase"
import { uploadCollectionCover } from "@/lib/upload"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Название подборки должно содержать не менее 2 символов.",
  }),
  description: z.string().optional(),
})

interface CreateCollectionDialogProps {
  userId: string
  buttonText?: string
}

export function CreateCollectionDialog({ userId, buttonText = "Создать подборку" }: CreateCollectionDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const supabase = getBrowserClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
      console.log("Cover image selected:", file.name, file.type, file.size);
    }
  }

  const removeCoverImage = () => {
    setCoverImage(null)
    if (coverPreview) {
      URL.revokeObjectURL(coverPreview)
      setCoverPreview(null)
    }
  }

  // Function to handle cover image upload using server-side API
  async function handleCoverImageUpload(file: File): Promise<string | null> {
    try {
      // Create form data for upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'collection-covers');
      
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
      
      console.log("Cover image upload successful via server:", result.url);
      return result.url;
    } catch (error) {
      console.error("Ошибка при загрузке обложки:", error);
      toast({
        variant: "destructive",
        title: "Ошибка загрузки",
        description: "Произошла непредвиденная ошибка при загрузке изображения",
      });
      return null;
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    
    try {
      let coverImageUrl = null
      
      if (coverImage) {
        coverImageUrl = await handleCoverImageUpload(coverImage)
      }
      
      const result = await createCollection(values.name, userId, coverImageUrl, values.description)

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Не удалось создать подборку",
          description: result.error,
        })
      } else {
        toast({
          title: "Подборка создана",
          description: "Ваша новая подборка успешно создана.",
        })
        setOpen(false)
        form.reset()
        removeCoverImage()
        router.refresh()
      }
    } catch (error) {
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="default"
          animation="scale" 
          className="flex items-center gap-2 bg-luxury-black dark:bg-luxury-royalBlue dark:text-white hover:bg-black dark:hover:bg-luxury-royalBlueMuted text-white py-5 px-5 rounded-sm"
        >
          <PlusCircle size={18} className="text-white" />
          <span className="text-white">{buttonText || "Создать подборку"}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-sm bg-white dark:bg-dark-graphite border-gray-100 dark:border-dark-slate theme-transition">
        <DialogHeader>
          <DialogTitle className="text-xl font-display text-luxury-black dark:text-white theme-transition">Создать новую подборку</DialogTitle>
          <DialogDescription className="text-luxury-black/70 dark:text-white/70 theme-transition">
            Создайте новую подборку для организации объектов недвижимости для ваших клиентов.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-luxury-black/80 dark:text-white/80 font-medium theme-transition">Название подборки</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Элитные квартиры" 
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
                  <FormLabel className="text-luxury-black/80 dark:text-white/80 font-medium theme-transition">Описание подборки</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Опишите подборку (необязательно)" 
                      className="rounded-sm border-gray-200 dark:border-dark-slate dark:bg-dark-slate dark:text-white dark:placeholder:text-white/60 focus-visible:ring-luxury-gold/50 dark:focus-visible:ring-luxury-royalBlue/50 py-2 min-h-[100px] theme-transition" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-error theme-transition" />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <FormLabel className="text-luxury-black/80 dark:text-white/80 font-medium theme-transition">Обложка подборки</FormLabel>
              
              {coverPreview ? (
                <div className="relative mt-2 rounded-sm overflow-hidden aspect-[3/2]">
                  <Image 
                    src={coverPreview} 
                    alt="Preview" 
                    width={400}
                    height={266}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 w-8 h-8 rounded-full"
                    onClick={removeCoverImage}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <div className="relative mt-2">
                  <label
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-dark-slate/80 rounded-sm cursor-pointer bg-gray-50 dark:bg-dark-slate hover:bg-gray-100 dark:hover:bg-dark-slate/80 theme-transition"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-gray-400 dark:text-gray-300 theme-transition" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-300 theme-transition">
                        <span className="font-medium">Загрузить обложку</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 theme-transition">PNG, JPG (макс. 5MB)</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleCoverImageChange}
                    />
                  </label>
                </div>
              )}
            </div>
            <DialogFooter className="gap-2 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)} 
                className="border-luxury-black/20 dark:border-white/20 hover:bg-luxury-black/5 dark:hover:bg-white/5 rounded-sm text-luxury-black dark:text-white theme-transition"
              >
                Отмена
              </Button>
              <Button 
                type="submit"
                variant="default" 
                disabled={isLoading}
                className="rounded-sm bg-[#D4AF37] dark:bg-[#1E3A8A] hover:bg-[#C09A2C] dark:hover:bg-[#1E3A8A]/90 text-white transition-colors duration-300"
              >
                <span className="text-white">{isLoading ? "Создание..." : "Создать"}</span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
