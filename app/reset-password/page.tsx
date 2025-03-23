"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { QuoteIcon, KeyRound, CheckCircle, AlertCircle } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { resetPassword } from "@/app/actions"
import { AuthIllustration } from "@/components/auth-illustration"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    const accessToken = params.get("access_token")
    const type = params.get("type")

    if (accessToken && type === "recovery") {
      setToken(accessToken)
    } else {
      const tokenFromUrl = searchParams.get("token")
      if (tokenFromUrl) {
        setToken(tokenFromUrl)
      } else {
        setError("Invalid or missing reset token. Please request a new password reset link.")
      }
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!password) {
      setError("Password is required")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!token) {
      setError("Invalid reset token. Please request a new password reset link.")
      return
    }

    setIsLoading(true)

    try {
      const result = await resetPassword(token, password)

      if (result.error) {
        setError(result.error)
        toast({ variant: "destructive", title: "Error", description: result.error })
      } else {
        setIsSuccess(true)
        toast({ title: "Password reset successful", description: "You can now sign in with your new password." })
      }
    } catch (err) {
      setError("An unexpected error occurred")
      toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center p-4 sm:p-6 relative">
      {/* Header Controls */}
      <div className="absolute top-4 left-4 md:left-8 flex items-center gap-2">
        <Link href="/">
          <Button variant="ghost" className="flex items-center gap-1">
            <QuoteIcon className="h-5 w-5 text-primary" />
            <span>QuoteKeeper</span>
          </Button>
        </Link>
      </div>
      
      <div className="absolute top-4 right-4 md:right-8">
        <ThemeToggle />
      </div>

      {/* Center Content */}
      <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-6xl gap-8">
        {/* Illustration (for desktop view) */}
        <div className="hidden lg:block w-1/2">
          <AuthIllustration type="reset-password" />
        </div>

        {/* Reset Form */}
        <div className="w-full max-w-lg lg:w-1/2">
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-primary/20 shadow-xl backdrop-blur-sm bg-card/80">
              <CardHeader className="space-y-1 px-4 sm:px-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="p-3 rounded-full bg-primary text-primary-foreground">
                    <KeyRound className="h-5 w-5" />
                  </div>
                </div>
                <CardTitle className="text-xl sm:text-2xl text-center">Reset Password</CardTitle>
                <CardDescription className="text-center text-sm sm:text-base">
                  {isSuccess ? "Your password has been reset successfully" : "Enter your new password below"}
                </CardDescription>
              </CardHeader>

              {isSuccess ? (
                <CardContent className="text-center">
                  <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-primary mb-3" />
                  <p className="text-base sm:text-lg font-medium">Password Reset Successful!</p>
                  <Button onClick={() => router.push("/sign-in")} className="mt-4 w-full">
                    Go to Sign In
                  </Button>
                </CardContent>
              ) : (
                <form onSubmit={handleSubmit}>
                  <CardContent className="grid gap-4 px-4 sm:px-6">
                    {error && (
                      <motion.div className="bg-red-100 text-red-600 p-3 rounded-md text-sm">
                        <AlertCircle className="h-4 w-4 inline-block mr-2" />
                        {error}
                      </motion.div>
                    )}

                    <div className="grid gap-2">
                      <Label htmlFor="password">New Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-3 px-4 sm:px-6">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Resetting Password..." : "Reset Password"}
                    </Button>
                    <Button variant="ghost" onClick={() => router.push("/sign-in")} className="w-full">
                      Back to Sign In
                    </Button>
                  </CardFooter>
                </form>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
