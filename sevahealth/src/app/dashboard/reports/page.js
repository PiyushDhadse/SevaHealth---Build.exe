"use client";

import { useState, useMemo, useEffect } from "react";
import {
  FileText,
  Download,
  Eye,
  Share2,
  Search,
  Plus,
  Filter,
  FileBarChart,
  Calendar,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon,
  FileDigit,
  MoreHorizontal,
  X,
  Trash2,
  Copy,
  Archive,
} from "lucide-react";
import CreateReportModal from "./CreateReportModal";

// --- MOCK DATA (Same as before) ---
const initialReports = [
  {
    id: 1,
    title: "Complete Blood Count (CBC)",
    type: "Lab Result",
    patient: "Rajesh Khanna",
    doctor: "Dr. Anjali Sharma",
    date: "2026-01-18",
    size: "1.2 MB",
    fileType: "pdf",
    status: "Finalized",
    description:
      "Hemoglobin levels slightly low (11.5 g/dL). Recommended iron supplements.",
  },
  {
    id: 2,
    title: "Chest X-Ray (PA View)",
    type: "Radiology",
    patient: "Sunita Devi",
    doctor: "Dr. Vikram Singh",
    date: "2026-01-17",
    size: "4.5 MB",
    fileType: "image",
    status: "Finalized",
    description: "Clear lung fields. No sign of congestion or opacity.",
  },
  {
    id: 3,
    title: "Monthly Diabetes Assessment",
    type: "Checkup",
    patient: "Amit Patel",
    doctor: "Dr. Anjali Sharma",
    date: "2026-01-15",
    size: "850 KB",
    fileType: "pdf",
    status: "Pending Review",
    description:
      "HbA1c levels stable at 6.2%. Continue current medication (Metformin).",
  },
  // ... (Feel free to keep your other mock data here)
];

export default function ReportsPage() {
  const [reports, setReports] = useState(initialReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");

  // --- NEW STATE FOR ACTIONS ---
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewReport, setViewReport] = useState(null); // Stores the object of report being viewed
  const [openMenuId, setOpenMenuId] = useState(null); // Stores ID of the open dropdown
  const [toastMsg, setToastMsg] = useState(null); // Stores success messages

  // --- STATS LOGIC ---
  const stats = useMemo(() => {
    return {
      total: reports.length,
      labs: reports.filter((r) => r.type === "Lab Result").length,
      radiology: reports.filter((r) => r.type === "Radiology").length,
      pending: reports.filter((r) => r.status === "Pending Review").length,
    };
  }, [reports]);

  // --- FILTER LOGIC ---
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || report.type === filterType;
    return matchesSearch && matchesType;
  });

  // --- ACTION HANDLERS ---

  // 1. Delete Report
  const handleDelete = (id) => {
    setReports(reports.filter((r) => r.id !== id));
    setOpenMenuId(null);
    showToast("Report deleted successfully");
  };

  // 2. Share Report (Simulated)
  const handleShare = (report) => {
    // In a real app, this would use navigator.share or copy a URL
    navigator.clipboard.writeText(
      `https://sevahealth.com/reports/${report.id}`,
    );
    showToast("Link copied to clipboard");
  };

  // 3. Helper for Toast
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAddReport = (newReport) => {
    const report = {
      id: reports.length + 1,
      ...newReport,
      date: new Date().toISOString().split("T")[0],
      size: "Unknown",
      status: "Finalized",
    };
    setReports([report, ...reports]);
    setShowCreateModal(false);
    showToast("New report uploaded successfully");
  };

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans text-slate-900"
      onClick={() => setOpenMenuId(null)} // Close menu when clicking background
    >
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Patient Records
          </h1>
          <p className="text-slate-500 mt-1">
            Centralized repository for lab results, prescriptions, and imaging.
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all active:scale-95"
        >
          <Plus size={20} />
          <span>Upload Report</span>
        </button>
      </div>

      {/* --- STATS --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Files"
          value={stats.total}
          icon={<FileDigit />}
          color="slate"
        />
        <StatCard
          label="Lab Results"
          value={stats.labs}
          icon={<FileBarChart />}
          color="emerald"
        />
        <StatCard
          label="Radiology"
          value={stats.radiology}
          icon={<ImageIcon />}
          color="blue"
        />
        <StatCard
          label="Pending Review"
          value={stats.pending}
          icon={<AlertCircle />}
          color="amber"
        />
      </div>

      {/* --- FILTERS --- */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by report name, patient, or doctor..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative min-w-[180px]">
          <Filter
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            size={16}
          />
          <select
            className="w-full pl-10 pr-8 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:border-emerald-500 outline-none appearance-none cursor-pointer shadow-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Lab Result">Lab Results</option>
            <option value="Radiology">Radiology</option>
            <option value="Prescription">Prescriptions</option>
          </select>
        </div>
      </div>

      {/* --- REPORTS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <ReportCard
            key={report.id}
            report={report}
            // Pass handlers down
            onView={(e) => {
              e.stopPropagation();
              setViewReport(report);
            }}
            onShare={(e) => {
              e.stopPropagation();
              handleShare(report);
            }}
            onDelete={() => handleDelete(report.id)}
            // Menu Logic
            isMenuOpen={openMenuId === report.id}
            onToggleMenu={(e) => {
              e.stopPropagation();
              setOpenMenuId(openMenuId === report.id ? null : report.id);
            }}
          />
        ))}
      </div>

      {/* --- MODALS & TOASTS --- */}
      {showCreateModal && (
        <CreateReportModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleAddReport}
        />
      )}

      {viewReport && (
        <ViewReportModal
          report={viewReport}
          onClose={() => setViewReport(null)}
        />
      )}

      {toastMsg && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle size={20} className="text-emerald-400" />
          <span className="font-bold text-sm">{toastMsg}</span>
        </div>
      )}
    </div>
  );
}

