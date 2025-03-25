"use server"

import { redirect } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import { supabase } from "@/lib/supabaseClient"
import bcrypt from "bcryptjs"
import { getSession, deleteSession } from "@/lib/auth"
import { needsCookieConsent } from "@/lib/cookie-utils"

// Test database connection on server start
let connectionTested = false

async function connectWithRetry(attempts: number, delay: number): Promise<boolean> {
  for (let i = 0; i < attempts; i++) {
    try {
      const { data, error } = await supabase.from("users").select("*").limit(1)
      if (error) throw error
      console.log(`Connection attempt ${i + 1} successful`)
      return true
    } catch (error) {
      console.error(`Connection attempt ${i + 1} failed:`, error)
      if (i === attempts - 1) {
        console.error("All connection attempts failed.")
        return false
      }
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
  return false
}

// Update the ensureDbConnection function to be more robust
async function ensureDbConnection() {
  if (!connectionTested) {
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error("Supabase credentials are not set")
        connectionTested = true
        return false
      }

      console.log("Testing database connection...")
      const connected = await connectWithRetry(3, 1000)
      connectionTested = true

      if (!connected) {
        console.warn("All database connection attempts failed, using fallback")
      } else {
        console.log("Database connection successful")
      }

      return connected
    } catch (error) {
      console.error("Error testing database connection:", error)
      connectionTested = true
      return false
    }
  }
  return connectionTested
}

