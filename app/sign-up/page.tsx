"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/app/actions";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { QuoteIcon, UserPlus } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";
import Link from "next/link";
import { AuthIllustration } from "@/components/auth-illustration";

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Form validation
    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      // Call the signUp function from app/actions.ts
      const result = await signUp(formData);

      // Handle errors
      if (result.error) {
        setError(result.error);
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      } else {
        // Success: Redirect to dashboard
        toast({
          title: "Account created",
          description: "Your account has been created successfully.",
        });
        router.push("/dashboard");
      }
    } catch (err) {
      // Handle unexpected errors
      setError("An unexpected error occurred");
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center p-4 relative pt-16">
      {/* Top Bar */}
      <div className="absolute left-4 top-4 md:left-8 md:top-8">
        <Link href="/" className="flex items-center gap-2">
          <QuoteIcon className="h-5 w-5 text-primary" />
          <span className="font-semibold text-lg">QuoteKeeper</span>
        </Link>
      </div>
      <div className="absolute right-4 top-4 md:right-8 md:top-8">
        <ThemeToggle />
      </div>

      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-2/3 items-center justify-center p-12">
      <AuthIllustration type="signin" />
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="w-full lg:w-2/3 max-w-2xl flex flex-col items-center mt-6">
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-primary/20 shadow-[0px_4px_10px_rgba(64,224,208,0.5)] backdrop-blur-sm bg-card/80">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-full bg-secondary text-secondary-foreground">
                  <UserPlus className="h-5 w-5" />
                </div>
                <CardTitle className="text-2xl">Create an account</CardTitle>
              </div>
              <CardDescription>Enter your details to sign up</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit} className="w-full">
              <CardContent className="grid gap-4">
                {error && (
                  <div className="bg-red-100 text-red-700 p-3 rounded-md">
                    {error}
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-gradient-to-r from-secondary to-terracotta-light text-white shadow-lg"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </CardFooter>
            </form>
          </Card>
          <div className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
