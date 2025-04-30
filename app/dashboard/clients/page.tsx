import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, WifiOff, UserPlus } from "lucide-react"
import { NavBar } from "@/components/nav-bar"
import { SubscriptionBanner } from "@/components/subscription-banner"
import { DashboardTabs } from "@/components/dashboard-tabs"
import { getSession, requireAuth } from "@/lib/auth"
import { getServerClient, executeWithRetry } from "@/lib/supabase"
import ClientsContent from "./components/clients-content"
import { ClientAvatar } from "./components/client-avatar"

// Disable caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Define client data type
export interface ClientData {
  id: string;
  full_name: string;
  phone?: string;
  email?: string;
  last_contact_date?: string;
  lead_source?: string;
  client_deal_requests?: Array<{
    id: string;
    real_estate_type?: string;
    budget_min?: number;
    budget_max?: number;
    payment_type?: string;
  }>;
  client_preferences?: Array<{
    id: string;
    rooms_min?: number;
    rooms_max?: number;
    area_min?: number;
    area_max?: number;
  }>;
  client_deal_stages?: Array<{
    id: string;
    stage?: string;
    status?: string;
    created_at?: string;
  }>;
  client_property_matches?: Array<{
    id: string;
  }>;
}

// Format date function (only used server-side)
function formatDate(dateString: string | null | undefined) {
  if (!dateString) return "Н/Д";
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export default async function ClientsPage({
  searchParams
}: {
  searchParams: { page?: string; pageSize?: string }
}) {
  // Get the session using server-side authentication
  const session = await getSession();

  // If no session, display the authorization required page
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-luxury p-4 py-16 theme-transition dashboard">
        <div className="bg-white dark:bg-dark-graphite rounded-sm shadow-elegant dark:shadow-elegant-dark p-12 max-w-lg w-full animate-fade-in-up theme-transition">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-serif font-medium tracking-tight text-luxury-black dark:text-white mb-2 theme-transition">
              РиелторПро
            </h1>
            <div className="w-16 h-0.5 bg-luxury-gold dark:bg-luxury-royalBlue mx-auto mb-6 theme-transition"></div>
            <h2 className="text-2xl font-display font-medium mb-4 text-luxury-black dark:text-white theme-transition">Требуется авторизация</h2>
            <p className="text-luxury-black/70 dark:text-white/70 mb-8 theme-transition">Для доступа к этой странице необходимо войти в систему.</p>
          </div>
          <div className="flex flex-col gap-4">
            <Link href="/login">
              <Button className="w-full bg-luxury-black dark:bg-luxury-royalBlue dark:text-white hover:bg-black dark:hover:bg-luxury-royalBlueMuted text-white py-6 theme-transition" animation="scale">
                Войти в систему
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="w-full border-luxury-black/20 dark:border-luxury-royalBlue/30 hover:bg-luxury-black/5 dark:hover:bg-luxury-royalBlue/10 dark:text-white rounded-sm py-6 theme-transition" animation="scale">
                Зарегистрироваться
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Parse pagination parameters from search params
  const page = parseInt(searchParams.page || '1');
  const pageSize = parseInt(searchParams.pageSize || '12');
  
  // Validate pagination parameters
  const validatedPage = page > 0 ? page : 1;
  const validatedPageSize = pageSize > 0 && pageSize <= 50 ? pageSize : 12;
  
  // Calculate range for query
  const from = (validatedPage - 1) * validatedPageSize;
  const to = from + validatedPageSize - 1;
  
  // Check if we're in offline mode
  const isOfflineMode = "isOfflineMode" in session && session.isOfflineMode === true;
  
  let clients: ClientData[] = [];
  let fetchError: Error | null = null;
  let pagination = {
    page: validatedPage,
    pageSize: validatedPageSize,
    totalCount: 0,
    totalPages: 0
  };

  if (!isOfflineMode) {
    try {
      const supabase = getServerClient();

      // First, get total count for pagination
      const { count, error: countError } = await supabase
        .from("clients")
        .select("id", { count: 'exact', head: true })
        .eq("agent_id", session.id);
      
      if (countError) {
        console.error("Error getting client count:", countError);
        fetchError = countError;
      } else {
        // Calculate pagination data
        const totalCount = count || 0;
        const totalPages = Math.ceil(totalCount / validatedPageSize);
        
        pagination = {
          page: validatedPage,
          pageSize: validatedPageSize,
          totalCount,
          totalPages
        };
        
        // Get clients with pagination
        const result = await executeWithRetry(() =>
          supabase
            .from("clients")
            .select(`
              id, 
              full_name, 
              phone, 
              email, 
              last_contact_date, 
              lead_source,
              client_deal_requests(
                id, 
                real_estate_type,
                budget_min,
                budget_max,
                payment_type
              ),
              client_preferences(
                id,
                rooms_min,
                rooms_max,
                area_min,
                area_max
              ),
              client_deal_stages(
                id,
                stage,
                status,
                created_at
              ),
              client_property_matches(
                id
              )
            `)
            .eq("agent_id", session.id)
            .order("created_at", { ascending: false })
            .range(from, to)
        );
        
        // Type assertion to help TypeScript understand the structure
        const { data, error } = result as { data: ClientData[] | null; error: Error | null };

        if (error) {
          console.error("Error fetching clients:", error);
          fetchError = error;
        } else {
          clients = data as ClientData[] || [];
        }
      }
    } catch (error) {
      console.error("Error in clients page:", error);
      fetchError = error instanceof Error ? error : new Error("Unknown error occurred");
    }
  }

  // User data structure for passing to components
  const userData = {
    id: session.id,
    name: session.name,
    isOfflineMode: isOfflineMode || false,
    trialInfo: session.trialInfo || null
  };
  
  const trialInfo = session.trialInfo;
  const isTrialActive = trialInfo?.isActive || false;
  const hasError = !isOfflineMode && !!fetchError;
  const hasClients = clients.length > 0;
  const showSubscriptionButton = !isOfflineMode && !fetchError && trialInfo && !trialInfo.isActive;
  const showAddClientButton = !isOfflineMode && !fetchError && isTrialActive;

  // Render the main layout with the client data
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-dark-charcoal dark:to-dark-slate relative theme-transition dashboard">
      <NavBar userName={session.name} isOfflineMode={isOfflineMode} />

      <main className="flex-1 container-wide py-8 relative z-10">
        {/* Subscription Banner */}
        {trialInfo && !isOfflineMode && trialInfo.isActive && (
          <SubscriptionBanner trialInfo={trialInfo} />
        )}
        
        {/* Offline warning */}
        {isOfflineMode && (
          <Alert variant="warning" className="mb-8 rounded-sm border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800/30 theme-transition ml-[-20px]">
            <WifiOff className="h-4 w-4 text-amber-600 dark:text-amber-500 theme-transition" />
            <AlertTitle className="font-medium text-amber-700 dark:text-amber-500 theme-transition">Режим офлайн</AlertTitle>
            <AlertDescription className="text-amber-700/80 dark:text-amber-500/90 theme-transition">
              Обнаружены проблемы с подключением к базе данных. Вы находитесь в режиме офлайн с ограниченной
              функциональностью. Попробуйте обновить страницу позже, когда соединение будет восстановлено.
            </AlertDescription>
          </Alert>
        )}

        {/* Error message */}
        {hasError && (
          <Alert variant="destructive" className="mb-8 rounded-sm border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800/30 theme-transition ml-[-20px]">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-500 theme-transition" />
            <AlertTitle className="font-medium text-red-700 dark:text-red-500 theme-transition">Ошибка загрузки данных</AlertTitle>
            <AlertDescription className="text-red-700/80 dark:text-red-500/90 theme-transition">
              Не удалось загрузить данные клиентов. Пожалуйста, попробуйте обновить страницу.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex justify-between items-center mb-10">
          <div>
            <DashboardTabs activeTab="clients" />
            <p className="text-luxury-black/60 dark:text-white/60 theme-transition ml-[-6px]">
              Управление клиентами и сделками
            </p>
          </div>
          <div className="mr-2">
            {showAddClientButton ? (
              <Link href="/dashboard/clients/new">
                <Button className="bg-luxury-black dark:bg-luxury-royalBlue dark:text-white hover:bg-black dark:hover:bg-luxury-royalBlueMuted text-white py-5 px-5 rounded-sm flex items-center gap-2">
                  <UserPlus size={18} />
                  Добавить клиента
                </Button>
              </Link>
            ) : showSubscriptionButton ? (
              <Link href="/dashboard/subscription">
                <Button className="bg-luxury-gold hover:bg-luxury-gold/90 text-white py-5 px-5 rounded-sm">
                  Оформить подписку
                </Button>
              </Link>
            ) : null}
          </div>
        </div>

        {!isOfflineMode && !fetchError && trialInfo && !trialInfo.isActive && (
          <Alert className="mb-8 rounded-sm border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800/30 theme-transition ml-[-20px]">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500 theme-transition" />
            <AlertTitle className="font-medium text-amber-700 dark:text-amber-500 theme-transition">Пробный период истек</AlertTitle>
            <AlertDescription className="text-amber-700/80 dark:text-amber-500/90 theme-transition">
              Ваш пробный период истек. Для продолжения использования системы необходимо оформить подписку. 
              <Link href="/dashboard/subscription" className="text-amber-800 dark:text-amber-400 ml-1 underline underline-offset-2">
                Оформить подписку
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {!isOfflineMode && !fetchError && (!hasClients) ? (
          <div className="bg-white dark:bg-dark-graphite rounded-sm shadow-elegant dark:shadow-elegant-dark p-16 text-center max-w-xl mx-auto mt-12 animate-fade-in-up theme-transition">
            <div className="flex flex-col items-center mb-8">
              <ClientAvatar 
                clientId="00000000-0000-0000-0000-000000000000"
                size="lg"
              />
              <div className="w-16 h-0.5 bg-luxury-gold dark:bg-luxury-royalBlue mx-auto mt-6 theme-transition"></div>
            </div>
            
            <h2 className="text-2xl font-display font-medium mb-4 text-luxury-black dark:text-white theme-transition">
              Пока нет клиентов
            </h2>
            
            <p className="text-luxury-black/70 dark:text-white/70 mb-8 max-w-lg mx-auto leading-relaxed theme-transition">
              Добавьте своего первого клиента, чтобы начать работать с клиентскими карточками и запросами на недвижимость.
            </p>
            
            {isTrialActive && (
              <Link href="/dashboard/clients/new">
                <Button className="bg-luxury-black dark:bg-luxury-royalBlue dark:text-white hover:bg-black dark:hover:bg-luxury-royalBlueMuted text-white py-5 px-5 rounded-sm flex items-center gap-2">
                  <UserPlus size={18} />
                  Добавить первого клиента
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <Suspense fallback={<div>Загрузка данных...</div>}>
            <ClientsContent 
              clients={clients}
              pagination={pagination}
              userData={userData}
              isTrialActive={isTrialActive}
            />
          </Suspense>
        )}
      </main>
    </div>
  );
} 