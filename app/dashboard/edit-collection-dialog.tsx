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
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { updateCollection } from "./actions"
import { Pencil, Upload, X } from "lucide-react"
import { getBrowserClient } from "@/lib/supabase"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Название коллекции должно содержать не менее 2 символов.",
  }),
  description: z.string().optional(),
})

interface EditCollectionDialogProps {
  userId: string
  collection: {
    id: string
    name: string
    description?: string | null
    cover_image?: string | null
  }
}

export function EditCollectionDialog({ userId, collection }: EditCollectionDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [currentCoverImage, setCurrentCoverImage] = useState<string | null>(collection.cover_image || null)
  const supabase = getBrowserClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: collection.name,
      description: collection.description || "",
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
      setCurrentCoverImage(null);
    }
  }

  const removeCoverImage = () => {
    setCoverImage(null)
    setCoverPreview(null)
    setCurrentCoverImage(null)
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
      let coverImageUrl = currentCoverImage;
      
      if (coverImage) {
        const newCoverUrl = await handleCoverImageUpload(coverImage);
        if (newCoverUrl) {
          coverImageUrl = newCoverUrl;
        }
      }
      
      const result = await updateCollection(collection.id, userId, values.name, values.description, coverImageUrl)

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Не удалось обновить коллекцию",
          description: result.error,
        })
      } else {
        toast({
          title: "Коллекция обновлена",
          description: "Данные коллекции успешно обновлены.",
        })
        setOpen(false)

        // Refresh the page to show updated data
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
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 rounded-sm bg-transparent hover:bg-gray-100 dark:hover:bg-dark-slate text-gray-500 dark:text-gray-400 hover:text-luxury-black dark:hover:text-white z-10"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-sm border-0 bg-dark-graphite text-white shadow-elegant-dark theme-transition">
        {/* Override close button styles */}
        <style jsx global>{`
          .edit-collection-dialog .dialog-close-button {
            color: white;
            opacity: 0.7;
          }
          .edit-collection-dialog .dialog-close-button:hover {
            opacity: 1;
            background: rgba(255, 255, 255, 0.1);
          }
        `}</style>
        <div className="edit-collection-dialog">
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm transition-opacity focus:outline-none focus:ring-0 disabled:pointer-events-none dialog-close-button">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </div>
        <DialogHeader>
          <DialogTitle className="text-xl font-display text-white">Редактировать коллекцию</DialogTitle>
          <DialogDescription className="text-white/70">
            Измените название, описание или обложку коллекции.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium">Название коллекции</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Элитные квартиры" 
                      className="rounded-sm border-dark-slate bg-dark-slate text-white focus-visible:ring-luxury-royalBlue/50 py-5" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-error" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium">Описание коллекции</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Описание коллекции (необязательно)" 
                      className="rounded-sm border-dark-slate bg-dark-slate text-white focus-visible:ring-luxury-royalBlue/50 py-2 min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-error" />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <FormLabel className="text-white font-medium">Обложка коллекции</FormLabel>
              
              {(coverPreview || currentCoverImage) ? (
                <div className="relative mt-2 rounded-sm overflow-hidden aspect-[3/2] border border-dark-slate">
                  <Image 
                    src={coverPreview || currentCoverImage || ''} 
                    alt="Предпросмотр" 
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
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-dark-slate rounded-sm cursor-pointer bg-dark-slate hover:bg-dark-slate/80"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-gray-300" />
                      <p className="mb-2 text-sm text-gray-300">
                        <span className="font-medium">Загрузить обложку</span>
                      </p>
                      <p className="text-xs text-gray-400">PNG, JPG (макс. 5MB)</p>
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
                className="border-dark-slate hover:bg-white/5 rounded-sm text-white"
              >
                Отмена
              </Button>
              <Button 
                type="submit"
                variant="default" 
                disabled={isLoading}
                className="rounded-sm bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white"
              >
                <span className="text-white">{isLoading ? "Сохранение..." : "Сохранить"}</span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}