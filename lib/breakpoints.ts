/**
 * Responsive Breakpoints Configuration
 * Mobile-first approach with clear breakpoints for different device sizes
 */

export const breakpoints = {
  // Mobile: 0-639px (default, mobile-first)
  mobile: {
    min: 0,
    max: 639,
    name: "mobile",
  },
  // Tablet: 640px-1023px
  tablet: {
    min: 640,
    max: 1023,
    name: "tablet",
  },
  // Desktop: 1024px-1535px
  desktop: {
    min: 1024,
    max: 1535,
    name: "desktop",
  },
  // Large Desktop: 1536px-1919px
  largeDesktop: {
    min: 1536,
    max: 1919,
    name: "largeDesktop",
  },
  // Ultra-wide: 1920px+
  ultraWide: {
    min: 1920,
    max: Infinity,
    name: "ultraWide",
  },
} as const

/**
 * Tailwind CSS breakpoint utilities
 * sm: 640px (tablet)
 * md: 768px (tablet landscape)
 * lg: 1024px (desktop)
 * xl: 1536px (large desktop)
 * 2xl: 1920px (ultra-wide)
 */

export const spacing = {
  mobile: {
    container: "px-4",
    section: "py-6",
    gap: "gap-4",
  },
  tablet: {
    container: "px-6 md:px-8",
    section: "py-8 md:py-10",
    gap: "gap-6",
  },
  desktop: {
    container: "px-8 lg:px-12",
    section: "py-10 lg:py-12",
    gap: "gap-8",
  },
  largeDesktop: {
    container: "px-12 xl:px-16",
    section: "py-12 xl:py-16",
    gap: "gap-10",
  },
  ultraWide: {
    container: "px-16 2xl:px-24",
    section: "py-16 2xl:py-20",
    gap: "gap-12",
  },
} as const

export const typography = {
  mobile: {
    h1: "text-3xl",
    h2: "text-2xl",
    h3: "text-xl",
    body: "text-base",
    small: "text-sm",
  },
  tablet: {
    h1: "text-4xl md:text-5xl",
    h2: "text-3xl md:text-4xl",
    h3: "text-2xl md:text-3xl",
    body: "text-base md:text-lg",
    small: "text-sm md:text-base",
  },
  desktop: {
    h1: "text-5xl lg:text-6xl",
    h2: "text-4xl lg:text-5xl",
    h3: "text-3xl lg:text-4xl",
    body: "text-lg lg:text-xl",
    small: "text-base lg:text-lg",
  },
} as const

