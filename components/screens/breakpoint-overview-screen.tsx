"use client"

import { useState } from "react"
import { Fuel, Hotel, UtensilsCrossed, Wrench, ZoomIn, ZoomOut, ChevronRight } from "lucide-react"
import BreakpointMap from "@/components/ui/breakpoint-map"

interface BreakpointOverviewScreenProps {
  routeData: any
  onSelectBreakpoint: (index: number) => void
  onSummary: () => void
}

const filterOptions = [
  { id: "fuel", label: "Fuel", icon: Fuel },
  { id: "hotels", label: "Hotels", icon: Hotel },
  { id: "food", label: "Food", icon: UtensilsCrossed },
  { id: "service", label: "Service", icon: Wrench },
]

export default function BreakpointOverviewScreen({
  routeData,
  onSelectBreakpoint,
  onSummary,
}: BreakpointOverviewScreenProps) {
  const [selectedDay, setSelectedDay] = useState(0)
  const [activeFilters, setActiveFilters] = useState<string[]>(["fuel", "hotels"])
  const [mapZoom, setMapZoom] = useState(1)

  const toggleFilter = (filterId: string) => {
    setActiveFilters((prev) => (prev.includes(filterId) ? prev.filter((f) => f !== filterId) : [...prev, filterId]))
  }

  const currentBreakpoint = routeData.breakpoints[selectedDay]

  return (
    <div className="w-full min-h-screen flex flex-col bg-background">
      <div className="border-b border-border bg-card px-6 md:px-12 py-6">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Your Route Overview</h1>
        <p className="text-sm text-muted-foreground">Total: 1100 km • 3 days</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 md:p-12 overflow-auto">
        {/* Map section */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden relative group min-h-96">
          <BreakpointMap breakpoint={currentBreakpoint} zoom={mapZoom} filters={activeFilters} />

          <div className="absolute bottom-4 right-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setMapZoom((z) => Math.min(z + 0.2, 2))}
              className="p-2 bg-primary text-primary-foreground rounded-lg hover:shadow-lg transition-all active:scale-95"
            >
              <ZoomIn size={20} />
            </button>
            <button
              onClick={() => setMapZoom((z) => Math.max(z - 0.2, 1))}
              className="p-2 bg-muted text-foreground rounded-lg hover:shadow-lg transition-all active:scale-95"
            >
              <ZoomOut size={20} />
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto max-h-96 lg:max-h-none pr-2">
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Filters</h3>
            <div className="grid grid-cols-2 gap-2">
              {filterOptions.map((filter) => {
                const Icon = filter.icon
                const isActive = activeFilters.includes(filter.id)
                return (
                  <button
                    key={filter.id}
                    onClick={() => toggleFilter(filter.id)}
                    className={`flex items-center gap-2 p-3 rounded-lg transition-all text-xs font-medium ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground border border-border hover:border-primary"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{filter.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Daily Segments</h3>
            <div className="space-y-2">
              {routeData.breakpoints.map((bp: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDay(idx)}
                  className={`w-full p-3 rounded-lg text-left transition-all text-sm ${
                    selectedDay === idx
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground border border-border hover:border-primary"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">Day {bp.day}</p>
                      <p className="text-xs opacity-75">{bp.city}</p>
                    </div>
                    <ChevronRight size={16} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-semibold text-foreground mb-4">Day {currentBreakpoint.day} Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Distance</span>
                <span className="font-semibold text-foreground">{currentBreakpoint.distance} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-semibold text-foreground">{currentBreakpoint.hours}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fuel Needed</span>
                <span className="font-semibold text-foreground">{Math.round(currentBreakpoint.distance / 20)} L</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => onSelectBreakpoint(selectedDay)}
              className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:shadow-lg transition-all active:scale-95"
            >
              View Details
            </button>
            <button
              onClick={onSummary}
              className="w-full py-3 bg-muted border border-border text-foreground font-semibold rounded-lg hover:border-primary transition-all active:scale-95"
            >
              Trip Summary
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
