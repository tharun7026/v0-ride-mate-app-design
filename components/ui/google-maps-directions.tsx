"use client"

import { useEffect, useMemo, useState } from "react"

interface GoogleMapsDirectionsProps {
  origin: string
  destination: string
  zoom?: number
  className?: string
}

export default function GoogleMapsDirections({
  origin,
  destination,
  zoom = 10,
  className = "",
}: GoogleMapsDirectionsProps) {
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [mapUrl, setMapUrl] = useState<string>("")

  // Check for API key in environment variables
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || null
    setApiKey(key)
  }, [])

  // Generate the Google Maps embed URL
  const generateMapUrl = useMemo(() => {
    if (!origin || !destination) {
      return ""
    }

    // Encode the origin and destination for URL
    const encodedOrigin = encodeURIComponent(origin)
    const encodedDestination = encodeURIComponent(destination)

    // If API key is available, use the Embed API (recommended)
    if (apiKey) {
      return `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${encodedOrigin}&destination=${encodedDestination}&zoom=${zoom}`
    }

    // Fallback: Use Google Maps with directions query
    // Note: For best results, set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your .env.local file
    // This fallback shows a map with route from origin to destination
    return `https://www.google.com/maps?q=${encodedOrigin}+to+${encodedDestination}&dirflg=d&output=embed`
  }, [origin, destination, zoom, apiKey])

  useEffect(() => {
    setMapUrl(generateMapUrl)
  }, [generateMapUrl])

  if (!origin || !destination) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-muted ${className}`}>
        <div className="text-center p-8">
          <p className="text-muted-foreground text-sm">Please provide origin and destination to view directions</p>
        </div>
      </div>
    )
  }

  if (!mapUrl) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-muted ${className}`}>
        <div className="text-center p-8">
          <p className="text-muted-foreground text-sm">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full h-full relative ${className}`}>
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={mapUrl}
        className="w-full h-full"
        title="Google Maps Directions"
      />
    </div>
  )
}

