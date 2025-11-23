"use client"

interface GridProps {
  children: React.ReactNode
  cols?: 1 | 2 | 3 | 4 | 6 | 12
  gap?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const gapClasses = {
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
  xl: "gap-10",
}

const gridColsClasses = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
  12: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-12",
}

export default function Grid({ children, cols = 3, gap = "md", className = "" }: GridProps) {
  return (
    <div className={`grid ${gridColsClasses[cols]} ${gapClasses[gap]} ${className}`}>{children}</div>
  )
}

