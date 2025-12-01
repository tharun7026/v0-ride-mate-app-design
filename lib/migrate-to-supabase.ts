/**
 * Migration utility to move routes from localStorage to Supabase
 * Run this once after setting up Supabase to migrate existing data
 */

import { getAllRoutes as getLocalRoutes } from "./route-storage"
import { createRoute } from "./route-storage-supabase"

export async function migrateLocalStorageToSupabase() {
  console.log("Starting migration from localStorage to Supabase...")

  try {
    // Check if user is authenticated
    const { supabase } = await import("./supabase/client")
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.error("❌ Error: You must be signed in to migrate routes to Supabase.")
      console.log("Please sign in first, then run migrateToSupabase() again.")
      return { success: false, migrated: 0, errors: ["User not authenticated"] }
    }

    console.log(`✓ User authenticated: ${user.email}`)

    const localRoutes = getLocalRoutes()
    console.log(`Found ${localRoutes.length} routes in localStorage`)

    if (localRoutes.length === 0) {
      console.log("No routes to migrate.")
      return { success: true, migrated: 0, errors: [] }
    }

    let migrated = 0
    const errors: string[] = []

    for (const route of localRoutes) {
      try {
        // Create route in Supabase
        await createRoute({
          name: route.name,
          description: route.description,
          source: route.source,
          destination: route.destination,
          sourceCoordinates: route.sourceCoordinates,
          destinationCoordinates: route.destinationCoordinates,
          breakpoints: route.breakpoints,
          totalDistance: route.totalDistance,
          totalDays: route.totalDays,
          totalHours: route.totalHours,
          totalFuel: route.totalFuel,
          dailyDistance: route.dailyDistance,
          hotelPreference: route.hotelPreference,
          vehicleType: route.vehicleType,
          transportMode: route.transportMode,
          plannedStartDate: route.plannedStartDate,
          plannedEndDate: route.plannedEndDate,
          actualStartDate: route.actualStartDate,
          actualEndDate: route.actualEndDate,
          notes: route.notes,
          tags: route.tags,
          isFavorite: route.isFavorite,
          isCompleted: route.isCompleted,
          isArchived: route.isArchived,
        })

        migrated++
        console.log(`✓ Migrated: ${route.name}`)
      } catch (error: any) {
        const errorMsg = `Failed to migrate "${route.name}": ${error.message}`
        errors.push(errorMsg)
        console.error(`✗ ${errorMsg}`)
      }
    }

    console.log(`\nMigration complete!`)
    console.log(`Successfully migrated: ${migrated}/${localRoutes.length} routes`)

    if (errors.length > 0) {
      console.log(`\nErrors encountered:`)
      errors.forEach((err) => console.log(`  - ${err}`))
    }

    return { success: true, migrated, errors }
  } catch (error: any) {
    console.error("Migration failed:", error)
    return { success: false, migrated: 0, errors: [error.message] }
  }
}

// Run migration if called directly
if (typeof window !== "undefined") {
  // Expose to window for manual execution in browser console
  ;(window as any).migrateToSupabase = migrateLocalStorageToSupabase
  console.log(
    "Migration function available. Run 'migrateToSupabase()' in browser console to migrate routes."
  )
}

