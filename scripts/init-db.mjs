import { createClient } from "@vercel/postgres"
import dotenv from "dotenv"

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" })

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.error("DATABASE_URL environment variable is not set")
  process.exit(1)
}

async function initializeDatabase() {
  console.log("Initializing database...")

  const client = createClient({
    connectionString: connectionString,
  })

  try {
    console.log("Connecting to database...")

    // Create tables
    console.log("Creating tables...")

    // Users table
    await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `
    console.log("Users table created")

    // Quotes table
    await client.sql`
      CREATE TABLE IF NOT EXISTS quotes (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        text TEXT NOT NULL,
        author TEXT NOT NULL,
        category TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `
    console.log("Quotes table created")

    // Categories table
    await client.sql`
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `
    console.log("Categories table created")

    // Sessions table
    await client.sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `
    console.log("Sessions table created")

    console.log("Database initialization completed successfully")
  } catch (error) {
    console.error("Error initializing database:", error)
  } finally {
    await client.end()
  }
}

initializeDatabase()

