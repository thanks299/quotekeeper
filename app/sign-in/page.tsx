"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/app/actions";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { QuoteIcon, LogIn } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";
import Link from "next/link";
import { AuthIllustration } from "@/components/auth-illustration";

export default function SignInPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn(formData);
      if (result.error) {
        setError(result.error);
        toast({ variant: "destructive", title: "Error", description: result.error });
      } else {
        toast({ title: "Welcome back!", description: "You have successfully signed in." });
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center p-4">
      {/* Top Left - QuoteKeeper Logo */}
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <Button variant="ghost" className="flex items-center gap-1">
          <QuoteIcon className="h-5 w-5 text-primary" />
          <span>QuoteKeeper</span>
        </Button>
      </Link>

      {/* Top Right - Dark Mode Toggle */}
      <div className="absolute right-4 top-4 md:right-8 md:top-8">
        <ThemeToggle />
      </div>

      {/* Left Side - Illustration (Now positioned to the far left) */}
      <div className="hidden lg:flex lg:w-1/2 h-full justify-start p-16">
        <AuthIllustration type="signin" />
      </div>

      {/* Right Side - Sign In Form */}
      <div className="w-full lg:w-1/2 max-w-2xl mt-8">
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-primary/20 shadow-[#E2725B] shadow-lg backdrop-blur-sm bg-card/80 p-8">
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-full bg-primary text-primary-foreground">
                  <LogIn className="h-5 w-5" />
                </div>
                <CardTitle className="text-3xl">Sign in</CardTitle>
              </div>
              <CardDescription className="text-lg">Enter your email and password to access your account</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="grid gap-6">
                {error && (
                  <motion.div
                    className="bg-destructive/15 text-destructive text-sm p-3 rounded-md"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {error}
                  </motion.div>
                )}
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="transition-all duration-200 focus:ring-primary bg-background/50 text-lg p-3"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="transition-all duration-200 focus:ring-primary bg-background/50 text-lg p-3"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-gradient-to-r from-primary to-turquoise-light text-white shadow-lg text-lg py-3"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
                <Link
                  href="/forgot-password"
                  className="text-sm text-center text-muted-foreground hover:text-primary transition-colors mt-2 w-full"
                >
                  Forgot your password?
                </Link>
              </CardFooter>
            </form>
          </Card>
          <div className="text-center text-sm mt-6 flex items-center justify-center gap-1">
            <span>Don&apos;t have an account?</span>
            <Link href="/sign-up" className="text-terracotta hover:underline underline-offset-2 font-medium">
              Sign up
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
