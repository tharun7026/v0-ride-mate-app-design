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
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted relative overflow-hidden px-6 py-12">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-slide-up">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">Plan Your Ride</h1>
          <p className="text-muted-foreground text-lg">Let's create your perfect journey</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">From</label>
            <div className="relative">
              <MapPin size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Starting city"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">To</label>
            <div className="relative">
              <MapPin size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Destination city"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
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
            className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 mt-8"
          >
            Generate My Ride Plan
          </button>
        </div>
      </div>
    </div>
  )
}