// --- SUB COMPONENT: REPORT CARD ---
function ReportCard({
  report,
  onView,
  onShare,
  onDelete,
  isMenuOpen,
  onToggleMenu,
}) {
  const isImage = report.fileType === "image";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full relative group">
      {/* Header */}
      <div className="p-5 flex gap-4 items-start">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isImage ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-600"}`}
        >
          {isImage ? <ImageIcon size={24} /> : <FileText size={24} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start relative">
            <h3 className="text-lg font-bold text-slate-800 truncate pr-2">
              {report.title}
            </h3>

            {/* THREE DOTS BUTTON */}
            <button
              onClick={onToggleMenu}
              className="text-slate-300 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition"
            >
              <MoreHorizontal size={20} />
            </button>

            {/* DROPDOWN MENU */}
            {isMenuOpen && (
              <div className="absolute right-0 top-8 w-40 bg-white border border-slate-200 rounded-xl shadow-xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={onShare}
                  className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Copy size={14} /> Copy Link
                </button>
                <button className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                  <Archive size={14} /> Archive
                </button>
                <div className="h-px bg-slate-100 mx-2"></div>
                <button
                  onClick={onDelete}
                  className="w-full text-left px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wide">
              {report.type}
            </span>
            <span className="text-xs text-slate-400">• {report.size}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 pb-4 flex-1">
        <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">
          {report.description}
        </p>
        <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-medium">Patient</span>
            <span className="text-slate-700 font-bold">{report.patient}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-medium">Date</span>
            <span className="text-slate-700 font-bold">{report.date}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-slate-100 flex gap-2">
        {/* VIEW BUTTON */}
        <button
          onClick={onView}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-colors"
        >
          <Eye size={16} /> View
        </button>

        {/* SAVE BUTTON */}
        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-50 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors border border-slate-200">
          <Download size={16} /> Save
        </button>

        {/* SHARE BUTTON */}
        <button
          onClick={onShare}
          className="px-3 py-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
        >
          <Share2 size={16} />
        </button>
      </div>
    </div>
  );
}

// --- NEW SUB COMPONENT: VIEW MODAL ---
function ViewReportModal({ report, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
      <div className="bg-white w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <FileText className="text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{report.title}</h3>
              <p className="text-xs text-slate-400">
                Published on {report.date} by {report.doctor}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body (Simulated Viewer) */}
        <div className="flex-1 bg-slate-100 overflow-y-auto p-8 flex justify-center">
          <div className="bg-white shadow-lg w-full max-w-2xl min-h-full p-12 flex flex-col items-center text-center">
            {/* Simulate Actual File Content */}
            <div className="w-full border-b pb-4 mb-8 flex justify-between items-end">
              <div className="text-left">
                <h1 className="text-2xl font-black text-slate-800 uppercase">
                  Medical Report
                </h1>
                <p className="text-sm text-slate-500">ID: #{report.id}8829</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-800">Hospital General</p>
                <p className="text-xs text-slate-500">Sector 12, Dist Pune</p>
              </div>
            </div>

            <div className="w-full text-left space-y-6">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h4 className="font-bold text-sm text-slate-400 uppercase mb-2">
                  Patient Details
                </h4>
                <p className="font-bold text-lg">{report.patient}</p>
                <p className="text-sm text-slate-600">Age: 34 • Gender: Male</p>
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-400 uppercase mb-2">
                  Clinical Findings
                </h4>
                <p className="text-slate-800 leading-relaxed">
                  {report.description}
                  <br />
                  <br />
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>

              {report.fileType === "image" && (
                <div className="mt-4 bg-black rounded-lg h-64 flex items-center justify-center text-white">
                  <ImageIcon size={48} className="opacity-50" />
                  <span className="ml-2 opacity-50 font-bold">
                    X-RAY PREVIEW
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Close
          </button>
          <button className="px-5 py-2.5 font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition flex items-center gap-2">
            <Download size={18} /> Download File
          </button>
        </div>
      </div>
    </div>
  );
}

// --- STAT CARD COMPONENT (No changes) ---
function StatCard({ label, value, icon, color }) {
  const colors = {
    emerald: "text-emerald-600 bg-emerald-50",
    blue: "text-blue-600 bg-blue-50",
    amber: "text-amber-600 bg-amber-50",
    slate: "text-slate-600 bg-slate-100",
  };

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
      <div className={`p-2.5 rounded-xl ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
          {label}
        </p>
        <p className="text-xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
}
