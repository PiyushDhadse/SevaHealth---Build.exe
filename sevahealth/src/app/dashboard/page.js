"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  Activity,
  UserCheck,
  AlertTriangle,
  RefreshCw,
  UserPlus,
  ArrowUpRight,
  MoreVertical,
  Calendar,
  CheckCircle2,
  X,
  Phone,
  FileText,
  XCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

// --- MOCK DATA FOR CHART ---
const chartData = [
  { name: "Mon", visits: 24, critical: 4 },
  { name: "Tue", visits: 38, critical: 6 },
  { name: "Wed", visits: 32, critical: 3 },
  { name: "Thu", visits: 45, critical: 8 },
  { name: "Fri", visits: 62, critical: 12 },
  { name: "Sat", visits: 55, critical: 9 },
  { name: "Sun", visits: 48, critical: 5 },
];

export default function DashboardMain() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // --- NOTIFICATION SYSTEM ---
  const addNotification = (title, message, type = "success") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  const handleManualSync = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    addNotification(
      "Sync Started",
      "Uploading offline records to server...",
      "info",
    );

    setTimeout(() => {
      setIsSyncing(false);
      addNotification(
        "Sync Complete",
        "All patient records are up to date.",
        "success",
      );
    }, 2500);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-50/50 p-4 md:p-8 space-y-8 font-sans text-slate-900">
      {/* --- NOTIFICATION TOAST CONTAINER --- */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {notifications.map((n) => (
            <Toast
              key={n.id}
              {...n}
              onClose={() =>
                setNotifications((prev) =>
                  prev.filter((item) => item.id !== n.id),
                )
              }
            />
          ))}
        </AnimatePresence>
      </div>

      {/* --- HERO SECTION --- */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 md:p-10 text-white shadow-xl shadow-indigo-200/40"
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-slate-400 text-xs font-semibold tracking-wide uppercase">
                District Overview
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Welcome back,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">
                Dr. Rao
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-lg">
              You have{" "}
              <span className="text-white font-semibold">
                4 high-risk patients
              </span>{" "}
              requiring attention today.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleManualSync}
              className="group relative flex items-center gap-3 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all active:scale-95"
            >
              <RefreshCw
                size={20}
                className={`text-indigo-400 transition-all duration-700 ${isSyncing ? "animate-spin" : "group-hover:rotate-180"}`}
              />
              <span className="font-semibold text-sm">
                {isSyncing ? "Syncing..." : "Sync Data"}
              </span>
            </button>

            <button className="flex items-center gap-3 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all active:scale-95">
              <UserPlus size={20} className="text-white" />
              <span className="font-semibold text-sm">New Patient</span>
            </button>
          </div>
        </div>

        {/* Abstract Backgrounds */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
      </motion.section>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          delay={0.1}
          icon={<Users />}
          label="Total Patients"
          value="1,248"
          trend="+12%"
          color="indigo"
        />
        <StatCard
          delay={0.2}
          icon={<Activity />}
          label="Screenings Today"
          value="89"
          trend="+5%"
          color="cyan"
        />
        <StatCard
          delay={0.3}
          icon={<UserCheck />}
          label="ASHA Active"
          value="47"
          trend="Stable"
          color="emerald"
        />
        <StatCard
          delay={0.4}
          icon={<AlertTriangle />}
          label="Pending Alerts"
          value="23"
          trend="+3"
          color="rose"
        />
      </div>

      {/* --- MAIN DASHBOARD CONTENT --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CHART SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                Weekly Screening Trends
              </h3>
              <p className="text-sm text-slate-500">
                Patient visits vs Critical cases
              </p>
            </div>
            <div className="flex gap-2 text-sm">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>{" "}
                Visits
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>{" "}
                Critical
              </span>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorCritical"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#fff" }}
                  cursor={{
                    stroke: "#cbd5e1",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="visits"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorVisits)"
                />
                <Area
                  type="monotone"
                  dataKey="critical"
                  stroke="#f43f5e"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorCritical)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* CRITICAL PATIENTS LIST */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800">
              Critical Attention
            </h3>
            <button className="text-slate-400 hover:text-indigo-600 transition-colors">
              <Calendar size={20} />
            </button>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[400px]">
            <PatientItem
              id={1}
              name="Rajesh Patel"
              diagnosis="Severe Hypertension"
              time="10:30 AM"
              severity="high"
              activeMenuId={activeMenuId}
              setActiveMenuId={setActiveMenuId}
              onAction={addNotification}
            />
            <PatientItem
              id={2}
              name="Meena Sharma"
              diagnosis="High Fever (104°F)"
              time="11:15 AM"
              severity="high"
              activeMenuId={activeMenuId}
              setActiveMenuId={setActiveMenuId}
              onAction={addNotification}
            />
            <PatientItem
              id={3}
              name="Anil Kumar"
              diagnosis="Diabetic Ketoacidosis"
              time="01:00 PM"
              severity="med"
              activeMenuId={activeMenuId}
              setActiveMenuId={setActiveMenuId}
              onAction={addNotification}
            />
            <PatientItem
              id={4}
              name="Sunita Rao"
              diagnosis="Post-natal Checkup"
              time="02:30 PM"
              severity="med"
              activeMenuId={activeMenuId}
              setActiveMenuId={setActiveMenuId}
              onAction={addNotification}
            />
            <PatientItem
              id={5}
              name="Vikram Singh"
              diagnosis="Chest Pain"
              time="03:45 PM"
              severity="high"
              activeMenuId={activeMenuId}
              setActiveMenuId={setActiveMenuId}
              onAction={addNotification}
            />
          </div>

          <button className="w-full mt-6 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all">
            View Full Patient List
          </button>
        </motion.div>
      </div>

      <div className="text-center text-slate-400 text-xs py-4">
        Last updated: {new Date().toLocaleTimeString()} • Secure connection
        established
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

function StatCard({ icon, label, value, trend, color, delay }) {
  const colorStyles = {
    indigo: "bg-indigo-50 text-indigo-600",
    cyan: "bg-cyan-50 text-cyan-600",
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colorStyles[color]}`}>
          {React.cloneElement(icon, { size: 24 })}
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
          {trend !== "Stable" && <ArrowUpRight size={12} />}
          {trend}
        </div>
      </div>
      <p className="text-slate-500 font-medium text-sm mb-1">{label}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
    </motion.div>
  );
}

function PatientItem({
  id,
  name,
  diagnosis,
  time,
  severity,
  activeMenuId,
  setActiveMenuId,
  onAction,
}) {
  const isMenuOpen = activeMenuId === id;
  const severityColor =
    severity === "high"
      ? "bg-rose-100 text-rose-700"
      : "bg-amber-100 text-amber-700";

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setActiveMenuId(isMenuOpen ? null : id);
  };

  const handleAction = (action) => {
    onAction("Action Taken", `${action} for ${name}`, "success");
    setActiveMenuId(null);
  };

  return (
    <div className="relative flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-indigo-200 hover:shadow-sm transition-all">
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${severity === "high" ? "bg-rose-200 text-rose-800" : "bg-amber-200 text-amber-800"}`}
        >
          {name.charAt(0)}
        </div>
        <div>
          <h4 className="font-bold text-slate-800 text-sm">{name}</h4>
          <p className="text-xs text-slate-500 font-medium">{diagnosis}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${severityColor}`}
        >
          {severity}
        </span>

        {/* Three Dots Menu Trigger */}
        <div className="relative">
          <button
            onClick={handleMenuClick}
            className={`p-1.5 rounded-lg transition-colors ${isMenuOpen ? "bg-indigo-100 text-indigo-600" : "text-slate-400 hover:bg-white hover:text-indigo-600"}`}
          >
            <MoreVertical size={18} />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute right-0 top-8 z-20 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden origin-top-right"
              >
                <button
                  onClick={() => handleAction("Opened Profile")}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                >
                  <FileText size={14} /> View Profile
                </button>
                <button
                  onClick={() => handleAction("Contacted")}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Phone size={14} /> Contact Patient
                </button>
                <div className="h-px bg-slate-100 my-0"></div>
                <button
                  onClick={() => handleAction("Marked Resolved")}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <CheckCircle2 size={14} /> Mark Resolved
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Toast({ title, message, type, onClose }) {
  const bgStyles =
    type === "success"
      ? "bg-slate-900 border-l-4 border-green-500"
      : "bg-slate-900 border-l-4 border-indigo-500";
  const icon =
    type === "success" ? (
      <CheckCircle2 className="text-green-500" />
    ) : (
      <RefreshCw className="text-indigo-500 animate-spin" />
    );

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg shadow-2xl min-w-[320px] max-w-sm ${bgStyles}`}
    >
      <div className="mt-0.5">{icon}</div>
      <div className="flex-1">
        <h4 className="text-white text-sm font-bold">{title}</h4>
        <p className="text-slate-400 text-xs mt-1">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-slate-500 hover:text-white transition-colors"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}
