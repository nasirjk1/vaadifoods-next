"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Sparkles, ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push("/account");
      }
    });
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        router.push("/account");
      }
    } catch (err: any) {
      console.error("Login failure:", err);
      setErrorMsg(err.message || "Invalid credentials. Please verify and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-slate-900 font-sans flex flex-col justify-between selection:bg-[#FF9933] selection:text-white">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-24 md:py-32">
        <div className="w-full max-w-md bg-white border border-[#0F2E1E]/5 rounded-[2.5rem] p-8 md:p-10 shadow-sm relative overflow-hidden">
          {/* Top Decorative Border Accent */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-vaadi-green via-[#FF9933] to-green-950"></div>

          <div className="text-center space-y-3 mb-8">
            <div className="flex items-center justify-center gap-1.5 text-[#FF9933]">
              <Sparkles className="w-3.5 h-3.5 fill-current animate-pulse" />
              <span className="font-black uppercase text-[10px] tracking-[0.25em] block">
                MEMBERS PORTAL
              </span>
            </div>
            <h1 className="font-serif text-3xl font-black text-[#0F2E1E]">
              Account Sign In
            </h1>
            <p className="text-xs text-slate-400 font-light max-w-xs mx-auto leading-relaxed">
              Log in to your account to keep track of your orders and saved addresses.
            </p>
          </div>

          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-2.5 mb-6 animate-shake">
              <ShieldCheck className="w-4 h-4 text-red-500 shrink-0 mt-0.5 rotate-180" />
              <p className="text-[11px] font-semibold text-red-700 leading-relaxed">
                {errorMsg}
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0F2E1E]/40" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 focus:bg-white border border-slate-100 focus:border-[#FF9933] rounded-xl outline-none transition-all text-xs font-semibold text-slate-800 shadow-inner"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0F2E1E]/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3.5 bg-slate-50 focus:bg-white border border-slate-100 focus:border-[#FF9933] rounded-xl outline-none transition-all text-xs font-semibold text-slate-800 shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 font-medium text-slate-400 hover:text-slate-600 outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#0F2E1E] hover:bg-[#FF9933] text-[#FAF7F0] hover:text-[#0F2E1E] font-black rounded-xl text-xs uppercase tracking-widest transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  Access Account <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Registration Redirect */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400 font-light">
              Don&apos;t have an account yet?{" "}
              <Link href="/signup" className="text-[#FF9933] hover:text-[#0F2E1E] font-bold transition-colors underline underline-offset-4">
                Register Here
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
