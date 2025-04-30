import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CollectionsSkeleton() {
  // Create an array with 6 items to show a grid of skeleton cards
  const skeletonCards = Array.from({ length: 6 }, (_, i) => i)
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {skeletonCards.map((index) => (
        <Card 
          key={index} 
          className="overflow-hidden rounded-sm border border-gray-100 dark:border-dark-slate shadow-subtle dark:shadow-elegant-dark theme-transition bg-transparent relative flex flex-col h-full"
        >
          <CardHeader className="bg-white dark:bg-dark-graphite border-b border-gray-100 dark:border-dark-slate pb-4 theme-transition">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          
          <CardContent className="pt-6 pb-4 dark:bg-dark-graphite theme-transition flex-1">
            <Skeleton className="aspect-[3/2] w-full mb-4" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
          
          <CardFooter className="bg-gray-50 dark:bg-dark-slate pt-4 border-t border-gray-100 dark:border-dark-slate theme-transition mt-auto">
            <Skeleton className="h-8 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
} 