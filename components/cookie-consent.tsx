"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { acceptAllCookies, acceptNecessaryCookies, shouldShowCookieConsent } from "@/lib/cookie-utils"
import { CookieSettings } from "@/components/cookie-settings"
import { saveCookiePreferences } from "@/app/actions"

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    // Small delay to prevent banner from flashing on page load
    const timer = setTimeout(() => {
      setShowBanner(shouldShowCookieConsent())
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleAcceptAll = async () => {
    acceptAllCookies()
    setShowBanner(false)

    // Save preferences to database if user is logged in
    try {
      await saveCookiePreferences({
        functional: true,
        analytics: true,
        marketing: true,
      })
    } catch (error) {
      console.error("Failed to save cookie preferences to database:", error)
    }
  }

  const handleAcceptNecessary = async () => {
    acceptNecessaryCookies()
    setShowBanner(false)

    // Save preferences to database if user is logged in
    try {
      await saveCookiePreferences({
        functional: false,
        analytics: false,
        marketing: false,
      })
    } catch (error) {
      console.error("Failed to save cookie preferences to database:", error)
    }
  }

  const handleOpenSettings = () => {
    setShowSettings(true)
  }

  const handleCloseSettings = () => {
    setShowSettings(false)
    setShowBanner(shouldShowCookieConsent())
  }

  if (!showBanner && !showSettings) return null

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t shadow-lg"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Cookie Consent</h3>
                  <p className="text-muted-foreground text-sm">
                    We use cookies to enhance your experience on our website. By clicking "Accept All", you consent to
                    the use of all cookies. You can manage your preferences or decline non-essential cookies by clicking
                    "Cookie Settings".{" "}
                    <Link href="/cookie-policy" className="text-primary hover:underline">
                      Learn more about our Cookie Policy
                    </Link>
                    .
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                  <Button variant="outline" size="sm" onClick={handleAcceptNecessary} className="w-full sm:w-auto">
                    Necessary Only
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleOpenSettings} className="w-full sm:w-auto">
                    Cookie Settings
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAcceptAll}
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                  >
                    Accept All
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showSettings && <CookieSettings onClose={handleCloseSettings} />}
    </>
  )
}

