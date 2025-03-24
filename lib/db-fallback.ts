// This file provides a fallback implementation when the database connection fails

import { v4 as uuidv4 } from "uuid";

// Simple in-memory storage for fallback
const storage = {
  users: new Map(),
  quotes: new Map(),
  categories: new Map(),
  sessions: new Map(),
};

// Helper to save to localStorage in client components
export function saveToLocalStorage(key: string, data: any) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Failed to save ${key} to localStorage:`, error);
    }
  }
}

// Helper to load from localStorage in client components
export function loadFromLocalStorage(key: string) {
  if (typeof window !== "undefined") {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Failed to load ${key} from localStorage:`, error);
      return null;
    }
  }
  return null;
}

// Fallback database operations
export const fallbackDb = {
  // User operations
  createUser: (userData: any) => {
    const id = uuidv4();
    const user = { ...userData, id, createdAt: new Date() };
    storage.users.set(id, user);
    return user;
  },

  getUserByEmail: (email: string) => {
    for (const user of storage.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  },

  getUserById: (id: string) => {
    return storage.users.get(id) || null;
  },

  // Quote operations
  getQuotes: (userId: string) => {
    const userQuotes = [];
    for (const quote of storage.quotes.values()) {
      if (quote.user_id === userId) {
        userQuotes.push(quote);
      }
    }
    return userQuotes.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  addQuote: (quoteData: any) => {
    const id = uuidv4();
    const quote = { ...quoteData, id, createdAt: new Date() };
    storage.quotes.set(id, quote);
    return quote;
  },

  updateQuote: (id: string, userId: string, quoteData: any) => {
    const quote = storage.quotes.get(id);
    if (quote && quote.user_id === userId) {
      const updatedQuote = { ...quote, ...quoteData };
      storage.quotes.set(id, updatedQuote);
      return true;
    }
    return false;
  },

  deleteQuote: (id: string, userId: string) => {
    const quote = storage.quotes.get(id);
    if (quote && quote.user_id === userId) {
      storage.quotes.delete(id);
      return true;
    }
    return false;
  },

  // Category operations
  getCategories: (userId: string) => {
    const userCategories = [];
    for (const category of storage.categories.values()) {
      if (category.user_id === userId) {
        userCategories.push(category);
      }
    }
    return userCategories;
  },

  addCategory: (categoryData: any) => {
    const id = uuidv4();
    const category = { ...categoryData, id, createdAt: new Date() };
    storage.categories.set(id, category);
    return category;
  },

  // Session operations
  createSession: (sessionData: any) => {
    const id = uuidv4();
    const session = { ...sessionData, id, createdAt: new Date() };
    storage.sessions.set(id, session);
    return session;
  },

  getSession: (id: string) => {
    return storage.sessions.get(id) || null;
  },

  deleteSession: (id: string) => {
    return storage.sessions.delete(id);
  },
};
