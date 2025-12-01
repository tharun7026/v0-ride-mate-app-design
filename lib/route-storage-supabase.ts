/**
 * Route Storage Utility - Supabase Backend
 * Handles CRUD operations for routes/trip plans using Supabase
 */

import { supabase } from "./supabase/client"
import type { RouteData, RouteBreakpoint } from "./route-storage"

// Re-export types for convenience
export type { RouteData, RouteBreakpoint } from "./route-storage"

/**
 * Convert database row to RouteData format
 */
function dbRowToRouteData(row: any): RouteData {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    version: row.version || 1,
    name: row.name,
    description: row.description || undefined,
    source: row.source,
    destination: row.destination,
    sourceCoordinates: row.source_coordinates
      ? {
          lat: row.source_coordinates.lat,
          lng: row.source_coordinates.lng,
        }
      : undefined,
    destinationCoordinates: row.destination_coordinates
      ? {
          lat: row.destination_coordinates.lat,
          lng: row.destination_coordinates.lng,
        }
      : undefined,
    breakpoints: (row.breakpoints || []) as RouteBreakpoint[],
    totalDistance: Number(row.total_distance),
    totalDays: row.total_days,
    totalHours: Number(row.total_hours),
    totalFuel: Number(row.total_fuel),
    dailyDistance: Number(row.daily_distance),
    hotelPreference: row.hotel_preference,
    vehicleType: row.vehicle_type || undefined,
    transportMode: row.transport_mode || undefined,
    plannedStartDate: row.planned_start_date || undefined,
    plannedEndDate: row.planned_end_date || undefined,
    actualStartDate: row.actual_start_date || undefined,
    actualEndDate: row.actual_end_date || undefined,
    notes: row.notes || undefined,
    tags: row.tags || undefined,
    isFavorite: row.is_favorite || false,
    isCompleted: row.is_completed || false,
    isArchived: row.is_archived || false,
    views: row.views || 0,
    shares: row.shares || 0,
    lastViewedAt: row.last_viewed_at || undefined,
  }
}

/**
 * Convert RouteData to database insert/update format
 */
function routeDataToDbRow(routeData: Partial<RouteData>, includeMetadata = false): any {
  const row: any = {}

  if (routeData.name !== undefined) row.name = routeData.name
  if (routeData.description !== undefined) row.description = routeData.description
  if (routeData.source !== undefined) row.source = routeData.source
  if (routeData.destination !== undefined) row.destination = routeData.destination
  if (routeData.sourceCoordinates !== undefined)
    row.source_coordinates = routeData.sourceCoordinates
  if (routeData.destinationCoordinates !== undefined)
    row.destination_coordinates = routeData.destinationCoordinates
  if (routeData.breakpoints !== undefined) row.breakpoints = routeData.breakpoints
  if (routeData.totalDistance !== undefined) row.total_distance = routeData.totalDistance
  if (routeData.totalDays !== undefined) row.total_days = routeData.totalDays
  if (routeData.totalHours !== undefined) row.total_hours = routeData.totalHours
  if (routeData.totalFuel !== undefined) row.total_fuel = routeData.totalFuel
  if (routeData.dailyDistance !== undefined) row.daily_distance = routeData.dailyDistance
  if (routeData.hotelPreference !== undefined) row.hotel_preference = routeData.hotelPreference
  if (routeData.vehicleType !== undefined) row.vehicle_type = routeData.vehicleType
  if (routeData.transportMode !== undefined) row.transport_mode = routeData.transportMode
  if (routeData.plannedStartDate !== undefined) row.planned_start_date = routeData.plannedStartDate
  if (routeData.plannedEndDate !== undefined) row.planned_end_date = routeData.plannedEndDate
  if (routeData.actualStartDate !== undefined) row.actual_start_date = routeData.actualStartDate
  if (routeData.actualEndDate !== undefined) row.actual_end_date = routeData.actualEndDate
  if (routeData.notes !== undefined) row.notes = routeData.notes
  if (routeData.tags !== undefined) row.tags = routeData.tags
  if (routeData.isFavorite !== undefined) row.is_favorite = routeData.isFavorite
  if (routeData.isCompleted !== undefined) row.is_completed = routeData.isCompleted
  if (routeData.isArchived !== undefined) row.is_archived = routeData.isArchived
  if (routeData.views !== undefined) row.views = routeData.views
  if (routeData.shares !== undefined) row.shares = routeData.shares
  if (routeData.lastViewedAt !== undefined) row.last_viewed_at = routeData.lastViewedAt

  if (includeMetadata) {
    if (routeData.version !== undefined) row.version = routeData.version
  }

  return row
}

/**
 * Get current user ID
 */
async function getUserId(): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user?.id || null
}

/**
 * Get all saved routes from Supabase
 */
export async function getAllRoutes(): Promise<RouteData[]> {
  try {
    const userId = await getUserId()
    if (!userId) {
      console.warn("No user authenticated. Returning empty routes.")
      return []
    }

    const { data, error } = await supabase
      .from("routes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching routes:", error)
      return []
    }

    return (data || []).map(dbRowToRouteData)
  } catch (error) {
    console.error("Error in getAllRoutes:", error)
    return []
  }
}

/**
 * Get a single route by ID
 */
export async function getRouteById(id: string): Promise<RouteData | null> {
  try {
    const userId = await getUserId()
    if (!userId) {
      return null
    }

    const { data, error } = await supabase
      .from("routes")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single()

    if (error) {
      console.error("Error fetching route:", error)
      return null
    }

    return data ? dbRowToRouteData(data) : null
  } catch (error) {
    console.error("Error in getRouteById:", error)
    return null
  }
}

/**
 * Create a new route
 */
