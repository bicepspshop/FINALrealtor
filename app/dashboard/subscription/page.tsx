import { requireAuth } from "@/lib/auth"
import { NavBar } from "@/components/nav-bar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, CreditCard, CheckCircle, AlertTriangle } from "lucide-react"
import { SubscriptionService } from "@/lib/subscription-service"

// Add client components for payment functionality
import { SubscriptionActions } from "./components/subscription-actions"
import { SubscriptionPlans } from "./components/subscription-plans"

export default async function SubscriptionPage() {
  // Get user session with auth check
  const session = await requireAuth()
  
  // Get subscription status directly from the service
  const subscriptionStatus = await SubscriptionService.getSubscriptionStatus(session.id);
  
  // Format trial end time
  let trialEndDate = "Недоступно";
  let remainingTime = "Закончился";
  
  if (subscriptionStatus.trialEndTime) {
    const date = new Date(subscriptionStatus.trialEndTime);
    trialEndDate = new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
    
    if (subscriptionStatus.remainingMinutes && subscriptionStatus.remainingMinutes > 0) {
      remainingTime = SubscriptionService.formatRemainingTime(subscriptionStatus.remainingMinutes);
    }
  }
  
  // Get user subscription data for detailed information
  const supabase = SubscriptionService.getSupabaseClient();
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("subscription_end_date, subscription_plan")
    .eq("id", session.id)
    .single();

  // Format subscription end date if available
  let subscriptionEndDate = "Бессрочно";
  if (userData?.subscription_end_date) {
    const date = new Date(userData.subscription_end_date);
    subscriptionEndDate = new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  }
  
  // Get subscription plan name
  const subscriptionPlanName = userData?.subscription_plan === 'yearly' ? 'Годовая' : 'Ежемесячная';
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-dark-charcoal dark:to-dark-slate theme-transition">
      <NavBar userName={session.name} />
      
      <main className="flex-1 container-luxury py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-serif font-medium mb-2 text-luxury-black dark:text-white theme-transition">Управление подпиской</h1>
          <div className="w-20 h-0.5 bg-luxury-gold dark:bg-luxury-royalBlue mt-2 mb-8 theme-transition"></div>
          
          {/* Subscription Status Card */}
          <Card className="mb-8 rounded-sm border-gray-100 dark:border-dark-slate shadow-subtle dark:shadow-elegant-dark theme-transition">
            <CardHeader>
              <CardTitle className="text-2xl font-medium text-luxury-black dark:text-white theme-transition">Статус подписки</CardTitle>
              <CardDescription className="text-luxury-black/70 dark:text-white/70 theme-transition">
                Информация о вашей текущей подписке
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Status Badge */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-luxury-black/80 dark:text-white/80 theme-transition">Текущий статус:</span>
                  {subscriptionStatus.status === 'trial' && (
                    <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-500 text-sm py-1 px-3 rounded-full flex items-center gap-1 theme-transition">
                      <Clock className="h-3 w-3" /> Пробный период
                    </span>
                  )}
                  {subscriptionStatus.status === 'expired' && (
                    <span className="bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-500 text-sm py-1 px-3 rounded-full flex items-center gap-1 theme-transition">
                      <AlertTriangle className="h-3 w-3" /> Пробный период истек
                    </span>
                  )}
                  {subscriptionStatus.status === 'active' && (
                    <span className="bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-500 text-sm py-1 px-3 rounded-full flex items-center gap-1 theme-transition">
                      <CheckCircle className="h-3 w-3" /> Активная подписка
                    </span>
                  )}
                </div>
                
                {/* Trial Period Info */}
                {(subscriptionStatus.status === 'trial' || subscriptionStatus.status === 'expired') && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-sm font-medium text-luxury-black/80 dark:text-white/80 theme-transition">Дата окончания пробного периода:</span>
                      <span className="text-sm text-luxury-black dark:text-white theme-transition">{trialEndDate}</span>
                    </div>
                    {subscriptionStatus.status === 'trial' && (
                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-sm font-medium text-luxury-black/80 dark:text-white/80 theme-transition">Осталось времени:</span>
                        <span className="text-sm text-luxury-black dark:text-white theme-transition">{remainingTime}</span>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Paid Subscription Info */}
                {subscriptionStatus.status === 'active' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-sm font-medium text-luxury-black/80 dark:text-white/80 theme-transition">Тип подписки:</span>
                      <span className="text-sm text-luxury-black dark:text-white theme-transition">{subscriptionPlanName}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-sm font-medium text-luxury-black/80 dark:text-white/80 theme-transition">Срок действия:</span>
                      <span className="text-sm text-luxury-black dark:text-white theme-transition">{subscriptionEndDate}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-100 dark:border-dark-slate pt-6 theme-transition">
              <div className="w-full">
                {subscriptionStatus.status !== 'active' && (
                  <Alert variant={subscriptionStatus.status === 'expired' ? 'destructive' : 'warning'} className="mb-6 rounded-sm">
                    <AlertTitle>
                      {subscriptionStatus.status === 'expired' 
                        ? 'Доступ ограничен!' 
                        : 'Оформите подписку сейчас'}
                    </AlertTitle>
                    <AlertDescription>
                      {subscriptionStatus.status === 'expired'
                        ? 'После истечения пробного периода доступ к функциям платформы ограничен. Оформите подписку для восстановления доступа.'
                        : 'Чтобы сохранить доступ ко всем функциям платформы после окончания пробного периода, оформите подписку.'}
                    </AlertDescription>
                  </Alert>
                )}
                
                {/* Client component for payment functionality */}
                <SubscriptionActions 
                  userId={session.id}
                  subscriptionStatus={subscriptionStatus.status} 
                />
              </div>
            </CardFooter>
          </Card>
          
          {/* Pricing Plans - now using client component */}
          <SubscriptionPlans />
        </div>
      </main>
    </div>
  )
} 