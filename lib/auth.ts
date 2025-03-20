import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { db, testConnection } from "./db";
import { sessions, users } from "./schema";
import { eq } from "drizzle-orm";
import { fallbackDb } from "./db-fallback";

// Session duration in seconds (7 days)
const SESSION_DURATION = 60 * 60 * 24 * 7;

// Session cookie name
const SESSION_COOKIE_NAME = "session_id";

// Cache for fallback state to avoid repeated checks
let fallbackCache: { timestamp: number; result: boolean } | null = null;
const FALLBACK_CACHE_DURATION = 5000; // 5 seconds

// Helper to check if we should use fallback
async function shouldUseFallback(): Promise<boolean> {
  if (fallbackCache && Date.now() - fallbackCache.timestamp < FALLBACK_CACHE_DURATION) {
    return fallbackCache.result;
  }

  try {
    console.log("Testing database connection for auth...");
    const connected = await testConnection();
    console.log("Database connection test result:", connected);
    fallbackCache = { timestamp: Date.now(), result: !connected };
    return !connected;
  } catch (error) {
    console.error("Error checking database connection for auth:", error);
    fallbackCache = { timestamp: Date.now(), result: true };
    return true;
  }
}

// Validate session ID format
function isValidSessionId(sessionId: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sessionId);
}

// Create a new session for a user
export async function createSession(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("Creating session for user:", userId);

    // Check if we should use fallback
    const useFallback = await shouldUseFallback();
    console.log("Using fallback for createSession:", useFallback);

    const sessionId = uuidv4();
    const expiresAt = new Date(Date.now() + SESSION_DURATION * 1000);

    if (useFallback) {
      console.log("Using fallback for createSession");

      // Create session in fallback
      fallbackDb.createSession({
        id: sessionId, // Ensure sessionId is passed
        userId,
        expiresAt,
      });
    } else {
      // Use database if available
      // Delete any existing sessions for this user
      await db.delete(sessions).where(eq(sessions.userId, userId));

      // Create a new session
      await db.insert(sessions).values({
        id: sessionId,
        userId,
        expiresAt,
      });
    }

    // Set the session cookie
    cookies().set({
      name: SESSION_COOKIE_NAME,
      value: sessionId,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_DURATION,
      sameSite: "lax",
    });

    console.log("Session created successfully");
    return { success: true };
  } catch (error) {
    console.error("Create session error:", error);
    return { success: false, error: "Failed to create session" };
  }
}

// Get the current session
export async function getSession(): Promise<{ id: string; userId: string } | null> {
  try {
    const sessionId = cookies().get(SESSION_COOKIE_NAME)?.value;
    console.log("Getting session with ID:", sessionId);

    if (!sessionId || !isValidSessionId(sessionId)) {
      console.log("Invalid or missing session ID in cookies");
      return null;
    }

    // Check if we should use fallback
    const useFallback = await shouldUseFallback();
    console.log("Using fallback for getSession:", useFallback);

    let session;
    if (useFallback) {
      console.log("Using fallback for getSession");

      // Get session from fallback
      session = fallbackDb.getSession(sessionId);
    } else {
      // Find the session in database
      session = await db.query.sessions.findFirst({
        where: eq(sessions.id, sessionId),
      });
    }

    // Check if session exists and is not expired
    if (!session || new Date(session.expiresAt) < new Date()) {
      console.log("Session not found or expired");
      await deleteSession();
      return null;
    }

    console.log("Session found:", session.id);
    return {
      id: session.id,
      userId: session.userId,
    };
  } catch (error) {
    console.error("Get session error:", error);
    return null;
  }
}

// Delete the current session
export async function deleteSession(): Promise<{ success: boolean; error?: string }> {
  try {
    const sessionId = cookies().get(SESSION_COOKIE_NAME)?.value;
    console.log("Deleting session with ID:", sessionId);

    if (sessionId && isValidSessionId(sessionId)) {
      // Check if we should use fallback
      const useFallback = await shouldUseFallback();
      console.log("Using fallback for deleteSession:", useFallback);

      if (useFallback) {
        console.log("Using fallback for deleteSession");

        // Delete session from fallback
        fallbackDb.deleteSession(sessionId);
      } else {
        // Delete session from database
        await db.delete(sessions).where(eq(sessions.id, sessionId));
      }
    }

    cookies().delete(SESSION_COOKIE_NAME);
    console.log("Session deleted successfully");
    return { success: true };
  } catch (error) {
    console.error("Delete session error:", error);
    return { success: false, error: "Failed to delete session" };
  }
}

// Get the current user
export async function getCurrentUser(): Promise<{
  id: string;
  name: string;
  email: string;
  createdAt: Date;
} | null> {
  try {
    console.log("Getting current user...");
    const session = await getSession();

    if (!session) {
      console.log("No session found, user is not authenticated");
      return null;
    }

    console.log("Session found, user ID:", session.userId);

    // Check if we should use fallback
    const useFallback = await shouldUseFallback();
    console.log("Using fallback for getCurrentUser:", useFallback);

    let user;
    if (useFallback) {
      console.log("Using fallback for getCurrentUser");

      // Get user from fallback
      user = fallbackDb.getUserById(session.userId);
    } else {
      // Get user from database
      user = await db.query.users.findFirst({
        where: eq(users.id, session.userId),
        columns: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      });
    }

    if (user) {
      console.log("User found:", user.id);
    } else {
      console.log("User not found");
    }

    return user || null;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}