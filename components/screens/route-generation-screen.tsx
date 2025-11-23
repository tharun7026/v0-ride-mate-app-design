"use client"

import { useEffect, useState } from "react"
import { MapPin } from "lucide-react"
import { calculateBreakpoints, type Breakpoint } from "@/lib/google-maps-api"

interface RouteGenerationScreenProps {
  tripData: any
  onComplete: (data: any) => void
}

export default function RouteGenerationScreen({ tripData, onComplete }: RouteGenerationScreenProps) {
  const [animatedBreakpoints, setAnimatedBreakpoints] = useState<number[]>([])
  const [routeComplete, setRouteComplete] = useState(false)
  const [breakpoints, setBreakpoints] = useState<Breakpoint[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch real route data from Google Maps API
    const fetchRouteData = async () => {
      setIsLoading(true)
      try {
        const calculatedBreakpoints = await calculateBreakpoints(
          tripData.source,
          tripData.destination,
          tripData.dailyDistance || 400
        )
        setBreakpoints(calculatedBreakpoints)
      } catch (error) {
        console.error("Error fetching route data:", error)
        // Fallback to empty array - will show loading state
        setBreakpoints([])
      } finally {
        setIsLoading(false)
      }
    }

    if (tripData?.source && tripData?.destination) {
      fetchRouteData()
    }
  }, [tripData])

  useEffect(() => {
    // Only animate breakpoints once they're loaded
    if (!isLoading && breakpoints.length > 0) {
      breakpoints.forEach((_, idx) => {
        setTimeout(
          () => {
            setAnimatedBreakpoints((prev) => [...prev, idx])
          },
          500 + idx * 600,
        )
      })

      setTimeout(
        () => {
          setRouteComplete(true)
          setTimeout(() => {
            onComplete({
              ...tripData,
              breakpoints,
            })
          }, 1000)
        },
        500 + breakpoints.length * 600 + 800,
      )
    }
  }, [isLoading, breakpoints, tripData, onComplete])

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden px-6 py-12">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center gap-12 max-w-2xl w-full">
        <div className="text-center animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-3">Finding Your Ideal Stops</h2>
          <p className="text-muted-foreground text-lg">
            {isLoading ? "Fetching route data from Google Maps..." : "Optimizing route with hotels, fuel, and restaurants..."}
          </p>
        </div>

        {isLoading && (
          <div className="w-full flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        <div className="w-full space-y-3">
          {breakpoints.map((bp, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-4 p-4 bg-card border border-border rounded-lg transition-all duration-500 ${
                animatedBreakpoints.includes(idx) ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
              }`}
            >
              <div className="flex-1">
                <p className="font-semibold text-foreground text-lg">
                  Day {bp.day} — {bp.city}
                </p>
                <p className="text-sm text-muted-foreground">
                  {bp.distance} km • {bp.hours}h
                </p>
              </div>
              {animatedBreakpoints.includes(idx) && (
                <div className="text-primary">
                  <MapPin size={20} />
                </div>
              )}
            </div>
          ))}
        </div>

        {routeComplete && <div className="text-6xl animate-bounce">✓</div>}
      </div>
    </div>
  )
}
