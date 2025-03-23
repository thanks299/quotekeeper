"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { QuoteIcon, KeyRound, ArrowLeft, Mail } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { requestPasswordReset } from "@/app/actions"
import { AuthIllustration } from "@/components/auth-illustration"

export default function ForgotPasswordPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!email) {
            setError("Email is required")
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address")
            return
        }

        setIsLoading(true)

        try {
            await requestPasswordReset(email)

            setIsSubmitted(true)
            toast({
                title: "Reset link sent",
                description: "If an account exists with this email, you will receive a password reset link.",
            })
        } catch (err) {
            console.error("Password reset error:", err)
            setError("An unexpected error occurred")
            toast({
                variant: "destructive",
                title: "Error",
                description: "An unexpected error occurred. Please try again.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
            <div className="absolute left-4 top-4 md:left-8 md:top-8">
                <Link href="/">
                    <Button variant="ghost" className="flex items-center gap-1">
                        <QuoteIcon className="h-5 w-5 text-primary" />
                        <span>QuoteKeeper</span>
                    </Button>
                </Link>
            </div>
            <div className="absolute right-4 top-4 md:right-8 md:top-8">
                <ThemeToggle />
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-6xl mx-auto gap-8 px-4">
                <div className="hidden lg:flex w-1/2 justify-center">
                    <AuthIllustration type="forgot-password" />
                </div>

                <div className="w-full lg:w-[56%] max-w-xl">
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
                                <CardTitle className="text-xl sm:text-2xl text-center">Forgot Password</CardTitle>
                                <CardDescription className="text-center text-sm sm:text-base">
                                    {isSubmitted
                                        ? "Check your email for a password reset link"
                                        : "Enter your email and we'll send you a password reset link"}
                                </CardDescription>
                            </CardHeader>

                            {isSubmitted ? (
                                <CardContent className="space-y-4 sm:space-y-6 pt-4 px-4 sm:px-6">
                                    <div className="bg-primary/10 text-primary p-4 sm:p-6 rounded-md text-center">
                                        <Mail className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-primary" />
                                        <p className="font-medium text-base sm:text-lg">Reset link sent!</p>
                                        <p className="text-xs sm:text-sm mt-2">
                                            If an account exists with the email <span className="font-medium">{email}</span>, you will receive a
                                            password reset link.
                                        </p>
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <Button onClick={() => router.push("/sign-in")} className="w-full">
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Back to Sign In
                                        </Button>
                                    </div>
                                </CardContent>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <CardContent className="grid gap-4 pt-4 px-4 sm:px-6">
                                        {error && (
                                            <motion.div className="bg-destructive/15 text-destructive p-3 rounded-md">
                                                {error}
                                            </motion.div>
                                        )}
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="m@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex flex-col space-y-3 sm:space-y-4 pt-2 px-4 sm:px-6 pb-6">
                                        <Button className="w-full" type="submit" disabled={isLoading}>
                                            {isLoading ? "Sending..." : "Send Reset Link"}
                                        </Button>
                                        <Button variant="ghost" onClick={() => router.push("/sign-in")} className="w-full">
                                            <ArrowLeft className="mr-2 h-4 w-4" />
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
