"use client"

import { useState } from "react"
import { MapPin, Star, ChevronLeft, Navigation } from "lucide-react"

interface BreakpointDetailsScreenProps {
  breakpointIndex: number | null
  routeData: any
  onBack: () => void
}

const mockData = {
  hotels: [
    {
      id: 1,
      name: "Grand Hotel Jhansi",
      rating: 4.5,
      reviews: 234,
      price: 3500,
      distance: "2 km",
    },
    {
      id: 2,
      name: "Budget Stay",
      rating: 4.0,
      reviews: 156,
      price: 1200,
      distance: "5 km",
    },
  ],
  fuel: [
    {
      id: 1,
      name: "Shell Fuel Station",
      distance: "1.2 km",
      open: true,
      price: 110,
    },
    {
      id: 2,
      name: "Bharat Petroleum",
      distance: "3.5 km",
      open: true,
      price: 108,
    },
  ],
  restaurants: [
    {
      id: 1,
      name: "Highway Dhaba",
      cuisine: "Indian",
      rating: 4.3,
      distance: "0.5 km",
    },
    {
      id: 2,
      name: "Cafe Express",
      cuisine: "Multicuisine",
      rating: 4.1,
      distance: "2 km",
    },
  ],
}

type TabType = "hotels" | "fuel" | "restaurants"

export default function BreakpointDetailsScreen({ breakpointIndex, routeData, onBack }: BreakpointDetailsScreenProps) {
  const [activeTab, setActiveTab] = useState<TabType>("hotels")
  const breakpoint = routeData?.breakpoints?.[breakpointIndex || 0]

  return (
    <div className="w-full min-h-screen flex flex-col bg-background">
      <div className="border-b border-border bg-card px-6 md:px-12 py-6 flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-muted rounded-lg transition-all active:scale-90">
          <ChevronLeft size={24} className="text-foreground" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{breakpoint?.city}</h1>
          <p className="text-sm text-muted-foreground">Day {breakpoint?.day}</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 md:px-12 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-4 border-b border-border mb-8">
            {["hotels", "fuel", "restaurants"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as TabType)}
                className={`pb-3 px-4 font-semibold text-sm transition-all relative ${
                  activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {activeTab === "hotels" && (
              <>
                {mockData.hotels.map((hotel) => (
                  <div
                    key={hotel.id}
                    className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-all"
                  >
                    <h3 className="font-bold text-foreground text-lg mb-3">{hotel.name}</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < Math.floor(hotel.rating) ? "fill-primary text-primary" : "text-muted"}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {hotel.rating} ({hotel.reviews})
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-foreground">₹{hotel.price}</span>
                      <span className="text-muted-foreground">{hotel.distance}</span>
                    </div>
                  </div>
                ))}
              </>
            )}

            {activeTab === "fuel" && (
              <>
                {mockData.fuel.map((station) => (
                  <div
                    key={station.id}
                    className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-foreground">{station.name}</h3>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${station.open ? "bg-primary/10 text-primary" : "bg-red-500/10 text-red-500"}`}
                      >
                        {station.open ? "Open" : "Closed"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">₹{station.price}/L</span>
                      <div className="flex items-center gap-1 text-foreground">
                        <MapPin size={14} />
                        <span>{station.distance}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {activeTab === "restaurants" && (
              <>
                {mockData.restaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-all"
                  >
                    <div className="mb-3">
                      <h3 className="font-bold text-foreground">{restaurant.name}</h3>
                      <p className="text-xs text-muted-foreground">{restaurant.cuisine}</p>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-primary text-primary" />
                        <span className="text-foreground font-medium">{restaurant.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin size={14} />
                        <span>{restaurant.distance}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-card px-6 md:px-12 py-6 space-y-3">
        <button className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:shadow-lg transition-all active:scale-95">
          Book Stay
        </button>
        <button className="w-full py-3 bg-muted border border-border text-foreground font-bold rounded-lg hover:border-primary transition-all active:scale-95 flex items-center justify-center gap-2">
          <Navigation size={20} />
          Navigate
        </button>
      </div>
    </div>
  )
}
