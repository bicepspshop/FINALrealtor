"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface SubscriptionCheckerProps {
  collectionId: string
  userId: string
}

export function SubscriptionChecker({ collectionId, userId }: SubscriptionCheckerProps) {
  const router = useRouter()
  
  useEffect(() => {
    // Initial check after component mounts
    checkSubscriptionStatus()
    
    // Set up interval to check every minute
    const interval = setInterval(checkSubscriptionStatus, 60000)
    
    // Clean up interval on unmount
    return () => clearInterval(interval)
  }, [collectionId, userId])
  
  const checkSubscriptionStatus = async () => {
    try {
      const response = await fetch(`/api/check-share-access?collectionId=${collectionId}&userId=${userId}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      })
      
      const data = await response.json()
      
      // If subscription is not active, redirect to expired page
      if (!data.isActive) {
        router.replace('/share/expired')
      }
    } catch (error) {
      console.error('Error checking subscription status:', error)
      // Don't redirect on error to prevent false positives
    }
  }
  
  // This component doesn't render anything
  return null
} 