"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.push("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-[#1E3A2F]/10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-[#1E3A2F] mb-2">Vaadi Admin</h1>
          <p className="text-[#1E3A2F]/60">Sign in to manage your store</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#1E3A2F] mb-2">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#1E3A2F]/40" />
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-3 border border-[#1E3A2F]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]/20 transition-all"
                placeholder="admin@vaadi.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1E3A2F] mb-2">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#1E3A2F]/40" />
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-3 border border-[#1E3A2F]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]/20 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1E3A2F] text-white py-3 rounded-xl font-medium hover:bg-[#1E3A2F]/90 transition-colors disabled:opacity-70 mt-2"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
