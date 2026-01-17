"use client";
import { useState } from "react";
import {
  Save,
  Bell,
  Globe,
  Database,
  Shield,
  CloudOff,
  RefreshCw,
  Smartphone,
  Mail,
  Check,
  AlertCircle,
  Download,
  Trash2,
  Moon,
  Zap,
} from "lucide-react";

export default function SettingsPage() {
  // --- STATE ---
  const [settings, setSettings] = useState({
    // Notification Settings
    emailNotifications: true,
    smsAlerts: true,
    pushNotifications: false,
    dailySummary: true,

    // Application Settings
    offlineMode: true,
    autoSync: true,
    syncFrequency: "hourly",
    dataRetention: "30",

    // Privacy Settings
    shareAnalytics: true,
    anonymizeData: false,
    exportData: false,
  });

  const [syncStatus, setSyncStatus] = useState("idle"); // 'idle', 'syncing', 'success', 'error'
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // --- HANDLERS ---
  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    setHasUnsavedChanges(true);
  };

  const handleSelectChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleManualSync = () => {
    setSyncStatus("syncing");
    setTimeout(() => {
      setSyncStatus("success");
      setTimeout(() => setSyncStatus("idle"), 2000);
    }, 1500);
  };

  const handleSaveSettings = () => {
    setHasUnsavedChanges(false);
    // Simulate save
    const btn = document.getElementById("save-btn");
    if (btn) {
      btn.innerText = "Saved!";
      setTimeout(() => (btn.innerText = "Save Changes"), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans text-slate-900">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Settings & Preferences
          </h1>
          <p className="text-slate-500 mt-1">
            Manage your notification preferences, data sync, and privacy
            controls.
          </p>
        </div>

        <button
          id="save-btn"
          onClick={handleSaveSettings}
          disabled={!hasUnsavedChanges}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95 ${
            hasUnsavedChanges
              ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200"
              : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
          }`}
        >
          <Save size={20} />
          Save Changes
        </button>
      </div>

      {/* --- SYNC STATUS BANNER --- */}
      {settings.offlineMode && (
        <div className="mb-8 bg-white border border-slate-200 rounded-2xl p-1 shadow-sm flex items-stretch overflow-hidden">
          <div className="bg-blue-50 w-2 shrink-0"></div>
          <div className="flex-1 p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <CloudOff size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">
                  Offline Mode Active
                </h3>
                <p className="text-sm text-slate-500">
                  Data is stored locally and synced when connection is
                  available.
                </p>
              </div>
            </div>

            <button
              onClick={handleManualSync}
              disabled={syncStatus === "syncing"}
              className="px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 min-w-[140px] justify-center"
            >
              {syncStatus === "syncing" ? (
                <>
                  <RefreshCw size={16} className="animate-spin" /> Syncing...
                </>
              ) : syncStatus === "success" ? (
                <>
                  <Check size={16} /> Synced!
                </>
              ) : (
                <>
                  <RefreshCw size={16} /> Sync Now
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* --- SETTINGS GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. NOTIFICATIONS */}
        <SettingsCard
          title="Notifications"
          icon={<Bell size={20} />}
          color="amber"
        >
          <ToggleRow
            label="Email Notifications"
            desc="Receive weekly digests and updates."
            icon={<Mail size={18} />}
            checked={settings.emailNotifications}
            onChange={() => handleToggle("emailNotifications")}
          />
          <ToggleRow
            label="SMS Alerts"
            desc="Critical alerts sent to your phone."
            icon={<Smartphone size={18} />}
            checked={settings.smsAlerts}
            onChange={() => handleToggle("smsAlerts")}
          />
          <ToggleRow
            label="Daily Summary"
            desc="End-of-day patient activity report."
            icon={<Moon size={18} />}
            checked={settings.dailySummary}
            onChange={() => handleToggle("dailySummary")}
          />
        </SettingsCard>

        {/* 2. APPLICATION */}
        <SettingsCard
          title="Application Behavior"
          icon={<Globe size={20} />}
          color="indigo"
        >
          <ToggleRow
            label="Offline Mode"
            desc="Enable full functionality without internet."
            icon={<Zap size={18} />}
            checked={settings.offlineMode}
            onChange={() => handleToggle("offlineMode")}
          />
          <ToggleRow
            label="Auto Sync"
            desc="Automatically sync when online."
            icon={<RefreshCw size={18} />}
            checked={settings.autoSync}
            onChange={() => handleToggle("autoSync")}
          />

          <div className="pt-4 border-t border-slate-50 space-y-4">
            <SelectRow
              label="Sync Frequency"
              value={settings.syncFrequency}
              onChange={(e) =>
                handleSelectChange("syncFrequency", e.target.value)
              }
              options={[
                { label: "Real-time (WiFi only)", value: "realtime" },
                { label: "Every Hour", value: "hourly" },
                { label: "Once Daily", value: "daily" },
              ]}
            />
            <SelectRow
              label="Data Retention"
              value={settings.dataRetention}
              onChange={(e) =>
                handleSelectChange("dataRetention", e.target.value)
              }
              options={[
                { label: "7 Days", value: "7" },
                { label: "30 Days", value: "30" },
                { label: "90 Days", value: "90" },
                { label: "Keep Forever", value: "forever" },
              ]}
            />
          </div>
        </SettingsCard>

        {/* 3. PRIVACY & DATA */}
        <SettingsCard
          title="Privacy & Data"
          icon={<Shield size={20} />}
          color="emerald"
        >
          <ToggleRow
            label="Share Analytics"
            desc="Help improve SevaHealth anonymously."
            icon={<Database size={18} />}
            checked={settings.shareAnalytics}
            onChange={() => handleToggle("shareAnalytics")}
          />
          <ToggleRow
            label="Anonymize Data"
            desc="Remove PII from local exports."
            icon={<Shield size={18} />}
            checked={settings.anonymizeData}
            onChange={() => handleToggle("anonymizeData")}
          />

          <div className="pt-4 mt-2 border-t border-slate-50 grid grid-cols-1 md:grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-sm transition-colors border border-slate-200">
              <Download size={16} /> Export Data
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-sm transition-colors border border-red-100">
              <Trash2 size={16} /> Clear Cache
            </button>
          </div>
        </SettingsCard>

        {/* 4. STORAGE USAGE */}
        <SettingsCard
          title="Storage Usage"
          icon={<Database size={20} />}
          color="rose"
        >
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
            <div className="flex justify-between items-end mb-2">
              <span className="font-bold text-slate-700 text-sm">
                Used Space
              </span>
              <span className="font-black text-slate-900 text-xl">
                1.2 GB{" "}
                <span className="text-slate-400 text-sm font-medium">
                  / 5 GB
                </span>
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 rounded-full h-3 mb-4 flex overflow-hidden">
              <div
                className="bg-indigo-500 h-full"
                style={{ width: "45%" }}
              ></div>
              <div
                className="bg-emerald-500 h-full"
                style={{ width: "20%" }}
              ></div>
              <div
                className="bg-amber-400 h-full"
                style={{ width: "10%" }}
              ></div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-3 gap-2 text-xs font-bold text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                Patients (850 MB)
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                Reports (320 MB)
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                Logs (30 MB)
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-3 p-3 bg-amber-50 rounded-lg text-amber-800 text-xs border border-amber-100">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <p>
              Storage is optimized automatically. Old logs are deleted after 30
              days based on your retention settings.
            </p>
          </div>
        </SettingsCard>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

function SettingsCard({ title, icon, children, color }) {
  const colors = {
    amber: "bg-amber-100 text-amber-600",
    indigo: "bg-indigo-100 text-indigo-600",
    emerald: "bg-emerald-100 text-emerald-600",
    rose: "bg-rose-100 text-rose-600",
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2.5 rounded-xl ${colors[color]}`}>{icon}</div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function ToggleRow({ label, desc, icon, checked, onChange }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-start gap-3">
        <div
          className={`mt-1 text-slate-400 group-hover:text-indigo-500 transition-colors`}
        >
          {icon}
        </div>
        <div>
          <p className="font-bold text-slate-700 text-sm">{label}</p>
          <p className="text-xs text-slate-500">{desc}</p>
        </div>
      </div>
      <button
        onClick={onChange}
        className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${
          checked ? "bg-indigo-600" : "bg-slate-200"
        }`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
            checked ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function SelectRow({ label, value, onChange, options }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none appearance-none cursor-pointer transition-all"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
          <svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L5 5L9 1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
