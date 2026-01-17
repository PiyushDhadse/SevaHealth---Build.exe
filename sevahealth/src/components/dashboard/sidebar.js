"use client";

import { useState, useEffect } from "react";
import {
  Home,
  Users,
  AlertTriangle,
  FileText,
  Settings,
  LogOut,
  Activity,
  UserCheck,
  Stethoscope,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { ROLES } from "@/src/lib/rbac";

// Navigation configuration
const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: [ROLES.DOCTOR, ROLES.ASHA_WORKER, ROLES.SUPERVISOR],
  },
  {
    name: "Patients",
    href: "/dashboard/patients",
    icon: Users,
    roles: [ROLES.DOCTOR, ROLES.ASHA_WORKER, ROLES.SUPERVISOR],
  },
  {
    name: "ASHA Workers",
    href: "/dashboard/workers",
    icon: UserCheck,
    roles: [ROLES.DOCTOR, ROLES.SUPERVISOR],
  },
  {
    name: "Alerts",
    href: "/dashboard/alerts",
    icon: AlertTriangle,
    roles: [ROLES.DOCTOR, ROLES.ASHA_WORKER, ROLES.SUPERVISOR],
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: FileText,
    roles: [ROLES.DOCTOR, ROLES.ASHA_WORKER, ROLES.SUPERVISOR],
  },
  {
    name: "Doctor Panel",
    href: "/dashboard/doctor",
    icon: Stethoscope,
    roles: [ROLES.DOCTOR, ROLES.ASHA_WORKER, ROLES.SUPERVISOR],
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: [ROLES.DOCTOR, ROLES.ASHA_WORKER, ROLES.SUPERVISOR],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const effectiveUserType = user?.user_type || ROLES.SUPERVISOR;

  const visibleNavItems = navItems.filter((item) => {
    return item.roles.includes(effectiveUserType);
  });

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const getRoleDisplayName = (userType) => {
    switch (userType) {
      case ROLES.DOCTOR:
        return "Chief Medical Officer";
      case ROLES.ASHA_WORKER:
        return "Field Worker (ASHA)";
      case ROLES.SUPERVISOR:
        return "District Supervisor";
      default:
        return "Authorized User";
    }
  };

  const getUserInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  return (
    <aside className="hidden md:flex flex-col w-72 h-screen bg-white border-r border-slate-200 sticky top-0 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      {/* --- BRAND HEADER --- */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">
              SevaHealth
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
              Enterprise Edition
            </p>
          </div>
        </div>

        {/* --- ROLE CARD --- */}
        <div className="relative overflow-hidden rounded-xl bg-slate-900 p-4 text-white shadow-md group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-indigo-500/30"></div>

          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                Current Access
              </p>
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-emerald-400" />
                {getRoleDisplayName(effectiveUserType)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar py-2">
        {mounted &&
          visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-200 translate-x-1"
                    : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600 hover:pl-5"
                }`}
              >
                <div className="flex items-center gap-3 relative z-10">
                  <Icon
                    className={`w-5 h-5 transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-500"}`}
                  />
                  <span>{item.name}</span>
                </div>

                {isActive && (
                  <ChevronRight className="w-4 h-4 text-indigo-200 animate-pulse" />
                )}
              </Link>
            );
          })}
      </nav>

      {/* --- USER PROFILE FOOTER --- */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="bg-white border border-slate-200/60 rounded-2xl p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-100 to-slate-200 flex items-center justify-center border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                <span className="text-indigo-600 font-bold text-sm">
                  {user?.name ? getUserInitials(user.name) : "U"}
                </span>
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                {user?.name || "User"}
              </p>
              <p className="text-[10px] text-slate-500 font-medium truncate">
                {user?.email || "user@sevahealth.org"}
              </p>
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
