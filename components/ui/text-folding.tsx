"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface TextFoldingProps {
  text: string
  maxLength?: number
  title?: string
  className?: string
}

export function TextFolding({ 
  text, 
  maxLength = 100, 
  title = "Полный текст", 
  className = "" 
}: TextFoldingProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  // If text is shorter than maxLength, just return it
  if (text.length <= maxLength) {
    return <p className={className}>{text}</p>
  }
  
  const truncatedText = text.slice(0, maxLength).trim() + "..."

  return (
    <>
      <div className={className}>
        <p className="whitespace-pre-line">{truncatedText}</p>
        <Button 
          variant="link" 
          size="sm" 
          onClick={() => setIsExpanded(true)}
          className="p-0 h-auto text-xs mt-1 text-luxury-gold dark:text-luxury-royalBlue theme-transition"
        >
          Показать больше
        </Button>
      </div>
      
      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          
          <div className="my-4">
            <p className="whitespace-pre-line">{text}</p>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsExpanded(false)}>
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 