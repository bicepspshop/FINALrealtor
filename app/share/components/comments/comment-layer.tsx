"use client"

interface CommentLayerProps {
  children: React.ReactNode
  propertyId?: string
  collectionId?: string
}

export function CommentLayer({ children }: CommentLayerProps) {
  // This is now just a passthrough wrapper
  // We keep it to maintain compatibility with the rest of the code
  return (
    <div className="relative w-full">
      {children}
    </div>
  )
}