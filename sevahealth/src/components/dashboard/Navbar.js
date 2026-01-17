"use client";
import { useState, useEffect } from "react";
import {
  Search,
  Bell,
  Wifi,
  WifiOff,
  RefreshCw,
  Menu,
  User,
  Check,
  Globe,
  Moon,
  Sun,
  ChevronDown,
  LogOut,
  Settings,
  X,
  AlertCircle,
  Info,
} from "lucide-react";

// --- INTERNAL TOAST COMPONENT (Self-contained for this demo) ---
const Toast = ({ message, type, onClose }) => {
  const bgColors = {
    success: "bg-emerald-600",
    error: "bg-rose-600",
    info: "bg-slate-800",
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl shadow-slate-200 text-white ${bgColors[type] || bgColors.info} animate-in slide-in-from-top-2 fade-in duration-300 min-w-[300px]`}
    >
      {type === "success" && <Check size={18} />}
      {type === "error" && <AlertCircle size={18} />}
      {type === "info" && <Info size={18} />}
      <span className="text-sm font-bold flex-1">{message}</span>
      <button onClick={onClose} className="opacity-80 hover:opacity-100">
        <X size={16} />
      </button>
    </div>
  );
};

export default function Navbar({ setSidebarOpen }) {
  // --- STATE ---
  const [isOnline, setIsOnline] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState("English");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Toast State
  const [toasts, setToasts] = useState([]);

  // Mock Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New patient registered", time: "5 min ago", read: false },
    {
      id: 2,
      title: "Urgent: Patient follow-up",
      time: "1 hour ago",
      read: false,
    },
    { id: 3, title: "Monthly report due", time: "2 hours ago", read: true },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // --- ACTIONS ---

  const addToast = (msg, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Simulate theme switch for demo purposes
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
      addToast("Dark mode enabled", "info");
    } else {
      document.documentElement.classList.remove("dark");
      addToast("Light mode enabled", "info");
    }
  };

  const handleSync = () => {
    if (!isOnline) {
      addToast("Cannot sync while offline", "error");
      return;
    }

    setIsSyncing(true);
    // Simulate Network Request
    setTimeout(() => {
      setIsSyncing(false);
      addToast("Data synchronized successfully", "success");
    }, 1500);
  };

  const toggleNetwork = () => {
    const newState = !isOnline;
    setIsOnline(newState);
    addToast(
      newState ? "You are back Online" : "You are now Offline",
      newState ? "success" : "error",
    );
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setShowLangMenu(false);
    addToast(`Language changed to ${lang}`, "success");
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast("All notifications marked as read", "success");
  };

  return (
    <>
      {/* --- TOAST CONTAINER (Fixed Position) --- */}
      <div className="fixed top-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <Toast
              message={t.msg}
              type={t.type}
              onClose={() =>
                setToasts((prev) => prev.filter((i) => i.id !== t.id))
              }
            />
          </div>
        ))}
      </div>

      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between gap-4">
          {/* 1. LEFT: Toggle & Search */}
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            <button
              onClick={() => setSidebarOpen?.(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="relative flex-1 hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="search"
                placeholder="Search patients, workers, or reports..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* 2. RIGHT: Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* A. Language Selector */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-600 text-sm font-bold transition-colors"
              >
                <Globe size={18} />
                <span>{language}</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${showLangMenu ? "rotate-180" : ""}`}
                />
              </button>

              {showLangMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowLangMenu(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 py-1">
                    {["English", "Hindi", "Marathi", "Gujarati"].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => handleLanguageChange(lang)}
                        className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-slate-50 flex items-center justify-between ${language === lang ? "text-indigo-600 bg-indigo-50" : "text-slate-700"}`}
                      >
                        {lang}
                        {language === lang && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* B. Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
              title={
                isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
              }
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* C. Network / Sync Status */}
            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              <button
                onClick={toggleNetwork}
                className={`p-1.5 rounded-md transition-all ${
                  isOnline
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
                title="Toggle Online/Offline"
              >
                {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
              </button>

              <button
                onClick={handleSync}
                disabled={!isOnline || isSyncing}
                className={`p-1.5 rounded-md transition-all flex items-center gap-2 ${
                  isSyncing
                    ? "bg-indigo-100 text-indigo-600"
                    : "text-slate-500 hover:text-indigo-600 hover:bg-white/50"
                }`}
                title="Sync Data"
              >
                <RefreshCw
                  size={16}
                  className={isSyncing ? "animate-spin" : ""}
                />
              </button>
            </div>

            {/* D. Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
                )}
              </button>

              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                      <h3 className="font-bold text-slate-800">
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!n.read ? "bg-indigo-50/40" : ""}`}
                          >
                            <div className="flex gap-3">
                              <div
                                className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? "bg-indigo-500" : "bg-slate-300"}`}
                              />
                              <div>
                                <p
                                  className={`text-sm ${!n.read ? "font-bold text-slate-800" : "font-medium text-slate-600"}`}
                                >
                                  {n.title}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                  {n.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-slate-400 text-sm">
                          No new notifications
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* E. Profile Dropdown (Preserved Structure, Updated Style) */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-bold text-slate-800 leading-none">
                    Supervisor
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">
                    Admin
                  </p>
                </div>
              </button>

              {showProfileMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-sm font-bold text-slate-900">
                        ASHA Supervisor
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        supervisor@sevahealth.in
                      </p>
                    </div>
                    <div className="p-1">
                      <a
                        href="/dashboard/profile"
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg group"
                      >
                        <User
                          size={16}
                          className="text-slate-400 group-hover:text-indigo-600"
                        />
                        Your Profile
                      </a>
                      <a
                        href="/dashboard/settings"
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg group"
                      >
                        <Settings
                          size={16}
                          className="text-slate-400 group-hover:text-indigo-600"
                        />
                        Settings
                      </a>
                    </div>
                    <div className="p-1 border-t border-slate-100">
                      <button
                        onClick={() => (window.location.href = "/login")}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
