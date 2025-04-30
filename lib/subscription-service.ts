import { getServerClient } from "./supabase";
import { cookies } from "next/headers";

export interface SubscriptionStatus {
  isActive: boolean;
  status: 'trial' | 'active' | 'expired' | 'unknown';
  trialEndTime?: Date;
  remainingMinutes?: number;
}

interface UserTrialData {
  id: string;
  trial_start_time: string;
  trial_duration_minutes: number;
  subscription_status: string;
}

/**
 * A centralized subscription service that provides a single source of truth
 * for all subscription-related operations and status checks.
 */
export class SubscriptionService {
  /**
   * Get the subscription status for a user by ID directly from the database
   * with no caching to ensure we always have the latest status.
   */
  static async getSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
    try {
      const supabase = getServerClient();
      
      // Get user data with trial information
      const { data: user, error } = await supabase
        .from("users")
        .select("trial_start_time, trial_duration_minutes, subscription_status")
        .eq("id", userId)
        .single();
        
      if (error || !user) {
        console.error("Failed to fetch user subscription data:", error);
        return { isActive: false, status: 'unknown' };
      }
      
      // If already paid, subscription is active
      if (user.subscription_status === 'active') {
        return { isActive: true, status: 'active' };
      }
      
      // If already marked as expired, return that
      if (user.subscription_status === 'expired') {
        return { isActive: false, status: 'expired' };
      }
      
      // For trial status, calculate if still active
      const trialStartTime = new Date(user.trial_start_time);
      const trialDurationMs = user.trial_duration_minutes * 60 * 1000;
      const trialEndTime = new Date(trialStartTime.getTime() + trialDurationMs);
      const currentTime = new Date();
      
      const isTrialActive = currentTime < trialEndTime;
      
      // If trial has expired but the status hasn't been updated, update it now
      if (!isTrialActive && user.subscription_status === 'trial') {
        await this.updateSubscriptionStatus(userId, 'expired');
        
        return { 
          isActive: false, 
          status: 'expired',
          trialEndTime,
          remainingMinutes: 0
        };
      }
      
      // Calculate remaining time if trial is active
      const remainingMinutes = isTrialActive ? 
        Math.floor((trialEndTime.getTime() - currentTime.getTime()) / (60 * 1000)) : 0;
      
      return {
        isActive: isTrialActive,
        status: 'trial',
        trialEndTime,
        remainingMinutes
      };
    } catch (error) {
      console.error("Error checking subscription status:", error);
      return { isActive: false, status: 'unknown' };
    }
  }
  
  /**
   * Update a user's subscription status in the database
   */
  static async updateSubscriptionStatus(userId: string, status: 'trial' | 'active' | 'expired'): Promise<boolean> {
    try {
      const supabase = getServerClient();
      
      const { error } = await supabase
        .from("users")
        .update({ subscription_status: status })
        .eq("id", userId);
      
      if (error) {
        console.error("Failed to update subscription status:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error updating subscription status:", error);
      return false;
    }
  }
  
  /**
   * Find and update all expired trials in a batch operation
   */
  static async updateAllExpiredTrials(): Promise<{ updated: number, errors: any[] }> {
    try {
      const supabase = getServerClient();
      const now = new Date();
      
      // Find users with trial status whose trials have expired
      const { data: usersToUpdate, error } = await supabase
        .from("users")
        .select("id, trial_start_time, trial_duration_minutes")
        .eq("subscription_status", "trial")
        .is("trial_duration_minutes", 'not.null');
      
      if (error || !usersToUpdate) {
        console.error("Failed to fetch users with expired trials:", error);
        return { updated: 0, errors: [error] };
      }
      
      const errors: any[] = [];
      let updatedCount = 0;
      
      // Filter users whose trials have actually expired
      const expiredUserIds = usersToUpdate
        .filter((user: UserTrialData) => {
          const trialStartTime = new Date(user.trial_start_time);
          const trialDurationMs = user.trial_duration_minutes * 60 * 1000;
          const trialEndTime = new Date(trialStartTime.getTime() + trialDurationMs);
          return now > trialEndTime;
        })
        .map((user: UserTrialData) => user.id);
      
      // Batch update all expired users
      if (expiredUserIds.length > 0) {
        const { error: batchUpdateError } = await supabase
          .from("users")
          .update({ subscription_status: 'expired' })
          .in("id", expiredUserIds);
        
        if (batchUpdateError) {
          errors.push(batchUpdateError);
        } else {
          updatedCount = expiredUserIds.length;
        }
      }
      
      return { updated: updatedCount, errors };
    } catch (error) {
      console.error("Error updating expired trials:", error);
      return { updated: 0, errors: [error] };
    }
  }
  
  /**
   * Get the current user ID from cookies
   */
  static getCurrentUserId(): string | null {
    try {
      // Using try/catch because cookies() is a Server Component API
      // and might not be available in all contexts
      const cookieStore = cookies();
      
      // Handle both synchronous and asynchronous cookie store
      if (cookieStore instanceof Promise) {
        // This is async, but since we can't make this function async without
        // changing its signature, we'll need to return null for this case
        console.warn("Cookie store is asynchronous, can't get user ID synchronously");
        return null;
      }
      
      const cookie = cookieStore.get('auth-token');
      return cookie ? cookie.value : null;
    } catch (error) {
      console.error("Error getting current user ID:", error);
      return null;
    }
  }
  
  /**
   * Format remaining trial time in a human-readable format
   */
  static formatRemainingTime(remainingMinutes: number): string {
    const days = Math.floor(remainingMinutes / (60 * 24));
    const hours = Math.floor((remainingMinutes % (60 * 24)) / 60);
    const minutes = Math.floor(remainingMinutes % 60);
    
    return `${days}д ${hours}ч ${minutes}м`;
  }
} 