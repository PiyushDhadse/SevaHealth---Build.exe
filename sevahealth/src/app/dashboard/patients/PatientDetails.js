"use client";
import { X, User, Phone, MapPin, Activity } from "lucide-react";

export default function PatientDetails({ patient, onClose }) {
  if (!patient) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-start">
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl font-bold">
              {patient.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {patient.name}
              </h2>
              <div className="flex gap-2 text-sm text-slate-500 mt-1">
                <span>{patient.id}</span> • <span>{patient.age} Yrs</span> •{" "}
                <span>{patient.gender}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
              Contact Info
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="text-indigo-400" size={18} />
                <span className="font-medium text-slate-700">
                  {patient.contact}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="text-indigo-400" size={18} />
                <span className="font-medium text-slate-700">
                  {patient.location}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
              Medical Status
            </h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-500">
                  Current Condition
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    patient.status === "Critical"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {patient.status}
                </span>
              </div>
              <p className="font-bold text-slate-800 text-lg">
                {patient.diagnosis}
              </p>
            </div>
            <div className="mt-4">
              <span className="text-xs text-slate-400 font-bold uppercase">
                Assigned Worker
              </span>
              <p className="font-medium text-slate-700 mt-1">
                {patient.ashaWorker}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
          <button className="text-indigo-600 text-sm font-bold hover:underline">
            View Full Medical History
          </button>
        </div>
      </div>
    </div>
  );
}
