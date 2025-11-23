"use client"

import { useState, useEffect } from "react"
import { Save, X, MapPin, Calendar, Fuel, Hotel, FileText, Tag } from "lucide-react"
import Container from "@/components/layout/container"
import Grid from "@/components/layout/grid"
import { getRouteById, updateRoute, type RouteData } from "@/lib/route-storage"

interface EditRouteScreenProps {
  routeId: string
  onSave: () => void
  onCancel: () => void
}

export default function EditRouteScreen({ routeId, onSave, onCancel }: EditRouteScreenProps) {
  const [route, setRoute] = useState<RouteData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const loadedRoute = getRouteById(routeId)
    if (loadedRoute) {
      setRoute(loadedRoute)
    }
    setIsLoading(false)
  }, [routeId])

  const handleSave = () => {
    if (!route) return

    setIsSaving(true)
    try {
      updateRoute(routeId, {
        name: route.name,
        description: route.description,
        source: route.source,
        destination: route.destination,
        dailyDistance: route.dailyDistance,
        hotelPreference: route.hotelPreference,
        vehicleType: route.vehicleType,
        transportMode: route.transportMode,
        plannedStartDate: route.plannedStartDate,
        plannedEndDate: route.plannedEndDate,
        notes: route.notes,
        tags: route.tags,
      })
      alert("Route updated successfully!")
      onSave()
    } catch (error) {
      console.error("Error saving route:", error)
      alert("Failed to save route. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading route...</p>
        </div>
      </div>
    )
  }

  if (!route) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-foreground mb-4">Route not found</p>
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-background">
      <Container maxWidth="xl" className="py-8 lg:py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2">
                Edit Route
              </h1>
              <p className="text-muted-foreground text-base md:text-lg">
                Update your trip plan details
              </p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Cancel editing"
            >
              <X size={24} className="text-foreground" />
            </button>
          </div>
        </div>

        <div className="space-y-6 lg:space-y-8">
          {/* Basic Information */}
          <div className="bg-card border border-border rounded-xl p-6 lg:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6">Basic Information</h3>
            <Grid cols={2} gap="md">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="route-name">
                  Route Name *
                </label>
                <input
                  id="route-name"
                  type="text"
                  value={route.name}
                  onChange={(e) => setRoute({ ...route, name: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="e.g., Mumbai to Goa Adventure"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="source">
                  From *
                </label>
                <div className="relative">
                  <MapPin
                    size={20}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <input
                    id="source"
                    type="text"
                    value={route.source}
                    onChange={(e) => setRoute({ ...route, source: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="destination">
                  To *
                </label>
                <div className="relative">
                  <MapPin
                    size={20}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <input
                    id="destination"
                    type="text"
                    value={route.destination}
                    onChange={(e) => setRoute({ ...route, destination: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  value={route.description || ""}
                  onChange={(e) => setRoute({ ...route, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  placeholder="Add a description for this route..."
                />
              </div>
            </Grid>
          </div>

          {/* Trip Preferences */}
          <div className="bg-card border border-border rounded-xl p-6 lg:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6">Trip Preferences</h3>
            <Grid cols={2} gap="md">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Daily Distance: {route.dailyDistance} km
                </label>
                <input
                  type="range"
                  min="100"
                  max="800"
                  step="50"
                  value={route.dailyDistance}
                  onChange={(e) => setRoute({ ...route, dailyDistance: Number(e.target.value) })}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>100 km</span>
                  <span>800 km</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="hotel-preference">
                  Hotel Preference
                </label>
                <select
                  id="hotel-preference"
                  value={route.hotelPreference}
                  onChange={(e) => setRoute({ ...route, hotelPreference: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="budget">Budget</option>
                  <option value="3-star">3-Star</option>
                  <option value="5-star">5-Star</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="vehicle-type">
                  Vehicle Type
                </label>
                <select
                  id="vehicle-type"
                  value={route.vehicleType || ""}
                  onChange={(e) => setRoute({ ...route, vehicleType: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="">Select vehicle type</option>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="scooter">Scooter</option>
                  <option value="bicycle">Bicycle</option>
                  <option value="car">Car</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="transport-mode">
                  Transport Mode
                </label>
                <select
                  id="transport-mode"
                  value={route.transportMode || ""}
                  onChange={(e) => setRoute({ ...route, transportMode: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="">Select transport mode</option>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="car">Car</option>
                  <option value="bicycle">Bicycle</option>
                  <option value="scooter">Scooter</option>
                </select>
              </div>
            </Grid>
          </div>

          {/* Dates */}
          <div className="bg-card border border-border rounded-xl p-6 lg:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Calendar size={24} className="text-primary" />
              Planned Dates
            </h3>
            <Grid cols={2} gap="md">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="start-date">
                  Planned Start Date
                </label>
                <input
                  id="start-date"
                  type="date"
                  value={route.plannedStartDate ? route.plannedStartDate.split("T")[0] : ""}
                  onChange={(e) =>
                    setRoute({
                      ...route,
                      plannedStartDate: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                    })
                  }
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="end-date">
                  Planned End Date
                </label>
                <input
                  id="end-date"
                  type="date"
                  value={route.plannedEndDate ? route.plannedEndDate.split("T")[0] : ""}
                  onChange={(e) =>
                    setRoute({
                      ...route,
                      plannedEndDate: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                    })
                  }
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </Grid>
          </div>

          {/* Notes & Tags */}
          <div className="bg-card border border-border rounded-xl p-6 lg:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <FileText size={24} className="text-primary" />
              Additional Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="notes">
                  Notes
                </label>
                <textarea
                  id="notes"
                  value={route.notes || ""}
                  onChange={(e) => setRoute({ ...route, notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  placeholder="Add any additional notes about this trip..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="tags">
                  Tags (comma-separated)
                </label>
                <div className="relative">
                  <Tag
                    size={20}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <input
                    id="tags"
                    type="text"
                    value={route.tags?.join(", ") || ""}
                    onChange={(e) =>
                      setRoute({
                        ...route,
                        tags: e.target.value
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter((tag) => tag.length > 0),
                      })
                    }
                    className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="e.g., adventure, family, weekend"
                  />
                </div>
                {route.tags && route.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {route.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-muted text-foreground rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Route Statistics (Read-only) */}
          <div className="bg-card border border-border rounded-xl p-6 lg:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6">Route Statistics</h3>
            <Grid cols={2} gap="md">
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Total Distance</p>
                <p className="text-2xl font-bold text-foreground">{route.totalDistance} km</p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Total Days</p>
                <p className="text-2xl font-bold text-foreground">{route.totalDays}</p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Total Hours</p>
                <p className="text-2xl font-bold text-foreground">{route.totalHours.toFixed(1)}h</p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Estimated Fuel</p>
                <p className="text-2xl font-bold text-foreground">{route.totalFuel} L</p>
              </div>
            </Grid>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving || !route.name || !route.source || !route.destination}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={onCancel}
              className="px-6 py-3 bg-muted border border-border text-foreground rounded-lg font-semibold hover:border-primary transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Container>
    </div>
  )
}

