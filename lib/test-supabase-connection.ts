/**
 * Test Supabase connection and configuration
 * Run this in browser console: testSupabaseConnection()
 */

import { supabase } from "./supabase/client"

export async function testSupabaseConnection() {
  console.log("🔍 Testing Supabase connection...\n")

  // Test 1: Environment variables
  console.log("1. Checking environment variables...")
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing environment variables!")
    console.log("   Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local")
    return { success: false, step: "env-vars" }
  }
  console.log("✓ Environment variables found")

  // Test 2: Supabase client
  console.log("\n2. Testing Supabase client...")
  try {
    const { data, error } = await supabase.from("routes").select("count").limit(1)
    if (error) {
      if (error.message.includes("relation") || error.message.includes("does not exist")) {
        console.error("❌ Routes table does not exist!")
        console.log("   Please run the SQL migration from supabase/migrations/001_create_routes_table.sql")
        return { success: false, step: "table-missing", error: error.message }
      }
      console.error("❌ Supabase connection error:", error.message)
      return { success: false, step: "connection", error: error.message }
    }
    console.log("✓ Supabase client connected")
  } catch (error: any) {
    console.error("❌ Failed to connect to Supabase:", error.message)
    return { success: false, step: "connection", error: error.message }
  }

  // Test 3: Authentication
  console.log("\n3. Checking authentication...")
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  const isAuthenticated = !authError && !!user
  if (!isAuthenticated) {
    console.warn("⚠️  Not authenticated")
    console.log("   Continuing test to check if RLS is disabled...")
  } else {
    console.log(`✓ Authenticated as: ${user.email || user.id}`)
  }

  // Test 4: RLS Policies
  console.log("\n4. Testing RLS policies...")
  try {
    const testRoute = {
      name: `Test Route ${Date.now()}`, // Use timestamp to avoid conflicts
      source: "Test Source",
      destination: "Test Destination",
      breakpoints: [],
      total_distance: 0,
      total_days: 0,
      total_hours: 0,
      total_fuel: 0,
      daily_distance: 400,
      hotel_preference: "3-star",
    }

    const { data: insertedData, error: insertError } = await supabase.from("routes").insert(testRoute).select().single()

    if (insertError) {
      if (insertError.message.includes("policy") || insertError.message.includes("RLS") || insertError.message.includes("row-level security")) {
        console.error("❌ RLS policy blocking insert!")
        console.log("   This means:")
        console.log("   - RLS is enabled (good for security)")
        if (!isAuthenticated) {
          console.log("   - You're not authenticated, so RLS is blocking the operation")
          console.log("   - To disable RLS for testing, run in Supabase SQL Editor:")
          console.log("     ALTER TABLE public.routes DISABLE ROW LEVEL SECURITY;")
        } else {
          console.log("   - Policies may need adjustment")
        }
        return { success: false, step: "rls", error: insertError.message, authenticated: isAuthenticated }
      }
      console.error("❌ Insert test failed:", insertError.message)
      return { success: false, step: "insert", error: insertError.message }
    }

    // Clean up test route
    if (insertedData?.id) {
      await supabase.from("routes").delete().eq("id", insertedData.id)
    }

    if (!isAuthenticated) {
      console.log("✓ Insert succeeded without authentication")
      console.log("⚠️  WARNING: RLS appears to be DISABLED")
      console.log("   This allows unauthenticated access to your database.")
      console.log("   ⚠️  Remember to re-enable RLS before production!")
      console.log("   To re-enable: ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;")
    } else {
      console.log("✓ RLS policies allow inserts (authenticated)")
    }
  } catch (error: any) {
    console.error("❌ RLS test failed:", error.message)
    return { success: false, step: "rls-test", error: error.message }
  }

  console.log("\n✅ All tests passed! Supabase is configured correctly.")
  return { success: true }
}

// Expose to window for browser console
if (typeof window !== "undefined") {
  ;(window as any).testSupabaseConnection = testSupabaseConnection
  console.log("Test function available. Run 'testSupabaseConnection()' in browser console.")
}

