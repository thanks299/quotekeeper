import { drizzle } from "drizzle-orm/vercel-postgres"
import { createClient } from "@vercel/postgres"
import * as schema from "./schema"

// Get the database connection string
const connectionString = process.env.DATABASE_URL

// Log connection string format (without credentials)
if (connectionString) {
  const parts = connectionString.split("@")
  if (parts.length > 1) {
    console.log("Connection string format:", parts[1])
  } else {
    console.log("Connection string format is unusual, might be malformed")
  }
} else {
  console.error("DATABASE_URL is not defined")
}

// Create a client with the explicit connection string
const client = createClient({
  connectionString: connectionString,
})

// Create drizzle database instance with vercel-postgres
export const db = drizzle(client, { schema })

// Test the database connection
export async function testConnection() {
  try {
    if (!connectionString) {
      console.error("No DATABASE_URL environment variable found")
      return false
    }

    console.log("Testing database connection...")

    // Run a simple query using the client directly
    const result = await client.sql`SELECT 1 as test`
    console.log("Database connection successful:", result.rows[0])
    return true
  } catch (error) {
    console.error("Database connection error:", error)
    // Log more details about the error
    if (error instanceof Error) {
      console.error("Error details:", error.message)
      console.error("Error stack:", error.stack)
    }
    return false
  }
}

