"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  CreditCard, 
  Check, 
  X, 
  UserCheck, 
  Calendar, 
  Home, 
  FileText, 
  AlertTriangle, 
  ChevronRight,
  Clock,
  History
} from "lucide-react"
import { DealStageHistory } from "./deal-stage-history"

// Define the different stages
const DEAL_STAGES = [
  { id: "need_identified", name: "Потребность выявлена", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: UserCheck },
  { id: "working", name: "В работе", color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400", icon: CreditCard },
  { id: "meeting", name: "Встреча", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400", icon: Calendar },
  { id: "showing", name: "Показ", color: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400", icon: Home },
  { id: "contract", name: "Аванс/Договор", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", icon: FileText },
  { id: "closed", name: "Закрыто", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: Check },
  { id: "rejected", name: "Отказ", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: X }
]

// Define the different statuses
const DEAL_STATUSES = {
  active: { name: "Активно", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  paused: { name: "Приостановлено", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  closed: { name: "Закрыто", color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400" },
  rejected: { name: "Отказ", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" }
}

type DealStage = {
  id?: string
  stage: string
  status: string
  notes?: string
  created_at?: string
}

interface DealProgressTrackerProps {
  clientId: string
  currentStage?: DealStage | null
  stageHistory?: DealStage[]
}

export function DealProgressTracker({ 
  clientId, 
  currentStage = null,
  stageHistory = [] 
}: DealProgressTrackerProps) {
  const [loading, setLoading] = useState(false)
  const [activeStage, setActiveStage] = useState<string>(currentStage?.stage || "need_identified")
  const [activeStatus, setActiveStatus] = useState<string>(currentStage?.status || "active")
  const [historyOpen, setHistoryOpen] = useState(false)

  // Find the current stage object
  const currentStageInfo = DEAL_STAGES.find(s => s.id === activeStage)
  const currentStatusInfo = DEAL_STATUSES[activeStatus as keyof typeof DEAL_STATUSES]

  // Update the client's deal stage
  const updateDealStage = async (newStage: string) => {
    if (activeStage === newStage) return

    setLoading(true)
    try {
      const response = await fetch(`/api/clients/${clientId}/deal-stage/current`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          stage: newStage,
          status: activeStatus,
          notes: ""
        })
      })

      if (!response.ok) {
        throw new Error("Failed to update deal stage")
      }

      // Update UI
      setActiveStage(newStage)
      toast.success("Этап сделки обновлен")
    } catch (error) {
      console.error("Error updating deal stage:", error)
      toast.error("Не удалось обновить этап сделки")
    } finally {
      setLoading(false)
    }
  }

  // Update the client's deal status
  const updateDealStatus = async (newStatus: string) => {
    if (activeStatus === newStatus) return

    setLoading(true)
    try {
      const response = await fetch(`/api/clients/${clientId}/deal-stage/current`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          stage: activeStage,
          status: newStatus,
          notes: ""
        })
      })

      if (!response.ok) {
        throw new Error("Failed to update deal status")
      }

      // Update UI
      setActiveStatus(newStatus)
      toast.success("Статус сделки обновлен")
    } catch (error) {
      console.error("Error updating deal status:", error)
      toast.error("Не удалось обновить статус сделки")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Card className="shadow-elegant dark:shadow-elegant-dark overflow-hidden rounded-sm border-0 animate-fade-in-up theme-transition">
        <CardHeader className="border-b border-gray-100 dark:border-dark-slate bg-gray-50/50 dark:bg-dark-slate/50 py-5 theme-transition">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg text-luxury-black dark:text-white theme-transition">
              <CreditCard className="h-5 w-5 text-luxury-gold dark:text-luxury-royalBlue/90 theme-transition" />
              Прогресс сделки
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setHistoryOpen(true)}
              className="text-xs text-luxury-black/70 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-dark-slate/50 border-gray-200 dark:border-dark-slate theme-transition"
            >
              <History className="h-3.5 w-3.5 mr-1.5" />
              История
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Current Stage Badge */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-luxury-black/60 dark:text-white/60 mb-2 theme-transition">Текущий этап:</p>
              {currentStageInfo && (
                <Badge className={`${currentStageInfo.color} px-3 py-1.5 rounded-md text-sm font-medium theme-transition`}>
                  <currentStageInfo.icon className="h-3.5 w-3.5 mr-1.5" />
                  {currentStageInfo.name}
                </Badge>
              )}
            </div>
            <div>
              <p className="text-sm text-luxury-black/60 dark:text-white/60 mb-2 theme-transition">Статус:</p>
              {currentStatusInfo && (
                <Badge className={`${currentStatusInfo.color} px-3 py-1.5 rounded-md text-sm font-medium theme-transition`}>
                  {currentStatusInfo.name}
                </Badge>
              )}
            </div>
          </div>
          
          {/* Stage Progress */}
          <div className="space-y-2 mb-8">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-luxury-black/80 dark:text-white/80 font-medium theme-transition">
                Этапы сделки
              </h4>
              <p className="text-sm text-luxury-black/60 dark:text-white/60 theme-transition">
                Нажмите для перехода
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row flex-wrap items-center justify-between gap-2 md:gap-0 relative">
              {DEAL_STAGES.map((stage, index) => {
                const isActive = activeStage === stage.id
                const isPassed = DEAL_STAGES.findIndex(s => s.id === activeStage) > index
                
                return (
                  <div key={stage.id} className="flex flex-col items-center z-10 w-full md:w-auto">
                    <button
                      disabled={loading}
                      onClick={() => updateDealStage(stage.id)}
                      className={`relative w-10 h-10 flex items-center justify-center rounded-full mb-2 transition-all
                        ${isActive ? stage.color : isPassed ? 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400 theme-transition' : 'bg-gray-100 text-gray-500 dark:bg-dark-slate dark:text-gray-400 theme-transition'}
                        ${!isActive && !loading ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}
                        ${loading ? 'opacity-70' : 'opacity-100'}
                      `}
                    >
                      {isPassed ? <Check className="h-5 w-5" /> : <stage.icon className="h-5 w-5" />}
                      
                      {isActive && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-luxury-gold dark:bg-luxury-royalBlue rounded-full animate-pulse theme-transition" />
                      )}
                    </button>
                    
                    <span className={`text-xs text-center ${isActive ? 'text-luxury-black dark:text-white font-medium' : 'text-luxury-black/60 dark:text-white/60'} theme-transition`}>
                      {stage.name}
                    </span>
                  </div>
                )
              })}
              
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-100 dark:bg-dark-slate -z-10 hidden md:block theme-transition" />
            </div>
          </div>
          
          {/* Status Options */}
          <div className="space-y-2">
            <h4 className="text-luxury-black/80 dark:text-white/80 font-medium mb-3 theme-transition">
              Статус сделки
            </h4>
            
            <div className="flex flex-wrap gap-2">
              {Object.entries(DEAL_STATUSES).map(([statusKey, status]) => (
                <Button
                  key={statusKey}
                  disabled={loading}
                  variant="outline"
                  onClick={() => updateDealStatus(statusKey)}
                  className={`border rounded-md transition-all
                    ${activeStatus === statusKey ? status.color + ' border-transparent' : 'bg-transparent border-gray-200 dark:border-dark-slate text-luxury-black/70 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-dark-slate/50'}
                    theme-transition
                  `}
                >
                  {status.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History Dialog */}
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg text-luxury-black dark:text-white theme-transition">
              <Clock className="h-5 w-5 text-luxury-gold dark:text-luxury-royalBlue/90 theme-transition" />
              История изменений
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[500px] overflow-y-auto">
            <DealStageHistory
              clientId={clientId}
              stageHistory={stageHistory}
              inDialog
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 