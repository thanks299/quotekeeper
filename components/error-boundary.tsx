"use client"

import React from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 border border-destructive/20 bg-destructive/10 rounded-lg my-4">
          <div className="flex items-center gap-2 text-destructive mb-4">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="font-semibold">Something went wrong</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            {this.state.error?.message || "An unexpected error occurred while displaying this content."}
          </p>
          <Button
            variant="outline"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="border-destructive/50 text-destructive hover:bg-destructive/10"
          >
            Try again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

