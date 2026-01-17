'use client';

import { useState, useMemo } from 'react';
import { 
  Bell, AlertTriangle, Info, CheckCircle, Search, 
  Megaphone, Filter, X, FileText, Calendar, ShieldAlert 
} from 'lucide-react';
import CreateAlertModal from './CreateAlertModal';

// --- ROBUST MOCK DATA ---
const initialAlerts = [
  {
    id: 1,
    title: "Dengue Outbreak Confirmed",
    message: "Cluster of 15 cases reported in Sector 12. Activate vector control protocols immediately. Distribution of mosquito nets required.",
    issuedBy: "Dr. Anjali Sharma (CMO)",
    date: "2026-01-18",
    time: "09:30 AM",
    type: "Critical",
    audience: "All ASHA Workers",
    attachment: "protocols_v2.pdf",
    read: false
  },
  {
    id: 2,
    title: "Heavy Rainfall Warning",
    message: "IMD predicts heavy rainfall for next 48 hours. Ensure expectant mothers in remote areas are moved closer to PHCs.",
    issuedBy: "District Administration",
    date: "2026-01-18",
    time: "08:15 AM",
    type: "Warning",
    audience: "Flood Prone Zones",
    attachment: null,
    read: false
  },
  {
    id: 3,
    title: "Vaccination Drive Update",
    message: "Polio Sunday scheduled for 25th Jan. Booth allocations attached below. Please confirm receipt.",
    issuedBy: "Health Department",
    date: "2026-01-15",
    time: "02:00 PM",
    type: "Info",
    audience: "All Staff",
    attachment: "booth_allocations.xlsx",
    read: true
  },
  {
    id: 4,
    title: "Supply Chain Delay",
    message: "Iron Folic Acid (IFA) tablets shipment delayed by 2 days. Manage current stock sparingly.",
    issuedBy: "Logistics Mgr",
    date: "2026-01-12",
    time: "11:45 AM",
    type: "Warning",
    audience: "Inventory Handlers",
    attachment: null,
    read: true
  }
];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // --- DERIVED STATS ---
  const stats = useMemo(() => {
    return {
      total: alerts.length,
      critical: alerts.filter(a => a.type === 'Critical').length,
      unread: alerts.filter(a => !a.read).length
    };
  }, [alerts]);

  // --- ACTIONS ---
  const handleCreateAlert = (newAlert) => {
    const fullAlert = {
      id: alerts.length + 1,
      ...newAlert,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    setAlerts([fullAlert, ...alerts]);
    setShowCreateModal(false);
  };

  const markAsRead = (id) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const deleteAlert = (id) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  // --- FILTERING ---
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          alert.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || alert.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans text-slate-900">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Emergency Broadcasts
            {stats.unread > 0 && (
              <span className="bg-rose-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                {stats.unread} New
              </span>
            )}
          </h1>
          <p className="text-slate-500 mt-1">Real-time announcements and critical warnings for the district.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-rose-200 transition-all active:scale-95"
        >
          <Megaphone size={20} />
          <span>Broadcast Alert</span>
        </button>
      </div>

      {/* --- METRICS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-r from-rose-500 to-rose-600 p-5 rounded-2xl text-white shadow-lg shadow-rose-100 relative overflow-hidden">
          <ShieldAlert size={80} className="absolute -right-4 -bottom-4 opacity-20" />
          <p className="font-bold opacity-80">Active Critical Alerts</p>
          <p className="text-4xl font-black mt-1">{stats.critical}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Info size={24} /></div>
          <div>
            <p className="text-slate-500 font-bold text-xs uppercase">Total Updates</p>
            <p className="text-2xl font-black text-slate-800">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Bell size={24} /></div>
          <div>
            <p className="text-slate-500 font-bold text-xs uppercase">Unacknowledged</p>
            <p className="text-2xl font-black text-slate-800">{stats.unread}</p>
          </div>
        </div>
      </div>

      {/* --- FILTERS --- */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search alerts by title or content..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative min-w-[180px]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <select
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:border-indigo-500 outline-none appearance-none cursor-pointer shadow-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All Severity</option>
            <option value="Critical">Critical</option>
            <option value="Warning">Warning</option>
            <option value="Info">Info</option>
          </select>
        </div>
      </div>

      {/* --- ALERTS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map(alert => (
            <AlertCard 
              key={alert.id} 
              alert={alert} 
              onRead={() => markAsRead(alert.id)} 
              onDelete={() => deleteAlert(alert.id)}
            />
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-400">
            <CheckCircle size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-bold text-lg">All caught up!</p>
            <p className="text-sm">No alerts found matching your criteria.</p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateAlertModal onClose={() => setShowCreateModal(false)} onSend={handleCreateAlert} />
      )}
    </div>
  );
}

// --- SUB COMPONENT ---
function AlertCard({ alert, onRead, onDelete }) {
  const styles = {
    Critical: {
      border: "border-l-4 border-l-rose-500 border-slate-200",
      bg: "bg-white",
      icon: <ShieldAlert className="text-rose-500" size={24} />,
      badge: "bg-rose-100 text-rose-700"
    },
    Warning: {
      border: "border-l-4 border-l-amber-500 border-slate-200",
      bg: "bg-white",
      icon: <AlertTriangle className="text-amber-500" size={24} />,
      badge: "bg-amber-100 text-amber-700"
    },
    Info: {
      border: "border-l-4 border-l-blue-500 border-slate-200",
      bg: "bg-white",
      icon: <Info className="text-blue-500" size={24} />,
      badge: "bg-blue-100 text-blue-700"
    }
  };

  const style = styles[alert.type] || styles.Info;

  return (
    <div className={`relative rounded-xl border shadow-sm p-6 transition-all hover:shadow-md ${style.border} ${style.bg} ${!alert.read ? 'ring-1 ring-offset-2 ring-indigo-100' : ''}`}>
      
      {/* Top Row */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
          <div className="p-3 bg-slate-50 rounded-lg h-fit">
            {style.icon}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide ${style.badge}`}>
                {alert.type}
              </span>
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                <Calendar size={12} /> {alert.date} • {alert.time}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">{alert.title}</h3>
          </div>
        </div>
        <button onClick={onDelete} className="text-slate-300 hover:text-slate-500 transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="mb-6 pl-[68px]">
        <p className="text-slate-600 text-sm leading-relaxed mb-3">
          {alert.message}
        </p>
        
        {alert.attachment && (
          <div className="inline-flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors">
            <FileText size={14} />
            {alert.attachment}
            <span className="ml-1 text-indigo-500">Download</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pl-[68px] flex justify-between items-center border-t border-slate-100 pt-4">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Issued By</p>
          <p className="text-xs font-bold text-slate-700">{alert.issuedBy}</p>
        </div>
        
        {!alert.read ? (
          <button 
            onClick={onRead}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100"
          >
            <CheckCircle size={14} /> Acknowledge
          </button>
        ) : (
          <span className="flex items-center gap-2 text-emerald-600 text-xs font-bold bg-emerald-50 px-3 py-1.5 rounded-lg">
            <CheckCircle size={14} /> Acknowledged
          </span>
        )}
      </div>
    </div>
  );
}