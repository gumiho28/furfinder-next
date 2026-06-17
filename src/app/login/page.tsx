"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
      } else {
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            }
          }
        });
        if (error) throw error;
        setIsLogin(true);
        setError("Registration successful! Please check your email to verify or just log in.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f7f6] dark:bg-[#2c2c36] p-4 text-[#333] dark:text-[#f5f5f5] font-sans">
      <div className="bg-[#ffffff] dark:bg-[#383844] p-8 rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.05)] w-full max-w-md border border-[#e1e4e8] dark:border-[#555566]">
        <h2 className="text-2xl font-bold text-[#003366] dark:text-[#82b1ff] mb-6 text-center">
          {isLogin ? "Welcome Back" : "Create an Account"}
        </h2>

        {error && (
          <div className={`p-3 mb-4 text-sm rounded ${error.includes('successful') ? 'bg-[#d4edda] text-[#155724]' : 'bg-[#f8d7da] text-[#721c24]'}`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-[#e1e4e8] dark:border-[#555566] rounded focus:outline-none focus:ring-2 focus:ring-[#d4af37] bg-transparent"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-[#e1e4e8] dark:border-[#555566] rounded focus:outline-none focus:ring-2 focus:ring-[#d4af37] bg-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-[#e1e4e8] dark:border-[#555566] rounded focus:outline-none focus:ring-2 focus:ring-[#d4af37] bg-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-[#003366] dark:bg-[#82b1ff] text-white dark:text-[#2c2c36] font-semibold rounded hover:opacity-90 transition disabled:opacity-50 mt-4"
          >
            {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="text-[#d4af37] hover:underline font-medium"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
