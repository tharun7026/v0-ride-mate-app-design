/**
 * Route Storage Utility
 * Handles CRUD operations for routes/trip plans
 * Designed to be easily migratable to a database backend
 */

export interface RouteBreakpoint {
  day: number
  city: string
  distance: number // in km
  hours: number
  location: {
    lat: number
    lng: number
  }
  address: string
}

export interface RouteData {
  // Metadata
  id: string
  createdAt: string // ISO 8601 timestamp
  updatedAt: string // ISO 8601 timestamp
  version: number // For optimistic locking in future

  // Route Information
  name: string
  description?: string
  source: string
  destination: string
  sourceCoordinates?: { lat: number; lng: number }
  destinationCoordinates?: { lat: number; lng: number }

  // Trip Details
  breakpoints: RouteBreakpoint[]
  totalDistance: number // in km
  totalDays: number
  totalHours: number
  totalFuel: number // in liters

  // Preferences
  dailyDistance: number // preferred daily distance in km
  hotelPreference: string // "budget" | "3-star" | "5-star"
  vehicleType?: string
  transportMode?: string // "motorcycle" | "car" | "bicycle" | "scooter"

  // Dates & Timing
  plannedStartDate?: string // ISO 8601 date
  plannedEndDate?: string // ISO 8601 date
  actualStartDate?: string // ISO 8601 date
  actualEndDate?: string // ISO 8601 date

  // Additional Information
  notes?: string
  tags?: string[]
  isFavorite?: boolean
  isCompleted?: boolean
  isArchived?: boolean

  // Statistics (for future analytics)
  views?: number
  shares?: number
  lastViewedAt?: string // ISO 8601 timestamp
}

const STORAGE_KEY = "savedRoutes"
const STORAGE_VERSION = "1.0.0"

/**
 * Generate a unique ID for routes
 */
