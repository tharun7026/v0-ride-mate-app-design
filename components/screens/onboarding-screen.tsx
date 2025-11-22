"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"

interface OnboardingScreenProps {
  onComplete: () => void
}

const slides = [
  {
    title: "Plan Smarter Rides",
    description: "AI-powered route optimization tailored to your preferences",
    icon: "🏍️",
  },
  {
    title: "Auto Breakpoints",
    description: "Your journey splits into perfect daily segments automatically",
    icon: "🗺️",
  },
  {
    title: "Stay & Fuel Sorted",
    description: "Find hotels, fuel, and restaurants along your route",
    icon: "⛽",
  },
]

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      onComplete()
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden px-6">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center justify-center gap-12">
        <div className="text-8xl md:text-9xl">{slides[currentSlide].icon}</div>

        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{slides[currentSlide].title}</h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto">
            {slides[currentSlide].description}
          </p>
        </div>

        <div className="flex gap-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide ? "w-8 bg-primary" : "w-2 bg-muted"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 active:scale-95"
        >
          {currentSlide === slides.length - 1 ? "Let's Ride" : "Next"}
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}
