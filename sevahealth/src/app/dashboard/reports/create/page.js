"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateReportPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Later: save to DB / Supabase
    router.push("/dashboard/reports");
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Create Medical Report</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Report Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 border rounded-xl"
          required
        />

        <textarea
          placeholder="Report Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-3 border rounded-xl"
          rows={4}
          required
        />

        <input
          type="file"
          className="w-full border rounded-xl p-3"
          required
        />

        <button
          type="submit"
          className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700"
        >
          Publish Report
        </button>
      </form>
    </div>
  );
}
