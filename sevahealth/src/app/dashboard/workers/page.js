'use client';

import { useState, useMemo } from 'react';
import { 
  Users, MapPin, Phone, Mail, Search, Plus, 
  Filter, TrendingUp, Smartphone, MoreVertical, 
  CheckCircle, AlertCircle, Star
} from 'lucide-react';
import { ProtectedRoute } from '../../rbac';
import { ROLES } from '../../permissions';
import AddWorkerModal from './AddWorkerModal';

// --- ROBUST MOCK DATA ---
const initialWorkers = [
  {
    id: 'ASHA-001',
    name: 'Meena Kumari',
    area: 'Sector 12',
    patients: 34,
    activeCases: 12,
    performance: 92, // Percentage
    lastSync: '10 mins ago',
    contact: '+91 98765 43210',
    email: 'meena.k@seva.org',
    status: 'Active',
    avatarColor: 'bg-indigo-100 text-indigo-600'
  },
  {
    id: 'ASHA-002',
    name: 'Geeta Devi',
    area: 'Sector 8',
    patients: 41,
    activeCases: 8,
    performance: 88,
    lastSync: '1 hour ago',
    contact: '+91 87654 32109',
    email: 'geeta.d@seva.org',
    status: 'Active',
    avatarColor: 'bg-emerald-100 text-emerald-600'
  },
  {
    id: 'ASHA-003',
    name: 'Sarita Singh',
    area: 'Village Kheri',
    patients: 28,
    activeCases: 15,
    performance: 76,
    lastSync: '2 days ago',
    contact: '+91 76543 21098',
    email: 'sarita.s@seva.org',
    status: 'Offline',
    avatarColor: 'bg-amber-100 text-amber-600'
  },
  {
    id: 'ASHA-004',
    name: 'Kavita Sharma',
    area: 'Sector 5',
    patients: 52,
    activeCases: 22,
    performance: 95,
    lastSync: 'Just now',
    contact: '+91 65432 10987',
    email: 'kavita.s@seva.org',
    status: 'Active',
    avatarColor: 'bg-blue-100 text-blue-600'
  },
  {
    id: 'ASHA-005',
    name: 'Sunita Patel',
    area: 'Village Rampur',
    patients: 23,
    activeCases: 5,
    performance: 64,
    lastSync: '5 hours ago',
    contact: '+91 54321 09876',
    email: 'sunita.p@seva.org',
    status: 'On Leave',
    avatarColor: 'bg-rose-100 text-rose-600'
  }
];

function WorkersPageContent() {
  const [workers, setWorkers] = useState(initialWorkers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // --- DERIVED METRICS ---
  const stats = useMemo(() => {
    const total = workers.length;
    const active = workers.filter(w => w.status === 'Active').length;
    const totalPatients = workers.reduce((acc, curr) => acc + parseInt(curr.patients), 0);
    const avgPerformance = Math.round(workers.reduce((acc, curr) => acc + curr.performance, 0) / total);

    return { total, active, totalPatients, avgPerformance };
  }, [workers]);

  // --- FILTER LOGIC ---
  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = 
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.area.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || worker.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddWorker = (newWorkerData) => {
    const newWorker = {
      id: `ASHA-00${workers.length + 1}`,
      ...newWorkerData,
      patients: 0,
      activeCases: 0,
      performance: 100, // New workers start with 100% score
      lastSync: 'Pending',
      status: 'Active',
      avatarColor: 'bg-indigo-100 text-indigo-600'
    };
    setWorkers(prev => [newWorker, ...prev]);
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans text-slate-900">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Field Force</h1>
          <p className="text-slate-500 mt-1">Manage ASHA workers, assignments, and device sync status.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
        >
          <Plus size={20} />
          <span>Onboard Worker</span>
        </button>
      </div>

      {/* --- TOP METRICS GRID --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Total Workforce" value={stats.total} icon={<Users />} color="indigo" />
        <MetricCard label="Currently Active" value={stats.active} icon={<CheckCircle />} color="emerald" />
        <MetricCard label="Patient Coverage" value={stats.totalPatients} icon={<Smartphone />} color="blue" />
        <MetricCard label="Avg. Performance" value={`${stats.avgPerformance}%`} icon={<TrendingUp />} color="amber" />
      </div>

      {/* --- FILTERS TOOLBAR --- */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search workers by name or area..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative min-w-[160px]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <select
            className="w-full pl-10 pr-8 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:border-indigo-500 outline-none appearance-none cursor-pointer shadow-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Offline">Offline</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>
      </div>

      {/* --- WORKER CARDS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredWorkers.map((worker) => (
          <WorkerCard key={worker.id} worker={worker} />
        ))}
      </div>

      {showAddModal && <AddWorkerModal onClose={() => setShowAddModal(false)} onSave={handleAddWorker} />}
    </div>
  );
}

// --- SUB COMPONENTS ---

function WorkerCard({ worker }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group">
      
      {/* Card Header */}
      <div className="p-5 flex justify-between items-start border-b border-slate-50">
        <div className="flex gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-inner ${worker.avatarColor}`}>
            {worker.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg leading-tight">{worker.name}</h3>
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mt-1">
              <MapPin size={12} />
              {worker.area}
            </div>
          </div>
        </div>
        <button className="text-slate-300 hover:text-slate-600">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Card Stats */}
      <div className="p-5 grid grid-cols-3 gap-2 text-center bg-slate-50/50">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patients</p>
          <p className="text-lg font-black text-slate-800">{worker.patients}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Cases</p>
          <p className="text-lg font-black text-indigo-600">{worker.activeCases}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Score</p>
          <div className="flex items-center justify-center gap-1">
            <p className="text-lg font-black text-emerald-600">{worker.performance}%</p>
          </div>
        </div>
      </div>

      {/* Status & Sync Info */}
      <div className="px-5 py-4 space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500 font-medium">Tablet Sync</span>
          <span className={`font-bold flex items-center gap-1.5 ${
            worker.lastSync.includes('min') || worker.lastSync === 'Just now' ? 'text-emerald-600' : 'text-amber-600'
          }`}>
            <Smartphone size={14} /> {worker.lastSync}
          </span>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500 font-medium">Duty Status</span>
          <StatusBadge status={worker.status} />
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-3">
        <button className="flex items-center justify-center gap-2 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors">
          <Phone size={16} className="text-indigo-500" /> Call
        </button>
        <button className="flex items-center justify-center gap-2 py-2 rounded-lg bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-colors">
          View Profile
        </button>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon, color }) {
  const colors = {
    indigo: "text-indigo-600 bg-indigo-50",
    emerald: "text-emerald-600 bg-emerald-50",
    blue: "text-blue-600 bg-blue-50",
    amber: "text-amber-600 bg-amber-50"
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-xl ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Offline: "bg-slate-100 text-slate-600 border-slate-200",
    "On Leave": "bg-amber-100 text-amber-700 border-amber-200"
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide border ${styles[status]}`}>
      {status}
    </span>
  );
}

export default function WorkersPage() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.DOCTOR, ROLES.SUPERVISOR]}>
      <WorkersPageContent />
    </ProtectedRoute>
  );
}