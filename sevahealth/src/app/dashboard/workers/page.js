// File: src/app/dashboard/workers/page.js
'use client';

import { Users, Clock, MapPin, Phone, Mail } from 'lucide-react';
import { useState } from 'react';

const ashaWorkers = [
    {
        id: 'ASHA001',
        name: 'Meena Kumari',
        area: 'Sector 12',
        patients: 34,
        lastActive: '2 hours ago',
        contact: '+91 98765 43210',
        email: 'meena.kumari@sevahealth.in',
        status: 'active'
    },
    {
        id: 'ASHA002',
        name: 'Geeta Devi',
        area: 'Sector 8',
        patients: 41,
        lastActive: '30 minutes ago',
        contact: '+91 87654 32109',
        email: 'geeta.devi@sevahealth.in',
        status: 'active'
    },
    {
        id: 'ASHA003',
        name: 'Sarita Singh',
        area: 'Village Kheri',
        patients: 28,
        lastActive: '5 hours ago',
        contact: '+91 76543 21098',
        email: 'sarita.singh@sevahealth.in',
        status: 'active'
    },
    {
        id: 'ASHA004',
        name: 'Kavita Sharma',
        area: 'Sector 5',
        patients: 52,
        lastActive: '1 hour ago',
        contact: '+91 65432 10987',
        email: 'kavita.sharma@sevahealth.in',
        status: 'active'
    },
    {
        id: 'ASHA005',
        name: 'Sunita Patel',
        area: 'Village Rampur',
        patients: 23,
        lastActive: '3 hours ago',
        contact: '+91 54321 09876',
        email: 'sunita.patel@sevahealth.in',
        status: 'offline'
    },
    {
        id: 'ASHA006',
        name: 'Rekha Verma',
        area: 'Sector 15',
        patients: 45,
        lastActive: 'Just now',
        contact: '+91 43210 98765',
        email: 'rekha.verma@sevahealth.in',
        status: 'active'
    }
];

export default function WorkersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterArea, setFilterArea] = useState('All');

    const uniqueAreas = ['All', ...new Set(ashaWorkers.map(worker => worker.area))];

    const filteredWorkers = ashaWorkers.filter(worker => {
        const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            worker.area.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesArea = filterArea === 'All' || worker.area === filterArea;
        return matchesSearch && matchesArea;
    });

    const handleViewProfile = (workerId) => {
        console.log(`Viewing profile for worker ${workerId}`);
        // Navigate to worker profile page
        // router.push(`/dashboard/workers/${workerId}`);
    };

    const handleAddWorker = () => {
        console.log('Adding new ASHA worker');
        // Open add worker modal/form
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">ASHA Health Workers</h1>
                <p className="text-gray-600 mt-2">Monitor and manage your community health workers.</p>
            </div>

            {/* Filters and Actions */}
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                {/* Search Bar */}
                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Search workers..."
                        className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Area Filter */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-700 font-medium">Area:</span>
                        <select
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filterArea}
                            onChange={(e) => setFilterArea(e.target.value)}
                        >
                            {uniqueAreas.map(area => (
                                <option key={area} value={area}>{area}</option>
                            ))}
                        </select>
                    </div>

                    {/* Add Worker Button */}
                    <button
                        onClick={handleAddWorker}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <Users size={18} />
                        Add New Worker
                    </button>
                </div>
            </div>

            {/* ASHA Workers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWorkers.map((worker) => (
                    <div key={worker.id} className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
                        {/* Worker Header */}
                        <div className="mb-6">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800">{worker.name}</h2>
                                    <div className="flex items-center gap-1 mt-1">
                                        <MapPin size={16} className="text-gray-400" />
                                        <p className="text-gray-600">{worker.area}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${worker.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {worker.status === 'active' ? '● Active' : '○ Offline'}
                                </span>
                            </div>

                            {/* Worker Stats */}
                            <div className="space-y-4">
                                {/* Patients */}
                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Users size={20} className="text-blue-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Patients</p>
                                            <p className="text-2xl font-bold text-gray-800">{worker.patients}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Last Active */}
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Clock size={20} className="text-gray-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Last Active</p>
                                            <p className="text-lg font-semibold text-gray-800">{worker.lastActive}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="mt-6 space-y-3">
                                <div className="flex items-center gap-3">
                                    <Phone size={16} className="text-gray-400" />
                                    <p className="text-gray-700">{worker.contact}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail size={16} className="text-gray-400" />
                                    <p className="text-gray-700 text-sm truncate">{worker.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* View Profile Button */}
                        <button
                            onClick={() => handleViewProfile(worker.id)}
                            className="w-full mt-6 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300"
                        >
                            View Profile
                        </button>
                    </div>
                ))}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                <div className="bg-white p-5 rounded-xl shadow border">
                    <h3 className="text-gray-500 text-sm font-medium">Total Workers</h3>
                    <p className="text-2xl font-bold text-gray-800 mt-2">{ashaWorkers.length}</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow border">
                    <h3 className="text-gray-500 text-sm font-medium">Active Now</h3>
                    <p className="text-2xl font-bold text-green-600 mt-2">
                        {ashaWorkers.filter(w => w.status === 'active').length}
                    </p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow border">
                    <h3 className="text-gray-500 text-sm font-medium">Total Patients</h3>
                    <p className="text-2xl font-bold text-blue-600 mt-2">
                        {ashaWorkers.reduce((sum, worker) => sum + worker.patients, 0)}
                    </p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow border">
                    <h3 className="text-gray-500 text-sm font-medium">Avg. Patients/Worker</h3>
                    <p className="text-2xl font-bold text-purple-600 mt-2">
                        {Math.round(ashaWorkers.reduce((sum, worker) => sum + worker.patients, 0) / ashaWorkers.length)}
                    </p>
                </div>
            </div>
        </div>
    );
}