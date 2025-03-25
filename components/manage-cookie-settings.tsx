"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CookieSettings } from "@/components/cookie-settings"
import { loadCookieSettings } from "@/lib/cookie-utils"

export function ManageCookieSettings() {
  const [showSettings, setShowSettings] = useState(false)
  const cookieSettings = loadCookieSettings()

  const handleOpenSettings = () => {
    setShowSettings(true)
  }

  const handleCloseSettings = () => {
    setShowSettings(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <h3 className="text-lg font-medium">Cookie Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your cookie preferences. You can change these settings at any time.
        </p>

        <div className="mt-2">
          <Button onClick={handleOpenSettings} variant="outline">
            Manage Cookie Settings
          </Button>
        </div>

        {cookieSettings.consentGiven && (
          <div className="text-xs text-muted-foreground mt-2">
            Last updated: {new Date(cookieSettings.lastUpdated).toLocaleString()}
          </div>
        )}
      </div>

      {showSettings && <CookieSettings onClose={handleCloseSettings} />}
    </div>
  )
}

