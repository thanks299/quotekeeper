"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import {
  type CookieCategory,
  type CookieSettings as CookieSettingsType,
  cookieCategoryDescriptions,
  loadCookieSettings,
  saveCookieSettings,
} from "@/lib/cookie-utils"
import { saveCookiePreferences } from "@/app/actions"

interface CookieSettingsProps {
  onClose: () => void
}

export function CookieSettings({ onClose }: CookieSettingsProps) {
  const [settings, setSettings] = useState<CookieSettingsType>(loadCookieSettings())
  const [activeTab, setActiveTab] = useState<string>("overview")

  // Handle outside click to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.classList.contains("cookie-settings-backdrop")) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  const handleToggle = (category: CookieCategory) => {
    if (category === "necessary") return // Can't toggle necessary cookies

    setSettings((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const handleSave = async () => {
    const updatedSettings = {
      ...settings,
      consentGiven: true,
      lastUpdated: new Date().toISOString(),
    }
    saveCookieSettings(updatedSettings)

    // Save to database if user is logged in
    try {
      await saveCookiePreferences({
        functional: updatedSettings.functional,
        analytics: updatedSettings.analytics,
        marketing: updatedSettings.marketing,
      })
    } catch (error) {
      console.error("Failed to save cookie preferences to database:", error)
    }

    onClose()
  }

  const handleAcceptAll = async () => {
    const updatedSettings = {
      ...settings,
      functional: true,
      analytics: true,
      marketing: true,
      consentGiven: true,
      lastUpdated: new Date().toISOString(),
    }
    saveCookieSettings(updatedSettings)

    // Save to database if user is logged in
    try {
      await saveCookiePreferences({
        functional: true,
        analytics: true,
        marketing: true,
      })
    } catch (error) {
      console.error("Failed to save cookie preferences to database:", error)
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 cookie-settings-backdrop">
      <motion.div
        className="w-full max-w-2xl max-h-[90vh] overflow-auto bg-background rounded-lg shadow-xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Cookie Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4 pt-4">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="detailed">Detailed Settings</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="p-4 space-y-4">
            <p className="text-muted-foreground">
              We use cookies to ensure the website functions properly and to improve your experience. You can choose
              which cookies you want to allow. Necessary cookies are required for the website to function.{" "}
              <Link href="/cookie-policy" className="text-primary hover:underline inline-flex items-center gap-1">
                View our full Cookie Policy <ExternalLink className="h-3 w-3" />
              </Link>
            </p>

            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="font-medium">Necessary Cookies</h3>
                  <p className="text-sm text-muted-foreground">{cookieCategoryDescriptions.necessary}</p>
                </div>
                <Switch checked={true} disabled />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="font-medium">Functional Cookies</h3>
                  <p className="text-sm text-muted-foreground">{cookieCategoryDescriptions.functional}</p>
                </div>
                <Switch checked={settings.functional} onCheckedChange={() => handleToggle("functional")} />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="font-medium">Analytics Cookies</h3>
                  <p className="text-sm text-muted-foreground">{cookieCategoryDescriptions.analytics}</p>
                </div>
                <Switch checked={settings.analytics} onCheckedChange={() => handleToggle("analytics")} />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="font-medium">Marketing Cookies</h3>
                  <p className="text-sm text-muted-foreground">{cookieCategoryDescriptions.marketing}</p>
                </div>
                <Switch checked={settings.marketing} onCheckedChange={() => handleToggle("marketing")} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="detailed" className="p-4 space-y-4">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Necessary Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  These cookies are essential for the website to function properly. They enable basic functions like
                  page navigation, access to secure areas, and security features. The website cannot function properly
                  without these cookies.
                </p>
                <div className="bg-muted p-3 rounded-md">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="necessary-cookies" className="font-medium">
                      Enable Necessary Cookies
                    </Label>
                    <Switch id="necessary-cookies" checked={true} disabled />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    These cookies cannot be disabled as they are required for the website to function.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Functional Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  These cookies enable the website to provide enhanced functionality and personalization. They may be
                  set by us or by third-party providers whose services we have added to our pages.
                </p>
                <div className="bg-muted p-3 rounded-md">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="functional-cookies" className="font-medium">
                      Enable Functional Cookies
                    </Label>
                    <Switch
                      id="functional-cookies"
                      checked={settings.functional}
                      onCheckedChange={() => handleToggle("functional")}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    If disabled, some features of the website may not function properly.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Analytics Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  These cookies allow us to count visits and traffic sources so we can measure and improve the
                  performance of our site. They help us know which pages are the most and least popular and see how
                  visitors move around the site.
                </p>
                <div className="bg-muted p-3 rounded-md">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="analytics-cookies" className="font-medium">
                      Enable Analytics Cookies
                    </Label>
                    <Switch
                      id="analytics-cookies"
                      checked={settings.analytics}
                      onCheckedChange={() => handleToggle("analytics")}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    All information these cookies collect is aggregated and therefore anonymous.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Marketing Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  These cookies may be set through our site by our advertising partners. They may be used by those
                  companies to build a profile of your interests and show you relevant ads on other sites.
                </p>
                <div className="bg-muted p-3 rounded-md">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="marketing-cookies" className="font-medium">
                      Enable Marketing Cookies
                    </Label>
                    <Switch
                      id="marketing-cookies"
                      checked={settings.marketing}
                      onCheckedChange={() => handleToggle("marketing")}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    These cookies do not store directly personal information, but are based on uniquely identifying your
                    browser and internet device.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Link href="/cookie-policy" className="text-primary hover:underline inline-flex items-center gap-1">
                View our full Cookie Policy <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between p-4 border-t">
          <div className="text-xs text-muted-foreground">
            Last updated: {settings.lastUpdated ? new Date(settings.lastUpdated).toLocaleString() : "Never"}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="outline" onClick={handleAcceptAll}>
              Accept All
            </Button>
            <Button onClick={handleSave}>Save Preferences</Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

