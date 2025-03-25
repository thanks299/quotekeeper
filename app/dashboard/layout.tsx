import type React from "react"
import { CookieConsent } from "@/components/cookie-consent"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <>
      {children}
      <CookieConsent />
    </>
  )
}

