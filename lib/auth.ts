import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabase } from "./supabaseClient";

// Session cookie name (used by Supabase)
const SESSION_COOKIE_NAME = "sb-access-token";

// Create a new session for a user
export async function createSession(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("Creating session for user:", userId);

    // Supabase handles session creation automatically during sign-in
    // No need to manually create a session in the database

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
    // Get the session from Supabase
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
      console.log("No session found, user is not authenticated");
      return null;
    }

    console.log("Session found:", data.session.user.id);
    return {
      id: data.session.access_token, // Use the access token as the session ID
      userId: data.session.user.id,
    };
  } catch (error) {
    console.error("Get session error:", error);
    return null;
  }
}

// Delete the current session (sign out)
export async function deleteSession(): Promise<{ success: boolean; error?: string }> {
  try {
    // Sign out using Supabase
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out error:", error.message);
      return { success: false, error: "Failed to sign out" };
    }

    // Clear the session cookie
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
  created_at: string;
} | null> {
  try {
    console.log("Getting current user...");

    // Get the session from Supabase
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      console.log("No session found, user is not authenticated");
      return null;
    }

    console.log("User found:", data.user.id);

    // Fetch additional user details from the database if needed
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, name, email, created_at")
      .eq("id", data.user.id)
      .single();

    if (userError || !user) {
      console.error("Failed to fetch user details:", userError?.message);
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
    };
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}

// Middleware to protect routes
export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }
}