"use client";

import { Search, Plus, Eye, Edit, Download } from 'lucide-react';
import { useState } from 'react';
import PatientDetails from './PatientDetails'; // Add this import

const patients = [
    {
        id: 'PAT001',
        name: 'Aarav Sharma',
        status: 'At Risk',
        age: 45,
        ashaWorker: 'Meena Kumari',
        lastVisit: '20/07/2024',
        contact: '+91 98765 43210',
        location: 'Sector 12, Delhi'
    },
    // ... rest of your patients array
];

export default function PatientsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedPatient, setSelectedPatient] = useState(null); // Add this state

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

    const handleViewPatient = (patient) => { // Updated function
        setSelectedPatient(patient);
    };

    const handleCloseDetails = () => {
        setSelectedPatient(null);
    };

    const handleAddPatient = () => {
        console.log('Adding new patient');
        // Open add patient modal/form
    };

    const handleExportData = () => {
        console.log('Exporting patient data');
        // Implement export functionality
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Patient Records</h1>
                <p className="text-gray-600 mt-2">Manage and view all patient data.</p>
            </div>

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

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleExportData}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            <Download size={18} />
                            Export
                        </button>
                        <button
                            onClick={handleAddPatient}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            <Plus size={18} />
                            Add New Patient
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
                                <th className="text-left py-4 px-6 text-gray-700 font-semibold">Patient</th>
                                <th className="text-left py-4 px-6 text-gray-700 font-semibold">Status</th>
                                <th className="text-left py-4 px-6 text-gray-700 font-semibold">Age</th>
                                <th className="text-left py-4 px-6 text-gray-700 font-semibold">ASHA Worker</th>
                                <th className="text-left py-4 px-6 text-gray-700 font-semibold">Last Visit</th>
                                <th className="text-left py-4 px-6 text-gray-700 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.map((patient) => (
                                <tr key={patient.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-4 px-6">
                                        <div>
                                            <p className="font-medium text-gray-800">{patient.name}</p>
                                            <p className="text-sm text-gray-500">{patient.id}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[patient.status]}`}>
                                            {patient.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-gray-700">{patient.age}</td>
                                    <td className="py-4 px-6">
                                        <div>
                                            <p className="text-gray-700">{patient.ashaWorker}</p>
                                            <p className="text-sm text-gray-500">{patient.location}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-gray-700">{patient.lastVisit}</td>
                                    <td className="py-4 px-6">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleViewPatient(patient)} // Pass the patient object
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                className="p-2 text-green-600 hover:bg-green-50 rounded"
                                                title="Edit Patient"
                                            >
                                                <Edit size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                    <p className="text-gray-600 text-sm">
                        Showing {filteredPatients.length} of {patients.length} patients
                    </p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                            Previous
                        </button>
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm bg-blue-600 text-white hover:bg-blue-700">
                            1
                        </button>
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                            2
                        </button>
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                <div className="bg-white p-5 rounded-xl shadow border">
                    <h3 className="text-gray-500 text-sm font-medium">Total Patients</h3>
                    <p className="text-2xl font-bold text-gray-800 mt-2">{patients.length}</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow border">
                    <h3 className="text-gray-500 text-sm font-medium">Critical</h3>
                    <p className="text-2xl font-bold text-red-600 mt-2">
                        {patients.filter(p => p.status === 'Critical').length}
                    </p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow border">
                    <h3 className="text-gray-500 text-sm font-medium">At Risk</h3>
                    <p className="text-2xl font-bold text-yellow-600 mt-2">
                        {patients.filter(p => p.status === 'At Risk').length}
                    </p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow border">
                    <h3 className="text-gray-500 text-sm font-medium">Stable</h3>
                    <p className="text-2xl font-bold text-green-600 mt-2">
                        {patients.filter(p => p.status === 'Stable').length}
                    </p>
                </div>
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