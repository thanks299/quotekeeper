"use server"
import { redirect } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import { db, testConnection } from "@/lib/db"
import { users, quotes, categories } from "@/lib/schema"
import { eq, and } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { createSession, getSession, deleteSession } from "@/lib/auth"

// Test database connection on server start
let connectionTested = false

async function connectWithRetry(attempts: number, delay: number): Promise<boolean> {
  for (let i = 0; i < attempts; i++) {
    try {
      const connected = await testConnection()
      console.log(`Connection attempt ${i + 1} successful:`, connected)
      return connected
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
      if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL environment variable is not set")
        connectionTested = true
        return false
      }

      console.log("Testing database connection...")
      // Try to connect with retries
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
export async function signUp(formData: { name: string; email: string; password: string }) {
  console.log("signUp action called with:", { name: formData.name, email: formData.email, password: "***" })

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
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, formData.email),
    })

    if (existingUser) {
      console.log("User already exists with email:", formData.email)
      return { error: "Email already in use" }
    }

    // Hash password
    console.log("Hashing password...")
    const hashedPassword = await bcrypt.hash(formData.password, 10)

    // Create user
    console.log("Creating new user...")
    const [newUser] = await db
      .insert(users)
      .values({
        id: uuidv4(),
        name: formData.name,
        email: formData.email,
        password: hashedPassword,
      })
      .returning()

    console.log("User created successfully:", newUser.id)

    // Create default categories for the user
    console.log("Creating default categories...")
    const defaultCategories = ["inspiration", "motivation", "wisdom", "humor", "other"]
    await Promise.all(
      defaultCategories.map((category) =>
        db.insert(categories).values({
          id: uuidv4(),
          userId: newUser.id,
          name: category,
        }),
      ),
    )

    // Create session
    console.log("Creating session...")
    const sessionResult = await createSession(newUser.id)
    console.log("Session creation result:", sessionResult)

    if (sessionResult.error) {
      console.error("Session creation failed:", sessionResult.error)
      return { error: "Account created but failed to sign in. Please try signing in." }
    }

    console.log("Sign-up process completed successfully")
    return { success: true }
  } catch (error) {
    console.error("Sign up error:", error)
    if (error instanceof Error) {
      console.error("Error details:", error.message)
      console.error("Error stack:", error.stack)
    }
    return { error: "Failed to create account. Please check your database connection." }
  }
}

export async function signIn(formData: { email: string; password: string }) {
  console.log("signIn action called with:", { email: formData.email, password: "***" })

  try {
    console.log("Testing database connection before sign-in...")
    await ensureDbConnection()

    // Find user
    console.log("Finding user with email:", formData.email)
    const user = await db.query.users.findFirst({
      where: eq(users.email, formData.email),
    })

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

    // Create session
    console.log("Creating session...")
    const sessionResult = await createSession(user.id)
    console.log("Session creation result:", sessionResult)

    if (sessionResult.error) {
      console.error("Session creation failed:", sessionResult.error)
      return { error: "Authentication successful but failed to create session. Please try again." }
    }

    console.log("Sign-in process completed successfully")
    return { success: true }
  } catch (error) {
    console.error("Sign in error:", error)
    if (error instanceof Error) {
      console.error("Error details:", error.message)
      console.error("Error stack:", error.stack)
    }
    return { error: "Failed to sign in. Please check your database connection." }
  }
}

export async function signOut() {
  try {
    await deleteSession()
    redirect("/")
  } catch (error) {
    console.error("Sign out error:", error)
    return { error: "Failed to sign out" }
  }
}

// Quote actions
// Update the getQuotes function to handle database errors better
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

    const userQuotes = await db.query.quotes.findMany({
      where: eq(quotes.userId, session.userId),
      orderBy: (quotes, { desc }) => [desc(quotes.createdAt)],
    })

    return userQuotes
  } catch (error) {
    console.error("Get quotes error:", error)
    return []
  }
}

export async function addQuote(quoteData: { text: string; author: string; category: string }) {
  try {
    await ensureDbConnection()

    const session = await getSession()

    if (!session) {
      redirect("/sign-in")
    }

    const [newQuote] = await db
      .insert(quotes)
      .values({
        id: uuidv4(),
        userId: session.userId,
        text: quoteData.text,
        author: quoteData.author || "Unknown",
        category: quoteData.category,
      })
      .returning()

    return newQuote
  } catch (error) {
    console.error("Add quote error:", error)
    throw new Error("Failed to add quote. Please check your database connection.")
  }
}

export async function updateQuote(quoteData: { id: string; text: string; author: string; category: string }) {
  try {
    await ensureDbConnection()

    const session = await getSession()

    if (!session) {
      redirect("/sign-in")
    }

    await db
      .update(quotes)
      .set({
        text: quoteData.text,
        author: quoteData.author,
        category: quoteData.category,
      })
      .where(and(eq(quotes.id, quoteData.id), eq(quotes.userId, session.userId)))

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

    await db.delete(quotes).where(and(eq(quotes.id, id), eq(quotes.userId, session.userId)))

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

    const userCategories = await db.query.categories.findMany({
      where: eq(categories.userId, session.userId),
    })

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
    const existingCategory = await db.query.categories.findFirst({
      where: and(eq(categories.userId, session.userId), eq(categories.name, name)),
    })

    if (existingCategory) {
      return { success: true }
    }

    await db.insert(categories).values({
      id: uuidv4(),
      userId: session.userId,
      name: name.toLowerCase(),
    })

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

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.userId),
      columns: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    })

    return user
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}

