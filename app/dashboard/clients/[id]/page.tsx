import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/auth"
import { getServerClient } from "@/lib/supabase"
import { NavBar } from "@/components/nav-bar"
import { User, ArrowLeft } from "lucide-react"
import { ContactInfoBlock } from "../components/contact-info-block"
import { DealRequestBlock } from "../components/deal-request-block"
import { ClientPreferencesBlock } from "../components/client-preferences-block"
import { DealProgressTracker } from "../components/deal-progress-tracker"
import { NotesTasksBlock } from "../components/notes-tasks-block"
import { PropertyMatchesBlock } from "../components/property-matches-block"

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const clientId = params.id
  const session = await getSession()
  
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-luxury p-4 py-16 theme-transition">
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
          </div>
        </div>
      </div>
    )
  }

  // Fetch client data
  const supabase = getServerClient()
  const { data: client } = await supabase
    .from("clients")
    .select(`
      id,
      full_name,
      email,
      phone,
      birthday,
      lead_source,
      last_contact_date,
      client_deal_requests (
        id,
        real_estate_type,
        budget_min,
        budget_max,
        first_payment,
        payment_type
      ),
      client_preferences (
        id,
        rooms_min,
        rooms_max,
        preferred_floor_min,
        preferred_floor_max,
        area_min,
        area_max
      ),
      client_locations (
        id,
        location_name
      ),
      client_features (
        id,
        feature_name
      ),
      client_deal_stages (
        id,
        stage,
        status,
        notes,
        created_at
      ),
      client_notes (
        id,
        content,
        created_at
      ),
      client_tasks (
        id,
        task_type,
        title,
        description,
        due_date,
        is_completed
      ),
      client_property_matches (
        id,
        property_id,
        status,
        sent_date,
        notes
      )
    `)
    .eq("id", clientId)
    .eq("agent_id", session.id)
    .single()

  if (!client) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-dark-charcoal dark:to-dark-slate relative theme-transition">
        <NavBar userName={session.name} />
        <main className="flex-1 container-luxury py-8 relative z-10">
          <div className="bg-white dark:bg-dark-graphite rounded-sm shadow-elegant dark:shadow-elegant-dark p-12 text-center max-w-xl mx-auto mt-12 animate-fade-in-up theme-transition">
            <h2 className="text-2xl font-display font-medium mb-4 text-luxury-black dark:text-white theme-transition">
              Клиент не найден
            </h2>
            <p className="text-luxury-black/70 dark:text-white/70 mb-8 theme-transition">
              Запрашиваемый клиент не найден или у вас нет доступа к нему.
            </p>
            <Link href="/dashboard/clients">
              <Button className="bg-luxury-black dark:bg-luxury-royalBlue dark:text-white hover:bg-black dark:hover:bg-luxury-royalBlueMuted text-white py-5 px-5 rounded-sm flex items-center gap-2 theme-transition">
                <ArrowLeft size={18} />
                Вернуться к списку клиентов
              </Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  // Get the first deal request if there are any
  const dealRequest = client.client_deal_requests && client.client_deal_requests.length > 0 
    ? client.client_deal_requests[0] 
    : null
  
  // Get the first preferences record if there are any
  const preferences = client.client_preferences && client.client_preferences.length > 0 
    ? client.client_preferences[0] 
    : null
  
  // Get the most recent deal stage if there are any
  const currentDealStage = client.client_deal_stages && client.client_deal_stages.length > 0
    ? client.client_deal_stages[0]
    : null
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-dark-charcoal dark:to-dark-slate relative theme-transition">
      <NavBar userName={session.name} />
      <main className="flex-1 container-luxury py-8 relative z-10">
        <div className="mb-6">
          <Link href="/dashboard/clients" className="inline-flex items-center text-luxury-black/70 dark:text-white/70 hover:text-luxury-gold dark:hover:text-luxury-royalBlue transition-colors theme-transition mb-4">
            <ArrowLeft size={16} className="mr-2" />
            Назад к списку клиентов
          </Link>
          
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-dark-slate flex items-center justify-center shrink-0 theme-transition">
              <User className="h-10 w-10 text-luxury-gold dark:text-luxury-royalBlue/90 theme-transition" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-medium text-luxury-black dark:text-white theme-transition">
                {client.full_name}
              </h1>
              <div className="w-20 h-0.5 bg-luxury-gold dark:bg-luxury-royalBlue mt-2 mb-1 theme-transition"></div>
              <p className="text-luxury-black/60 dark:text-white/60 theme-transition">
                {client.lead_source && `Источник: ${client.lead_source}`}
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
          {/* Contact Information Block */}
          <ContactInfoBlock 
            clientId={client.id} 
            data={{
              full_name: client.full_name,
              phone: client.phone,
              email: client.email,
              birthday: client.birthday,
              lead_source: client.lead_source
            }} 
          />
          
          {/* Deal Request Block */}
          <DealRequestBlock 
            clientId={client.id}
            dealRequest={dealRequest}
            locations={client.client_locations}
          />
          
          {/* Client Preferences Block */}
          <ClientPreferencesBlock 
            clientId={client.id}
            preferences={preferences}
            features={client.client_features}
          />
          
          {/* Deal Progress Tracker Block */}
          <DealProgressTracker
            clientId={client.id}
            currentStage={currentDealStage}
            stageHistory={client.client_deal_stages}
          />
          
          {/* Notes & Tasks Block - Changed to one column */}
          <NotesTasksBlock
            clientId={client.id}
            notes={client.client_notes}
            tasks={client.client_tasks}
            lastContactDate={client.last_contact_date}
          />
          
          {/* Property Matches Block */}
          <PropertyMatchesBlock
            clientId={client.id}
            propertyMatches={client.client_property_matches}
          />
        </div>
      </main>
    </div>
  )
} 