// Update the signUp function to handle database errors better
export async function signUp(formData: {
  name: string
  email: string
  password: string
}) {
  console.log("signUp action called with:", {
    name: formData.name,
    email: formData.email,
    password: "***",
  })

  try {
    console.log("Testing database connection before sign-up...")
    const connected = await ensureDbConnection()
    console.log("Database connection result:", connected)

    if (!connected) {
      console.log("Database connection failed, returning error")
      return { error: "Database connection failed. Please try again later." }
    }

    // Check if user already exists
    console.log("Checking if user already exists...")
    const { data: existingUser, error: queryError } = await supabase
      .from("users")
      .select("*")
      .eq("email", formData.email)
      .single()

    if (existingUser) {
      console.log("User already exists with email:", formData.email)
      return { error: "Email already in use" }
    }

    // Create Supabase Auth user first
    console.log("Creating Supabase Auth user...")
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard`,
        data: {
          name: formData.name,
        },
      },
    })

    if (authError) {
      console.error("Supabase Auth user creation failed:", authError.message)
      return { error: "Failed to create account. Please try again." }
    }

    if (!authData.user) {
      console.error("Supabase Auth returned no user")
      return { error: "Failed to create account. Please try again." }
    }

    // Hash password
    console.log("Hashing password...")
    const hashedPassword = await bcrypt.hash(formData.password, 10)

    // Create user in our custom table
    console.log("Creating new user in database...")
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          id: authData.user.id,
          name: formData.name,
          email: formData.email,
          password: hashedPassword,
        },
      ])
      .select()
      .single()

    if (insertError) {
      console.error("Error creating user:", insertError.message)
      return { error: "Failed to create account. Please try again." }
    }

    console.log("User created successfully:", newUser.id)

    // Create default categories for the user
    console.log("Creating default categories...")
    const defaultCategories = ["inspiration", "motivation", "wisdom", "humor", "other"]
    await Promise.all(
      defaultCategories.map((category) =>
        supabase.from("categories").insert([
          {
            id: uuidv4(),
            user_id: newUser.id,
            name: category,
          },
        ]),
      ),
    )

    console.log("Sign-up process completed successfully")

    // Check if cookie consent is needed
    const showCookieConsent = needsCookieConsent()

    // Immediately sign in the user
    if (authData.session) {
      console.log("User has been automatically signed in")
      return { success: true, needsCookieConsent: showCookieConsent }
    } else {
      console.log("Created user but email confirmation may be required")
      // If email confirmation is enabled in Supabase, we'll need to use the credentials to sign in
      const signInResult = await signIn({
        email: formData.email,
        password: formData.password,
      })
      return {
        ...signInResult,
        needsCookieConsent: showCookieConsent,
      }
    }
  } catch (error) {
    console.error("Sign up error:", error)
    return {
      error: "Failed to create account. Please check your database connection.",
    }
  }
}

export async function signIn(formData: { email: string; password: string }) {
  console.log("signIn action called with:", {
    email: formData.email,
    password: "***",
  })

  try {
    console.log("Testing database connection before sign-in...")
    await ensureDbConnection()

    // Try to sign in with Supabase Auth first
    console.log("Signing in with Supabase Auth...")
    const { data: session, error: sessionError } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

    if (sessionError) {
      console.error("Session creation failed:", sessionError.message)

      // Check if this is an email confirmation error
      if (sessionError.message.includes("Email not confirmed")) {
        return {
          error:
            "Your email address has not been verified. Please check your inbox (and spam folder) for a confirmation email.",
        }
      }

      // Find user to verify credentials manually
      console.log("Finding user with email:", formData.email)
      const { data: user, error: queryError } = await supabase
        .from("users")
        .select("*")
        .eq("email", formData.email)
        .single()

      if (!user) {
        console.log("User not found with email:", formData.email)
        return { error: "Invalid email or password" }
      }

      // Verify password
      console.log("Verifying password...")
      const passwordMatch = await bcrypt.compare(formData.password, user.password)

      if (!passwordMatch) {
        console.log("Password does not match")
        return { error: "Invalid email or password" }
      }

      return {
        error: "Authentication successful but failed to create session. Please confirm your email address.",
      }
    }

    console.log("Sign-in process completed successfully")

    // Check if cookie consent is needed
    const showCookieConsent = needsCookieConsent()

    return {
      success: true,
      needsCookieConsent: showCookieConsent,
    }
  } catch (error) {
    console.error("Sign in error:", error)
    return {
      error: "Failed to sign in. Please check your database connection.",
    }
  }
}

export async function signOut() {
  try {
    await supabase.auth.signOut()
    await deleteSession()
    redirect("/")
  } catch (error) {
    console.error("Sign out error:", error)
    return { error: "Failed to sign out" }
  }
}

// Quote actions
export async function getQuotes() {
  try {
    const connected = await ensureDbConnection()
    if (!connected) {
      console.warn("Database connection failed, returning empty quotes array")
      return []
    }

    const session = await getSession()
    if (!session) {
      redirect("/sign-in")
    }

    const { data: userQuotes, error } = await supabase
      .from("quotes")
      .select("*")
      .eq("user_id", session.user_id)
      .order("created_at", { ascending: false })

    if (error) throw error

    return userQuotes
  } catch (error) {
    console.error("Get quotes error:", error)
    return []
  }
}

export async function addQuote(quoteData: {
  text: string
  author: string
  category: string
}) {
  try {
    await ensureDbConnection()

    const session = await getSession()

    if (!session) {
      redirect("/sign-in")
    }

    const { data: newQuote, error } = await supabase
      .from("quotes")
      .insert([
        {
          id: uuidv4(),
          user_id: session.user_id,
          text: quoteData.text,
          author: quoteData.author || "Unknown",
          category: quoteData.category,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return newQuote
  } catch (error) {
    console.error("Add quote error:", error)
    throw new Error("Failed to add quote. Please check your database connection.")
  }
}

export async function updateQuote(quoteData: {
  id: string
  text: string
  author: string
  category: string
}) {
  try {
    await ensureDbConnection()

    const session = await getSession()

    if (!session) {
      redirect("/sign-in")
    }

    const { error } = await supabase
      .from("quotes")
      .update({
        text: quoteData.text,
        author: quoteData.author,
        category: quoteData.category,
      })
      .eq("id", quoteData.id)
      .eq("user_id", session.user_id)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Update quote error:", error)
    throw new Error("Failed to update quote. Please check your database connection.")
  }
}

export async function deleteQuote(id: string) {
  try {
    await ensureDbConnection()

    const session = await getSession()

    if (!session) {
      redirect("/sign-in")
    }

    const { error } = await supabase.from("quotes").delete().eq("id", id).eq("user_id", session.user_id)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Delete quote error:", error)
    throw new Error("Failed to delete quote. Please check your database connection.")
  }
}

// Category actions
export async function getCategories() {
  try {
    await ensureDbConnection()

    const session = await getSession()

    if (!session) {
      redirect("/sign-in")
    }

    const { data: userCategories, error } = await supabase
      .from("categories")
      .select("name")
      .eq("user_id", session.user_id)

    if (error) throw error

    return userCategories.map((category) => category.name)
  } catch (error) {
    console.error("Get categories error:", error)
    return []
  }
}

export async function addCategory(name: string) {
  try {
    await ensureDbConnection()

    const session = await getSession()

    if (!session) {
      redirect("/sign-in")
    }

    // Check if category already exists
    const { data: existingCategory, error: queryError } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", session.user_id)
      .eq("name", name)
      .single()

    if (existingCategory) {
      return { success: true }
    }

    const { error } = await supabase.from("categories").insert([
      {
        id: uuidv4(),
        user_id: session.user_id,
        name: name.toLowerCase(),
      },
    ])

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Add category error:", error)
    throw new Error("Failed to add category. Please check your database connection.")
  }
}

// Export getCurrentUser directly from actions.ts
export async function getCurrentUser() {
  try {
    await ensureDbConnection()

    const session = await getSession()

    if (!session) {
      return null
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("id, name, email, created_at") // <-- Use `created_at` here
      .eq("id", session.user_id)
      .single()

    if (error) throw error

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at, // <-- Use `created_at` here
    }
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}

/**
 * Request a password reset for the given email
 * This function sends a password reset email using Supabase Auth
 */
export async function requestPasswordReset(email: string) {
  console.log("Password reset requested for:", email)

  try {
    await ensureDbConnection()

    // Check if the user exists first (optional, for better error handling)
    const { data: user, error: userError } = await supabase.from("users").select("id").eq("email", email).single()

    // We don't want to reveal if an email exists or not for security reasons,
    // so we'll proceed with the reset request regardless

    // Use Supabase Auth to send a password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password`,
    })

    if (error) {
      console.error("Error sending password reset email:", error.message)
      // For security reasons, we don't want to reveal specific errors
      return { success: true } // Still return success to prevent email enumeration
    }

    console.log("Password reset email sent successfully")
    return { success: true }
  } catch (error) {
    console.error("Request password reset error:", error)
    // For security reasons, we don't expose the actual error
    return { success: true } // Still return success to prevent email enumeration
  }
}

