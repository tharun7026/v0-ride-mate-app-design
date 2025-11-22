"use client"

import { useState } from "react"
import SplashScreen from "@/components/screens/splash-screen"
import OnboardingScreen from "@/components/screens/onboarding-screen"
import TripPlannerScreen from "@/components/screens/trip-planner-screen"
import RouteGenerationScreen from "@/components/screens/route-generation-screen"
import BreakpointOverviewScreen from "@/components/screens/breakpoint-overview-screen"
import BreakpointDetailsScreen from "@/components/screens/breakpoint-details-screen"
import TripSummaryScreen from "@/components/screens/trip-summary-screen"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<string>("splash")
  const [routeData, setRouteData] = useState<any>(null)
  const [selectedBreakpoint, setSelectedBreakpoint] = useState<number | null>(null)

  const handleNavigate = (screen: string, data?: any) => {
    setCurrentScreen(screen)
    if (data) {
      if (data.routeData) setRouteData(data.routeData)
      if (data.selectedBreakpoint !== undefined) setSelectedBreakpoint(data.selectedBreakpoint)
    }
  }

  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      {currentScreen === "splash" && <SplashScreen onComplete={() => handleNavigate("onboarding")} />}
      {currentScreen === "onboarding" && <OnboardingScreen onComplete={() => handleNavigate("trip-planner")} />}
      {currentScreen === "trip-planner" && (
        <TripPlannerScreen onGenerate={(data) => handleNavigate("route-generation", { routeData: data })} />
      )}
      {currentScreen === "route-generation" && (
        <RouteGenerationScreen
          tripData={routeData}
          onComplete={(data) => handleNavigate("breakpoint-overview", { routeData: data })}
        />
      )}
      {currentScreen === "breakpoint-overview" && (
        <BreakpointOverviewScreen
          routeData={routeData}
          onSelectBreakpoint={(index) => handleNavigate("breakpoint-details", { selectedBreakpoint: index })}
          onSummary={() => handleNavigate("trip-summary", { routeData })}
        />
      )}
      {currentScreen === "breakpoint-details" && (
        <BreakpointDetailsScreen
          breakpointIndex={selectedBreakpoint}
          routeData={routeData}
          onBack={() => handleNavigate("breakpoint-overview")}
        />
      )}
      {currentScreen === "trip-summary" && (
        <TripSummaryScreen routeData={routeData} onStartNew={() => handleNavigate("trip-planner")} />
      )}
    </div>
  )
}
