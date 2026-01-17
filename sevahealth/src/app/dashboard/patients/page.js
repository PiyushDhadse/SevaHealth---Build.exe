'use client';

import { Search, Plus, Eye, Edit, Download, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import PatientDetails from './PatientDetails';
import { useAuth } from '@/src/context/AuthContext';
import { useRolePermissions } from '@/src/lib/rbac';
import { PERMISSIONS } from '@/src/lib/rbac/permissions';

// Mock patients data - In production, this would come from Supabase
// Each patient should have a 'created_by' or 'asha_worker_id' field
const mockPatients = [
    {
        id: 'PAT001',
        name: 'Aarav Sharma',
        status: 'At Risk',
        age: 45,
        ashaWorker: 'Meena Kumari',
        ashaWorkerId: 'user_123', // ASHA worker ID who created this patient
        lastVisit: '20/07/2024',
        contact: '+91 98765 43210',
        location: 'Sector 12, Delhi',
        created_by: 'user_123' // User who created this patient
    },
    {
        id: 'PAT002',
        name: 'Priya Verma',
        status: 'Stable',
        age: 32,
        ashaWorker: 'Sunita Devi',
        ashaWorkerId: 'user_456',
        lastVisit: '22/07/2024',
        contact: '+91 98765 43211',
        location: 'Sector 15, Delhi',
        created_by: 'user_456'
    },
    {
        id: 'PAT003',
        name: 'Rajesh Kumar',
        status: 'Critical',
        age: 58,
        ashaWorker: 'Meena Kumari',
        ashaWorkerId: 'user_123',
        lastVisit: '19/07/2024',
        contact: '+91 98765 43212',
        location: 'Sector 12, Delhi',
        created_by: 'user_123'
    }
];

export default function PatientsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patients, setPatients] = useState([]);
    
    const { user } = useAuth();
    const { hasPermission, canViewAll, isAshaWorker } = useRolePermissions();

    useEffect(() => {
        // Load patients based on user role
        loadPatients();
    }, [user]);

    const loadPatients = () => {
        // In production, fetch from Supabase with role-based filtering
        let filteredData = mockPatients;
        
        // If ASHA worker, only show their own patients
        if (isAshaWorker && user) {
            filteredData = mockPatients.filter(p => p.created_by === user.id || p.ashaWorkerId === user.id);
        }
        
        setPatients(filteredData);
    };

    // Filter patients based on search and status
    const filteredPatients = patients.filter(patient => {
        const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.ashaWorker.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || patient.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const statusColors = {
        'Stable': 'bg-green-100 text-green-800',
        'At Risk': 'bg-yellow-100 text-yellow-800',
        'Critical': 'bg-red-100 text-red-800'
    };

    const handleViewPatient = (patient) => {
        setSelectedPatient(patient);
    };

    const handleCloseDetails = () => {
        setSelectedPatient(null);
    };

    const handleAddPatient = () => {
        if (!hasPermission(PERMISSIONS.CREATE_PATIENT)) {
            alert('You do not have permission to add patients');
            return;
        }
        console.log('Adding new patient');
        // Open add patient modal/form
    };

    const handleEditPatient = (patient) => {
        if (!hasPermission(PERMISSIONS.EDIT_PATIENT)) {
            alert('You do not have permission to edit patients');
            return;
        }
        
        // ASHA workers can only edit their own patients
        if (isAshaWorker && patient.created_by !== user?.id) {
            alert('You can only edit patients you created');
            return;
        }
        
        console.log('Editing patient:', patient.id);
        // Open edit patient modal/form
    };

    const handleExportData = () => {
        if (!hasPermission(PERMISSIONS.GENERATE_REPORT)) {
            alert('You do not have permission to export data');
            return;
        }
        console.log('Exporting patient data');
        // Implement export functionality
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Role Indicator */}
            {isAshaWorker && (
                <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
                    <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-medium text-blue-900">ASHA Worker View</p>
                        <p className="text-xs text-blue-700 mt-1">
                            You are viewing only the patients you have created or are assigned to.
                            {!canViewAll && ' To view all patients, contact your administrator.'}
                        </p>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Patient Records</h1>
                <p className="text-gray-600 mt-2">
                    {canViewAll 
                        ? 'Manage and view all patient data across the system.' 
                        : 'Manage and view your assigned patient data.'}
                </p>
            </div>

            {/* Filters and Actions */}
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                {/* Search Bar */}
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Filter by name..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-700 font-medium">Status:</span>
                        <select
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        {hasPermission(PERMISSIONS.GENERATE_REPORT) && (
                            <button
                                onClick={handleExportData}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                <Download size={18} />
                                Export
                            </button>
                        )}
                        {hasPermission(PERMISSIONS.CREATE_PATIENT) && (
                            <button
                                onClick={handleAddPatient}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <Plus size={18} />
                                Add New Patient
                            </button>
                        )}
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
                            {filteredPatients.length > 0 ? (
                                filteredPatients.map((patient) => (
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
                                                    onClick={() => handleViewPatient(patient)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                {(hasPermission(PERMISSIONS.EDIT_PATIENT) && 
                                                  (canViewAll || patient.created_by === user?.id)) && (
                                                    <button
                                                        onClick={() => handleEditPatient(patient)}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded"
                                                        title="Edit Patient"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center text-gray-500">
                                        No patients found matching your criteria
                                    </td>
                                </tr>
                            )}
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
                    <h3 className="text-gray-500 text-sm font-medium">
                        {canViewAll ? 'Total Patients' : 'My Patients'}
                    </h3>
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

            {/* Patient Details Modal */}
            {selectedPatient && (
                <PatientDetails
                    patient={selectedPatient}
                    onClose={handleCloseDetails}
                />
            )}
        </div>
    );
}
