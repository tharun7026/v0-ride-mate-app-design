"use client"

import { useState, useEffect } from "react"
import { Menu, X, Home, Map, Settings, User, LogOut, Bell } from "lucide-react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

interface AppLayoutProps {
  children: React.ReactNode
  currentScreen?: string
}

const navigation = [
  { name: "Plan Trip", screen: "trip-planner", icon: Home },
  { name: "My Routes", screen: "routes", icon: Map },
  { name: "Profile", screen: "profile", icon: User },
  { name: "Settings", screen: "settings", icon: Settings },
]

export default function AppLayout({ children, currentScreen }: AppLayoutProps) {
  const { user, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [userInfo, setUserInfo] = useState({ name: "User Name", email: "user@example.com" })

  // Load user info from profile and Supabase auth
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("userProfile")
      let name = "User Name"
      let email = user?.email || "user@example.com"
      
      if (saved) {
        try {
          const profile = JSON.parse(saved)
          name = profile.firstName && profile.lastName
            ? `${profile.firstName} ${profile.lastName}`
            : profile.firstName || profile.lastName || user?.email?.split("@")[0] || "User Name"
          email = profile.email || user?.email || email
        } catch (error) {
          console.error("Error loading user info:", error)
        }
      } else if (user?.email) {
        // Use email username if no profile saved
        name = user.email.split("@")[0]
      }
      
      setUserInfo({ name, email })
    }
  }, [currentScreen, user]) // Reload when screen changes or user changes

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-card border-r border-border
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          flex flex-col
        `}
        aria-label="Main navigation"
      >
        {/* Logo/Brand */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold">
              RM
            </div>
            <span className="font-bold text-lg text-foreground hidden lg:block">RideMate</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <X size={20} className="text-foreground" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto" aria-label="Main navigation">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = currentScreen === item.screen
            return (
              <button
                key={item.screen}
                onClick={() => {
                  // Close sidebar on mobile after navigation
                  if (isMobile) {
                    setSidebarOpen(false)
                  }
                  // Navigation will be handled by parent via currentScreen prop
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(
                      new CustomEvent("navigate", { detail: { screen: item.screen } })
                    )
                  }
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left
                  ${isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}
                  focus:outline-none focus:ring-2 focus:ring-primary/20
                `}
                aria-current={isActive ? "page" : undefined}
                aria-label={`Navigate to ${item.name}`}
              >
                <Icon size={20} aria-hidden="true" />
                <span className="font-medium">{item.name}</span>
              </button>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-border">
          <button
            onClick={() => {
              if (isMobile) setSidebarOpen(false)
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("navigate", { detail: { screen: "profile" } }))
              }
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-left"
            aria-label="View profile"
          >
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
              <User size={20} className="text-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{userInfo.name}</p>
              <p className="text-xs text-muted-foreground truncate">{userInfo.email}</p>
            </div>
          </button>
          <button
            onClick={async () => {
              try {
                await signOut()
                if (typeof window !== "undefined") {
                  // Clear local storage
                  localStorage.removeItem("userProfile")
                  localStorage.removeItem("appSettings")
                  localStorage.removeItem("savedRoutes")
                  // Navigate to auth screen
                  window.dispatchEvent(new CustomEvent("navigate", { detail: { screen: "auth" } }))
                }
              } catch (error) {
                console.error("Error signing out:", error)
                alert("Error signing out. Please try again.")
              }
            }}
            className="w-full mt-2 flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            aria-label="Sign out"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar (Mobile) */}
        <header className="lg:hidden h-16 bg-card border-b border-border flex items-center justify-between px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Open sidebar"
          >
            <Menu size={24} className="text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-sm">
              RM
            </div>
            <span className="font-bold text-lg text-foreground">RideMate</span>
          </div>
          <button
            className="p-2 hover:bg-muted rounded-lg transition-colors relative"
            aria-label="Notifications"
          >
            <Bell size={20} className="text-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto" role="main">
          {children}
        </main>
      </div>
    </div>
  )
}

