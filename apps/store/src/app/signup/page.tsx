"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Lock, Sparkles, ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push("/account");
      }
    });
  }, [router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Check if session was created automatically (email confirmation disabled)
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          setSuccessMsg("Registration successful! Entering dashboard...");
          setTimeout(() => {
            router.push("/account");
          }, 1500);
        } else {
          setSuccessMsg("Account registered! If email confirmation is required, please check your inbox to verify your email. Otherwise, you can now log in.");
          // Clear inputs
          setFullName("");
          setEmail("");
          setPhone("");
          setPassword("");
        }
      }
    } catch (err: any) {
      console.error("Signup failure:", err);
      setErrorMsg(err.message || "An unexpected error occurred during registration. Please try again.");
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
                CREATION PORTAL
              </span>
            </div>
            <h1 className="font-serif text-3xl font-black text-[#0F2E1E]">
              Create Account
            </h1>
            <p className="text-xs text-slate-400 font-light max-w-xs mx-auto leading-relaxed">
              Create an account for faster checkout, saved addresses, and order tracking.
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

          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-2.5 mb-6">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-[11px] font-semibold text-emerald-700 leading-relaxed">
                {successMsg}
              </p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block ml-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0F2E1E]/40" />
                <input
                  type="text"
                  required
                  placeholder="Shahzaib Kashmiri"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 focus:bg-white border border-slate-100 focus:border-[#FF9933] rounded-xl outline-none transition-all text-xs font-semibold text-slate-800 shadow-inner"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1">
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
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 focus:bg-white border border-slate-100 focus:border-[#FF9933] rounded-xl outline-none transition-all text-xs font-semibold text-slate-800 shadow-inner"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block ml-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0F2E1E]/40" />
                <input
                  type="tel"
                  required
                  placeholder="+91 XXXXX XXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 focus:bg-white border border-slate-100 focus:border-[#FF9933] rounded-xl outline-none transition-all text-xs font-semibold text-slate-800 shadow-inner"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0F2E1E]/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 bg-slate-50 focus:bg-white border border-slate-100 focus:border-[#FF9933] rounded-xl outline-none transition-all text-xs font-semibold text-slate-800 shadow-inner"
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
              className="w-full py-4 bg-[#0F2E1E] hover:bg-[#FF9933] text-[#FAF7F0] hover:text-[#0F2E1E] font-black rounded-xl text-xs uppercase tracking-widest transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  Create Account <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Login Redirect */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400 font-light">
              Already have an account?{" "}
              <Link href="/login" className="text-[#FF9933] hover:text-[#0F2E1E] font-bold transition-colors underline underline-offset-4">
                Sign In Instead
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
