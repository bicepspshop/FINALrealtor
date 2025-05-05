'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CreditCard, Loader2 } from 'lucide-react'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

// Define props for the component
interface SubscriptionActionsProps {
  userId: string
  subscriptionStatus: 'trial' | 'active' | 'expired' | 'unknown'
}

export function SubscriptionActions({ userId, subscriptionStatus }: SubscriptionActionsProps) {
  // State for dialog
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Handler for subscribing
  const handleSubscription = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Call the API to initiate payment
      const response = await fetch('/api/subscription/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType: selectedPlan,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Не удалось создать платеж')
      }

      // Redirect to YooKassa payment page
      window.location.href = data.confirmationUrl
    } catch (err: any) {
      console.error('Payment error:', err)
      setError(err.message || 'Произошла ошибка при создании платежа')
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button 
        className="w-full bg-luxury-gold hover:bg-luxury-goldMuted dark:bg-luxury-royalBlue dark:hover:bg-luxury-royalBlueMuted text-luxury-black dark:text-white py-6 theme-transition"
        onClick={() => setIsOpen(true)}
      >
        <CreditCard className="mr-2 h-4 w-4" />
        {subscriptionStatus === 'active'
          ? 'Управление платежами'
          : 'Оформить подписку'}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md rounded-sm border-gray-100 dark:border-dark-slate shadow-subtle dark:shadow-elegant-dark theme-transition">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium text-luxury-black dark:text-white theme-transition">
              Выберите план подписки
            </DialogTitle>
            <DialogDescription className="text-luxury-black/70 dark:text-white/70 theme-transition">
              Выберите тариф, который подходит вашим потребностям
            </DialogDescription>
          </DialogHeader>

          <div className="pt-4 pb-6">
            <RadioGroup 
              defaultValue={selectedPlan} 
              onValueChange={(value) => setSelectedPlan(value as 'monthly' | 'yearly')}
              className="space-y-4"
            >
              <div className="flex items-start space-x-3 border border-gray-200 dark:border-dark-slate p-4 rounded-sm cursor-pointer hover:border-luxury-gold dark:hover:border-luxury-royalBlue transition-colors theme-transition">
                <RadioGroupItem value="monthly" id="monthly" className="mt-1" />
                <div className="flex-1">
                  <Label 
                    htmlFor="monthly" 
                    className="text-luxury-black dark:text-white font-serif text-lg theme-transition"
                  >
                    Ежемесячный план
                  </Label>
                  <p className="text-luxury-black/70 dark:text-white/70 text-sm mt-1 theme-transition">
                    2 000 ₽ в месяц
                  </p>
                  <p className="text-luxury-black/70 dark:text-white/70 text-xs mt-2 theme-transition">
                    Автоматическое продление каждый месяц
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 border-2 border-luxury-gold dark:border-luxury-royalBlue p-4 rounded-sm relative cursor-pointer theme-transition">
                <RadioGroupItem value="yearly" id="yearly" className="mt-1" />
                <div className="flex-1">
                  <div className="absolute -right-3 -top-3 bg-luxury-gold dark:bg-luxury-royalBlue text-white py-1 px-2 rounded-sm text-xs font-medium theme-transition">
                    Экономия 30%
                  </div>
                  <Label 
                    htmlFor="yearly" 
                    className="text-luxury-black dark:text-white font-serif text-lg theme-transition"
                  >
                    Годовой план
                  </Label>
                  <p className="text-luxury-black/70 dark:text-white/70 text-sm mt-1 theme-transition">
                    16 800 ₽ в год (1 400 ₽/месяц)
                  </p>
                  <p className="text-luxury-black/70 dark:text-white/70 text-xs mt-2 theme-transition">
                    Автоматическое продление каждый год
                  </p>
                </div>
              </div>
            </RadioGroup>

            {error && (
              <div className="mt-4 text-sm text-red-600 dark:text-red-400 theme-transition">
                {error}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button 
              onClick={() => setIsOpen(false)} 
              variant="outline" 
              className="border-gray-200 dark:border-dark-slate dark:text-white hover:bg-gray-100 dark:hover:bg-dark-slate/50 theme-transition"
            >
              Отмена
            </Button>
            <Button 
              onClick={handleSubscription} 
              className="bg-luxury-gold hover:bg-luxury-goldMuted dark:bg-luxury-royalBlue dark:hover:bg-luxury-royalBlueMuted text-luxury-black dark:text-white theme-transition"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Загрузка...
                </>
              ) : (
                'Оплатить'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 