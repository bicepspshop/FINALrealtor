"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  CreditCard, 
  Check, 
  X, 
  UserCheck, 
  Calendar, 
  Home, 
  FileText, 
  Clock 
} from "lucide-react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"

// Define the different stages
const DEAL_STAGES = {
  need_identified: { name: "Потребность выявлена", icon: UserCheck, color: "text-blue-600 dark:text-blue-400" },
  working: { name: "В работе", icon: CreditCard, color: "text-violet-600 dark:text-violet-400" },
  meeting: { name: "Встреча", icon: Calendar, color: "text-indigo-600 dark:text-indigo-400" },
  showing: { name: "Показ", icon: Home, color: "text-teal-600 dark:text-teal-400" },
  contract: { name: "Аванс/Договор", icon: FileText, color: "text-amber-600 dark:text-amber-400" },
  closed: { name: "Закрыто", icon: Check, color: "text-green-600 dark:text-green-400" },
  rejected: { name: "Отказ", icon: X, color: "text-red-600 dark:text-red-400" }
}

// Define the different statuses
const DEAL_STATUSES = {
  active: { name: "Активно", color: "text-green-600 dark:text-green-400" },
  paused: { name: "Приостановлено", color: "text-amber-600 dark:text-amber-400" },
  closed: { name: "Закрыто", color: "text-gray-600 dark:text-gray-400" },
  rejected: { name: "Отказ", color: "text-red-600 dark:text-red-400" }
}

type DealStage = {
  id?: string
  stage: string
  status: string
  notes?: string
  created_at?: string
}

interface DealStageHistoryProps {
  clientId: string
  stageHistory?: DealStage[]
  inDialog?: boolean
}

export function DealStageHistory({ 
  clientId, 
  stageHistory = [],
  inDialog = false
}: DealStageHistoryProps) {
  const [history, setHistory] = useState<DealStage[]>(stageHistory)
  const [loading, setLoading] = useState<boolean>(false)

  // Fetch history if not provided
  useEffect(() => {
    if (stageHistory.length === 0) {
      fetchHistory()
    }
  }, [clientId, stageHistory])

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/clients/${clientId}/deal-stage/history`)
      if (!response.ok) {
        throw new Error("Failed to fetch deal stage history")
      }
      const data = await response.json()
      setHistory(data.data || [])
    } catch (error) {
      console.error("Error fetching deal stage history:", error)
    } finally {
      setLoading(false)
    }
  }

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Н/Д"
    return format(new Date(dateString), "d MMMM yyyy, HH:mm", { locale: ru })
  }

  // If shown in a dialog, render without the Card wrapper
  if (inDialog) {
    return (
      <div className="p-3">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-luxury-gold dark:border-luxury-royalBlue theme-transition"></div>
          </div>
        ) : history.length === 0 ? (
          <p className="text-center py-6 text-luxury-black/60 dark:text-white/60 theme-transition">
            История изменений пуста
          </p>
        ) : (
          <div className="space-y-4">
            {history.map((stage, index) => {
              const stageInfo = DEAL_STAGES[stage.stage as keyof typeof DEAL_STAGES]
              const statusInfo = DEAL_STATUSES[stage.status as keyof typeof DEAL_STATUSES]
              
              if (!stageInfo) return null
              
              const StageIcon = stageInfo.icon
              
              return (
                <div 
                  key={stage.id || index} 
                  className={`relative pl-8 pb-6 ${index !== history.length - 1 ? 'border-l-2 border-gray-100 dark:border-dark-slate ml-3 theme-transition' : ''}`}
                >
                  <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-white dark:bg-dark-graphite flex items-center justify-center border-2 border-gray-100 dark:border-dark-slate theme-transition">
                    <StageIcon className={`h-4 w-4 ${stageInfo.color} theme-transition`} />
                  </div>
                  
                  <div className="pb-1">
                    <span className="text-sm font-medium text-luxury-black dark:text-white theme-transition">
                      {stageInfo.name}
                    </span>
                    {" "}
                    <span className={`text-xs ${statusInfo.color} theme-transition`}>
                      ({statusInfo.name})
                    </span>
                  </div>
                  
                  <div className="text-xs text-luxury-black/60 dark:text-white/60 flex items-center gap-1 mb-1.5 theme-transition">
                    <Clock className="h-3 w-3" />
                    {formatDate(stage.created_at)}
                  </div>
                  
                  {stage.notes && (
                    <p className="text-sm text-luxury-black/80 dark:text-white/80 bg-gray-50 dark:bg-dark-slate/50 p-3 rounded-sm mt-2 theme-transition">
                      {stage.notes}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  // Default view with Card wrapper
  return (
    <Card className="shadow-elegant dark:shadow-elegant-dark overflow-hidden rounded-sm border-0 animate-fade-in-up theme-transition">
      <CardHeader className="border-b border-gray-100 dark:border-dark-slate bg-gray-50/50 dark:bg-dark-slate/50 py-5 theme-transition">
        <CardTitle className="flex items-center gap-2 text-lg text-luxury-black dark:text-white theme-transition">
          <Clock className="h-5 w-5 text-luxury-gold dark:text-luxury-royalBlue/90 theme-transition" />
          История изменений
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-luxury-gold dark:border-luxury-royalBlue theme-transition"></div>
          </div>
        ) : history.length === 0 ? (
          <p className="text-center py-6 text-luxury-black/60 dark:text-white/60 theme-transition">
            История изменений пуста
          </p>
        ) : (
          <div className="space-y-4">
            {history.map((stage, index) => {
              const stageInfo = DEAL_STAGES[stage.stage as keyof typeof DEAL_STAGES]
              const statusInfo = DEAL_STATUSES[stage.status as keyof typeof DEAL_STATUSES]
              
              if (!stageInfo) return null
              
              const StageIcon = stageInfo.icon
              
              return (
                <div 
                  key={stage.id || index} 
                  className={`relative pl-8 pb-6 ${index !== history.length - 1 ? 'border-l-2 border-gray-100 dark:border-dark-slate ml-3 theme-transition' : ''}`}
                >
                  <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-white dark:bg-dark-graphite flex items-center justify-center border-2 border-gray-100 dark:border-dark-slate theme-transition">
                    <StageIcon className={`h-4 w-4 ${stageInfo.color} theme-transition`} />
                  </div>
                  
                  <div className="pb-1">
                    <span className="text-sm font-medium text-luxury-black dark:text-white theme-transition">
                      {stageInfo.name}
                    </span>
                    {" "}
                    <span className={`text-xs ${statusInfo.color} theme-transition`}>
                      ({statusInfo.name})
                    </span>
                  </div>
                  
                  <div className="text-xs text-luxury-black/60 dark:text-white/60 flex items-center gap-1 mb-1.5 theme-transition">
                    <Clock className="h-3 w-3" />
                    {formatDate(stage.created_at)}
                  </div>
                  
                  {stage.notes && (
                    <p className="text-sm text-luxury-black/80 dark:text-white/80 bg-gray-50 dark:bg-dark-slate/50 p-3 rounded-sm mt-2 theme-transition">
                      {stage.notes}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 