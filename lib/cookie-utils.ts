// Cookie consent types and utilities

export type CookieCategory = "necessary" | "functional" | "analytics" | "marketing"

export interface CookieSettings {
  necessary: boolean // Always true, can't be disabled
  functional: boolean
  analytics: boolean
  marketing: boolean
  consentGiven: boolean // Whether the user has made a choice
  lastUpdated: string // ISO date string
}

export const defaultCookieSettings: CookieSettings = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
  consentGiven: false,
  lastUpdated: "",
}

export const cookieCategoryDescriptions: Record<CookieCategory, string> = {
  necessary: "Essential cookies that enable basic functionality and security features of the website.",
  functional: "Cookies that enhance the functionality of the website, such as remembering your preferences.",
  analytics: "Cookies that help us understand how you interact with our website and improve your experience.",
  marketing: "Cookies used to track visitors across websites to display relevant advertisements.",
}

// Save cookie settings to localStorage
export function saveCookieSettings(settings: CookieSettings): void {
  try {
    settings.lastUpdated = new Date().toISOString()
    localStorage.setItem("cookieSettings", JSON.stringify(settings))
  } catch (error) {
    console.error("Failed to save cookie settings:", error)
  }
}

// Load cookie settings from localStorage
export function loadCookieSettings(): CookieSettings {
  try {
    const savedSettings = localStorage.getItem("cookieSettings")
    if (savedSettings) {
      return JSON.parse(savedSettings) as CookieSettings
    }
  } catch (error) {
    console.error("Failed to load cookie settings:", error)
  }
  return { ...defaultCookieSettings }
}

// Check if consent has been given
export function hasConsentBeenGiven(): boolean {
  try {
    const savedSettings = localStorage.getItem("cookieSettings")
    if (savedSettings) {
      const settings = JSON.parse(savedSettings) as CookieSettings
      return settings.consentGiven
    }
  } catch (error) {
    console.error("Failed to check consent status:", error)
  }
  return false
}

// Check if a specific cookie category is allowed
export function isCookieCategoryAllowed(category: CookieCategory): boolean {
  if (category === "necessary") return true // Necessary cookies are always allowed

  try {
    const settings = loadCookieSettings()
    return settings.consentGiven && settings[category]
  } catch (error) {
    console.error(`Failed to check if ${category} cookies are allowed:`, error)
    return false
  }
}

// Accept all cookies
export function acceptAllCookies(): void {
  const settings: CookieSettings = {
    necessary: true,
    functional: true,
    analytics: true,
    marketing: true,
    consentGiven: true,
    lastUpdated: new Date().toISOString(),
  }
  saveCookieSettings(settings)
}

// Accept only necessary cookies
export function acceptNecessaryCookies(): void {
  const settings: CookieSettings = {
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
    consentGiven: true,
    lastUpdated: new Date().toISOString(),
  }
  saveCookieSettings(settings)
}

// Should show cookie consent banner
export function shouldShowCookieConsent(): boolean {
  return !hasConsentBeenGiven()
}

// Server-side function to check if cookie consent is needed
export function needsCookieConsent(): boolean {
  // This is a server-side function, so we can't access localStorage directly
  // We'll always return true from the server and let the client decide
  return true
}

// NEW FUNCTIONS

// Set a cookie based on user consent
export function setCookieWithConsent(
  name: string,
  value: string,
  category: CookieCategory,
  options: { days?: number; path?: string; domain?: string; secure?: boolean } = {},
): boolean {
  // Check if the cookie category is allowed
  if (!isCookieCategoryAllowed(category)) {
    console.log(`Cookie '${name}' not set because '${category}' cookies are not allowed`)
    return false
  }

  // Set the cookie
  const { days = 30, path = "/", domain, secure = true } = options

  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=${path}`

  if (domain) {
    cookieString += `; domain=${domain}`
  }

  if (secure) {
    cookieString += "; secure"
  }

  document.cookie = cookieString
  return true
}

// Get a cookie value
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null // Return null if not in browser environment
  }

  const nameEQ = encodeURIComponent(name) + "="
  const cookies = document.cookie.split(";")

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i]
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1, cookie.length)
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length))
    }
  }

  return null
}

// Delete a cookie
export function deleteCookie(name: string, path = "/", domain?: string): void {
  if (typeof document === "undefined") {
    return // Return if not in browser environment
  }

  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${domain ? `; domain=${domain}` : ""}`
}

