"use client"

import { isCookieCategoryAllowed, setCookieWithConsent } from "./cookie-utils"

// This is a simple analytics service that respects user consent
// In a real application, you would integrate with Google Analytics, Mixpanel, etc.

class AnalyticsService {
  private initialized = false
  private userId: string | null = null
  private sessionId: string | null = null
  private events: Array<{ name: string; properties: Record<string, any>; timestamp: number }> = []

  // Initialize analytics only if user has given consent
  public init(): boolean {
    // Check if analytics cookies are allowed
    if (!isCookieCategoryAllowed("analytics")) {
      console.log("Analytics disabled due to user preferences")
      return false
    }

    // Generate a session ID
    this.sessionId = this.generateId()

    // Set analytics cookies
    setCookieWithConsent("analytics_session_id", this.sessionId, "analytics", { days: 1 })

    // Set user ID if not already set
    const existingUserId = localStorage.getItem("analytics_user_id")
    if (existingUserId) {
      this.userId = existingUserId
    } else {
      this.userId = this.generateId()
      // We use localStorage for this as it's not a cookie, but still respects user consent
      if (isCookieCategoryAllowed("analytics")) {
        localStorage.setItem("analytics_user_id", this.userId)
      }
    }

    this.initialized = true
    console.log("Analytics initialized")

    // Track page view
    this.trackPageView()

    return true
  }

  // Track a page view
  public trackPageView(url?: string): void {
    if (!this.canTrack()) return

    const pageUrl = url || window.location.pathname

    this.trackEvent("page_view", {
      url: pageUrl,
      title: document.title,
      referrer: document.referrer,
    })
  }

  // Track a custom event
  public trackEvent(name: string, properties: Record<string, any> = {}): void {
    if (!this.canTrack()) return

    const event = {
      name,
      properties,
      timestamp: Date.now(),
    }

    this.events.push(event)

    // In a real implementation, you would send this to your analytics service
    console.log("Analytics event tracked:", event)

    // For demonstration, we'll store events in localStorage
    this.persistEvents()
  }

  // Check if we can track (initialized and consent given)
  private canTrack(): boolean {
    if (!this.initialized) {
      // Try to initialize if not already
      if (!this.init()) {
        return false
      }
    }

    return isCookieCategoryAllowed("analytics")
  }

  // Generate a random ID
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  // Store events in localStorage (for demonstration)
  private persistEvents(): void {
    if (isCookieCategoryAllowed("analytics")) {
      try {
        localStorage.setItem("analytics_events", JSON.stringify(this.events))
      } catch (error) {
        console.error("Failed to persist analytics events:", error)
      }
    }
  }
}

// Create a singleton instance
export const analytics = new AnalyticsService()

// Export a hook to use analytics in components
export function useAnalytics() {
  return analytics
}

