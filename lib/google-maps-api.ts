/**
 * Google Maps API utility functions
 * Fetches real route data including distance, duration, and breakpoints
 */

export interface RouteLeg {
  distance: {
    text: string
    value: number // in meters
  }
  duration: {
    text: string
    value: number // in seconds
  }
  start_address: string
  end_address: string
  start_location: {
    lat: number
    lng: number
  }
  end_location: {
    lat: number
    lng: number
  }
}

export interface RouteData {
  distance: {
    text: string
    value: number // total distance in meters
  }
  duration: {
    text: string
    value: number // total duration in seconds
  }
  legs: RouteLeg[]
  overview_polyline: {
    points: string
  }
}

export interface Breakpoint {
  day: number
  city: string
  distance: number // in km
  hours: number
  location: {
    lat: number
    lng: number
  }
  address: string
}

/**
 * Fetch route data from Google Maps Directions API
 */
export async function fetchRouteData(
  origin: string,
  destination: string,
  apiKey?: string
): Promise<RouteData | null> {
  const key = apiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!key) {
    console.warn("Google Maps API key not found. Using fallback data.")
    return null
  }

  try {
    const encodedOrigin = encodeURIComponent(origin)
    const encodedDestination = encodeURIComponent(destination)

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodedOrigin}&destination=${encodedDestination}&key=${key}`

    const response = await fetch(url)
    const data = await response.json()

    if (data.status !== "OK" || !data.routes || data.routes.length === 0) {
      console.error("Google Maps API error:", data.status, data.error_message)
      return null
    }

    const route = data.routes[0]
    const leg = route.legs[0]

    return {
      distance: leg.distance,
      duration: leg.duration,
      legs: route.legs,
      overview_polyline: route.overview_polyline,
    }
  } catch (error) {
    console.error("Error fetching route data:", error)
    return null
  }
}

/**
 * Get place name from coordinates using reverse geocoding
 */
export async function getPlaceName(lat: number, lng: number, apiKey?: string): Promise<string> {
  const key = apiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!key) {
    return "Unknown Location"
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`

    const response = await fetch(url)
    const data = await response.json()

    if (data.status === "OK" && data.results && data.results.length > 0) {
      // Try to get a city name or locality
      const result = data.results.find(
        (r: any) =>
          r.types.includes("locality") ||
          r.types.includes("administrative_area_level_2") ||
          r.types.includes("administrative_area_level_1")
      ) || data.results[0]

      return result.formatted_address.split(",")[0] // Get first part (usually city name)
    }

    return "Unknown Location"
  } catch (error) {
    console.error("Error fetching place name:", error)
    return "Unknown Location"
  }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function getDistanceBetweenPoints(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Find point along polyline at a specific distance
 */
function findPointAtDistance(
  polyline: Array<{ lat: number; lng: number }>,
  targetDistanceKm: number
): { lat: number; lng: number } | null {
  if (polyline.length === 0) return null

  let accumulatedDistance = 0
  for (let i = 1; i < polyline.length; i++) {
    const segmentDistance = getDistanceBetweenPoints(
      polyline[i - 1].lat,
      polyline[i - 1].lng,
      polyline[i].lat,
      polyline[i].lng
    )

    if (accumulatedDistance + segmentDistance >= targetDistanceKm) {
      // Interpolate between current and previous point
      const ratio = (targetDistanceKm - accumulatedDistance) / segmentDistance
      return {
        lat: polyline[i - 1].lat + (polyline[i].lat - polyline[i - 1].lat) * ratio,
        lng: polyline[i - 1].lng + (polyline[i].lng - polyline[i - 1].lng) * ratio,
      }
    }

    accumulatedDistance += segmentDistance
  }

  // If target distance exceeds route length, return last point
  return polyline[polyline.length - 1]
}

/**
 * Calculate breakpoints along a route based on daily distance preference
 */
export async function calculateBreakpoints(
  origin: string,
  destination: string,
  dailyDistanceKm: number,
  apiKey?: string
): Promise<Breakpoint[]> {
  const routeData = await fetchRouteData(origin, destination, apiKey)

  if (!routeData) {
    // Fallback: return mock data if API fails
    return [
      { day: 1, city: "Jhansi", distance: 385, hours: 6.5, location: { lat: 0, lng: 0 }, address: "" },
      { day: 2, city: "Indore", distance: 290, hours: 4.5, location: { lat: 0, lng: 0 }, address: "" },
      { day: 3, city: "Panaji", distance: 425, hours: 7, location: { lat: 0, lng: 0 }, address: "" },
    ]
  }

  const totalDistanceKm = routeData.distance.value / 1000 // Convert meters to km
  const totalDurationHours = routeData.duration.value / 3600 // Convert seconds to hours

  // Calculate number of days needed
  const numberOfDays = Math.ceil(totalDistanceKm / dailyDistanceKm)

  // If route is shorter than daily distance, return single breakpoint
  if (numberOfDays <= 1) {
    const cityName = await getPlaceName(
      routeData.legs[0].end_location.lat,
      routeData.legs[0].end_location.lng,
      apiKey
    )
    return [
      {
        day: 1,
        city: cityName || destination,
        distance: Math.round(totalDistanceKm),
        hours: Math.round(totalDurationHours * 10) / 10,
        location: routeData.legs[0].end_location,
        address: routeData.legs[0].end_address,
      },
    ]
  }

  // Decode polyline to get all points along the route
  const polyline = decodePolyline(routeData.overview_polyline.points)

  // Calculate breakpoints
  const breakpoints: Breakpoint[] = []
  const distancePerDay = totalDistanceKm / numberOfDays
  const durationPerDay = totalDurationHours / numberOfDays

  for (let day = 1; day <= numberOfDays; day++) {
    const targetDistance = distancePerDay * day
    const point = findPointAtDistance(polyline, targetDistance)

    if (!point) continue

    // Get city name for this location
    const cityName = await getPlaceName(point.lat, point.lng, apiKey)

    // Calculate actual distance for this segment
    const segmentDistance =
      day === 1
        ? distancePerDay
        : day === numberOfDays
          ? totalDistanceKm - distancePerDay * (day - 1)
          : distancePerDay

    const segmentDuration =
      day === 1
        ? durationPerDay
        : day === numberOfDays
          ? totalDurationHours - durationPerDay * (day - 1)
          : durationPerDay

    breakpoints.push({
      day,
      city: cityName || (day === numberOfDays ? destination : `Day ${day} Stop`),
      distance: Math.round(segmentDistance),
      hours: Math.round(segmentDuration * 10) / 10,
      location: point,
      address: day === numberOfDays ? routeData.legs[routeData.legs.length - 1].end_address : "",
    })
  }

  return breakpoints
}

/**
 * Decode Google Maps polyline string to coordinates
 * This is useful for finding intermediate points along the route
 */
export function decodePolyline(encoded: string): Array<{ lat: number; lng: number }> {
  const poly: Array<{ lat: number; lng: number }> = []
  let index = 0
  const len = encoded.length
  let lat = 0
  let lng = 0

  while (index < len) {
    let b
    let shift = 0
    let result = 0
    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)
    const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1
    lat += dlat

    shift = 0
    result = 0
    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)
    const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1
    lng += dlng

    poly.push({ lat: lat * 1e-5, lng: lng * 1e-5 })
  }

  return poly
}

