"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Edit, Plus, Home, Building2, Trash2, Calendar, MapPin, ListFilter, ExternalLink, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { TextFolding } from "@/components/ui/text-folding"

// Form schema for adding/editing property match
const propertyMatchSchema = z.object({
  property_id: z.string().uuid({ message: "Необходимо выбрать объект недвижимости" }),
  status: z.enum(["sent", "visited", "interested", "offer_made", "rejected"], { 
    required_error: "Необходимо выбрать статус" 
  }),
  notes: z.string().optional(),
});

type PropertyMatchFormData = z.infer<typeof propertyMatchSchema>;

// Define the component props
interface PropertyMatchesBlockProps {
  clientId: string;
  propertyMatches?: Array<{
    id: string;
    property_id: string;
    status: string;
    sent_date?: string;
    notes?: string;
  }> | null;
}

// Helper function to format status
const formatStatus = (status: string) => {
  const statusMap: Record<string, { label: string; color: string }> = {
    sent: { label: "Отправлено", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
    visited: { label: "Просмотрено", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
    interested: { label: "Заинтересован", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" },
    offer_made: { label: "Сделано предложение", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" },
    rejected: { label: "Отклонено", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
  };

  return statusMap[status] || { label: status, color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300" };
};

// Format date
const formatDate = (dateString?: string) => {
  if (!dateString) return "Н/Д";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric'
  }).format(date);
};

export function PropertyMatchesBlock({ clientId, propertyMatches = [] }: PropertyMatchesBlockProps) {
  const [properties, setProperties] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [propertyCollections, setPropertyCollections] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Initialize form
  const form = useForm<PropertyMatchFormData>({
    resolver: zodResolver(propertyMatchSchema),
    defaultValues: {
      property_id: "",
      status: "sent",
      notes: ""
    },
  });

  // Load properties for selection - memoized to prevent unnecessary re-renders
  const loadProperties = useCallback(async () => {
    if (properties.length > 0) return; // Only load if not already loaded
    
    setPropertiesLoading(true);
    try {
      // Add a limit parameter to restrict the number of properties loaded at once
      const response = await fetch(`/api/properties?limit=50`);
      
      if (!response.ok) {
        throw new Error('Ошибка при загрузке объектов недвижимости');
      }
      
      const data = await response.json();
      setProperties(data);
      
      // Create a map of property ID to collection ID
      const collectionsMap: Record<string, string> = {};
      data.forEach((property: any) => {
        if (property.collection_id) {
          collectionsMap[property.id] = property.collection_id;
        }
      });
      setPropertyCollections(prevCollections => ({
        ...prevCollections,
        ...collectionsMap
      }));
    } catch (error) {
      console.error("Error loading properties:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось загрузить список недвижимости",
      });
    } finally {
      setPropertiesLoading(false);
    }
  }, [properties.length, toast]);

  // Handle form submission to add new property match
  const onSubmit = async (data: PropertyMatchFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/clients/${clientId}/property-match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          property_id: data.property_id,
          status: data.status,
          notes: data.notes || null,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при добавлении объекта');
      }
      
      const result = await response.json();
      
      toast({
        title: "Объект добавлен",
        description: "Объект недвижимости успешно прикреплен к клиенту",
      });
      
      // Add to the local state
      if (propertyMatches) {
        propertyMatches.push({
          id: result.id,
          property_id: data.property_id,
          status: data.status,
          sent_date: new Date().toISOString(),
          notes: data.notes,
        });
      }
      
      // Reset form and close dialog
      form.reset();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding property match:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Произошла неожиданная ошибка",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load property details for display
  const fetchPropertyDetails = async (propertyId: string) => {
    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Ошибка при загрузке данных объекта');
      }
      
      const data = await response.json();
      setSelectedProperty(data);
    } catch (error) {
      console.error("Error fetching property details:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось загрузить данные объекта",
      });
    }
  };

  // Update property match status
  const updatePropertyMatchStatus = async (matchId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/clients/${clientId}/property-match/${matchId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Ошибка при обновлении статуса');
      }
      
      // Update local state
      if (propertyMatches) {
        const matchIndex = propertyMatches.findIndex(match => match.id === matchId);
        if (matchIndex !== -1) {
          propertyMatches[matchIndex].status = newStatus;
        }
      }
      
      toast({
        title: "Статус обновлен",
        description: "Статус объекта недвижимости успешно обновлен",
      });
    } catch (error) {
      console.error("Error updating property match status:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось обновить статус объекта",
      });
    }
  };

  // Delete property match
  const deletePropertyMatch = async (matchId: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту связь?")) {
      return;
    }
    
    try {
      const response = await fetch(`/api/clients/${clientId}/property-match/${matchId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Ошибка при удалении объекта');
      }
      
      // Update local state
      if (propertyMatches) {
        const matchIndex = propertyMatches.findIndex(match => match.id === matchId);
        if (matchIndex !== -1) {
          propertyMatches.splice(matchIndex, 1);
        }
      }
      
      toast({
        title: "Объект удален",
        description: "Объект недвижимости успешно откреплен от клиента",
      });
    } catch (error) {
      console.error("Error deleting property match:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось удалить объект",
      });
    }
  };

  // Load collection IDs for property matches once on mount
  useEffect(() => {
    const matches = propertyMatches || [];
    if (matches.length > 0) {
      const propertyIds = matches.map(match => match.property_id);
      const uniqueIds = [...new Set(propertyIds)];
      const missingIds = uniqueIds.filter(id => !propertyCollections[id]);
      
      if (missingIds.length > 0) {
        // Batch fetch all missing collections at once
        const fetchCollections = async () => {
          try {
            // Create a query string with all property IDs
            const idsParam = missingIds.join(',');
            const response = await fetch(`/api/properties/collections?ids=${idsParam}`);
            
            if (response.ok) {
              const data = await response.json();
              setPropertyCollections(prev => ({ ...prev, ...data }));
            }
          } catch (error) {
            console.error("Error fetching property collections:", error);
          }
        };
        
        fetchCollections();
      }
    }
  }, [propertyMatches, propertyCollections]);

  return (
    <Card className="overflow-hidden rounded-sm border border-gray-100 dark:border-dark-slate shadow-subtle dark:shadow-elegant-dark hover:shadow-elegant dark:hover:shadow-luxury-dark transition-all duration-500 animate-fade-in-up theme-transition">
      <CardHeader className="bg-white dark:bg-dark-graphite theme-transition pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium text-luxury-black dark:text-white theme-transition">
            Подобранные объекты
          </CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (open) {
              loadProperties();
            }
          }}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-luxury-black/70 dark:text-white/70 hover:text-luxury-gold dark:hover:text-luxury-royalBlue hover:bg-transparent theme-transition"
              >
                <Plus size={16} />
                <span className="sr-only">Добавить объект</span>
              </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-[500px] bg-white dark:bg-dark-graphite rounded-sm theme-transition">
              <DialogHeader>
                <DialogTitle className="text-luxury-black dark:text-white theme-transition">Добавить объект недвижимости</DialogTitle>
                <DialogDescription className="text-luxury-black/60 dark:text-white/60 theme-transition">
                  Выберите объект и установите его статус для клиента
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="space-y-4 my-4">
                    <FormField
                      control={form.control}
                      name="property_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-luxury-black/80 dark:text-white/80 theme-transition">Объект недвижимости</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white dark:bg-dark-slate border-gray-200 dark:border-dark-charcoal hover:border-gray-300 dark:hover:border-gray-600 theme-transition">
                                <SelectValue placeholder="Выберите объект" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white dark:bg-dark-slate theme-transition">
                              {propertiesLoading ? (
                                <div className="flex items-center justify-center py-2">
                                  <Loader2 className="h-4 w-4 animate-spin text-gray-500 dark:text-gray-400 theme-transition" />
                                </div>
                              ) : properties.length > 0 ? (
                                properties.map((property) => (
                                  <SelectItem key={property.id} value={property.id}>
                                    {property.address} ({property.property_type}, {property.rooms} к., {property.area} м²)
                                  </SelectItem>
                                ))
                              ) : (
                                <div className="px-2 py-2 text-sm text-gray-500 dark:text-gray-400 theme-transition">
                                  Объекты недвижимости не найдены
                                </div>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-luxury-black/80 dark:text-white/80 theme-transition">Статус</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white dark:bg-dark-slate border-gray-200 dark:border-dark-charcoal hover:border-gray-300 dark:hover:border-gray-600 theme-transition">
                                <SelectValue placeholder="Выберите статус" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white dark:bg-dark-slate theme-transition">
                              <SelectItem value="sent">Отправлено</SelectItem>
                              <SelectItem value="visited">Просмотрено</SelectItem>
                              <SelectItem value="interested">Заинтересован</SelectItem>
                              <SelectItem value="offer_made">Сделано предложение</SelectItem>
                              <SelectItem value="rejected">Отклонено</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-luxury-black/80 dark:text-white/80 theme-transition">Заметки</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Заметки о заинтересованности клиента..." 
                              className="resize-none bg-white dark:bg-dark-slate border-gray-200 dark:border-dark-charcoal hover:border-gray-300 dark:hover:border-gray-600 theme-transition"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <DialogFooter className="mt-6">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsAddDialogOpen(false)}
                      className="border-luxury-black/20 dark:border-luxury-royalBlue/30 text-luxury-black dark:text-white hover:bg-luxury-black/5 dark:hover:bg-luxury-royalBlue/10 theme-transition"
                    >
                      Отмена
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-luxury-gold hover:bg-luxury-gold/90 text-white theme-transition"
                      disabled={isLoading}
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Добавить
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription className="text-luxury-black/60 dark:text-white/60 theme-transition">
          Объекты недвижимости, подобранные для клиента
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-4 pb-5">
        {propertyMatches && propertyMatches.length > 0 ? (
          <div className="space-y-4">
            {propertyMatches.map((match) => (
              <div key={match.id} className="p-3 bg-gray-50 dark:bg-dark-slate rounded-sm border border-gray-100 dark:border-dark-charcoal theme-transition">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-luxury-gold dark:text-luxury-royalBlue/90 theme-transition" />
                    <span className="font-medium text-luxury-black dark:text-white theme-transition">
                      ID: {match.property_id.slice(0, 8)}...
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={`${formatStatus(match.status).color} theme-transition`}>
                      {formatStatus(match.status).label}
                    </Badge>
                    
                    <Select onValueChange={(value) => updatePropertyMatchStatus(match.id, value)} defaultValue={match.status}>
                      <SelectTrigger className="min-w-9 h-9 p-2 border border-gray-200 dark:border-dark-slate rounded-sm bg-white/70 dark:bg-dark-slate/70 hover:bg-gray-100 dark:hover:bg-dark-charcoal focus:ring-1 focus:ring-luxury-gold/30 dark:focus:ring-luxury-royalBlue/30 transition-all theme-transition">
                        <Edit size={14} className="text-gray-500 dark:text-gray-400 theme-transition" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-dark-slate theme-transition w-44">
                        <SelectItem value="sent">Отправлено</SelectItem>
                        <SelectItem value="visited">Просмотрено</SelectItem>
                        <SelectItem value="interested">Заинтересован</SelectItem>
                        <SelectItem value="offer_made">Сделано предложение</SelectItem>
                        <SelectItem value="rejected">Отклонено</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button 
                      variant="outline"
                      className="min-w-9 h-9 p-2 border-gray-200 dark:border-dark-slate rounded-sm bg-white/70 dark:bg-dark-slate/70 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 focus:ring-1 focus:ring-red-300/30 text-red-400 dark:text-red-400 transition-all theme-transition"
                      onClick={() => deletePropertyMatch(match.id)}
                    >
                      <Trash2 size={14} />
                      <span className="sr-only">Удалить</span>
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 theme-transition mt-1">
                  <Calendar size={12} />
                  <span>Отправлено: {formatDate(match.sent_date)}</span>
                </div>
                
                {match.notes && (
                  <div className="mt-2">
                    <TextFolding 
                      text={match.notes}
                      maxLength={80}
                      className="text-sm text-gray-700 dark:text-gray-300 theme-transition" 
                      title="Заметки к подбору"
                    />
                  </div>
                )}
                
                <div className="mt-3 flex justify-end">
                  <Link href={propertyCollections[match.property_id] 
                    ? `/dashboard/collections/${propertyCollections[match.property_id]}` 
                    : `/dashboard/collections`}>
                    <Button variant="link" className="h-8 p-0 text-luxury-gold dark:text-luxury-royalBlue/90 theme-transition">
                      Просмотреть объект
                      <ExternalLink size={12} className="ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 dark:bg-dark-slate flex items-center justify-center mb-3 theme-transition">
              <Home className="h-6 w-6 text-gray-400 dark:text-gray-500 theme-transition" />
            </div>
            <p className="text-luxury-black/60 dark:text-white/60 theme-transition text-sm">
              Нет подобранных объектов недвижимости
            </p>
            <Button 
              variant="link" 
              className="mt-2 text-luxury-gold dark:text-luxury-royalBlue theme-transition"
              onClick={() => {
                setIsAddDialogOpen(true);
                loadProperties();
              }}
            >
              Добавить первый объект
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 