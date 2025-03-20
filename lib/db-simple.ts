import { drizzle } from "drizzle-orm/node-postgres"
import * as schema from "./schema"

// Create a simple client without using Pool directly
let db: any
let pgClient: any

// Initialize database connection
async function initDb() {
  try {
    // Dynamic import to avoid ESM/CJS issues
    const pg = await import("pg")
    const { Client } = pg.default || pg

    // Database connection string
    const connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/quotekeeper"

    // Create a client
    pgClient = new Client({
      connectionString,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
    })

    // Connect to the database
    await pgClient.connect()

    // Create drizzle instance
    db = drizzle(pgClient, { schema })

    console.log("Database connection initialized successfully")
    return true
  } catch (error) {
    console.error("Failed to initialize database connection:", error)
    return false
  }
}

// Get the database instance
export async function getDb() {
  if (!db) {
    await initDb()
  }
  return db
}

// Test the database connection
export async function testConnection() {
  try {
    if (!pgClient) {
      await initDb()
    }

    if (!pgClient) {
      return false
    }

    // Run a simple query
    const result = await pgClient.query("SELECT 1 as test")
    console.log("Database connection successful:", result.rows[0])
    return true
  } catch (error) {
    console.error("Database connection error:", error)
    return false
  }
}

// Close the database connection
export async function closeDb() {
  if (pgClient) {
    try {
      await pgClient.end()
      console.log("Database connection closed")
    } catch (error) {
      console.error("Error closing database connection:", error)
    }
  }
}

// Initialize the database connection
initDb().catch(console.error)

// Export the database instance
export { db }

