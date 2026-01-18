"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Download,
  Filter,
  MapPin,
  Phone,
  Calendar,
  User,
  Activity,
} from "lucide-react";
import AddPatientModal from "@/src/app/dashboard/patients/AddpatientModal";
import PatientDetails from "@/src/app/dashboard/patients/PatientDetails";

// --- ROBUST MOCK DATA ---
const initialPatients = [
  {
    id: "PAT-2024-001",
    name: "Rajesh Patel",
    status: "Critical",
    age: 58,
    gender: "Male",
    ashaWorker: "Meena Kumari",
    lastVisit: "Today, 10:30 AM",
    contact: "+91 98765 43210",
    location: "Sector 4, Borgaon",
    diagnosis: "Severe Hypertension",
  },
  {
    id: "PAT-2024-002",
    name: "Sunita Rao",
    status: "At Risk",
    age: 26,
    gender: "Female",
    ashaWorker: "Lakshmi Devi",
    lastVisit: "Yesterday, 4:15 PM",
    contact: "+91 98765 12345",
    location: "Ward 7, Jalgaon",
    diagnosis: "Prenatal - 3rd Trimester",
  },
  {
    id: "PAT-2024-003",
    name: "Vikram Singh",
    status: "Stable",
    age: 42,
    gender: "Male",
    ashaWorker: "Meena Kumari",
    lastVisit: "18 Jan, 2024",
    contact: "+91 91234 56789",
    location: "Shivaji Nagar",
    diagnosis: "Type 2 Diabetes Control",
  },
  {
    id: "PAT-2024-004",
    name: "Anjali Gupta",
    status: "Follow-up",
    age: 34,
    gender: "Female",
    ashaWorker: "Priya Sharma",
    lastVisit: "15 Jan, 2024",
    contact: "+91 88997 76655",
    location: "Sector 12, Main Road",
    diagnosis: "Post-Viral Fatigue",
  },
  {
    id: "PAT-2024-005",
    name: "Rahul Verma",
    status: "Critical",
    age: 65,
    gender: "Male",
    ashaWorker: "Lakshmi Devi",
    lastVisit: "Today, 09:00 AM",
    contact: "+91 77788 99000",
    location: "Old Market Area",
    diagnosis: "Arrhythmia Alert",
  },
];

export default function PatientsPage() {
  const [patients, setPatients] = useState(initialPatients);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter Logic
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.ashaWorker?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || patient.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddPatient = (newPatientData) => {
    // Create a complete patient object
    const newPatient = {
      id: `PAT-2024-00${patients.length + 6}`,
      ...newPatientData,
      lastVisit: "Just Now",
      ashaWorker: "Assigned: Pending", // Default for new adds
    };
    setPatients((prev) => [newPatient, ...prev]);
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans text-slate-900">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Patient Registry
          </h1>
          <p className="text-slate-500 mt-1">
            Centralized database for district health monitoring.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
        >
          <Plus size={20} />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* --- FILTERS TOOLBAR --- */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by Name, ID, or ASHA Worker..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative group">
            <Filter
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              size={16}
            />
            <select
              className="appearance-none pl-10 pr-8 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:border-indigo-500 outline-none cursor-pointer hover:bg-slate-50 transition-colors min-w-[140px]"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Critical">Critical</option>
              <option value="At Risk">At Risk</option>
              <option value="Stable">Stable</option>
            </select>
          </div>

          <button className="flex items-center gap-2 px-4 py-3 border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors">
            <Download size={18} />{" "}
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* --- PATIENT TABLE --- */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-black uppercase tracking-wider text-slate-400">
                <th className="p-6">Patient Identity</th>
                <th className="p-6">Status & Diagnosis</th>
                <th className="p-6">Assigned ASHA</th>
                <th className="p-6">Last Interaction</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="group hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                            patient.gender === "Female"
                              ? "bg-pink-100 text-pink-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {patient.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">
                            {patient.name}
                          </p>
                          <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                            {patient.id} • {patient.age} Yrs • {patient.gender}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-6">
                      <StatusBadge status={patient.status} />
                      <p className="text-xs font-medium text-slate-500 mt-2 truncate max-w-[150px]">
                        {patient.diagnosis}
                      </p>
                    </td>

                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-slate-400" />
                        <span className="text-sm font-medium text-slate-700">
                          {patient.ashaWorker}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin size={12} className="text-slate-400" />
                        <span className="text-xs text-slate-400">
                          {patient.location}
                        </span>
                      </div>
                    </td>

                    <td className="p-6">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <Calendar size={14} className="text-slate-400" />
                        {patient.lastVisit}
                      </div>
                    </td>

                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setSelectedPatient(patient)}
                          className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
                          <Edit size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Search size={48} className="mb-4 opacity-20" />
                      <p className="text-lg font-bold">No patients found</p>
                      <p className="text-sm">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- BOTTOM METRICS --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <MetricCard
          label="Total Patients"
          value={patients.length}
          icon={<User />}
        />
        <MetricCard
          label="Critical Cases"
          value={patients.filter((p) => p.status === "Critical").length}
          icon={<Activity />}
          color="rose"
        />
        <MetricCard
          label="At Risk"
          value={patients.filter((p) => p.status === "At Risk").length}
          icon={<Activity />}
          color="amber"
        />
        <MetricCard
          label="New Today"
          value="3"
          icon={<Plus />}
          color="emerald"
        />
      </div>

      {/* --- MODALS --- */}
      {showAddModal && (
        <AddPatientModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddPatient}
        />
      )}
      {selectedPatient && (
        <PatientDetails
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
}

// --- SUB COMPONENTS ---

function StatusBadge({ status }) {
  const styles = {
    Critical: "bg-rose-100 text-rose-700 border-rose-200",
    "At Risk": "bg-amber-100 text-amber-700 border-amber-200",
    Stable: "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Follow-up": "bg-blue-100 text-blue-700 border-blue-200",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border ${styles[status] || "bg-slate-100 text-slate-600"}`}
    >
      {status}
    </span>
  );
}

function MetricCard({ label, value, icon, color = "indigo" }) {
  const colors = {
    indigo: "text-indigo-600 bg-indigo-50",
    rose: "text-rose-600 bg-rose-50",
    amber: "text-amber-600 bg-amber-50",
    emerald: "text-emerald-600 bg-emerald-50",
  };

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-xl ${colors[color]}`}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
          {label}
        </p>
        <p className="text-2xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
}
