"use client"

import { isCookieCategoryAllowed, setCookieWithConsent, getCookie } from "./cookie-utils"

// This is a simple functional service that respects user consent
// It handles features like theme preferences, language settings, etc.

class FunctionalService {
  private initialized = false

  // Initialize functional features only if user has given consent
  public init(): boolean {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      return false
    }

    // Check if functional cookies are allowed
    if (!isCookieCategoryAllowed("functional")) {
      console.log("Functional features disabled due to user preferences")
      return false
    }

    // In a real implementation, you would initialize functional features here
    this.initialized = true
    console.log("Functional features initialized")

    return true
  }

  // Save user preferences
  public savePreference(key: string, value: string): boolean {
    if (!this.canUseFunctional()) return false

    // Set a functional cookie
    return setCookieWithConsent(`pref_${key}`, value, "functional", { days: 365 })
  }

  // Get user preferences
  public getPreference(key: string): string | null {
    if (!this.canUseFunctional()) return null

    // Get the preference from cookies
    return getCookie(`pref_${key}`)
  }

  // Save the last viewed quotes for quick access
  public saveLastViewedQuotes(quoteIds: string[]): boolean {
    if (!this.canUseFunctional()) return false

    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      return false
    }

    // Save only the last 5 quotes
    const lastFiveQuotes = quoteIds.slice(0, 5)

    try {
      // Use localStorage instead of cookies for this feature
      localStorage.setItem("last_viewed_quotes", JSON.stringify(lastFiveQuotes))
      return true
    } catch (error) {
      console.error("Failed to save last viewed quotes:", error)
      return false
    }
  }

  // Get the last viewed quotes
  public getLastViewedQuotes(): string[] {
    if (!this.canUseFunctional()) return []

    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      return []
    }

    try {
      const lastViewedQuotes = localStorage.getItem("last_viewed_quotes")
      if (lastViewedQuotes) {
        return JSON.parse(lastViewedQuotes)
      }
    } catch (error) {
      console.error("Failed to parse last viewed quotes:", error)
    }

    return []
  }

  // Check if we can use functional features
  private canUseFunctional(): boolean {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      return false
    }

    if (!this.initialized) {
      // Try to initialize if not already
      if (!this.init()) {
        return false
      }
    }

    return isCookieCategoryAllowed("functional")
  }
}

// Create a singleton instance
export const functional = new FunctionalService()

// Export a hook to use functional features in components
export function useFunctional() {
  return functional
}

