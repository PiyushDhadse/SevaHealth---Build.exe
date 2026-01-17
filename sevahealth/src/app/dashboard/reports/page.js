"use client";

import { useState } from "react";
import Link from "next/link";

export default function ReportsPage() {
  const [reports] = useState([
    {
      id: 1,
      title: "Monthly Health Assessment",
      doctor: "Dr. Anjali Sharma",
      date: "2026-01-10",
      description: "General health evaluation report including vitals and diagnosis.",
      fileUrl: "/reports/sample-report.pdf"
    },
    {
      id: 2,
      title: "Diabetes Follow-up Report",
      doctor: "Dr. Rajesh Kumar",
      date: "2026-01-08",
      description: "Blood sugar analysis and medication adjustments.",
      fileUrl: "/reports/sample-report.pdf"
    }
  ]);

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Medical Reports</h1>
          <p className="text-sm text-slate-500">
            Reports published by doctors
          </p>
        </div>

        {/* Create Report Button */}
        <Link
          href="/dashboard/reports/create"
          className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition"
        >
          + Create Report
        </Link>
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold text-slate-800">
              {report.title}
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              By <span className="font-medium">{report.doctor}</span>
            </p>

            <p className="text-xs text-slate-400 mt-1">
              Published on {report.date}
            </p>

            <p className="text-sm text-slate-600 mt-3">
              {report.description}
            </p>

            {/* Actions */}
            <div className="mt-5 flex justify-end">
              <a
                href={report.fileUrl}
                download
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
                           border border-emerald-600 text-emerald-600 rounded-lg
                           hover:bg-emerald-50 transition"
              >
                ⬇ Download Report
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
