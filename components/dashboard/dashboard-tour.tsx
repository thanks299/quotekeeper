"use client"

import { useState, useEffect } from "react"
import Joyride, { type CallBackProps, STATUS, type Step } from "react-joyride"
import { useTheme } from "next-themes"

interface DashboardTourProps {
  userId: string
}

export function DashboardTour({ userId }: DashboardTourProps) {
  const [runTour, setRunTour] = useState(false)
  const { theme } = useTheme()
  const isDarkTheme = theme === "dark"

  // Define the tour steps
  const steps: Step[] = [
    {
      target: ".dashboard-header",
      content: "Welcome to QuoteKeeper! This is your personal dashboard where you can manage all your favorite quotes.",
      disableBeacon: true,
      placement: "bottom",
    },
    {
      target: ".tabs-list",
      content: "Use these tabs to navigate between your quotes, add new ones, or manage categories.",
      placement: "bottom",
    },
    {
      target: ".quotes-tab-content",
      content: "Here you can view all your saved quotes. Use the category filters to organize them.",
      placement: "top",
    },
    {
      target: ".category-filters",
      content: "Filter your quotes by category to find exactly what you're looking for.",
      placement: "bottom",
    },
    {
      target: ".search-quotes",
      content: "Search for specific quotes by text or author.",
      placement: "bottom-start",
    },
    {
      target: ".quote-card",
      content:
        "Each quote card displays the content, author, and category. You can edit or delete quotes using the buttons in the top-right corner.",
      placement: "left",
    },
    {
      target: ".add-quote-button",
      content: "Click this button to quickly add a new quote to your collection.",
      placement: "left",
    },
  ]

  useEffect(() => {
    // Check if user is new or returning after 30 days
    const checkUserStatus = async () => {
      try {
        // Get the last tour date from localStorage
        const lastTourDate = localStorage.getItem(`lastTourDate-${userId}`)
        const isNewUser = !localStorage.getItem(`userHasSeenTour-${userId}`)

        // Calculate if it's been 30 days since the last tour
        const showTourAfterDays = 30
        const daysSinceLastTour = lastTourDate
          ? Math.floor((Date.now() - new Date(lastTourDate).getTime()) / (1000 * 60 * 60 * 24))
          : showTourAfterDays + 1

        // Show tour for new users or users returning after 30 days
        if (isNewUser || daysSinceLastTour >= showTourAfterDays) {
          setRunTour(true)
        }
      } catch (error) {
        console.error("Error checking user tour status:", error)
      }
    }

    // Small delay to ensure DOM elements are loaded
    const timer = setTimeout(() => {
      checkUserStatus()
    }, 1000)

    return () => clearTimeout(timer)
  }, [userId])

  // Handle tour events
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type } = data

    // Update localStorage when tour is finished or skipped
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTour(false)
      localStorage.setItem(`lastTourDate-${userId}`, new Date().toISOString())
      localStorage.setItem(`userHasSeenTour-${userId}`, "true")
    }
  }

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      hideCloseButton
      run={runTour}
      scrollToFirstStep
      showProgress
      showSkipButton
      steps={steps}
      styles={{
        options: {
          arrowColor: isDarkTheme ? "#1e293b" : "#ffffff",
          backgroundColor: isDarkTheme ? "#1e293b" : "#ffffff",
          overlayColor: "rgba(0, 0, 0, 0.5)",
          primaryColor: isDarkTheme ? "hsl(var(--primary))" : "hsl(var(--primary))",
          textColor: isDarkTheme ? "#f8fafc" : "#334155",
          zIndex: 1000,
        },
        tooltip: {
          borderRadius: "0.5rem",
          fontSize: "14px",
        },
        tooltipContainer: {
          textAlign: "left",
        },
        buttonNext: {
          backgroundColor: "hsl(var(--primary))",
          borderRadius: "0.25rem",
          color: "#ffffff",
        },
        buttonBack: {
          marginRight: 10,
          color: isDarkTheme ? "#f8fafc" : "#334155",
        },
        buttonSkip: {
          color: isDarkTheme ? "#f8fafc" : "#334155",
        },
      }}
    />
  )
}

