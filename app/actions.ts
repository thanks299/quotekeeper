"use server";

import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";
import { createSession, getSession, deleteSession } from "@/lib/auth";

// Test database connection on server start
let connectionTested = false;

async function connectWithRetry(attempts: number, delay: number): Promise<boolean> {
  for (let i = 0; i < attempts; i++) {
    try {
      const { data, error } = await supabase.from("users").select("*").limit(1);
      if (error) throw error;
      console.log(`Connection attempt ${i + 1} successful`);
      return true;
    } catch (error) {
      console.error(`Connection attempt ${i + 1} failed:`, error);
      if (i === attempts - 1) {
        console.error("All connection attempts failed.");
        return false;
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  return false;
}

// Update the ensureDbConnection function to be more robust
async function ensureDbConnection() {
  if (!connectionTested) {
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error("Supabase credentials are not set");
        connectionTested = true;
        return false;
      }

      console.log("Testing database connection...");
      const connected = await connectWithRetry(3, 1000);
      connectionTested = true;

      if (!connected) {
        console.warn("All database connection attempts failed, using fallback");
      } else {
        console.log("Database connection successful");
      }

      return connected;
    } catch (error) {
      console.error("Error testing database connection:", error);
      connectionTested = true;
      return false;
    }
  }
  return connectionTested;
}

// Update the signUp function to handle database errors better
export async function signUp(formData: { name: string; email: string; password: string }) {
  console.log("signUp action called with:", { name: formData.name, email: formData.email, password: "***" });

  try {
    console.log("Testing database connection before sign-up...");
    const connected = await ensureDbConnection();
    console.log("Database connection result:", connected);

    if (!connected) {
      console.log("Database connection failed, returning error");
      return { error: "Database connection failed. Please try again later." };
    }

    // Check if user already exists
    console.log("Checking if user already exists...");
    const { data: existingUser, error: queryError } = await supabase
      .from("users")
      .select("*")
      .eq("email", formData.email)
      .single();

    if (existingUser) {
      console.log("User already exists with email:", formData.email);
      return { error: "Email already in use" };
    }

    // Hash password
    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(formData.password, 10);

    // Create user
    console.log("Creating new user...");
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          id: uuidv4(),
          name: formData.name,
          email: formData.email,
          password: hashedPassword,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error("Error creating user:", insertError.message);
      return { error: "Failed to create account. Please try again." };
    }

    console.log("User created successfully:", newUser.id);

    // Create default categories for the user
    console.log("Creating default categories...");
    const defaultCategories = ["inspiration", "motivation", "wisdom", "humor", "other"];
    await Promise.all(
      defaultCategories.map((category) =>
        supabase.from("categories").insert([
          {
            id: uuidv4(),
            userId: newUser.id,
            name: category,
          },
        ]),
      ),
    );

    // Create session
    console.log("Creating session...");
    const { data: session, error: sessionError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (sessionError) {
      console.error("Session creation failed:", sessionError.message);
      return { error: "Account created but failed to sign in. Please try signing in." };
    }

    console.log("Sign-up process completed successfully");
    return { success: true };
  } catch (error) {
    console.error("Sign up error:", error);
    return { error: "Failed to create account. Please check your database connection." };
  }
}

export async function signIn(formData: { email: string; password: string }) {
  console.log("signIn action called with:", { email: formData.email, password: "***" });

  try {
    console.log("Testing database connection before sign-in...");
    await ensureDbConnection();

    // Find user
    console.log("Finding user with email:", formData.email);
    const { data: user, error: queryError } = await supabase
      .from("users")
      .select("*")
      .eq("email", formData.email)
      .single();

    if (!user) {
      console.log("User not found with email:", formData.email);
      return { error: "Invalid email or password" };
    }

    // Verify password
    console.log("Verifying password...");
    const passwordMatch = await bcrypt.compare(formData.password, user.password);

    if (!passwordMatch) {
      console.log("Password does not match");
      return { error: "Invalid email or password" };
    }

    // Create session
    console.log("Creating session...");
    const { data: session, error: sessionError } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (sessionError) {
      console.error("Session creation failed:", sessionError.message);
      return { error: "Authentication successful but failed to create session. Please try again." };
    }

    console.log("Sign-in process completed successfully");
    return { success: true };
  } catch (error) {
    console.error("Sign in error:", error);
    return { error: "Failed to sign in. Please check your database connection." };
  }
}

export async function signOut() {
  try {
    await supabase.auth.signOut();
    await deleteSession();
    redirect("/");
  } catch (error) {
    console.error("Sign out error:", error);
    return { error: "Failed to sign out" };
  }
}

// Quote actions
export async function getQuotes() {
  try {
    const connected = await ensureDbConnection();
    if (!connected) {
      console.warn("Database connection failed, returning empty quotes array");
      return [];
    }

    const session = await getSession();
    if (!session) {
      redirect("/sign-in");
    }

    const { data: userQuotes, error } = await supabase
      .from("quotes")
      .select("*")
      .eq("userId", session.userId)
      .order("createdAt", { ascending: false });

    if (error) throw error;

    return userQuotes;
  } catch (error) {
    console.error("Get quotes error:", error);
    return [];
  }
}

export async function addQuote(quoteData: { text: string; author: string; category: string }) {
  try {
    await ensureDbConnection();

    const session = await getSession();

    if (!session) {
      redirect("/sign-in");
    }

    const { data: newQuote, error } = await supabase
      .from("quotes")
      .insert([
        {
          id: uuidv4(),
          userId: session.userId,
          text: quoteData.text,
          author: quoteData.author || "Unknown",
          category: quoteData.category,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return newQuote;
  } catch (error) {
    console.error("Add quote error:", error);
    throw new Error("Failed to add quote. Please check your database connection.");
  }
}

export async function updateQuote(quoteData: { id: string; text: string; author: string; category: string }) {
  try {
    await ensureDbConnection();

    const session = await getSession();

    if (!session) {
      redirect("/sign-in");
    }

    const { error } = await supabase
      .from("quotes")
      .update({
        text: quoteData.text,
        author: quoteData.author,
        category: quoteData.category,
      })
      .eq("id", quoteData.id)
      .eq("userId", session.userId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Update quote error:", error);
    throw new Error("Failed to update quote. Please check your database connection.");
  }
}

export async function deleteQuote(id: string) {
  try {
    await ensureDbConnection();

    const session = await getSession();

    if (!session) {
      redirect("/sign-in");
    }

    const { error } = await supabase
      .from("quotes")
      .delete()
      .eq("id", id)
      .eq("userId", session.userId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Delete quote error:", error);
    throw new Error("Failed to delete quote. Please check your database connection.");
  }
}

// Category actions
export async function getCategories() {
  try {
    await ensureDbConnection();

    const session = await getSession();

    if (!session) {
      redirect("/sign-in");
    }

    const { data: userCategories, error } = await supabase
      .from("categories")
      .select("name")
      .eq("userId", session.userId);

    if (error) throw error;

    return userCategories.map((category) => category.name);
  } catch (error) {
    console.error("Get categories error:", error);
    return [];
  }
}

export async function addCategory(name: string) {
  try {
    await ensureDbConnection();

    const session = await getSession();

    if (!session) {
      redirect("/sign-in");
    }

    // Check if category already exists
    const { data: existingCategory, error: queryError } = await supabase
      .from("categories")
      .select("*")
      .eq("userId", session.userId)
      .eq("name", name)
      .single();

    if (existingCategory) {
      return { success: true };
    }

    const { error } = await supabase.from("categories").insert([
      {
        id: uuidv4(),
        userId: session.userId,
        name: name.toLowerCase(),
      },
    ]);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Add category error:", error);
    throw new Error("Failed to add category. Please check your database connection.");
  }
}

// Export getCurrentUser directly from actions.ts
export async function getCurrentUser() {
  try {
    await ensureDbConnection();

    const session = await getSession();

    if (!session) {
      return null;
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("id, name, email, created_at") // <-- Use `created_at` here
      .eq("id", session.userId)
      .single();

    if (error) throw error;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.created_at, // <-- Use `created_at` here
    };
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}
