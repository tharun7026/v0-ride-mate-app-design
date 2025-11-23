"use client"

import { useState, useEffect } from "react"
import { Settings as SettingsIcon, Moon, Sun, Globe, Shield, Bell, Palette } from "lucide-react"
import Container from "@/components/layout/container"
import Grid from "@/components/layout/grid"

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    theme: "system",
    language: "en",
    units: "metric",
    twoFactorEnabled: false,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    tripReminders: true,
    promotionalEmails: false,
  })

  // Load settings from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("appSettings")
      if (saved) {
        try {
          const savedSettings = JSON.parse(saved)
          setSettings((prev) => ({ ...prev, ...savedSettings }))
        } catch (error) {
          console.error("Error loading settings:", error)
        }
      }
    }
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("appSettings", JSON.stringify(settings))
    }
  }, [settings])

  return (
    <div className="w-full min-h-screen bg-background">
      <Container maxWidth="2xl" className="py-8 lg:py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 flex items-center gap-3">
            <SettingsIcon size={32} className="text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Customize your app experience and preferences
          </p>
        </div>

        <div className="space-y-6 lg:space-y-8">
          {/* Appearance */}
          <div className="bg-card border border-border rounded-xl p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <Palette size={24} className="text-primary" />
              <h3 className="text-xl md:text-2xl font-bold text-foreground">Appearance</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">Theme</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: "light", icon: Sun, label: "Light" },
                    { value: "dark", icon: Moon, label: "Dark" },
                    { value: "system", icon: SettingsIcon, label: "System" },
                  ].map((theme) => {
                    const Icon = theme.icon
                    return (
                      <button
                        key={theme.value}
                        onClick={() => setSettings({ ...settings, theme: theme.value })}
                        className={`
                          flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all
                          ${
                            settings.theme === theme.value
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }
                        `}
                        aria-label={`Set theme to ${theme.label}`}
                      >
                        <Icon size={20} />
                        <span className="font-medium">{theme.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Language & Region */}
          <div className="bg-card border border-border rounded-xl p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <Globe size={24} className="text-primary" />
              <h3 className="text-xl md:text-2xl font-bold text-foreground">Language & Region</h3>
            </div>
            <Grid cols={2} gap="md">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  aria-label="Select language"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="hi">Hindi</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Units</label>
                <select
                  value={settings.units}
                  onChange={(e) => setSettings({ ...settings, units: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  aria-label="Select units"
                >
                  <option value="metric">Metric (km, °C)</option>
                  <option value="imperial">Imperial (miles, °F)</option>
                </select>
              </div>
            </Grid>
          </div>

          {/* Security */}
          <div className="bg-card border border-border rounded-xl p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield size={24} className="text-primary" />
              <h3 className="text-xl md:text-2xl font-bold text-foreground">Security</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <label className="text-foreground font-medium cursor-pointer" htmlFor="2fa">
                    Two-Factor Authentication
                  </label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="2fa"
                  checked={settings.twoFactorEnabled}
                  onChange={(e) => setSettings({ ...settings, twoFactorEnabled: e.target.checked })}
                  className="w-5 h-5 text-primary border-border rounded focus:ring-2 focus:ring-primary/20"
                  aria-label="Enable two-factor authentication"
                />
              </div>
              <button className="w-full sm:w-auto px-6 py-3 bg-muted border border-border text-foreground rounded-lg font-semibold hover:border-primary transition-colors">
                Change Password
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-card border border-border rounded-xl p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <Bell size={24} className="text-primary" />
              <h3 className="text-xl md:text-2xl font-bold text-foreground">Notifications</h3>
            </div>
            <div className="space-y-4">
              {[
                { key: "emailNotifications", label: "Email Notifications" },
                { key: "pushNotifications", label: "Push Notifications" },
                { key: "smsNotifications", label: "SMS Notifications" },
                { key: "tripReminders", label: "Trip Reminders" },
                { key: "promotionalEmails", label: "Promotional Emails" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <label className="text-foreground font-medium cursor-pointer" htmlFor={item.key}>
                    {item.label}
                  </label>
                  <input
                    type="checkbox"
                    id={item.key}
                    checked={settings[item.key as keyof typeof settings] as boolean}
                    onChange={(e) =>
                      setSettings({ ...settings, [item.key]: e.target.checked })
                    }
                    className="w-5 h-5 text-primary border-border rounded focus:ring-2 focus:ring-primary/20"
                    aria-label={item.label}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

