'use client';

import { Video, Mail } from 'lucide-react';

export default function DoctorCard({ doctor }) {
    const handleMeetJoin = () => {
        if (typeof window !== 'undefined') {
            window.open(doctor.meetLink, '_blank');
            console.log(`Joining ${doctor.name}'s Google Meet`);
        }
    };

    const handleEmail = () => {
    if (typeof window !== 'undefined') {
        // Direct Gmail compose URL
        const subject = `Consultation Request - ${doctor.name}`;
        const body = `Dear ${doctor.name},\n\nI would like to request a consultation regarding...`;
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(doctor.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        window.open(gmailUrl, '_blank');
        console.log(`Opening Gmail for ${doctor.name} at ${doctor.email}`);
    }
};

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6 hover:shadow-lg transition-shadow duration-300">
            <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{doctor.name}</h2>
                <p className="text-gray-600 mt-1">{doctor.hospital}</p>
            </div>

            <div className="space-y-3 mb-6">
                <div>
                    <p className="text-sm font-medium text-gray-500">Specialization</p>
                    <p className="text-gray-800 font-medium">{doctor.specialization}</p>
                </div>

                <div>
                    <p className="text-sm font-medium text-gray-500">Availability</p>
                    <p className="text-gray-800 font-medium">{doctor.availability}</p>
                </div>

                <div>
                    <p className="text-sm font-medium text-gray-500">Next Available</p>
                    <p className="text-gray-800 font-medium">{doctor.nextAvailable}</p>
                </div>
            </div>

            <div className="space-y-3">
                {/* Email Button */}
                <button
                    onClick={handleEmail}
                    className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300"
                >
                    <Mail size={20} />
                    Email
                </button>

                {/* Google Meet Button */}
                <button
                    onClick={handleMeetJoin}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300"
                >
                    <Video size={20} />
                    Join Google Meet
                </button>
            </div>
        </div>
    );
}