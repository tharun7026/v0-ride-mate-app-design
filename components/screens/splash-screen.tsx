"use client"

import { useEffect } from "react"

interface SplashScreenProps {
  onComplete: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3500)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-32 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-30 animate-pulse" />
      </div>

      <div className="relative z-10 text-center px-6 animate-slide-up">
        <div className="mb-8">
          <div className="w-24 h-24 bg-primary text-primary-foreground rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-5xl font-black">RM</span>
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-3 tracking-tight">RideMate</h1>
        <p className="text-lg md:text-xl text-muted-foreground font-light">Your Smart Travel Companion</p>

        <div className="mt-16 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="inline-block text-sm text-muted-foreground font-medium opacity-60 animate-pulse">
            Loading your adventure...
          </div>
        </div>
      </div>
    </div>
  )
}
