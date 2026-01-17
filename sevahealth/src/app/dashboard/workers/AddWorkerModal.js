"use client";
import { useState } from "react";
import { X, UserPlus, Shield } from "lucide-react";

export default function AddWorkerModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    area: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden scale-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <UserPlus size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Onboard New Worker</h2>
              <p className="text-indigo-100 text-xs">
                Create credentials for field staff
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-indigo-100 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Full Name
            </label>
            <input
              required
              type="text"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
              placeholder="e.g. Anjali Verma"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Assigned Area / Sector
            </label>
            <input
              required
              type="text"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
              placeholder="e.g. Sector 4, Jalgaon"
              onChange={(e) =>
                setFormData({ ...formData, area: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Mobile Contact
              </label>
              <input
                required
                type="tel"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                placeholder="+91"
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Official Email
            </label>
            <input
              required
              type="email"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
              placeholder="worker@sevahealth.org"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="bg-indigo-50 p-3 rounded-xl flex gap-3 items-start border border-indigo-100">
            <Shield className="text-indigo-600 shrink-0 mt-0.5" size={16} />
            <p className="text-xs text-indigo-800">
              Default role will be set to <strong>ASHA_WORKER</strong>. The user
              will receive an SMS with login credentials upon creation.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95"
            >
              Create Worker Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
