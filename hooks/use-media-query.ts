"use client"

import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      return
    }

    const media = window.matchMedia(query)

    // Update the state with the current match
    const updateMatches = () => {
      setMatches(media.matches)
    }

    // Call once to set the initial value
    updateMatches()

    // Set up the listener
    media.addEventListener("change", updateMatches)

    // Clean up
    return () => {
      media.removeEventListener("change", updateMatches)
    }
  }, [query])

  return matches
}

