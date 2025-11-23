"use client"

import { useState, useEffect } from "react"
import SplashScreen from "@/components/screens/splash-screen"
import OnboardingScreen from "@/components/screens/onboarding-screen"
import TripPlannerScreen from "@/components/screens/trip-planner-screen"
import RouteGenerationScreen from "@/components/screens/route-generation-screen"
import BreakpointOverviewScreen from "@/components/screens/breakpoint-overview-screen"
import BreakpointDetailsScreen from "@/components/screens/breakpoint-details-screen"
import TripSummaryScreen from "@/components/screens/trip-summary-screen"
import ProfileScreen from "@/components/screens/profile-screen"
import SettingsScreen from "@/components/screens/settings-screen"
import MyRoutesScreen from "@/components/screens/my-routes-screen"
import AppLayout from "@/components/layout/app-layout"
import { initializeRoutesStorage } from "@/lib/route-storage"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<string>("splash")
  const [routeData, setRouteData] = useState<any>(null)
  const [selectedBreakpoint, setSelectedBreakpoint] = useState<number | null>(null)

  // Check if onboarding has been completed and initialize storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Initialize routes storage (migrate old format if needed)
      initializeRoutesStorage()

      const onboardingCompleted = localStorage.getItem("onboardingCompleted")
      if (onboardingCompleted === "true") {
        // Skip onboarding and go directly to trip planner after splash
        // We'll handle this in the splash screen completion
      }

      // Listen for navigation events from sidebar
      const handleNavigate = (event: CustomEvent) => {
        setCurrentScreen(event.detail.screen)
      }

      window.addEventListener("navigate", handleNavigate as EventListener)
      return () => window.removeEventListener("navigate", handleNavigate as EventListener)
    }
  }, [])

  const handleNavigate = (screen: string, data?: any) => {
    setCurrentScreen(screen)
    if (data) {
      if (data.routeData) setRouteData(data.routeData)
      if (data.selectedBreakpoint !== undefined) setSelectedBreakpoint(data.selectedBreakpoint)
    }
  }

  // Determine next screen after splash based on onboarding status
  const getNextScreenAfterSplash = () => {
    if (typeof window !== "undefined") {
      const onboardingCompleted = localStorage.getItem("onboardingCompleted")
      return onboardingCompleted === "true" ? "trip-planner" : "onboarding"
    }
    return "onboarding"
  }

  // Screens that should not use the app layout (full-screen experiences)
  const fullScreenScreens = ["splash", "onboarding", "route-generation"]

  const shouldUseLayout = !fullScreenScreens.includes(currentScreen)

  const renderScreen = () => {
    switch (currentScreen) {
      case "splash":
        return <SplashScreen onComplete={() => handleNavigate(getNextScreenAfterSplash())} />
      case "onboarding":
        return <OnboardingScreen onComplete={() => handleNavigate("trip-planner")} />
      case "trip-planner":
        return (
          <TripPlannerScreen onGenerate={(data) => handleNavigate("route-generation", { routeData: data })} />
        )
      case "route-generation":
        return (
          <RouteGenerationScreen
            tripData={routeData}
            onComplete={(data) => handleNavigate("breakpoint-overview", { routeData: data })}
          />
        )
      case "breakpoint-overview":
        return (
          <BreakpointOverviewScreen
            routeData={routeData}
            onSelectBreakpoint={(index) => handleNavigate("breakpoint-details", { selectedBreakpoint: index })}
            onSummary={() => handleNavigate("trip-summary", { routeData })}
          />
        )
      case "breakpoint-details":
        return (
          <BreakpointDetailsScreen
            breakpointIndex={selectedBreakpoint}
            routeData={routeData}
            onBack={() => handleNavigate("breakpoint-overview")}
          />
        )
      case "trip-summary":
        return <TripSummaryScreen routeData={routeData} onStartNew={() => handleNavigate("trip-planner")} />
      case "routes":
        return <MyRoutesScreen />
      case "profile":
        return <ProfileScreen />
      case "settings":
        return <SettingsScreen />
      default:
        return <TripPlannerScreen onGenerate={(data) => handleNavigate("route-generation", { routeData: data })} />
    }
  }

  if (shouldUseLayout) {
    return (
      <AppLayout currentScreen={currentScreen}>
        <div className="w-full min-h-screen bg-background text-foreground">{renderScreen()}</div>
      </AppLayout>
    )
  }

  return <div className="w-full min-h-screen bg-background text-foreground">{renderScreen()}</div>
}
