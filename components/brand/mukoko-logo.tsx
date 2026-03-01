"use client"

interface MukokoLogoProps {
  className?: string
  size?: number
  showWordmark?: boolean
  suffix?: string
}

/**
 * Mukoko brand logo — hexagonal beehive mark with optional wordmark.
 * "Mukoko" means "Beehive" in Shona.
 *
 * The hexagon represents the beehive cell, the inner "m" letterform is
 * constructed from three vertical strokes with connected arches, evoking
 * the honeycomb structure.
 */
export function MukokoLogo({
  className = "",
  size = 28,
  showWordmark = true,
  suffix,
}: MukokoLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        {/* Hexagon shell */}
        <path
          d="M16 1.072l12.124 7v13.856L16 28.928 3.876 21.928V8.072L16 1.072z"
          fill="currentColor"
        />
        {/* Inner "m" letterform — three strokes with arches */}
        <path
          d="M10 21V14.5C10 12.567 11.567 11 13.5 11S17 12.567 17 14.5V21M17 14.5C17 12.567 18.567 11 20.5 11S24 12.567 24 14.5V21"
          stroke="var(--background, #0A0A0A)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Left vertical stroke */}
        <line
          x1="10"
          y1="11"
          x2="10"
          y2="21"
          stroke="var(--background, #0A0A0A)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>

      {showWordmark && (
        <span className="flex items-baseline gap-1.5">
          <span className="text-sm font-semibold tracking-tight text-foreground">
            mukoko
          </span>
          {suffix && (
            <span className="text-xs text-muted-foreground">{suffix}</span>
          )}
        </span>
      )}
    </span>
  )
}
