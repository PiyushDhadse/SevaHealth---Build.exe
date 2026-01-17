"use client";
import { useState } from "react";
import { X, UploadCloud, FileText } from "lucide-react";

export default function CreateReportModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    patient: "",
    doctor: "",
    type: "Lab Result",
    fileType: "pdf",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-600 p-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Upload Medical Report</h2>
              <p className="text-emerald-100 text-xs">
                Add new records to patient history
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-100 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* File Upload Simulation */}
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-emerald-500 hover:bg-emerald-50 transition-colors cursor-pointer group">
            <div className="bg-slate-100 p-3 rounded-full mb-3 group-hover:bg-white text-slate-400 group-hover:text-emerald-600 transition-colors">
              <UploadCloud size={24} />
            </div>
            <p className="text-sm font-bold text-slate-700">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-slate-400 mt-1">
              PDF, JPG, DICOM (Max 10MB)
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Report Title
            </label>
            <input
              required
              type="text"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
              placeholder="e.g. Blood Test Results - Jan"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Patient Name
              </label>
              <input
                required
                type="text"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                placeholder="Patient Name"
                onChange={(e) =>
                  setFormData({ ...formData, patient: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Doctor / Source
              </label>
              <input
                required
                type="text"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                placeholder="Dr. Name"
                onChange={(e) =>
                  setFormData({ ...formData, doctor: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Category
              </label>
              <select
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <option value="Lab Result">Lab Result</option>
                <option value="Radiology">Radiology</option>
                <option value="Prescription">Prescription</option>
                <option value="Checkup">General Checkup</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                File Format
              </label>
              <select
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                onChange={(e) =>
                  setFormData({ ...formData, fileType: e.target.value })
                }
              >
                <option value="pdf">PDF Document</option>
                <option value="image">Image (JPG/PNG)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Summary / Notes
            </label>
            <textarea
              rows="2"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none text-sm"
              placeholder="Brief description of findings..."
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-95"
          >
            Save & Publish Report
          </button>
        </form>
      </div>
    </div>
  );
}
