"use client"

interface ContainerProps {
  children: React.ReactNode
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
  className?: string
}

const maxWidthClasses = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  full: "max-w-full",
}

export default function Container({ children, maxWidth = "xl", className = "" }: ContainerProps) {
  return (
    <div
      className={`
        w-full mx-auto
        px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24
        ${maxWidthClasses[maxWidth]}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

