"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ClientAvatar } from "./client-avatar"
import { ClientContactInfo } from "./client-contact-info"
import { clearSupabaseCache } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Trash2, Home as HomeIcon, Clock, Building as BuildingIcon, Wallet, CreditCard, CheckSquare, DoorOpen, Maximize2, Activity as ActivityIcon } from "lucide-react"
import { ClientData } from "../page"
import ClientsGrid from "./clients-grid"

// Format date function (client-side version)
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

// Define types for formatting utilities
interface FormatUtils {
  formatDate: (dateString: string | null | undefined) => string;
  formatBudget: (min?: number, max?: number) => string | null;
  formatRealEstateType: (type?: string) => string | null;
  formatArea: (min?: number, max?: number) => string | null;
  formatRooms: (min?: number, max?: number) => string | null;
}

// Define types for ClientCard props
interface ClientCardProps {
  client: ClientData;
  formatDate: (dateString: string | null | undefined) => string;
  isTrialActive?: boolean;
  onClientDeleted?: (clientId: string) => void;
}

// Client Card component for displaying a client
function ClientCard({ client, formatDate, isTrialActive, onClientDeleted }: ClientCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Extract client data
  const dealRequest = client.client_deal_requests?.[0] || null;
  const preferences = client.client_preferences?.[0] || null;
  const dealStage = client.client_deal_stages?.[0] || null;
  const matchesCount = client.client_property_matches?.length || 0;

  // Formatting utilities
  const formatUtils: FormatUtils = {
    formatDate,
    formatBudget: (min?: number, max?: number) => {
      if (min === undefined && max === undefined) return null;
      
      const formatValue = (value: number) => {
        return value >= 1000000
          ? `${(value / 1000000).toFixed(1)} млн ₽`
          : `${(value / 1000).toFixed(0)} тыс ₽`;
      };
      
      if (min !== undefined && max !== undefined) return `${formatValue(min)} - ${formatValue(max)}`;
      if (min !== undefined) return `от ${formatValue(min)}`;
      if (max !== undefined) return `до ${formatValue(max)}`;
      
      return null;
    },
    
    formatRealEstateType: (type?: string) => {
      if (!type) return null;
      
      const types: Record<string, string> = {
        'apartment': 'Квартира',
        'house': 'Дом',
        'land': 'Земля',
        'commercial': 'Коммерческая',
        'garage': 'Гараж'
      };
      
      return types[type] || type;
    },
    
    formatArea: (min?: number, max?: number) => {
      if (min === undefined && max === undefined) return null;
      
      if (min !== undefined && max !== undefined) return `${min} - ${max} м²`;
      if (min !== undefined) return `от ${min} м²`;
      if (max !== undefined) return `до ${max} м²`;
      
      return null;
    },
    
    formatRooms: (min?: number, max?: number) => {
      if (min === undefined && max === undefined) return null;
      
      if (min !== undefined && min === max) {
        return `${min} ${min === 1 ? 'комната' : min < 5 ? 'комнаты' : 'комнат'}`;
      }
      if (min !== undefined && max !== undefined) return `${min} - ${max} комн.`;
      if (min !== undefined) return `от ${min} комн.`;
      if (max !== undefined) return `до ${max} комн.`;
      
      return null;
    }
  };

  // Deal stage names mapping
  const stageName: Record<string, string> = {
    'initial': 'Первичный контакт',
    'search': 'Поиск объектов',
    'viewing': 'Просмотры',
    'negotiation': 'Переговоры',
    'contract': 'Оформление договора',
    'closed': 'Сделка закрыта'
  };

  // Status names mapping
  const statusName: Record<string, string> = {
    'active': 'Активно',
    'pending': 'В ожидании',
    'paused': 'Приостановлено',
    'showing': 'Показ',
    'closed': 'Закрыто',
    'rejected': 'Отказ',
    'completed': 'Завершено'
  };
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteClient = async () => {
    try {
      setIsDeleting(true)
      
      const response = await fetch(`/api/clients/${client.id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error("Ошибка при удалении клиента")
      }
      
      toast({
        title: "Клиент удален",
        description: "Клиент успешно удален из системы",
      })
      
      // Clear cache for clients endpoint
      clearSupabaseCache('/api/dashboard/clients');
      
      // Notify parent component about deletion
      if (onClientDeleted) {
        onClientDeleted(client.id);
      }
      
      // Close the dialog
      setIsDeleteDialogOpen(false);
      
      // Force refresh the page to ensure UI is updated
      router.refresh();
    } catch (error) {
      console.error("Error deleting client:", error)
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось удалить клиента. Пожалуйста, попробуйте снова.",
      })
    } finally {
      setIsDeleting(false)
    }
  }
  
  // Helper to determine if divider should be shown
  const shouldShowDivider = (before: boolean, after: boolean) => {
    return before && after;
  };
  
  const hasPreferenceData = preferences && 
    (formatUtils.formatArea(preferences.area_min, preferences.area_max) || 
     formatUtils.formatRooms(preferences.rooms_min, preferences.rooms_max));
  
  const hasDealOrPreferences = !!dealRequest || !!hasPreferenceData;
  const hasStatusOrMatches = !!dealStage || matchesCount > 0;
  
  return (
    <>
      <Link href={isTrialActive ? `/dashboard/clients/${client.id}` : "/dashboard/subscription"}>
        <Card 
          className="overflow-hidden rounded-sm border border-gray-100 dark:border-dark-slate shadow-subtle dark:shadow-elegant-dark hover:shadow-elegant dark:hover:shadow-luxury-dark transition-all duration-500 animate-fade-in-up hover:-translate-y-1 property-card theme-transition bg-transparent relative h-full p-6"
          style={{ animationDelay: `${Math.min(0, 500)}ms`, minHeight: "360px" }}
        >
          <button 
            onClick={handleDeleteClick}
            className="absolute top-3 right-3 p-1.5 rounded-full text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-all theme-transition z-10"
            aria-label="Удалить клиента"
          >
            <Trash2 size={16} />
          </button>
          
          {/* Header with client name and avatar */}
          <div className="flex items-center gap-4">
            <ClientAvatar 
              clientId={client.id}
              clientName={client.full_name}
              size="sm"
            />
            <div>
              <h3 className="text-xl font-medium text-luxury-black dark:text-white truncate max-w-[200px] theme-transition">
                {client.full_name}
              </h3>
              {client.lead_source && (
                <div className="text-sm text-gray-500 dark:text-gray-400 theme-transition flex items-center gap-1.5 mt-1">
                  <HomeIcon size={14} className="text-luxury-gold dark:text-luxury-royalBlue/80 theme-transition" />
                  {client.lead_source}
                </div>
              )}
            </div>
          </div>
          
          {/* Contact information */}
          <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300 theme-transition">
            <ClientContactInfo phone={client.phone} email={client.email} />
            
            {client.last_contact_date && (
              <div className="flex items-center gap-2 pt-1">
                <Clock size={14} className="text-gray-400 dark:text-gray-500 shrink-0 theme-transition" />
                <span className="text-xs">Последний контакт: {formatDate(client.last_contact_date)}</span>
              </div>
            )}
          </div>
          
          {/* Always show first divider */}
          <div className="h-px bg-gray-100 dark:bg-dark-slate w-full my-4 theme-transition"></div>
          
          {/* Deal request information */}
          {dealRequest && (
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 theme-transition">
              <div className="flex items-center gap-1.5 mb-2 text-luxury-black dark:text-white">
                <BuildingIcon size={14} className="text-luxury-gold dark:text-luxury-royalBlue theme-transition" />
                <span className="font-medium text-xs">ЗАПРОС НА НЕДВИЖИМОСТЬ</span>
              </div>
              
              {formatUtils.formatRealEstateType(dealRequest.real_estate_type) && (
                <div className="flex items-center gap-2">
                  <HomeIcon size={14} className="text-gray-400 dark:text-gray-500 shrink-0 theme-transition" />
                  <span>{formatUtils.formatRealEstateType(dealRequest.real_estate_type)}</span>
                </div>
              )}
              
              {formatUtils.formatBudget(dealRequest.budget_min, dealRequest.budget_max) && (
                <div className="flex items-center gap-2">
                  <Wallet size={14} className="text-gray-400 dark:text-gray-500 shrink-0 theme-transition" />
                  <span>{formatUtils.formatBudget(dealRequest.budget_min, dealRequest.budget_max)}</span>
                </div>
              )}
              
              {dealRequest.payment_type && (
                <div className="flex items-center gap-2">
                  <CreditCard size={14} className="text-gray-400 dark:text-gray-500 shrink-0 theme-transition" />
                  <span>
                    {dealRequest.payment_type === 'cash' ? 'Наличные' : 
                     dealRequest.payment_type === 'mortgage' ? 'Ипотека' : 
                     dealRequest.payment_type === 'installment' ? 'Рассрочка' : 
                     dealRequest.payment_type}
                  </span>
                </div>
              )}
            </div>
          )}
          
          {/* Conditional divider between deal request and preferences */}
          {shouldShowDivider(!!dealRequest, !!hasPreferenceData) && (
            <div className="h-px bg-gray-100 dark:bg-dark-slate w-full my-4 theme-transition"></div>
          )}
          
          {/* Client preferences */}
          {hasPreferenceData && (
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 theme-transition">
              <div className="flex items-center gap-1.5 mb-2 text-luxury-black dark:text-white">
                <CheckSquare size={14} className="text-luxury-gold dark:text-luxury-royalBlue theme-transition" />
                <span className="font-medium text-xs">ПРЕДПОЧТЕНИЯ</span>
              </div>
              
              {formatUtils.formatRooms(preferences?.rooms_min, preferences?.rooms_max) && (
                <div className="flex items-center gap-2">
                  <DoorOpen size={14} className="text-gray-400 dark:text-gray-500 shrink-0 theme-transition" />
                  <span>{formatUtils.formatRooms(preferences?.rooms_min, preferences?.rooms_max)}</span>
                </div>
              )}
              
              {formatUtils.formatArea(preferences?.area_min, preferences?.area_max) && (
                <div className="flex items-center gap-2">
                  <Maximize2 size={14} className="text-gray-400 dark:text-gray-500 shrink-0 theme-transition" />
                  <span>{formatUtils.formatArea(preferences?.area_min, preferences?.area_max)}</span>
                </div>
              )}
            </div>
          )}
          
          {/* Conditional divider before status section */}
          {shouldShowDivider(hasDealOrPreferences, hasStatusOrMatches) && (
            <div className="h-px bg-gray-100 dark:bg-dark-slate w-full my-4 theme-transition"></div>
          )}
          
          {/* Status and property matches grid */}
          {hasStatusOrMatches && (
            <div className="grid grid-cols-2 gap-4 text-sm mt-3">
              {dealStage && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ActivityIcon size={14} className="text-luxury-gold dark:text-luxury-royalBlue theme-transition" />
                    <span className="font-medium text-xs text-luxury-black dark:text-white">СТАТУС</span>
                  </div>
                  <div className={`px-2 py-1 rounded-sm text-xs inline-flex ${
                    dealStage.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    dealStage.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    dealStage.status === 'paused' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' :
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                  } theme-transition`}>
                    {/* Show the translated status name if in list view or the stage name on detailed view */}
                    {dealStage.status === 'showing' 
                      ? statusName['showing'] || 'Показ'
                      : (dealStage.status && statusName[dealStage.status]) || stageName[dealStage.stage || ''] || dealStage.stage}
                  </div>
                </div>
              )}
              
              {matchesCount > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <BuildingIcon size={14} className="text-luxury-gold dark:text-luxury-royalBlue theme-transition" />
                    <span className="font-medium text-xs text-luxury-black dark:text-white">ОБЪЕКТЫ</span>
                  </div>
                  <div className="px-2 py-1 rounded-sm bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs inline-flex theme-transition">
                    {matchesCount} {matchesCount === 1 ? 'объект' : matchesCount < 5 ? 'объекта' : 'объектов'}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </Link>
      
      {/* Delete dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-dark-graphite theme-transition">
          <DialogHeader>
            <DialogTitle className="text-luxury-black dark:text-white theme-transition">Удаление клиента</DialogTitle>
            <DialogDescription className="text-luxury-black/70 dark:text-white/70 theme-transition">
              Вы действительно хотите удалить клиента <span className="font-medium text-luxury-black dark:text-white theme-transition">{client.full_name}</span>? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              className="border-gray-200 dark:border-dark-slate hover:bg-gray-100 dark:hover:bg-dark-slate/60 text-luxury-black dark:text-white theme-transition"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white"
              onClick={handleDeleteClient}
              disabled={isDeleting}
            >
              {isDeleting ? "Удаление..." : "Удалить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

interface ClientsContentProps {
  clients: ClientData[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  userData: {
    id: string;
    name: string;
    isOfflineMode: boolean;
    trialInfo: any;
  };
  isTrialActive: boolean;
}

export default function ClientsContent({ 
  clients, 
  pagination, 
  userData, 
  isTrialActive
}: ClientsContentProps) {
  const [currentPagination, setCurrentPagination] = useState(pagination);
  const router = useRouter();
  
  // Function to handle page changes
  const handlePageChange = (newPage: number) => {
    // Update pagination state
    setCurrentPagination(prev => ({ ...prev, page: newPage }));
    
    // Update URL with new page parameter
    const url = new URL(window.location.href);
    url.searchParams.set('page', newPage.toString());
    
    // Use shallow routing to update the URL without reloading the page
    router.push(url.pathname + url.search, { scroll: false });
  };

  // Handle client deletion
  const handleClientDeleted = (clientId: string) => {
    // Update pagination data if needed
    if (currentPagination.totalCount > 0) {
      const newTotalCount = currentPagination.totalCount - 1;
      const newTotalPages = Math.ceil(newTotalCount / currentPagination.pageSize);
      
      setCurrentPagination(prev => ({
        ...prev,
        totalCount: newTotalCount,
        totalPages: newTotalPages
      }));
    }
    
    // Refresh the page to get updated data from the server
    router.refresh();
  };

  return (
    <ClientsGrid 
      clients={clients}
      formatDate={formatDate}
      isTrialActive={isTrialActive}
      ClientCard={ClientCard}
      pagination={currentPagination}
      onPageChange={handlePageChange}
      onClientDeleted={handleClientDeleted}
    />
  );
} 