"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { QuoteIcon, Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user } = useAuth()

  return (
    <motion.header
      className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 font-semibold">
          <QuoteIcon className="h-6 w-6 text-primary" />
          <span>QuoteKeeper</span>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <Link href="/dashboard">
              <Button className="interactive-button bg-gradient-to-r from-primary to-turquoise-light text-white shadow-lg shadow-primary/20">
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  className="text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="interactive-button bg-gradient-to-r from-secondary to-terracotta-light text-white shadow-lg shadow-secondary/20">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="transition-all duration-200 hover:bg-primary/10"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center gap-4 p-4 border-t">
              {user ? (
                <Link href="/dashboard" className="w-full">
                  <Button className="w-full bg-gradient-to-r from-primary to-turquoise-light">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/sign-in" className="w-full">
                    <Button
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up" className="w-full">
                    <Button className="w-full bg-gradient-to-r from-secondary to-terracotta-light">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

