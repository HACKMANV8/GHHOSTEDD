// src/components/auth/LoginForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Lock, User } from "lucide-react";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // authService.login() saves token in localStorage + attaches to axios
      await authService.login(formData.username, formData.password);

      // Redirect to missions
      router.push("/missions");
    } catch (err: any) {
      // Show backend error message if available
      const message =
        err.response?.data?.message ||
        err.message ||
        "Invalid username or password";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#1a1a1a] border-gray-800">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Lock className="h-12 w-12 text-green-400" />
          </div>
          <CardTitle className="text-2xl text-center text-green-400">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            Enter your credentials to access the system
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert
                variant="destructive"
                className="bg-red-900/20 border-red-900 text-red-400"
              >
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-300">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Username
                </div>
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="SGT.KHAN"
                value={formData.username}
                onChange={handleChange}
                required
                autoCapitalize="characters"
                className="bg-[#0a0a0a] border-gray-700 text-white placeholder:text-gray-500 focus:border-green-400 uppercase font-mono tracking-wider"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="bg-[#0a0a0a] border-gray-700 text-white placeholder:text-gray-500 focus:border-green-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="text-center text-sm text-gray-400 mt-4">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-green-400 hover:text-green-300 font-semibold"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}