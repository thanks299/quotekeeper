"use client"

import { AlertTriangle } from "lucide-react"

interface ErrorDisplayProps {
  errorMessage: string
  isUsingLocalStorage: boolean
}

export function ErrorDisplay({ errorMessage, isUsingLocalStorage }: ErrorDisplayProps) {
  if (!errorMessage) return null

  return (
    <div className="bg-destructive/15 text-destructive p-4 rounded-md flex items-start gap-3">
      <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
      <div>
        <p className="font-medium">{errorMessage}</p>
        <p className="text-sm mt-1">
          {isUsingLocalStorage
            ? "Your quotes are being saved to local storage. They will be available only on this device and browser."
            : "Please make sure your database is properly configured and the DATABASE_URL environment variable is set correctly."}
        </p>
        {isUsingLocalStorage && (
          <p className="text-sm mt-2">
            <strong>Note:</strong> When the database connection is restored, you'll need to manually transfer your
            quotes.
          </p>
        )}
      </div>
    </div>
  )
}

