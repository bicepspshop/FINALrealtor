"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Trash, Copy, ExternalLink, Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { deleteCollection, generateShareLink } from "./actions"
import { toHumanReadableUrl } from "@/lib/utils"
import { ShareModal } from "@/components/share-modal"

interface CollectionActionsProps {
  collectionId: string
  userId: string
  hasShareLink: boolean
  shareId?: string
}

export function CollectionActions({ collectionId, userId, hasShareLink, shareId }: CollectionActionsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [localShareId, setLocalShareId] = useState(shareId)
  const [localHasShareLink, setLocalHasShareLink] = useState(hasShareLink)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const result = await deleteCollection(collectionId, userId)

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Не удалось удалить коллекцию",
          description: result.error,
        })
      } else {
        toast({
          title: "Коллекция удалена",
          description: "Коллекция была успешно удалена.",
        })
        setIsDeleteDialogOpen(false)
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

  const handleGenerateShareLink = async () => {
    setIsLoading(true)
    try {
      const result = await generateShareLink(collectionId, userId)

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Не удалось создать ссылку",
          description: result.error,
        })
      } else {
        // Update local state to show the Copy/Go buttons immediately
        setLocalShareId(result.shareId)
        setLocalHasShareLink(true)
        
        // Open share modal instead of directly copying to clipboard
        setIsShareModalOpen(true)
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

  const copyToClipboard = async () => {
    try {
      // Use local state for share link status
      if (localShareId) {
        // Open share modal instead of directly copying to clipboard
        setIsShareModalOpen(true)
      }
      // If no shareId, but has flag hasShareLink, generate link
      else if (localHasShareLink) {
        handleGenerateShareLink()
      }
      // If no shareId or hasShareLink flag, create new link
      else {
        handleGenerateShareLink()
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Не удалось скопировать ссылку",
        description: "Произошла ошибка при копировании ссылки",
      })
    }
  }

  return (
    <div className="flex justify-between w-full">
      <div className="flex gap-2">
        <Button 
          variant="minimal" 
          size="sm" 
          onClick={copyToClipboard} 
          disabled={isLoading}
          className="bg-black dark:bg-[#4A6FA5] text-white hover:bg-black/80 dark:hover:bg-[#3B5B8C] flex items-center gap-1.5 px-2.5 py-1 transition-colors duration-300"
        >
          {localHasShareLink ? (
            <>
              <Copy className="h-4 w-4" />
              <span className="hidden md:inline">Копировать</span>
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4" />
              <span className="hidden md:inline">Создать ссылку</span>
            </>
          )}
        </Button>

        {localHasShareLink && localShareId && (
          <Button 
            variant="minimal" 
            size="sm" 
            onClick={() => router.push(`/share/${localShareId}`)} 
            disabled={isLoading}
            className="bg-black dark:bg-[#4A6FA5] text-white hover:bg-black/80 dark:hover:bg-[#3B5B8C] flex items-center gap-1.5 px-2.5 py-1 transition-colors duration-300"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="hidden md:inline">Перейти</span>
          </Button>
        )}
      </div>

      <Button 
        variant="minimal" 
        size="sm" 
        onClick={() => setIsDeleteDialogOpen(true)} 
        disabled={isLoading}
        className="text-red-500 hover:text-red-600 hover:bg-red-50 flex items-center gap-1.5 px-2.5 py-1 transition-colors duration-300"
      >
        <Trash className="h-4 w-4" />
        <span className="hidden md:inline">Удалить</span>
      </Button>

      {/* Диалог подтверждения удаления */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-display text-luxury-black">Удалить коллекцию</DialogTitle>
            <DialogDescription className="text-luxury-black/70">
              Вы уверены, что хотите удалить эту коллекцию? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-6">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)} 
              disabled={isLoading}
              className="border-luxury-black/20 hover:bg-luxury-black/5 rounded-sm"
            >
              Отмена
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={isLoading}
              className="bg-red-500 hover:bg-red-600 text-white rounded-sm"
            >
              {isLoading ? "Удаление..." : "Удалить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Share Modal */}
      {localShareId && (
        <ShareModal
          shareId={localShareId}
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}
    </div>
  )
}
