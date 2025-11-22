"use client"

import type React from "react"

import { Fuel, Hotel, UtensilsCrossed, Wrench } from "lucide-react"

interface BreakpointMapProps {
  breakpoint: any
  zoom: number
  filters: string[]
}

const mockLocations = {
  fuel: [
    { id: 1, name: "Shell", x: "25%", y: "40%" },
    { id: 2, name: "BP", x: "55%", y: "35%" },
    { id: 3, name: "Bharat", x: "70%", y: "60%" },
  ],
  hotels: [
    { id: 1, name: "Grand Hotel", x: "35%", y: "50%" },
    { id: 2, name: "Budget Stay", x: "65%", y: "45%" },
  ],
  food: [
    { id: 1, name: "Dhaba", x: "20%", y: "60%" },
    { id: 2, name: "Cafe", x: "50%", y: "65%" },
    { id: 3, name: "Restaurant", x: "75%", y: "55%" },
  ],
  service: [{ id: 1, name: "Service Center", x: "45%", y: "30%" }],
}

const iconMap: Record<string, React.ComponentType<any>> = {
  fuel: Fuel,
  hotels: Hotel,
  food: UtensilsCrossed,
  service: Wrench,
}

export default function BreakpointMap({ breakpoint, zoom, filters }: BreakpointMapProps) {
  return (
    <div className="w-full h-full relative bg-gradient-to-br from-muted to-background overflow-hidden">
      {/* Map background with grid pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 1000 800">
        <defs>
          <pattern id="mapGrid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="1000" height="800" fill="url(#mapGrid)" />
      </svg>

      {/* Animated route line */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none transition-transform duration-300"
        style={{ transform: `scale(${zoom})` }}
        viewBox="0 0 1000 800"
      >
        <path
          d="M 100 400 Q 300 200, 500 350 Q 700 450, 900 400"
          stroke="currentColor"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          opacity={0.2}
          className="text-foreground"
        />
      </svg>

      {/* Location pins */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {Object.entries(mockLocations).map(([category, locations]) => {
          if (!filters.includes(category)) return null

          return locations.map((location, idx) => {
            const Icon = iconMap[category]
            const colorMap: Record<string, string> = {
              fuel: "rgb(15, 15, 15)",
              hotels: "rgb(0, 0, 0)",
              food: "rgb(50, 50, 50)",
              service: "rgb(30, 30, 30)",
            }

            const borderColorMap: Record<string, string> = {
              fuel: "rgb(200, 200, 200)",
              hotels: "rgb(150, 150, 150)",
              food: "rgb(100, 100, 100)",
              service: "rgb(120, 120, 120)",
            }

            return (
              <div
                key={`${category}-${location.id}`}
                style={{
                  left: location.x,
                  top: location.y,
                  animationDelay: `${idx * 0.1}s`,
                }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              >
                <div className="relative transition-transform duration-300" style={{ animationDelay: `${idx * 0.2}s` }}>
                  <div
                    className="p-2 rounded-lg text-foreground shadow-lg transition-all duration-300 group-hover:scale-110 border"
                    style={{
                      backgroundColor: colorMap[category],
                      borderColor: borderColorMap[category],
                    }}
                  >
                    <Icon size={20} />
                  </div>

                  {/* Hover tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-foreground text-background border border-foreground px-3 py-1 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-medium">
                    {location.name}
                  </div>

                  {/* Pulsing ring */}
                  <div
                    className="absolute inset-0 rounded-full border-2 animate-pulse"
                    style={{
                      borderColor: borderColorMap[category],
                    }}
                  />
                </div>
              </div>
            )
          })
        })}
      </div>

      {/* Breakpoint marker (center) */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <div className="w-6 h-6 bg-primary rounded-full shadow-lg animate-pulse" />
          <div className="absolute inset-0 border-2 border-primary rounded-full animate-pulse" />
        </div>
      </div>

      {/* Info overlay */}
      <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm border border-border rounded-lg p-4 text-foreground text-sm max-w-xs">
        <p className="font-semibold mb-2">{breakpoint?.city}</p>
        <p className="text-xs text-muted-foreground">
          Zoom: {zoom.toFixed(1)}x • Filters: {filters.length} active
        </p>
      </div>
    </div>
  )
}
