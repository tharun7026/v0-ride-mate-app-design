"use client"

import { Share2, Download, MapPin, Calendar, Fuel, Hotel } from "lucide-react"

interface TripSummaryScreenProps {
  routeData: any
  onStartNew: () => void
}

export default function TripSummaryScreen({ routeData, onStartNew }: TripSummaryScreenProps) {
  const totalDistance = routeData.breakpoints.reduce((sum: number, bp: any) => sum + bp.distance, 0)
  const totalHours = routeData.breakpoints.reduce((sum: number, bp: any) => sum + bp.hours, 0)
  const totalFuel = Math.round(totalDistance / 20)

  const handleSave = () => {
    alert("✓ Trip saved successfully!")
  }

  const handleShare = () => {
    alert("✓ Shared with friends!")
  }

  const handleExport = () => {
    alert("✓ Exported to Google Maps!")
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-background">
      <div className="border-b border-border bg-card px-6 md:px-12 py-6">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Trip Ready!</h1>
        <p className="text-muted-foreground">Your perfect journey is planned</p>
      </div>

      <div className="flex-1 overflow-auto px-6 md:px-12 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-slide-up">
            <div className="text-7xl mb-6">🎉</div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-3">Your Adventure Awaits</h2>
            <p className="text-muted-foreground text-lg">Everything is set for your journey</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary transition-all">
              <div className="flex justify-center mb-3">
                <MapPin className="text-primary" size={24} />
              </div>
              <p className="text-sm text-muted-foreground mb-2">Distance</p>
              <p className="text-2xl md:text-3xl font-bold text-foreground">{totalDistance} km</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary transition-all">
              <div className="flex justify-center mb-3">
                <Calendar className="text-primary" size={24} />
              </div>
              <p className="text-sm text-muted-foreground mb-2">Days</p>
              <p className="text-2xl md:text-3xl font-bold text-foreground">{routeData.breakpoints.length}</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary transition-all">
              <div className="flex justify-center mb-3">
                <Fuel className="text-primary" size={24} />
              </div>
              <p className="text-sm text-muted-foreground mb-2">Fuel</p>
              <p className="text-2xl md:text-3xl font-bold text-foreground">{totalFuel} L</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary transition-all">
              <div className="flex justify-center mb-3">
                <Hotel className="text-primary" size={24} />
              </div>
              <p className="text-sm text-muted-foreground mb-2">Stays</p>
              <p className="text-2xl md:text-3xl font-bold text-foreground">{routeData.breakpoints.length}</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 md:p-8 mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">Your Journey</h2>
            <div className="space-y-3">
              {routeData.breakpoints.map((bp: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg hover:border-primary transition-all"
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
        </div>
      </div>

      <div className="border-t border-border bg-card px-6 md:px-12 py-6 space-y-3">
        <button
          onClick={handleSave}
          className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:shadow-lg transition-all active:scale-95"
        >
          Save Trip Plan
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleExport}
            className="py-3 bg-muted border border-border text-foreground font-semibold rounded-lg hover:border-primary transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Download size={18} />
            Export
          </button>
          <button
            onClick={handleShare}
            className="py-3 bg-muted border border-border text-foreground font-semibold rounded-lg hover:border-primary transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Share2 size={18} />
            Share
          </button>
        </div>
        <button
          onClick={onStartNew}
          className="w-full py-3 bg-muted border border-border text-foreground font-semibold rounded-lg hover:border-primary transition-all active:scale-95"
        >
          Plan Another Ride
        </button>
      </div>
    </div>
  )
}
