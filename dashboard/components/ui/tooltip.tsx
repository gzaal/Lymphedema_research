"use client"

// Simplified tooltip - use native title attributes instead
// This is a stub to prevent import errors

function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function Tooltip({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function TooltipTrigger({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function TooltipContent({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
