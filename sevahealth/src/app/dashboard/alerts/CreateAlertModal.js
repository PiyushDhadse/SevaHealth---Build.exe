"use client";
import { useState } from "react";
import { X, Send, AlertTriangle } from "lucide-react";

export default function CreateAlertModal({ onClose, onSend }) {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "Info",
    audience: "All",
    issuedBy: "Admin Console",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <AlertTriangle size={24} className="text-rose-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Broadcast Alert</h2>
              <p className="text-slate-400 text-xs">
                Send notifications to field teams
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Alert Title
            </label>
            <input
              required
              type="text"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-800"
              placeholder="e.g. Extreme Heat Advisory"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Severity Level
              </label>
              <select
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <option value="Info">Info (Blue)</option>
                <option value="Warning">Warning (Amber)</option>
                <option value="Critical">Critical (Red)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Target Audience
              </label>
              <select
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                onChange={(e) =>
                  setFormData({ ...formData, audience: e.target.value })
                }
              >
                <option value="All">All Staff</option>
                <option value="Doctors">Doctors Only</option>
                <option value="ASHA">ASHA Workers</option>
                <option value="Sector 12">Sector 12 Specific</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Message Content
            </label>
            <textarea
              required
              rows="4"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none text-sm text-slate-700"
              placeholder="Type your alert message details here..."
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
            ></textarea>
          </div>

          <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 flex gap-3">
            <AlertTriangle
              className="text-amber-600 shrink-0 mt-0.5"
              size={16}
            />
            <p className="text-xs text-amber-800 leading-snug">
              <strong>Warning:</strong> Broadcasting a &quot;Critical&quot; alert will
              trigger SMS and App Push Notifications to all selected recipients
              immediately.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Send size={18} /> Send Broadcast
          </button>
        </form>
      </div>
    </div>
  );
}
