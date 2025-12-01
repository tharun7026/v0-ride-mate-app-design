"use client"

import { useState } from "react"
import Container from "@/components/layout/container"
import AuthForm from "@/components/auth/auth-form"
import { Map } from "lucide-react"

export default function AuthScreen() {
  const [mode, setMode] = useState<"signin" | "signup">("signin")

  return (
    <div className="w-full min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <Container maxWidth="md" className="w-full">
        <div className="bg-card border border-border rounded-xl p-8 lg:p-12 shadow-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-xl">
                RM
              </div>
              <h1 className="text-3xl font-bold text-foreground">RideMate</h1>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {mode === "signin" ? "Welcome Back" : "Create Your Account"}
            </h2>
            <p className="text-muted-foreground">
              {mode === "signin"
                ? "Sign in to save and manage your trip routes"
                : "Start planning your next adventure"}
            </p>
          </div>

          {/* Auth Form */}
          <AuthForm
            mode={mode}
            onToggleMode={() => setMode(mode === "signin" ? "signup" : "signin")}
            onSuccess={() => {
              // Navigation will be handled by the parent component
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("navigate", { detail: { screen: "trip-planner" } }))
              }
            }}
          />

          {/* Features */}
          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground text-center mb-4">What you'll get:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: Map, text: "Save & Sync Routes" },
                { icon: Map, text: "Access Anywhere" },
                { icon: Map, text: "Secure Storage" },
              ].map((feature, idx) => {
                const Icon = feature.icon
                return (
                  <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon size={16} className="text-primary" />
                    <span>{feature.text}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

