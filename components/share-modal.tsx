"use client"

import { useState } from "react"
import { Copy, Mail } from "lucide-react"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface ShareModalProps {
  shareId: string
  isOpen: boolean
  onClose: () => void
}

export function ShareModal({ shareId, isOpen, onClose }: ShareModalProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  
  // Generate both versions of the URL
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const machineUrl = `${baseUrl}/share/${shareId}`
  
  // Function to convert the URL to a human-readable form with Cyrillic characters
  const getReadableUrl = (url: string) => {
    // Using a more robust regex approach to handle different domain variations
    return url
      .replace(/www\.xn--e1afkmafcebq\.xn--p1ai/g, 'www.риелторпро.рф')
      .replace(/xn--e1afkmafcebq\.xn--p1ai/g, 'риелторпро.рф')
      .replace(/www\.xn--e1afkmafcebq/g, 'www.риелторпро')
      .replace(/xn--e1afkmafcebq/g, 'риелторпро')
      .replace(/\.xn--p1ai/g, '.рф')
  }
  
  // Get the human-readable URL with Cyrillic characters
  const readableUrl = getReadableUrl(machineUrl)
  
  // Copy the readable URL with Cyrillic characters
  const copyFullUrl = async () => {
    try {
      await navigator.clipboard.writeText(readableUrl)
      setCopied(true)
      
      toast({
        title: "Ссылка скопирована",
        description: "Ссылка скопирована в буфер обмена",
      })
      
      // Reset copied state after a delay
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Не удалось скопировать ссылку",
        description: "Произошла ошибка при копировании ссылки",
      })
    }
  }
  
  const shareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(readableUrl)}`
    window.open(url, '_blank')
  }
  
  const shareEmail = () => {
    const url = `mailto:?subject=Коллекция недвижимости&body=${encodeURIComponent(readableUrl)}`
    window.open(url, '_blank')
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md dark:bg-dark-graphite theme-transition">
        <DialogHeader>
          <DialogTitle className="dark:text-white theme-transition">Поделиться коллекцией</DialogTitle>
          <DialogDescription className="dark:text-white/70 theme-transition">
            Используйте эту ссылку для обмена коллекцией с клиентами
          </DialogDescription>
        </DialogHeader>
        
        {/* Show the readable URL for visual reference */}
        <div className="p-4 bg-gray-50 dark:bg-dark-slate rounded-sm border border-gray-100 dark:border-dark-charcoal mb-4 theme-transition">
          <p className="text-gray-500 dark:text-white/60 text-sm mb-1 theme-transition">Ссылка в удобном формате:</p>
          <p className="font-medium break-all text-luxury-black dark:text-white theme-transition">{readableUrl}</p>
        </div>
        
        {/* Sharing buttons */}
        <div className="grid gap-4">
          <Button 
            onClick={copyFullUrl}
            className="flex items-center gap-2 bg-luxury-black dark:bg-luxury-royalBlue text-white dark:text-white hover:bg-black dark:hover:bg-luxury-royalBlueMuted theme-transition"
            animation="scale"
          >
            <Copy className="h-4 w-4" />
            <span>Копировать ссылку</span>
          </Button>
          
          {/* WhatsApp sharing */}
          <Button 
            variant="outline"
            onClick={shareWhatsApp}
            className="flex items-center gap-2 border-luxury-black/20 dark:border-luxury-royalBlue/30 hover:bg-luxury-black/5 dark:hover:bg-luxury-royalBlue/10 dark:text-white theme-transition"
            animation="scale"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span>Отправить в WhatsApp</span>
          </Button>
          
          {/* Email sharing */}
          <Button 
            variant="outline"
            onClick={shareEmail}
            className="flex items-center gap-2 border-luxury-black/20 dark:border-luxury-royalBlue/30 hover:bg-luxury-black/5 dark:hover:bg-luxury-royalBlue/10 dark:text-white theme-transition"
            animation="scale"
          >
            <Mail className="h-4 w-4" />
            <span>Отправить по email</span>
          </Button>
        </div>
        
        <DialogFooter className="mt-4">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="dark:text-white theme-transition"
          >
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
