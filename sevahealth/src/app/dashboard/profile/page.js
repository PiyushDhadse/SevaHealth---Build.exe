"use client";
import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Camera,
  Save,
  FileText,
  Download,
  LogOut,
  Briefcase,
  Calendar,
  Check,
  AlertCircle,
  X,
} from "lucide-react";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "ASHA",
    lastName: "Supervisor",
    email: "supervisor@sevahealth.in",
    phone: "+91 98765 43210",
    role: "Senior Field Supervisor",
    location: "Rural Health Center, Block A",
    district: "Satara, Maharashtra",
    bio: "Dedicated to improving community health outcomes. Managing 24 ASHA workers across 12 villages since 2021.",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      // In a real app, trigger a toast here
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans text-slate-900">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            My Profile
          </h1>
          <p className="text-slate-500 mt-1">
            Manage your personal details and account security.
          </p>
        </div>

        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-colors shadow-sm">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isEditing || isSaving}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold shadow-lg transition-all active:scale-95 ${
              isEditing
                ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200"
                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            }`}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- LEFT COLUMN (Main Form) --- */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Personal Information */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                <User size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Personal Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                icon={<User size={16} />}
              />
              <InputField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">
                  Bio / Description
                </label>
                <textarea
                  name="bio"
                  rows="3"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* 2. Contact & Location */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                <MapPin size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Contact & Location
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                icon={<Mail size={16} />}
              />
              <InputField
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                icon={<Phone size={16} />}
              />
              <InputField
                label="Work Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                icon={<Briefcase size={16} />}
              />
              <InputField
                label="District / State"
                name="district"
                value={formData.district}
                onChange={handleChange}
                icon={<MapPin size={16} />}
              />
            </div>
          </div>

          {/* 3. Security (Password) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600">
                <Shield size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Security</h2>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-white p-2 rounded-lg border border-slate-200 text-slate-400">
                  <Shield size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Password</p>
                  <p className="text-xs text-slate-500">
                    Last changed 3 months ago
                  </p>
                </div>
              </div>
              <button className="px-4 py-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 rounded-lg text-sm font-bold shadow-sm transition-all w-full md:w-auto">
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN (Sidebar) --- */}
        <div className="space-y-6">
          {/* 1. Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

            <div className="relative mt-8 mb-4 group cursor-pointer">
              <div className="w-28 h-28 rounded-2xl bg-white p-1 shadow-lg rotate-3 group-hover:rotate-0 transition-transform duration-300">
                <div className="w-full h-full bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center relative">
                  {/* Placeholder Image or User Initials */}
                  <span className="text-3xl font-black text-indigo-300">
                    AS
                  </span>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" size={24} />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-lg shadow-sm border border-slate-100 text-indigo-600">
                <Camera size={14} />
              </div>
            </div>

            <h2 className="text-xl font-black text-slate-900">
              {formData.firstName} {formData.lastName}
            </h2>
            <p className="text-sm font-medium text-slate-500 mb-6">
              {formData.role}
            </p>

            <div className="w-full grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
              <div className="text-center p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <p className="text-xs text-slate-400 font-bold uppercase">
                  Joined
                </p>
                <p className="font-bold text-slate-700 flex items-center justify-center gap-1">
                  <Calendar size={12} /> Jan &apos;24
                </p>
              </div>
              <div className="text-center p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <p className="text-xs text-slate-400 font-bold uppercase">
                  Status
                </p>
                <p className="font-bold text-emerald-600 flex items-center justify-center gap-1">
                  <Check size={12} /> Active
                </p>
              </div>
            </div>
          </div>

          {/* 2. Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">
              Account Actions
            </h3>
            <div className="space-y-2">
              <ActionButton
                icon={<FileText size={16} />}
                label="Activity Logs"
              />
              <ActionButton
                icon={<Download size={16} />}
                label="Download Data"
              />

              <div className="h-px bg-slate-100 my-2"></div>

              <button className="w-full flex items-center justify-between px-4 py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-sm font-bold transition-colors group">
                <span className="flex items-center gap-3">
                  <LogOut
                    size={16}
                    className="text-rose-400 group-hover:text-rose-600"
                  />
                  Sign Out
                </span>
              </button>
            </div>
          </div>

          {/* 3. Support Widget */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-1">Need Help?</h3>
              <p className="text-indigo-100 text-sm mb-4">
                Contact IT support for account issues.
              </p>
              <button className="w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20 rounded-lg text-sm font-bold transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

function InputField({ label, name, type = "text", value, onChange, icon }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center justify-between">
        {label}
      </label>
      <div className="relative group">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
        />
        {icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

function ActionButton({ icon, label }) {
  return (
    <button className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-xl text-slate-600 text-sm font-medium transition-colors group">
      <span className="flex items-center gap-3">
        <span className="text-slate-400 group-hover:text-indigo-600 transition-colors">
          {icon}
        </span>
        {label}
      </span>
      <span className="text-slate-300 group-hover:translate-x-1 transition-transform">
        →
      </span>
    </button>
  );
}
