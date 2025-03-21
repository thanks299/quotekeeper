import { createClient } from "@vercel/postgres"
import dotenv from "dotenv"

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" })

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.error("DATABASE_URL environment variable is not set")
  process.exit(1)
}

async function testConnection() {
  console.log("Testing database connection...")

  const client = createClient({
    connectionString: connectionString,
  })

  try {
    console.log("Connecting to database...")
    const result = await client.sql`SELECT 1 as test`
    console.log("Connection successful:", result.rows[0])
    console.log("Database connection is working properly!")
  } catch (error) {
    console.error("Connection failed:", error)
  } finally {
    await client.end()
  }
}

testConnection()