/**
 * Reset a user's password with the provided token and new password
 */
export async function resetPassword(token: string, newPassword: string) {
  console.log("Password reset with token requested")

  try {
    await ensureDbConnection()

    // For Supabase password reset, we need to use the token to verify the user's email first
    // This is done by calling the verifyOtp method with the token
    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: "recovery",
    })

    if (verifyError) {
      console.error("Error verifying token:", verifyError.message)
      return {
        error: "Failed to verify reset token. The link may have expired or is invalid.",
      }
    }

    // Now update the user's password
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      console.error("Error resetting password:", error.message)
      return { error: "Failed to reset password. Please try again." }
    }

    console.log("Password reset successfully")
    return { success: true }
  } catch (error) {
    console.error("Reset password error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

/**
 * Save user's cookie preferences to the database
 */
export async function saveCookiePreferences(preferences: {
  functional: boolean
  analytics: boolean
  marketing: boolean
}) {
  try {
    await ensureDbConnection()

    const session = await getSession()

    if (!session) {
      return { error: "User not authenticated" }
    }

    // Save cookie preferences to user record
    const { error } = await supabase
      .from("users")
      .update({
        cookie_preferences: preferences,
        cookie_consent_given: true,
        cookie_consent_date: new Date().toISOString(),
      })
      .eq("id", session.user_id)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Save cookie preferences error:", error)
    return { error: "Failed to save cookie preferences" }
  }
}

/**
 * Get user's cookie preferences from the database
 */
export async function getCookiePreferences() {
  try {
    await ensureDbConnection()

    const session = await getSession()

    if (!session) {
      return { consentGiven: false }
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("cookie_preferences, cookie_consent_given, cookie_consent_date")
      .eq("id", session.user_id)
      .single()

    if (error) throw error

    if (!user || !user.cookie_consent_given) {
      return { consentGiven: false }
    }

    return {
      consentGiven: true,
      preferences: user.cookie_preferences || {
        necessary: true,
        functional: false,
        analytics: false,
        marketing: false,
      },
      lastUpdated: user.cookie_consent_date,
    }
  } catch (error) {
    console.error("Get cookie preferences error:", error)
    return { consentGiven: false }
  }
}