export async function createRoute(
  routeData: Omit<RouteData, "id" | "createdAt" | "updatedAt" | "version">
): Promise<RouteData> {
  try {
    const userId = await getUserId()
    if (!userId) {
      throw new Error("User must be authenticated to create routes")
    }

    const dbRow = routeDataToDbRow({
      ...routeData,
      isFavorite: routeData.isFavorite ?? false,
      isCompleted: routeData.isCompleted ?? false,
      isArchived: routeData.isArchived ?? false,
      views: routeData.views ?? 0,
      shares: routeData.shares ?? 0,
      version: 1,
    })

    const { data, error } = await supabase
      .from("routes")
      .insert({
        ...dbRow,
        user_id: userId,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating route:", error)
      throw error
    }

    return dbRowToRouteData(data)
  } catch (error) {
    console.error("Error in createRoute:", error)
    throw error
  }
}

/**
 * Update an existing route
 */
export async function updateRoute(
  id: string,
  updates: Partial<Omit<RouteData, "id" | "createdAt" | "version">>
): Promise<RouteData | null> {
  try {
    const userId = await getUserId()
    if (!userId) {
      throw new Error("User must be authenticated to update routes")
    }

    // Get current route to check version
    const currentRoute = await getRouteById(id)
    if (!currentRoute) {
      throw new Error(`Route with id ${id} not found`)
    }

    const dbRow = routeDataToDbRow(updates)
    dbRow.version = (currentRoute.version || 1) + 1

    // Type assertion needed due to Supabase's strict typing
    // @ts-ignore - Supabase types are complex, dbRow matches Update type structure
    const { data, error } = await supabase
      .from("routes")
      .update(dbRow)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single()

    if (error) {
      console.error("Error updating route:", error)
      throw error
    }

    return data ? dbRowToRouteData(data) : null
  } catch (error) {
    console.error("Error in updateRoute:", error)
    throw error
  }
}

/**
 * Delete a route
 */
export async function deleteRoute(id: string): Promise<boolean> {
  try {
    const userId = await getUserId()
    if (!userId) {
      return false
    }

    const { error } = await supabase
      .from("routes")
      .delete()
      .eq("id", id)
      .eq("user_id", userId)

    if (error) {
      console.error("Error deleting route:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deleteRoute:", error)
    return false
  }
}

/**
 * Get routes with filters
 */
export async function getRoutes(filters?: {
  isFavorite?: boolean
  isCompleted?: boolean
  isArchived?: boolean
  searchQuery?: string
  sortBy?: "createdAt" | "updatedAt" | "name" | "totalDistance"
  sortOrder?: "asc" | "desc"
}): Promise<RouteData[]> {
  try {
    const userId = await getUserId()
    if (!userId) {
      return []
    }

    let query = supabase.from("routes").select("*").eq("user_id", userId)

    // Apply filters
    if (filters) {
      if (filters.isFavorite !== undefined) {
        query = query.eq("is_favorite", filters.isFavorite)
      }
      if (filters.isCompleted !== undefined) {
        query = query.eq("is_completed", filters.isCompleted)
      }
      if (filters.isArchived !== undefined) {
        query = query.eq("is_archived", filters.isArchived)
      }
      if (filters.searchQuery) {
        query = query.or(
          `name.ilike.%${filters.searchQuery}%,source.ilike.%${filters.searchQuery}%,destination.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`
        )
      }

      // Apply sorting
      if (filters.sortBy) {
        const columnMap: Record<string, string> = {
          createdAt: "created_at",
          updatedAt: "updated_at",
          name: "name",
          totalDistance: "total_distance",
        }
        query = query.order(columnMap[filters.sortBy] || "created_at", {
          ascending: filters.sortOrder !== "desc",
        })
      } else {
        query = query.order("created_at", { ascending: false })
      }
    } else {
      query = query.order("created_at", { ascending: false })
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching filtered routes:", error)
      return []
    }

    return (data || []).map(dbRowToRouteData)
  } catch (error) {
    console.error("Error in getRoutes:", error)
    return []
  }
}

/**
 * Increment route views
 */
export async function incrementRouteViews(id: string): Promise<void> {
  try {
    const userId = await getUserId()
    if (!userId) return

    const route = await getRouteById(id)
    if (!route) return

    await updateRoute(id, {
      views: (route.views || 0) + 1,
      lastViewedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error incrementing route views:", error)
  }
}

/**
 * Toggle favorite status
 */
export async function toggleFavorite(id: string): Promise<boolean> {
  try {
    const route = await getRouteById(id)
    if (!route) return false

    const newFavoriteStatus = !route.isFavorite
    await updateRoute(id, { isFavorite: newFavoriteStatus })
    return newFavoriteStatus
  } catch (error) {
    console.error("Error toggling favorite:", error)
    return false
  }
}

/**
 * Archive/unarchive a route
 */
export async function toggleArchive(id: string): Promise<boolean> {
  try {
    const route = await getRouteById(id)
    if (!route) return false

    const newArchiveStatus = !route.isArchived
    await updateRoute(id, { isArchived: newArchiveStatus })
    return newArchiveStatus
  } catch (error) {
    console.error("Error toggling archive:", error)
    return false
  }
}

/**
 * Mark route as completed
 */
export async function markAsCompleted(id: string): Promise<void> {
  try {
    await updateRoute(id, {
      isCompleted: true,
      actualEndDate: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error marking route as completed:", error)
  }
}

/**
 * Initialize routes storage (for migration from localStorage)
 */
export async function initializeRoutesStorage(): Promise<void> {
  // This function can be used to migrate data from localStorage to Supabase
  // Implementation depends on your migration strategy
  console.log("Routes storage initialized with Supabase")
}

