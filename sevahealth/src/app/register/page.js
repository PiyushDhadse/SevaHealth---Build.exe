"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  FileBadge,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  UserCog,
  UserCheck,
  Activity,
  Wand2,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    pincode: "",
    governmentId: "",
    role: "doctor",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // MOCK REGISTRATION HANDLER
  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, role, password, confirmPassword } = formData;

    // Basic Validation
    if (!name || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      // 1. Simulate Network Delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 2. Determine Dashboard Route
      let redirectPath = "/dashboard";
      if (role === "doctor") redirectPath = "/dashboard/doctor";
      else if (role === "asha_worker") redirectPath = "/dashboard/asha";
      else if (role === "admin") redirectPath = "/dashboard/admin";
      else if (role === "nurse") redirectPath = "/dashboard/nurse";

      // 3. Create Mock User Object
      const mockUser = {
        id: `mock-user-${Date.now()}`,
        email: email,
        name: name,
        role: role,
        user_type: role,
        logged_in: true,
        last_login: new Date().toISOString(),
      };

      // 4. Store Session (Mock)
      localStorage.setItem("current_user", JSON.stringify(mockUser));
      localStorage.setItem("auth_user", JSON.stringify(mockUser));

      console.log("✅ Mock Registration Successful:", mockUser);
      setSuccess("Account created successfully! Redirecting...");

      // 5. Redirect
      setTimeout(() => {
        router.push(redirectPath);
      }, 1000);
    } catch (err) {
      console.error("Registration error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      if (!success) setIsLoading(false);
    }
  };

  // Helper to fill demo data
  const fillDemoData = () => {
    setFormData({
      name: "Dr. New User",
      email: `doctor-${Math.floor(Math.random() * 1000)}@seva.com`,
      phone: "9876543210",
      city: "Mumbai",
      country: "India",
      pincode: "400001",
      governmentId: "MED-ID-8829",
      role: "doctor",
      password: "demo123",
      confirmPassword: "demo123",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-indigo-600 to-slate-50 -z-10" />

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-white/50 animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-50/50 p-8 border-b border-slate-100 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black text-slate-800 tracking-tight">
              SevaHealth
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900">
            Create your Account
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Join our healthcare network today
          </p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 text-sm text-rose-700 animate-in slide-in-from-top-2">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3 text-sm text-emerald-700 animate-in slide-in-from-top-2">
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
              <p className="font-medium">{success}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            {/* --- Personal Info Section --- */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <UserCheck size={14} /> Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="relative group">
                  <div className="absolute left-3 top-3.5 text-slate-400">
                    <User size={18} />
                  </div>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name *"
                    required
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* Email */}
                <div className="relative group">
                  <div className="absolute left-3 top-3.5 text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address *"
                    required
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* Phone */}
                <div className="relative group">
                  <div className="absolute left-3 top-3.5 text-slate-400">
                    <Phone size={18} />
                  </div>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* Role Selection */}
                <div className="relative group">
                  <div className="absolute left-3 top-3.5 text-slate-400">
                    {formData.role === "doctor" ? (
                      <Stethoscope size={18} />
                    ) : (
                      <UserCog size={18} />
                    )}
                  </div>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="doctor">Doctor</option>
                    <option value="asha_worker">ASHA Worker</option>
                    <option value="nurse">Nurse</option>
                    <option value="admin">Administrator</option>
                  </select>
                  <div className="absolute right-3 top-3.5 text-slate-400 pointer-events-none">
                    <ArrowRight size={14} className="rotate-90" />
                  </div>
                </div>
              </div>
            </div>

            {/* --- Location & ID Section --- */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Building size={14} /> Location & Verification
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative group md:col-span-1">
                  <div className="absolute left-3 top-3.5 text-slate-400">
                    <MapPin size={18} />
                  </div>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="relative group md:col-span-1">
                  <input
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Country"
                    disabled={isLoading}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="relative group md:col-span-1">
                  <input
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="Pincode"
                    disabled={isLoading}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="relative group">
                <div className="absolute left-3 top-3.5 text-slate-400">
                  <FileBadge size={18} />
                </div>
                <input
                  name="governmentId"
                  value={formData.governmentId}
                  onChange={handleChange}
                  placeholder="Government ID / Medical License Number"
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* --- Security Section --- */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <ShieldCheck size={14} /> Security
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative group">
                  <div className="absolute left-3 top-3.5 text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password *"
                    required
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="relative group">
                  <div className="absolute left-3 top-3.5 text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password *"
                    required
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Complete Registration <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Controls */}
          <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-6">
            <button
              onClick={fillDemoData}
              disabled={isLoading}
              className="text-xs font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-1 transition-colors uppercase tracking-wide"
            >
              <Wand2 size={14} /> Quick Fill (Dev Mode)
            </button>

            <p className="text-sm text-slate-500 font-medium">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-6 text-center w-full pointer-events-none hidden md:block">
        <p className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1">
          <ShieldCheck size={12} />
          Secure HIPAA Compliant Registration
        </p>
      </div>
    </div>
  );
}
