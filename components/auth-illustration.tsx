"use client"

import { motion } from "framer-motion"
import { QuoteIcon, BookOpen, Sparkles, Mail, KeyRound, Lock } from "lucide-react"

interface AuthIllustrationProps {
  type: "signin" | "signup" | "forgot-password" | "reset-password"
}

export function AuthIllustration({ type }: AuthIllustrationProps) {
  return (
    <div className="auth-illustration relative h-full flex items-center justify-center">
      <motion.div className="relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        {/* Background circles */}
        <motion.div
          className="absolute -z-10 w-64 h-64 rounded-full bg-primary/10"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        <motion.div
          className="absolute -z-10 w-80 h-80 rounded-full bg-secondary/10"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 1,
          }}
        />

        {/* Main illustration */}
        <div className="relative z-10">
          {type === "signin" && (
            <div className="flex flex-col items-center">
              <motion.div
                className="w-64 h-64 bg-card rounded-lg shadow-xl overflow-hidden border border-primary/20 flex flex-col"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-primary h-12 flex items-center px-4">
                  <QuoteIcon className="h-5 w-5 text-primary-foreground" />
                  <span className="ml-2 text-primary-foreground font-medium">QuoteKeeper</span>
                </div>
                <div className="flex-1 p-4 flex flex-col gap-3">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="p-3 bg-muted rounded-md"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.2 }}
                    >
                      <div className="h-3 w-3/4 bg-primary/20 rounded mb-2"></div>
                      <div className="h-2 w-full bg-muted-foreground/20 rounded"></div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <h3 className="text-xl font-bold mb-2">Welcome Back!</h3>
                <p className="text-muted-foreground">Access your personal collection of wisdom</p>
              </motion.div>
            </div>
          )}

          {type === "signup" && (
            <div className="flex flex-col items-center">
              <motion.div
                className="relative"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-72 h-72 bg-card rounded-lg shadow-xl overflow-hidden border border-secondary/20 flex flex-col">
                  <div className="bg-secondary h-12 flex items-center px-4">
                    <BookOpen className="h-5 w-5 text-secondary-foreground" />
                    <span className="ml-2 text-secondary-foreground font-medium">Your Collection</span>
                  </div>
                  <div className="flex-1 p-4 flex flex-col gap-3">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        className="p-3 bg-muted rounded-md"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: i * 0.2 }}
                      >
                        <div className="h-3 w-3/4 bg-secondary/20 rounded mb-2"></div>
                        <div className="h-2 w-full bg-muted-foreground/20 rounded"></div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.div
                  className="absolute -top-4 -right-4 w-12 h-12 bg-accent rounded-full flex items-center justify-center text-accent-foreground"
                  animate={{
                    rotate: [0, 10, 0, -10, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  <Sparkles className="h-6 w-6" />
                </motion.div>
              </motion.div>

              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <h3 className="text-xl font-bold mb-2">Start Your Collection</h3>
                <p className="text-muted-foreground">Create an account to save your favorite quotes</p>
              </motion.div>
            </div>
          )}

          {type === "forgot-password" && (
            <div className="flex flex-col items-center">
              <motion.div
                className="relative"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-72 h-72 bg-card rounded-lg shadow-xl overflow-hidden border border-primary/20 flex flex-col">
                  <div className="bg-primary h-12 flex items-center px-4">
                    <Mail className="h-5 w-5 text-primary-foreground" />
                    <span className="ml-2 text-primary-foreground font-medium">Password Recovery</span>
                  </div>
                  <div className="flex-1 p-4 flex flex-col gap-3">
                    <motion.div
                      className="p-3 bg-muted rounded-md"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="h-3 w-3/4 bg-primary/20 rounded mb-2"></div>
                      <div className="h-2 w-full bg-muted-foreground/20 rounded"></div>
                    </motion.div>

                    <motion.div
                      className="p-3 bg-primary/10 rounded-md flex items-center gap-2"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Mail className="h-4 w-4 text-primary" />
                      <div className="h-3 w-3/4 bg-primary/20 rounded"></div>
                    </motion.div>

                    <motion.div
                      className="mt-auto p-3 bg-primary/20 rounded-md text-center"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="h-4 w-1/2 bg-primary/30 rounded mx-auto"></div>
                    </motion.div>
                  </div>
                </div>

                <motion.div
                  className="absolute -top-4 -right-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground"
                  animate={{
                    rotate: [0, 10, 0, -10, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  <KeyRound className="h-6 w-6" />
                </motion.div>
              </motion.div>

              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <h3 className="text-xl font-bold mb-2">Recover Your Account</h3>
                <p className="text-muted-foreground">We'll send you a link to reset your password</p>
              </motion.div>
            </div>
          )}

          {type === "reset-password" && (
            <div className="flex flex-col items-center">
              <motion.div
                className="relative"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-72 h-72 bg-card rounded-lg shadow-xl overflow-hidden border border-primary/20 flex flex-col">
                  <div className="bg-primary h-12 flex items-center px-4">
                    <KeyRound className="h-5 w-5 text-primary-foreground" />
                    <span className="ml-2 text-primary-foreground font-medium">Reset Password</span>
                  </div>
                  <div className="flex-1 p-4 flex flex-col gap-3">
                    <motion.div
                      className="p-3 bg-muted rounded-md"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="h-3 w-3/4 bg-primary/20 rounded mb-2"></div>
                      <div className="h-2 w-full bg-muted-foreground/20 rounded"></div>
                    </motion.div>

                    <motion.div
                      className="p-3 bg-muted rounded-md"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="h-3 w-3/4 bg-primary/20 rounded mb-2"></div>
                      <div className="h-2 w-full bg-muted-foreground/20 rounded"></div>
                    </motion.div>

                    <motion.div
                      className="mt-auto p-3 bg-primary/20 rounded-md text-center"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="h-4 w-1/2 bg-primary/30 rounded mx-auto"></div>
                    </motion.div>
                  </div>
                </div>

                <motion.div
                  className="absolute -top-4 -right-4 w-12 h-12 bg-accent rounded-full flex items-center justify-center text-accent-foreground"
                  animate={{
                    rotate: [0, 10, 0, -10, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  <Lock className="h-6 w-6" />
                </motion.div>
              </motion.div>

              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <h3 className="text-xl font-bold mb-2">Create New Password</h3>
                <p className="text-muted-foreground">Choose a strong password for your account</p>
              </motion.div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

