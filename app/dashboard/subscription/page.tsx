import { getSession, requireAuth } from "@/lib/auth"
import { NavBar } from "@/components/nav-bar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, CreditCard, CheckCircle, AlertTriangle } from "lucide-react"
import { formatRemainingTrialTime } from "@/lib/subscription"

export default async function SubscriptionPage() {
  // Get user session with auth check
  const session = await requireAuth()
  
  // Default values
  let subscriptionStatus = session.subscriptionStatus || 'unknown';
  let trialInfo = session.trialInfo || { isActive: false, subscriptionStatus: 'unknown' };
  
  // Format trial end time
  let trialEndDate = "Недоступно";
  let remainingTime = "Закончился";
  
  if (trialInfo.trialEndTime) {
    const date = new Date(trialInfo.trialEndTime);
    trialEndDate = new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
    
    if (trialInfo.remainingMinutes && trialInfo.remainingMinutes > 0) {
      remainingTime = formatRemainingTrialTime(trialInfo.remainingMinutes);
    }
  }
  
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
                  {subscriptionStatus === 'trial' && (
                    <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-500 text-sm py-1 px-3 rounded-full flex items-center gap-1 theme-transition">
                      <Clock className="h-3 w-3" /> Пробный период
                    </span>
                  )}
                  {subscriptionStatus === 'expired' && (
                    <span className="bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-500 text-sm py-1 px-3 rounded-full flex items-center gap-1 theme-transition">
                      <AlertTriangle className="h-3 w-3" /> Пробный период истек
                    </span>
                  )}
                  {subscriptionStatus === 'active' && (
                    <span className="bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-500 text-sm py-1 px-3 rounded-full flex items-center gap-1 theme-transition">
                      <CheckCircle className="h-3 w-3" /> Активная подписка
                    </span>
                  )}
                </div>
                
                {/* Trial Period Info */}
                {(subscriptionStatus === 'trial' || subscriptionStatus === 'expired') && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-sm font-medium text-luxury-black/80 dark:text-white/80 theme-transition">Дата окончания пробного периода:</span>
                      <span className="text-sm text-luxury-black dark:text-white theme-transition">{trialEndDate}</span>
                    </div>
                    {subscriptionStatus === 'trial' && (
                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-sm font-medium text-luxury-black/80 dark:text-white/80 theme-transition">Осталось времени:</span>
                        <span className="text-sm text-luxury-black dark:text-white theme-transition">{remainingTime}</span>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Paid Subscription Info (placeholder) */}
                {subscriptionStatus === 'active' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-sm font-medium text-luxury-black/80 dark:text-white/80 theme-transition">Тип подписки:</span>
                      <span className="text-sm text-luxury-black dark:text-white theme-transition">Профессиональная</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-sm font-medium text-luxury-black/80 dark:text-white/80 theme-transition">Срок действия:</span>
                      <span className="text-sm text-luxury-black dark:text-white theme-transition">Бессрочно</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-100 dark:border-dark-slate pt-6 theme-transition">
              <div className="w-full">
                {subscriptionStatus !== 'active' && (
                  <Alert variant={subscriptionStatus === 'expired' ? 'destructive' : 'warning'} className="mb-6 rounded-sm">
                    <AlertTitle>
                      {subscriptionStatus === 'expired' 
                        ? 'Доступ ограничен!' 
                        : 'Оформите подписку сейчас'}
                    </AlertTitle>
                    <AlertDescription>
                      {subscriptionStatus === 'expired'
                        ? 'После истечения пробного периода доступ к функциям платформы ограничен. Оформите подписку для восстановления доступа.'
                        : 'Чтобы сохранить доступ ко всем функциям платформы после окончания пробного периода, оформите подписку.'}
                    </AlertDescription>
                  </Alert>
                )}
                
                <Button 
                  className="w-full bg-luxury-gold hover:bg-luxury-goldMuted dark:bg-luxury-royalBlue dark:hover:bg-luxury-royalBlueMuted text-luxury-black dark:text-white py-6 theme-transition"
                  disabled
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  {subscriptionStatus === 'active'
                    ? 'Управление платежами'
                    : 'Оформить подписку'}
                </Button>
                <p className="text-xs text-center mt-4 text-luxury-black/60 dark:text-white/60 theme-transition">
                  Функция оплаты подписки будет доступна в ближайшее время
                </p>
              </div>
            </CardFooter>
          </Card>
          
          {/* Pricing Plans Card */}
          <Card className="mb-8 rounded-sm border-gray-100 dark:border-dark-slate shadow-subtle dark:shadow-elegant-dark theme-transition">
            <CardHeader>
              <CardTitle className="text-2xl font-medium text-luxury-black dark:text-white theme-transition">Тарифы</CardTitle>
              <CardDescription className="text-luxury-black/70 dark:text-white/70 theme-transition">
                Информация о доступных планах подписки
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-sm border border-gray-200 dark:border-dark-slate p-6 flex flex-col theme-transition">
                  <div className="mb-4">
                    <h3 className="text-xl font-medium text-luxury-black dark:text-white mb-2 theme-transition">Стандартный</h3>
                    <div className="w-12 h-[2px] bg-luxury-gold/50 dark:bg-luxury-royalBlue/50 mb-4 theme-transition"></div>
                    <p className="text-2xl font-bold text-luxury-black dark:text-white mb-1 theme-transition">
                      1 200 ₽<span className="text-sm font-normal text-luxury-black/60 dark:text-white/60">/месяц</span>
                    </p>
                    <p className="text-sm text-luxury-black/60 dark:text-white/60 theme-transition">
                      Ежемесячная оплата
                    </p>
                  </div>
                  <div className="flex-1">
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start gap-2 text-sm text-luxury-black/90 dark:text-white/90 theme-transition">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0 theme-transition" />
                        <span>Без ограничений на количество подборок</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-luxury-black/90 dark:text-white/90 theme-transition">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0 theme-transition" />
                        <span>До 50 объектов в каждой подборке</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-luxury-black/90 dark:text-white/90 theme-transition">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0 theme-transition" />
                        <span>Базовая техническая поддержка</span>
                      </li>
                    </ul>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full border-luxury-black/20 dark:border-luxury-royalBlue/30 hover:bg-luxury-black/5 dark:hover:bg-luxury-royalBlue/10 rounded-sm py-5 theme-transition"
                    disabled
                  >
                    Скоро
                  </Button>
                </div>
                
                <div className="rounded-sm border-2 border-luxury-gold dark:border-luxury-royalBlue p-6 flex flex-col relative overflow-hidden theme-transition">
                  <div className="absolute -right-8 top-6 bg-luxury-gold dark:bg-luxury-royalBlue text-white py-1 px-10 transform rotate-45 text-xs font-medium theme-transition">
                    Рекомендуем
                  </div>
                  <div className="mb-4">
                    <h3 className="text-xl font-medium text-luxury-black dark:text-white mb-2 theme-transition">Профессиональный</h3>
                    <div className="w-12 h-[2px] bg-luxury-gold dark:bg-luxury-royalBlue mb-4 theme-transition"></div>
                    <p className="text-2xl font-bold text-luxury-black dark:text-white mb-1 theme-transition">
                      10 000 ₽<span className="text-sm font-normal text-luxury-black/60 dark:text-white/60">/год</span>
                    </p>
                    <p className="text-sm text-luxury-black/60 dark:text-white/60 theme-transition">
                      Ежегодная оплата <span className="text-green-600 dark:text-green-500">Экономия 30%</span>
                    </p>
                  </div>
                  <div className="flex-1">
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start gap-2 text-sm text-luxury-black/90 dark:text-white/90 theme-transition">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0 theme-transition" />
                        <span>Без ограничений на количество подборок</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-luxury-black/90 dark:text-white/90 theme-transition">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0 theme-transition" />
                        <span>Неограниченное количество объектов</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-luxury-black/90 dark:text-white/90 theme-transition">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0 theme-transition" />
                        <span>Премиум техническая поддержка</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-luxury-black/90 dark:text-white/90 theme-transition">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0 theme-transition" />
                        <span>Доступ к будущим премиум-функциям</span>
                      </li>
                    </ul>
                  </div>
                  <Button 
                    className="w-full bg-luxury-gold hover:bg-luxury-goldMuted dark:bg-luxury-royalBlue dark:hover:bg-luxury-royalBlueMuted text-luxury-black dark:text-white py-5 theme-transition"
                    disabled
                  >
                    Скоро
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 