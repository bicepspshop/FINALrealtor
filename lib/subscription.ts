import { getServerClient } from "./supabase"

// Types
export interface TrialInfo {
  isActive: boolean;
  subscriptionStatus: string;
  trialEndTime?: Date;
  remainingMinutes?: number;
}

/**
 * Checks the trial status for a given user
 */
export async function checkTrialStatus(userId: string): Promise<TrialInfo> {
  try {
    const supabase = getServerClient();
    
    // Get user data with trial information
    const { data: user, error } = await supabase
      .from("users")
      .select("id, trial_start_time, trial_duration_minutes, subscription_status")
      .eq("id", userId)
      .single();
      
    if (error || !user) {
      console.error("Failed to fetch user trial data:", error);
      return { isActive: false, subscriptionStatus: 'unknown' };
    }
    
    // If already paid, no need to check trial
    if (user.subscription_status === 'active') {
      return { isActive: true, subscriptionStatus: 'active' };
    }
    
    // If already expired, return that
    if (user.subscription_status === 'expired') {
      return { isActive: false, subscriptionStatus: 'expired' };
    }
    
    // Check if trial is still active by calculating end time
    const trialStartTime = new Date(user.trial_start_time);
    const trialDurationMs = user.trial_duration_minutes * 60 * 1000;
    const trialEndTime = new Date(trialStartTime.getTime() + trialDurationMs);
    const currentTime = new Date();
    
    const isTrialActive = currentTime < trialEndTime;
    
    // If trial expired but status not updated yet
    if (!isTrialActive && user.subscription_status === 'trial') {
      // Update the status
      await supabase
        .from("users")
        .update({ subscription_status: 'expired' })
        .eq("id", userId);
        
      return { 
        isActive: false, 
        subscriptionStatus: 'expired',
        trialEndTime
      };
    }
    
    // Calculate remaining time
    const remainingMinutes = isTrialActive ? 
      Math.floor((trialEndTime.getTime() - currentTime.getTime()) / (60 * 1000)) : 0;
    
    return {
      isActive: isTrialActive,
      subscriptionStatus: user.subscription_status,
      trialEndTime,
      remainingMinutes
    };
  } catch (error) {
    console.error("Error checking trial status:", error);
    return { isActive: false, subscriptionStatus: 'error' };
  }
}

/**
 * Returns a simplified string representation of remaining trial time
 */
export function formatRemainingTrialTime(remainingMinutes: number): string {
  const days = Math.floor(remainingMinutes / (60 * 24));
  const hours = Math.floor((remainingMinutes % (60 * 24)) / 60);
  const minutes = Math.floor(remainingMinutes % 60);
  
  return `${days}д ${hours}ч ${minutes}м`;
}

/**
 * Batch update subscription status for all users with expired trials
 * This function can be called by a scheduled job or admin action
 */
export async function updateExpiredTrials(): Promise<{ updated: number, errors: any[] }> {
  try {
    const supabase = getServerClient();
    const currentTime = new Date().toISOString();
    
    // Find all users with trial status whose trial period has expired
    const { data: usersToUpdate, error } = await supabase
      .from("users")
      .select("id, trial_start_time, trial_duration_minutes")
      .eq("subscription_status", "trial")
      .lte("trial_start_time", currentTime)
      .is("trial_duration_minutes", 'not.null');
    
    if (error || !usersToUpdate) {
      console.error("Failed to fetch users with expired trials:", error);
      return { updated: 0, errors: [error] };
    }
    
    const errors = [];
    let updatedCount = 0;
    
    // Check each user and update if trial has expired
    for (const user of usersToUpdate) {
      const trialStartTime = new Date(user.trial_start_time);
      const trialDurationMs = user.trial_duration_minutes * 60 * 1000;
      const trialEndTime = new Date(trialStartTime.getTime() + trialDurationMs);
      const currentTime = new Date();
      
      if (currentTime > trialEndTime) {
        // Trial has expired, update status
        const { error: updateError } = await supabase
          .from("users")
          .update({ subscription_status: 'expired' })
          .eq("id", user.id);
          
        if (updateError) {
          errors.push({ userId: user.id, error: updateError });
        } else {
          updatedCount++;
        }
      }
    }
    
    return { updated: updatedCount, errors };
  } catch (error) {
    console.error("Error updating expired trials:", error);
    return { updated: 0, errors: [error] };
  }
} 