function generateId(): string {
  return `route_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Get all saved routes from localStorage
 */
export function getAllRoutes(): RouteData[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []

    const data = JSON.parse(stored)
    
    // Handle new format: { version, routes, lastUpdated }
    if (data && typeof data === "object" && Array.isArray(data.routes)) {
      return data.routes
    }
    
    // Handle old format: direct array (for backward compatibility)
    if (Array.isArray(data)) {
      return data
    }
    
    return []
  } catch (error) {
    console.error("Error reading routes from localStorage:", error)
    return []
  }
}

/**
 * Get a single route by ID
 */
export function getRouteById(id: string): RouteData | null {
  const routes = getAllRoutes()
  return routes.find((route) => route.id === id) || null
}

/**
 * Create a new route
 */
export function createRoute(routeData: Omit<RouteData, "id" | "createdAt" | "updatedAt" | "version">): RouteData {
  const routes = getAllRoutes()

  const newRoute: RouteData = {
    ...routeData,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
    views: 0,
    shares: 0,
    isFavorite: false,
    isCompleted: false,
    isArchived: false,
  }

  routes.push(newRoute)
  saveRoutes(routes)

  return newRoute
}

/**
 * Update an existing route
 */
export function updateRoute(id: string, updates: Partial<Omit<RouteData, "id" | "createdAt" | "version">>): RouteData | null {
  const routes = getAllRoutes()
  const index = routes.findIndex((route) => route.id === id)

  if (index === -1) {
    console.error(`Route with id ${id} not found`)
    return null
  }

  const existingRoute = routes[index]
  const updatedRoute: RouteData = {
    ...existingRoute,
    ...updates,
    id: existingRoute.id, // Preserve ID
    createdAt: existingRoute.createdAt, // Preserve creation date
    updatedAt: new Date().toISOString(),
    version: (existingRoute.version || 1) + 1, // Increment version
  }

  routes[index] = updatedRoute
  saveRoutes(routes)

  return updatedRoute
}

/**
 * Delete a route
 */
export function deleteRoute(id: string): boolean {
  const routes = getAllRoutes()
  const filtered = routes.filter((route) => route.id !== id)

  if (filtered.length === routes.length) {
    console.error(`Route with id ${id} not found`)
    return false
  }

  saveRoutes(filtered)
  return true
}

/**
 * Save routes array to localStorage
 */
function saveRoutes(routes: RouteData[]): void {
  if (typeof window === "undefined") return

  try {
    const data = {
      version: STORAGE_VERSION,
      routes,
      lastUpdated: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error("Error saving routes to localStorage:", error)
    // Handle quota exceeded error
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      alert("Storage quota exceeded. Please delete some old routes.")
    }
  }
}

/**
 * Initialize routes storage (for migration/upgrades)
 */
export function initializeRoutesStorage(): void {
  if (typeof window === "undefined") return

  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    // Initialize with empty array
    saveRoutes([])
    return
  }

  try {
    const data = JSON.parse(stored)
    // Migrate old format if needed
    if (Array.isArray(data)) {
      // Old format - migrate to new format
      const migratedRoutes = data.map((route: any) => ({
        ...route,
        id: route.id || generateId(),
        createdAt: route.createdAt || new Date().toISOString(),
        updatedAt: route.updatedAt || new Date().toISOString(),
        version: route.version || 1,
      }))
      saveRoutes(migratedRoutes)
    }
  } catch (error) {
    console.error("Error initializing routes storage:", error)
  }
}

/**
 * Get routes with filters
 */
export function getRoutes(filters?: {
  isFavorite?: boolean
  isCompleted?: boolean
  isArchived?: boolean
  searchQuery?: string
  sortBy?: "createdAt" | "updatedAt" | "name" | "totalDistance"
  sortOrder?: "asc" | "desc"
}): RouteData[] {
  let routes = getAllRoutes()

  // Apply filters
  if (filters) {
    if (filters.isFavorite !== undefined) {
      routes = routes.filter((route) => route.isFavorite === filters.isFavorite)
    }
    if (filters.isCompleted !== undefined) {
      routes = routes.filter((route) => route.isCompleted === filters.isCompleted)
    }
    if (filters.isArchived !== undefined) {
      routes = routes.filter((route) => route.isArchived === filters.isArchived)
    }
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      routes = routes.filter(
        (route) =>
          route.name.toLowerCase().includes(query) ||
          route.source.toLowerCase().includes(query) ||
          route.destination.toLowerCase().includes(query) ||
          route.description?.toLowerCase().includes(query)
      )
    }

    // Apply sorting
    if (filters.sortBy) {
      routes.sort((a, b) => {
        let aValue: any = a[filters.sortBy!]
        let bValue: any = b[filters.sortBy!]

        if (filters.sortBy === "createdAt" || filters.sortBy === "updatedAt") {
          aValue = new Date(aValue).getTime()
          bValue = new Date(bValue).getTime()
        }

        if (typeof aValue === "string") {
          aValue = aValue.toLowerCase()
          bValue = bValue.toLowerCase()
        }

        const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0
        return filters.sortOrder === "desc" ? -comparison : comparison
      })
    }
  }

  return routes
}

/**
 * Increment route views
 */
export function incrementRouteViews(id: string): void {
  const route = getRouteById(id)
  if (route) {
    updateRoute(id, {
      views: (route.views || 0) + 1,
      lastViewedAt: new Date().toISOString(),
    })
  }
}

/**
 * Toggle favorite status
 */
export function toggleFavorite(id: string): boolean {
  const route = getRouteById(id)
  if (route) {
    updateRoute(id, { isFavorite: !route.isFavorite })
    return !route.isFavorite
  }
  return false
}

/**
 * Archive/unarchive a route
 */
export function toggleArchive(id: string): boolean {
  const route = getRouteById(id)
  if (route) {
    updateRoute(id, { isArchived: !route.isArchived })
    return !route.isArchived
  }
  return false
}

/**
 * Mark route as completed
 */
export function markAsCompleted(id: string): void {
  updateRoute(id, {
    isCompleted: true,
    actualEndDate: new Date().toISOString(),
  })
}

/**
 * Export route data (for backup/migration)
 */
export function exportRoutes(): string {
  const routes = getAllRoutes()
  return JSON.stringify(routes, null, 2)
}

/**
 * Import routes (for restore/migration)
 */
export function importRoutes(jsonData: string): { success: boolean; imported: number; errors: string[] } {
  try {
    const data = JSON.parse(jsonData)
    const routesToImport = Array.isArray(data) ? data : data.routes || []

    let imported = 0
    const errors: string[] = []

    routesToImport.forEach((route: any) => {
      try {
        // Validate route structure
        if (!route.source || !route.destination) {
          errors.push(`Route missing required fields: ${route.name || "Unknown"}`)
          return
        }

        // Create new route (will generate new ID and timestamps)
        createRoute({
          name: route.name || `${route.source} to ${route.destination}`,
          description: route.description,
          source: route.source,
          destination: route.destination,
          sourceCoordinates: route.sourceCoordinates,
          destinationCoordinates: route.destinationCoordinates,
          breakpoints: route.breakpoints || [],
          totalDistance: route.totalDistance || 0,
          totalDays: route.totalDays || 0,
          totalHours: route.totalHours || 0,
          totalFuel: route.totalFuel || 0,
          dailyDistance: route.dailyDistance || 400,
          hotelPreference: route.hotelPreference || "3-star",
          vehicleType: route.vehicleType,
          transportMode: route.transportMode,
          plannedStartDate: route.plannedStartDate,
          plannedEndDate: route.plannedEndDate,
          notes: route.notes,
          tags: route.tags,
          isFavorite: route.isFavorite || false,
        })
        imported++
      } catch (error) {
        errors.push(`Error importing route: ${error}`)
      }
    })

    return { success: true, imported, errors }
  } catch (error) {
    return { success: false, imported: 0, errors: [`Invalid JSON format: ${error}`] }
  }
}

