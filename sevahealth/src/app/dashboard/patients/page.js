"use client";

import { Search, Plus, Eye, Edit, Download, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/src/lib/supabase/Client";
import PatientDetails from "./PatientDetails";
import AddPatientModal from "@/src/app/dashboard/patients/AddpatientModal"; // Ensure this component exists

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch patients from database
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("patients")
        .select(
          `
          *,
          users:registered_by(name)
        `,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPatients(data || []);
    } catch (err) {
      setError("Failed to load patients: " + err.message);
      console.error("Error fetching patients:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter patients based on search and status
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patient_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.contact?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || patient.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    Stable: "bg-green-100 text-green-800",
    "At Risk": "bg-yellow-100 text-yellow-800",
    Critical: "bg-red-100 text-red-800",
  };

  const handleViewPatient = (patient) => setSelectedPatient(patient);
  const handleCloseDetails = () => setSelectedPatient(null);
  const handleAddPatient = () => {
    console.log("Add patient clicked - Opening modal");
    setShowAddModal(true);
  };

  const handleExportData = () => {
    console.log("Exporting patient data");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
          <p className="mt-2 text-gray-600">Loading patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Patient Records</h1>
        <p className="text-gray-600 mt-2">Manage and view all patient data.</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Filters and Actions */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-64">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-700 font-medium">Status:</span>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Stable">Stable</option>
              <option value="At Risk">At Risk</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Download size={18} /> Export
            </button>
            <button
              onClick={handleAddPatient}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={18} /> Add New Patient
            </button>
          </div>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-gray-700 font-semibold">
                  Patient ID
                </th>
                <th className="text-left py-4 px-6 text-gray-700 font-semibold">
                  Name
                </th>
                <th className="text-left py-4 px-6 text-gray-700 font-semibold">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-gray-700 font-semibold">
                  Age/Gender
                </th>
                <th className="text-left py-4 px-6 text-gray-700 font-semibold">
                  Contact
                </th>
                <th className="text-left py-4 px-6 text-gray-700 font-semibold">
                  Registered By
                </th>
                <th className="text-left py-4 px-6 text-gray-700 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-500">
                    No patients found
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-6 font-mono text-sm text-gray-600">
                      {patient.patient_code || "N/A"}
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium text-gray-800">
                        {patient.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {patient.patient_type || "General"}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[patient.status] || "bg-gray-100 text-gray-800"}`}
                      >
                        {patient.status || "Unknown"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {patient.age} yrs / {patient.gender}
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {patient.contact}
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {patient.users?.name || "System"}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewPatient(patient)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Eye size={18} />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                          <Edit size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <SummaryCard title="Total Patients" value={patients.length} />
        <SummaryCard
          title="Critical"
          value={patients.filter((p) => p.status === "Critical").length}
          color="text-red-600"
        />
        <SummaryCard
          title="At Risk"
          value={patients.filter((p) => p.status === "At Risk").length}
          color="text-yellow-600"
        />
        <SummaryCard
          title="Stable"
          value={patients.filter((p) => p.status === "Stable").length}
          color="text-green-600"
        />
      </div>

      {/* Modals */}
      {selectedPatient && (
        <PatientDetails
          patient={selectedPatient}
          onClose={handleCloseDetails}
          onUpdate={fetchPatients}
        />
      )}

      {showAddModal && (
        <AddPatientModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            fetchPatients();
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}

function SummaryCard({ title, value, color = "text-gray-800" }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow border">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className={`text-2xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
  );
}
