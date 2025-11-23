"use client"

import { useState, useEffect } from "react"
import { User, Mail, Phone, MapPin, Calendar, Camera, Save } from "lucide-react"
import Container from "@/components/layout/container"
import Grid from "@/components/layout/grid"
import { getAllRoutes } from "@/lib/route-storage"

interface UserProfile {
  // Basic Information
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  profileImage: string

  // Location & Demographics
  location: string
  city: string
  state: string
  country: string
  timezone: string

  // Preferences
  preferredLanguage: string
  theme: "light" | "dark" | "system"
  units: "metric" | "imperial"

  // Ride Preferences
  vehicleType: string
  ridingExperience: string
  preferredDailyDistance: number
  hotelPreference: string
  budgetRange: string

  // Security
  twoFactorEnabled: boolean
  recoveryEmail: string
  recoveryPhone: string

  // Activity & Engagement
  totalTrips: number
  totalDistance: number
  memberSince: string
  lastActive: string

  // Notification Preferences
  emailNotifications: boolean
  pushNotifications: boolean
  smsNotifications: boolean
  tripReminders: boolean
  promotionalEmails: boolean
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    location: "",
    city: "",
    state: "",
    country: "",
    preferredLanguage: "en",
    theme: "system",
    units: "metric",
    vehicleType: "",
    ridingExperience: "",
    preferredDailyDistance: 400,
    hotelPreference: "3-star",
    budgetRange: "",
    twoFactorEnabled: false,
    recoveryEmail: "",
    recoveryPhone: "",
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    tripReminders: true,
    promotionalEmails: false,
    totalTrips: 0,
    totalDistance: 0,
    memberSince: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  })

  const [isEditing, setIsEditing] = useState(false)

  // Load profile from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("userProfile")
      if (saved) {
        try {
          const savedProfile = JSON.parse(saved)
          setProfile((prev) => ({ ...prev, ...savedProfile }))
        } catch (error) {
          console.error("Error loading profile:", error)
        }
      }
    }
  }, [])

  // Calculate stats from saved routes
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedRoutes = getAllRoutes()
        const totalTrips = savedRoutes.length
        const totalDistance = savedRoutes.reduce((sum: number, route: any) => sum + (route.totalDistance || 0), 0)
        setProfile((prev) => ({ ...prev, totalTrips, totalDistance }))
      } catch (error) {
        console.error("Error loading route statistics:", error)
        // Set defaults if there's an error
        setProfile((prev) => ({ ...prev, totalTrips: 0, totalDistance: 0 }))
      }
    }
  }, [])

  const handleSave = () => {
    // Save profile to localStorage
    if (typeof window !== "undefined") {
      const profileToSave = {
        ...profile,
        lastActive: new Date().toISOString(),
      }
      localStorage.setItem("userProfile", JSON.stringify(profileToSave))
      setIsEditing(false)
      alert("Profile saved successfully!")
    }
  }

  return (
    <div className="w-full min-h-screen bg-background">
      <Container maxWidth="2xl" className="py-8 lg:py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2">
            Profile Settings
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Manage your personal information and preferences
          </p>
        </div>

        <div className="space-y-6 lg:space-y-8">
          {/* Profile Header */}
          <div className="bg-card border border-border rounded-xl p-6 lg:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                  {profile.profileImage ? (
                    <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} className="text-muted-foreground" />
                  )}
                </div>
                {isEditing && (
                  <button
                    className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
                    aria-label="Change profile picture"
                  >
                    <Camera size={16} />
                  </button>
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {profile.firstName || "Your"} {profile.lastName || "Name"}
                </h2>
                <p className="text-muted-foreground mb-4">{profile.email || "user@example.com"}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="px-3 py-1 bg-muted text-foreground rounded-full text-sm">
                    {profile.totalTrips || 0} Trips
                  </span>
                  <span className="px-3 py-1 bg-muted text-foreground rounded-full text-sm">
                    {profile.totalDistance || 0} km
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-card border border-border rounded-xl p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-foreground">Basic Information</h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  Edit
                </button>
              )}
            </div>

            <Grid cols={2} gap="md">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">First Name</label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  aria-label="First name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Last Name</label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  aria-label="Last name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
                <div className="relative">
                  <Mail size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!isEditing}
                    className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-lg text-foreground disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    aria-label="Email address"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Phone</label>
                <div className="relative">
                  <Phone size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    disabled={!isEditing}
                    className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-lg text-foreground disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    aria-label="Phone number"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Date of Birth</label>
                <div className="relative">
                  <Calendar size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                    disabled={!isEditing}
                    className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-lg text-foreground disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    aria-label="Date of birth"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Location</label>
                <div className="relative">
                  <MapPin size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    disabled={!isEditing}
                    placeholder="City, State, Country"
                    className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-lg text-foreground disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    aria-label="Location"
                  />
                </div>
              </div>
            </Grid>

            {isEditing && (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  <Save size={18} />
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 bg-muted border border-border text-foreground rounded-lg font-semibold hover:border-primary transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Ride Preferences */}
          <div className="bg-card border border-border rounded-xl p-6 lg:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6">Ride Preferences</h3>
            <Grid cols={2} gap="md">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Vehicle Type</label>
                <select
                  value={profile.vehicleType}
                  onChange={(e) => setProfile({ ...profile, vehicleType: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  aria-label="Vehicle type"
                >
                  <option value="">Select vehicle type</option>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="scooter">Scooter</option>
                  <option value="bicycle">Bicycle</option>
                  <option value="car">Car</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Riding Experience</label>
                <select
                  value={profile.ridingExperience}
                  onChange={(e) => setProfile({ ...profile, ridingExperience: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  aria-label="Riding experience"
                >
                  <option value="">Select experience level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Preferred Daily Distance: {profile.preferredDailyDistance} km
                </label>
                <input
                  type="range"
                  min="100"
                  max="800"
                  step="50"
                  value={profile.preferredDailyDistance}
                  onChange={(e) => setProfile({ ...profile, preferredDailyDistance: Number(e.target.value) })}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                  aria-label="Preferred daily distance"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>100 km</span>
                  <span>800 km</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Hotel Preference</label>
                <select
                  value={profile.hotelPreference}
                  onChange={(e) => setProfile({ ...profile, hotelPreference: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  aria-label="Hotel preference"
                >
                  <option value="budget">Budget</option>
                  <option value="3-star">3-Star</option>
                  <option value="5-star">5-Star</option>
                </select>
              </div>
            </Grid>
          </div>

          {/* Notification Preferences */}
          <div className="bg-card border border-border rounded-xl p-6 lg:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6">Notification Preferences</h3>
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
                    checked={profile[item.key as keyof UserProfile] as boolean}
                    onChange={(e) =>
                      setProfile({ ...profile, [item.key]: e.target.checked })
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

