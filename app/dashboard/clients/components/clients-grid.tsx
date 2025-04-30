import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Simple pagination component - can be moved to a shared component if used elsewhere
function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Don't display pagination if there's only one page
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center mt-8 gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-8 w-8 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="text-sm">
        Страница {currentPage} из {totalPages}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-8 w-8 p-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

interface ClientsGridProps {
  clients: any[];
  formatDate: (dateString: string | null | undefined) => string;
  isTrialActive: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
  onClientDeleted?: (clientId: string) => void;
  ClientCard: React.ComponentType<{
    client: any;
    formatDate: (dateString: string | null | undefined) => string;
    isTrialActive: boolean;
    onClientDeleted?: (clientId: string) => void;
  }>;
}

// Optimized client grid component with pagination
export default function ClientsGrid({ 
  clients, 
  formatDate, 
  isTrialActive, 
  ClientCard,
  pagination,
  onPageChange,
  onClientDeleted
}: ClientsGridProps) {
  if (!clients.length) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 ml-[-20px]">
        {clients.map(client => (
          <ClientCard 
            key={client.id} 
            client={client} 
            formatDate={formatDate} 
            isTrialActive={isTrialActive}
            onClientDeleted={onClientDeleted}
          />
        ))}
      </div>
      
      {pagination && onPageChange && (
        <Pagination 
          currentPage={pagination.page} 
          totalPages={pagination.totalPages} 
          onPageChange={onPageChange} 
        />
      )}
    </div>
  );
} 