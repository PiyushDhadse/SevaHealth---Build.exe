'use client';
import { useState, useEffect } from 'react';
import { Home, Users, AlertTriangle, FileText, Settings, LogOut, Activity, UserCheck, Stethoscope } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import { ROLES } from '@/src/lib/rbac';

// Navigation items with role-based access
const navItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    roles: [ROLES.DOCTOR, ROLES.ASHA_WORKER, ROLES.SUPERVISOR]
  },
  {
    name: 'Patients',
    href: '/dashboard/patients',
    icon: Users,
    roles: [ROLES.DOCTOR, ROLES.ASHA_WORKER, ROLES.SUPERVISOR]
  },
  {
    name: 'ASHA Workers',
    href: '/dashboard/workers',
    icon: UserCheck,
    roles: [ROLES.DOCTOR, ROLES.SUPERVISOR] // Only doctors and supervisors
  },
  {
    name: 'Alerts',
    href: '/dashboard/alerts',
    icon: AlertTriangle,
    roles: [ROLES.DOCTOR, ROLES.ASHA_WORKER, ROLES.SUPERVISOR]
  },
  {
    name: 'Reports',
    href: '/dashboard/reports',
    icon: FileText,
    roles: [ROLES.DOCTOR, ROLES.ASHA_WORKER, ROLES.SUPERVISOR]
  },
  {
    name: 'Doctor Panel',
    href: '/dashboard/doctor',
    icon: Stethoscope,
    roles: [ROLES.DOCTOR, ROLES.ASHA_WORKER, ROLES.SUPERVISOR] // All can consult doctors
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    roles: [ROLES.DOCTOR, ROLES.ASHA_WORKER, ROLES.SUPERVISOR]
  }
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get effective user type (with fallback for development/demo mode)
  const effectiveUserType = user?.user_type || ROLES.SUPERVISOR;

  // Filter navigation items based on user role
  const visibleNavItems = navItems.filter(item => {
    return item.roles.includes(effectiveUserType);
  });

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // Get role display name
  const getRoleDisplayName = (userType) => {
    switch (userType) {
      case ROLES.DOCTOR: return 'Doctor';
      case ROLES.ASHA_WORKER: return 'ASHA Worker';
      case ROLES.SUPERVISOR: return 'Supervisor';
      default: return 'User';
    }
  };

  // Get user initials
  const getUserInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 bg-white border-r border-gray-200">
        {/* Logo Section */}
        <div className="h-16 flex items-center px-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">SevaHealth</h1>
          </div>
          <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
            {effectiveUserType === ROLES.DOCTOR ? 'Doctor' : effectiveUserType === ROLES.SUPERVISOR ? 'Supervisor' : 'ASHA'}
          </span>
        </div>

        {/* Role Badge */}
        <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Logged in as</p>
          <p className="text-sm font-semibold text-gray-900">{getRoleDisplayName(effectiveUserType)}</p>
          {effectiveUserType === ROLES.ASHA_WORKER && (
            <p className="text-xs text-gray-500 mt-1">Limited Access Mode</p>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {mounted && visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${isActive
                  ? 'bg-blue-50 text-blue-600 font-medium border border-blue-100'
                  : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-medium text-sm">
                {user?.name ? getUserInitials(user.name) : 'U'}
              </span>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || ''}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
