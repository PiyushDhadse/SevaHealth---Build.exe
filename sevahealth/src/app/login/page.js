"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Activity,
  AlertCircle,
  UserPlus,
  Zap,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // MOCK LOGIN HANDLER
  // Accepts any credentials and redirects based on email content
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter an email and password to simulate login.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      // 1. Simulate Network Delay (1 second)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 2. Determine Role based on email (Simple Mock Logic)
      // If email contains "admin" -> Admin, "asha" -> Asha Worker, else -> Doctor
      let role = "doctor";
      let redirectPath = "/dashboard/doctor";

      if (email.toLowerCase().includes("admin")) {
        role = "admin";
        redirectPath = "/dashboard/admin";
      } else if (email.toLowerCase().includes("asha")) {
        role = "asha_worker";
        redirectPath = "/dashboard/asha";
      } else if (email.toLowerCase().includes("nurse")) {
        role = "nurse";
        redirectPath = "/dashboard/nurse";
      }

      // 3. Create Mock User Session
      const mockUser = {
        id: "mock-user-123",
        email: email,
        name: role === "doctor" ? "Dr. Mock User" : "Mock Staff Member",
        role: role,
        user_type: role,
        logged_in: true,
        last_login: new Date().toISOString(),
      };

      // 4. Store in LocalStorage (Simulates Session)
      localStorage.setItem("current_user", JSON.stringify(mockUser));
      localStorage.setItem("auth_user", JSON.stringify(mockUser));

      console.log("✅ Mock Login Successful:", mockUser);

      // 5. Redirect
      router.push(redirectPath);
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  // Helper to quick-fill form for testing
  const fillCredentials = (role) => {
    if (role === "doctor") {
      setEmail("doctor@seva.com");
      setPassword("demo123");
    } else if (role === "asha") {
      setEmail("asha@seva.com");
      setPassword("demo123");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-600 to-slate-50 -z-10" />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-white/50 p-8 md:p-10 animate-in fade-in zoom-in-95 duration-300">
        {/* Header Section */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-black text-slate-800 tracking-tight">
              SevaHealth
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-500 font-medium">
            Enter any details to access the dashboard
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Status Alerts */}
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 text-sm text-rose-700 animate-in slide-in-from-top-2">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none">
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="any@email.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Password
              </label>
              <span className="text-xs font-medium text-slate-400">
                Any password works
              </span>
            </div>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Accessing Dashboard...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 font-medium">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
            >
              Create Account
            </Link>
          </p>
        </div>

        {/* Quick Fill Buttons (For ease of use since logic is mocked) */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 text-center uppercase tracking-wider font-bold mb-3">
            Quick Fill (Dev Mode)
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => fillCredentials("doctor")}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 rounded-lg text-xs font-bold transition-all"
            >
              <Zap size={14} /> Doctor
            </button>
            <button
              type="button"
              onClick={() => fillCredentials("asha")}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 border border-slate-200 hover:border-emerald-200 rounded-lg text-xs font-bold transition-all"
            >
              <UserPlus size={14} /> ASHA Worker
            </button>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-6 text-center w-full pointer-events-none">
        <p className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1">
          <ShieldCheck size={12} />
          Secure HIPAA Compliant Login
        </p>
      </div>
    </div>
  );
}
