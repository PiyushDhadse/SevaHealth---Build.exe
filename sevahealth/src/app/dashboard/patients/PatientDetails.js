'use client';

import { X, Phone, MapPin, Calendar, User } from 'lucide-react';

export default function PatientDetails({ patient, onClose }) {
    if (!patient) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{patient.name}</h2>
                        <p className="text-gray-600">{patient.id}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X size={24} />
                    </button>
                </div>

                {/* Patient Info */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Personal Information</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <User className="text-gray-400" size={18} />
                                        <div>
                                            <p className="text-sm text-gray-500">Age</p>
                                            <p className="font-medium">{patient.age} years</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="text-gray-400" size={18} />
                                        <div>
                                            <p className="text-sm text-gray-500">Contact</p>
                                            <p className="font-medium">{patient.contact}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin className="text-gray-400" size={18} />
                                        <div>
                                            <p className="text-sm text-gray-500">Location</p>
                                            <p className="font-medium">{patient.location}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Health Status */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Health Status</h3>
                                <div className="inline-block px-4 py-2 rounded-full bg-red-100 text-red-800 font-medium">
                                    {patient.status}
                                </div>
                            </div>
                        </div>

                        {/* ASHA Worker & Visits */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-2">ASHA Worker</h3>
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <p className="font-medium text-blue-800">{patient.ashaWorker}</p>
                                    <p className="text-sm text-blue-600 mt-1">{patient.location}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Last Visit</h3>
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                    <Calendar className="text-gray-400" size={18} />
                                    <div>
                                        <p className="font-medium">{patient.lastVisit}</p>
                                        <p className="text-sm text-gray-500">DD/MM/YYYY</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-8 pt-6 border-t">
                        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                            Schedule Follow-up
                        </button>
                        <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                            Edit Profile
                        </button>
                        <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                            View History
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}