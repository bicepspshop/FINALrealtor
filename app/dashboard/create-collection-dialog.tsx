"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { useToast } from "@/hooks/use-toast"
import { createCollection } from "./actions"
import { PlusCircle } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Название коллекции должно содержать не менее 2 символов.",
  }),
})

interface CreateCollectionDialogProps {
  userId: string
  buttonText?: string
}

export function CreateCollectionDialog({ userId, buttonText = "Создать коллекцию" }: CreateCollectionDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const result = await createCollection(values.name, userId)

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Не удалось создать коллекцию",
          description: result.error,
        })
      } else {
        toast({
          title: "Коллекция создана",
          description: "Ваша новая коллекция успешно создана.",
        })
        setOpen(false)
        form.reset()
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
          className="flex items-center gap-2 bg-[#D4AF37] dark:bg-[#1E3A8A] hover:bg-[#C09A2C] dark:hover:bg-[#1E3A8A]/90 text-white transition-colors duration-300"
        >
          <PlusCircle size={18} className="text-white" />
          <span className="text-white">{buttonText}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-display text-luxury-black">Создать новую коллекцию</DialogTitle>
          <DialogDescription className="text-luxury-black/70">
            Создайте новую коллекцию для организации объектов недвижимости для ваших клиентов.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-luxury-black/80 font-medium">Название коллекции</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Элитные квартиры" 
                      className="rounded-sm border-gray-200 focus-visible:ring-luxury-gold/50 py-5" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)} 
                className="border-luxury-black/20 hover:bg-luxury-black/5 rounded-sm"
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
