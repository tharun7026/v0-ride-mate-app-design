"use client"

import { useState, useEffect } from "react"
import { MapPin, Calendar, Fuel, Hotel, Trash2, Eye, Share2, Download, Plus, Edit, Star, Search, Filter } from "lucide-react"
import Container from "@/components/layout/container"
import Grid from "@/components/layout/grid"
import {
  getAllRoutes,
  deleteRoute,
  toggleFavorite,
  toggleArchive,
  incrementRouteViews,
  type RouteData,
} from "@/lib/route-storage"
import EditRouteScreen from "./edit-route-screen"

export default function MyRoutesScreen() {
  const [savedRoutes, setSavedRoutes] = useState<RouteData[]>([])
  const [selectedRoute, setSelectedRoute] = useState<RouteData | null>(null)
  const [editingRouteId, setEditingRouteId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [showArchived, setShowArchived] = useState(false)

  // Load saved routes from localStorage
  const loadRoutes = () => {
    const routes = getAllRoutes()
    const filtered = showArchived ? routes : routes.filter((r) => !r.isArchived)
    setSavedRoutes(filtered)
  }

  useEffect(() => {
    loadRoutes()
    // Refresh routes when window gains focus (in case another tab updated data)
    const handleFocus = () => loadRoutes()
    window.addEventListener("focus", handleFocus)
    return () => window.removeEventListener("focus", handleFocus)
  }, [showArchived])

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this route? This action cannot be undone.")) {
      if (deleteRoute(id)) {
        loadRoutes()
        if (selectedRoute?.id === id) {
          setSelectedRoute(null)
        }
        alert("Route deleted successfully!")
      }
    }
  }

  const handleView = (route: RouteData) => {
    incrementRouteViews(route.id)
    setSelectedRoute(route)
  }

  const handleEdit = (routeId: string) => {
    setEditingRouteId(routeId)
  }

  const handleEditSave = () => {
    setEditingRouteId(null)
    loadRoutes()
    // Reload selected route if it was the one being edited
    if (selectedRoute && editingRouteId === selectedRoute.id) {
      const updated = getAllRoutes().find((r) => r.id === selectedRoute.id)
      if (updated) setSelectedRoute(updated)
    }
  }

  const handleEditCancel = () => {
    setEditingRouteId(null)
  }

  const handleToggleFavorite = (id: string) => {
    toggleFavorite(id)
    loadRoutes()
    if (selectedRoute?.id === id) {
      const updated = getAllRoutes().find((r) => r.id === id)
      if (updated) setSelectedRoute(updated)
    }
  }

  const handleToggleArchive = (id: string) => {
    toggleArchive(id)
    loadRoutes()
    if (selectedRoute?.id === id) {
      setSelectedRoute(null)
    }
  }

  // Filter routes based on search query
  const filteredRoutes = savedRoutes.filter((route) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      route.name.toLowerCase().includes(query) ||
      route.source.toLowerCase().includes(query) ||
      route.destination.toLowerCase().includes(query) ||
      route.description?.toLowerCase().includes(query) ||
      route.tags?.some((tag) => tag.toLowerCase().includes(query))
    )
  })

  const handleShare = (route: RouteData) => {
    // In a real app, this would share the route
    navigator.clipboard.writeText(
      `Check out my route: ${route.source} to ${route.destination} - ${route.totalDistance}km over ${route.totalDays} days`
    )
    alert("Route link copied to clipboard!")
  }

  const handleExport = (route: RouteData) => {
    // In a real app, this would export to GPX/PDF
    alert(`Exporting route: ${route.name}`)
  }

  const handleCreateNew = () => {
    // Navigate to trip planner
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("navigate", { detail: { screen: "trip-planner" } }))
    }
  }

  // Show edit screen if editing
  if (editingRouteId) {
    return <EditRouteScreen routeId={editingRouteId} onSave={handleEditSave} onCancel={handleEditCancel} />
  }

  if (selectedRoute) {
    return (
      <div className="w-full min-h-screen bg-background">
        <Container maxWidth="2xl" className="py-8 lg:py-12">
          <div className="mb-6">
            <button
              onClick={() => setSelectedRoute(null)}
              className="text-muted-foreground hover:text-foreground mb-4 flex items-center gap-2 transition-colors"
              aria-label="Back to routes list"
            >
              ← Back to Routes
            </button>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2">
              {selectedRoute.name}
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              {selectedRoute.source} → {selectedRoute.destination}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <MapPin className="text-primary" size={20} />
              </div>
              <p className="text-xs text-muted-foreground mb-1">Distance</p>
              <p className="text-xl font-bold text-foreground">{selectedRoute.totalDistance} km</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <Calendar className="text-primary" size={20} />
              </div>
              <p className="text-xs text-muted-foreground mb-1">Days</p>
              <p className="text-xl font-bold text-foreground">{selectedRoute.totalDays}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <Fuel className="text-primary" size={20} />
              </div>
              <p className="text-xs text-muted-foreground mb-1">Fuel</p>
              <p className="text-xl font-bold text-foreground">{selectedRoute.totalFuel} L</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <Hotel className="text-primary" size={20} />
              </div>
              <p className="text-xs text-muted-foreground mb-1">Stays</p>
              <p className="text-xl font-bold text-foreground">{selectedRoute.totalDays}</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 lg:p-8 mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">Route Details</h2>
            <div className="space-y-3">
              {selectedRoute.breakpoints.map((bp, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg hover:border-primary transition-all border border-transparent"
                >
                  <div>
                    <p className="font-semibold text-foreground">Day {bp.day}</p>
                    <p className="text-sm text-muted-foreground">{bp.city}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{bp.distance} km</p>
                    <p className="text-xs text-muted-foreground">{bp.hours}h ride</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Route Information */}
          {selectedRoute.description && (
            <div className="bg-card border border-border rounded-xl p-6 lg:p-8 mb-6">
              <h3 className="text-lg font-bold text-foreground mb-3">Description</h3>
              <p className="text-muted-foreground">{selectedRoute.description}</p>
            </div>
          )}

          {(selectedRoute.notes || selectedRoute.tags) && (
            <div className="bg-card border border-border rounded-xl p-6 lg:p-8 mb-6">
              {selectedRoute.notes && (
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-foreground mb-3">Notes</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{selectedRoute.notes}</p>
                </div>
              )}
              {selectedRoute.tags && selectedRoute.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRoute.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-muted text-foreground rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Metadata */}
          <div className="bg-card border border-border rounded-xl p-6 lg:p-8 mb-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Route Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Created</p>
                <p className="font-medium text-foreground">
                  {new Date(selectedRoute.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Last Updated</p>
                <p className="font-medium text-foreground">
                  {new Date(selectedRoute.updatedAt).toLocaleDateString()}
                </p>
              </div>
              {selectedRoute.plannedStartDate && (
                <div>
                  <p className="text-muted-foreground mb-1">Planned Start</p>
                  <p className="font-medium text-foreground">
                    {new Date(selectedRoute.plannedStartDate).toLocaleDateString()}
                  </p>
                </div>
              )}
              {selectedRoute.plannedEndDate && (
                <div>
                  <p className="text-muted-foreground mb-1">Planned End</p>
                  <p className="font-medium text-foreground">
                    {new Date(selectedRoute.plannedEndDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleEdit(selectedRoute.id)}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              <Edit size={18} />
              Edit Route
            </button>
            <button
              onClick={() => {
                handleToggleFavorite(selectedRoute.id)
                const updated = getAllRoutes().find((r) => r.id === selectedRoute.id)
                if (updated) setSelectedRoute(updated)
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                selectedRoute.isFavorite
                  ? "bg-primary/10 text-primary border border-primary"
                  : "bg-muted border border-border text-foreground hover:border-primary"
              }`}
            >
              <Star size={18} className={selectedRoute.isFavorite ? "fill-current" : ""} />
              {selectedRoute.isFavorite ? "Favorited" : "Add to Favorites"}
            </button>
            <button
              onClick={() => handleShare(selectedRoute)}
              className="flex items-center gap-2 px-6 py-3 bg-muted border border-border text-foreground rounded-lg font-semibold hover:border-primary transition-colors"
            >
              <Share2 size={18} />
              Share Route
            </button>
            <button
              onClick={() => handleExport(selectedRoute)}
              className="flex items-center gap-2 px-6 py-3 bg-muted border border-border text-foreground rounded-lg font-semibold hover:border-primary transition-colors"
            >
              <Download size={18} />
              Export
            </button>
            <button
              onClick={() => {
                if (confirm("Are you sure you want to delete this route?")) {
                  handleDelete(selectedRoute.id)
                }
              }}
              className="flex items-center gap-2 px-6 py-3 bg-destructive text-white rounded-lg font-semibold hover:bg-destructive/90 transition-colors"
              >
              <Trash2 size={18} />
              Delete
            </button>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-background">
      <Container maxWidth="xl" className="py-8 lg:py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2">
              My Routes
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              View and manage your saved trip routes
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
              <Search size={18} className="text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search routes..."
                className="bg-transparent border-none outline-none text-foreground placeholder-muted-foreground w-40 sm:w-64"
              />
            </div>
            {/* <button
              onClick={() => setShowArchived(!showArchived)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                showArchived
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted border border-border text-foreground hover:border-primary"
              }`}
            >
              <Filter size={18} className="inline mr-2" />
              {showArchived ? "Hide Archived" : "Show Archived"}
            </button> */}
            <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Grid view"
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "list"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="List view"
              >
                List
              </button>
            </div>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              aria-label="Create new route"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">New Route</span>
            </button>
          </div>
        </div>

        {filteredRoutes.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 lg:p-16 text-center">
            <div className="text-6xl mb-6">🗺️</div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">No Routes Yet</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start planning your first adventure! Create a new route to get started.
            </p>
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              <Plus size={20} />
              Create Your First Route
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <Grid cols={3} gap="md">
            {filteredRoutes.map((route) => (
              <div
                key={route.id}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary transition-all cursor-pointer group"
                onClick={() => handleView(route)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {route.name}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin size={14} />
                      {route.source} → {route.destination}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(route.id)
                    }}
                    className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="Delete route"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Distance</p>
                    <p className="text-sm font-semibold text-foreground">{route.totalDistance} km</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Days</p>
                    <p className="text-sm font-semibold text-foreground">{route.totalDays}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Fuel</p>
                    <p className="text-sm font-semibold text-foreground">{route.totalFuel} L</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Created</p>
                    <p className="text-sm font-semibold text-foreground">
                      {new Date(route.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleView(route)
                    }}
                    className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm"
                  >
                    <Eye size={16} className="inline mr-2" />
                    View
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(route.id)
                    }}
                    className="px-3 py-2 bg-muted border border-border text-foreground rounded-lg hover:border-primary transition-colors"
                    aria-label="Edit route"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggleFavorite(route.id)
                    }}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      route.isFavorite
                        ? "bg-primary/10 text-primary border border-primary"
                        : "bg-muted border border-border text-foreground hover:border-primary"
                    }`}
                    aria-label={route.isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Star size={16} className={route.isFavorite ? "fill-current" : ""} />
                  </button>
                </div>
              </div>
            ))}
          </Grid>
        ) : (
          <div className="space-y-4">
            {filteredRoutes.map((route) => (
              <div
                key={route.id}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-1">{route.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin size={14} />
                          {route.source} → {route.destination}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-muted-foreground" />
                        <span className="text-foreground">{route.totalDistance} km</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-muted-foreground" />
                        <span className="text-foreground">{route.totalDays} days</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Fuel size={14} className="text-muted-foreground" />
                        <span className="text-foreground">{route.totalFuel} L</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {new Date(route.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleView(route)}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm"
                    >
                      <Eye size={16} className="inline mr-2" />
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(route.id)}
                      className="p-2 bg-muted border border-border text-foreground rounded-lg hover:border-primary transition-colors"
                      aria-label="Edit route"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleToggleFavorite(route.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        route.isFavorite
                          ? "bg-primary/10 text-primary border border-primary"
                          : "bg-muted border border-border text-foreground hover:border-primary"
                      }`}
                      aria-label={route.isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Star size={16} className={route.isFavorite ? "fill-current" : ""} />
                    </button>
                    <button
                      onClick={() => handleShare(route)}
                      className="p-2 bg-muted border border-border text-foreground rounded-lg hover:border-primary transition-colors"
                      aria-label="Share route"
                    >
                      <Share2 size={16} />
                    </button>
                    <button
                      onClick={() => handleToggleArchive(route.id)}
                      className="p-2 bg-muted border border-border text-foreground rounded-lg hover:border-primary transition-colors"
                      aria-label={route.isArchived ? "Unarchive route" : "Archive route"}
                      title={route.isArchived ? "Unarchive" : "Archive"}
                    >
                      <Filter size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(route.id)}
                      className="p-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
                      aria-label="Delete route"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  )
}

