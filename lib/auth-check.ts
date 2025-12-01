/**
 * Authentication check utility
 * Helps verify if user is authenticated with Supabase
 */

import { supabase } from "./supabase/client"

export async function checkAuth(): Promise<{ isAuthenticated: boolean; user: any; error?: string }> {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      return { isAuthenticated: false, user: null, error: error.message }
    }

    return { isAuthenticated: !!user, user }
  } catch (error: any) {
    return { isAuthenticated: false, user: null, error: error.message || "Unknown error" }
  }
}

export async function signInAnonymously(): Promise<{ success: boolean; error?: string }> {
  try {
    // Note: Supabase doesn't have anonymous auth by default
    // This is a placeholder - you'll need to set up proper auth
    const { data, error } = await supabase.auth.signInAnonymously()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to sign in" }
  }
}

