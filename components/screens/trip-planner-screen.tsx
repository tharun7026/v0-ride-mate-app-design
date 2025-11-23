"use client"

import { useState } from "react"
import { MapPin } from "lucide-react"

interface TripPlannerScreenProps {
  onGenerate: (data: any) => void
}

export default function TripPlannerScreen({ onGenerate }: TripPlannerScreenProps) {
  const [source, setSource] = useState("")
  const [destination, setDestination] = useState("")
  const [dailyDistance, setDailyDistance] = useState(400)
  const [hotelPref, setHotelPref] = useState("3-star")

  const handleGenerate = () => {
    onGenerate({
      source,
      destination,
      dailyDistance,
      hotelPref,
    })
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted relative overflow-hidden px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="relative z-10 w-full max-w-md lg:max-w-2xl animate-slide-up">
        <div className="mb-8 md:mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-3">
            Plan Your Ride
          </h1>
          <p className="text-muted-foreground text-base md:text-lg lg:text-xl">
            Let's create your perfect journey
          </p>
        </div>

        <div className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2 md:mb-3" htmlFor="source">
                From
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
                  placeholder="Starting city"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  aria-label="Starting city"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2 md:mb-3" htmlFor="destination">
                To
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
                  placeholder="Destination city"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  aria-label="Destination city"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-foreground">Daily Distance</label>
              <span className="text-sm font-bold text-primary">{dailyDistance} km</span>
            </div>
            <input
              type="range"
              min="100"
              max="800"
              step="50"
              value={dailyDistance}
              onChange={(e) => setDailyDistance(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>100 km</span>
              <span>800 km</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">Hotel Preference</label>
            <div className="flex gap-2">
              {["Budget", "3-star", "5-star"].map((pref) => (
                <button
                  key={pref}
                  onClick={() => setHotelPref(pref)}
                  className={`flex-1 py-3 px-3 rounded-lg font-medium transition-all ${
                    hotelPref === pref
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-card border border-border text-foreground hover:border-primary"
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!source || !destination}
            className="w-full py-3 md:py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 mt-6 md:mt-8 text-base md:text-lg"
            aria-label="Generate ride plan"
          >
            Generate My Ride Plan
          </button>
        </div>
      </div>
    </div>
  )
}
