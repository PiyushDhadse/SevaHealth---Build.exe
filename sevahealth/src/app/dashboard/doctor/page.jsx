import DoctorCard from '@/src/components/dashboard/doctors/DoctorCard';

const doctors = [
    {
        id: 1,
        name: "Dr. Rohan Sharma",
        hospital: "Apollo Hospital, Delhi",
        specialization: "Cardiologist",
        phone: "+91 98765 43210",
        email: "stparate@gmail.com", // Added email
        availability: "Mon-Fri, 9 AM - 5 PM",
        nextAvailable: "Today, 3:00 PM",
        meetLink: "https://meet.google.com/ffe-sibr-akq",
    },
    {
        id: 2,
        name: "Dr. Priya Patel",
        hospital: "Fortis Hospital, Mumbai",
        specialization: "Neurologist",
        phone: "+91 87654 32109",
        email: "stparate@gmail.com", // Added email
        availability: "Mon-Sat, 10 AM - 6 PM",
        nextAvailable: "Tomorrow, 11:00 AM",
        meetLink: "https://meet.google.com/ffe-sibr-akq",
    },
    {
        id: 3,
        name: "Dr. Anil Gupta",
        hospital: "Max Super Speciality, Delhi",
        specialization: "Orthopedic Surgeon",
        phone: "+91 76543 21098",
        email: "stparate@gmail.com", // Added email
        availability: "Mon-Fri, 8 AM - 4 PM",
        nextAvailable: "Today, 4:30 PM",
        meetLink: "https://meet.google.com/ffe-sibr-akq",
    },
    {
        id: 4,
        name: "Dr. Sunita Reddy",
        hospital: "AIIMS Delhi",
        specialization: "Pediatrician",
        phone: "+91 65432 10987",
        email: "stparate@gmail.com", // Added email
        availability: "24/7 Emergency",
        nextAvailable: "Available Now",
        meetLink: "https://meet.google.com/ffe-sibr-akq",
    },
    {
        id: 5,
        name: "Dr. Vikram Singh",
        hospital: "Medanta Hospital, Gurgaon",
        specialization: "Oncologist",
        phone: "+91 54321 09876",
        email: "stparate@gmail.com", // Added email
        availability: "By Appointment",
        nextAvailable: "Wednesday, 2:00 PM",
        meetLink: "https://meet.google.com/ffe-sibr-akq",
    },
    {
        id: 6,
        name: "Dr. Neha Verma",
        hospital: "Columbia Asia, Pune",
        specialization: "Dermatologist",
        phone: "+91 43210 98765",
        email: "stparate@gmail.com", // Added email
        availability: "Mon-Sat, 11 AM - 7 PM",
        nextAvailable: "Thursday, 3:30 PM",
        meetLink: "https://meet.google.com/ffe-sibr-akq",
    }
];

export default function DoctorsPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Medical Specialists</h1>
                <p className="text-gray-600 mt-2">Connect with specialist doctors via call, email, or Google Meet video consultation.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
            </div>
            
            {/* Instructions Box */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">How to Contact Doctors:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
                    <div>
                        <h4 className="font-medium mb-1">📞 Phone Call</h4>
                        <p>Direct phone consultation with the doctor</p>
                    </div>
                    <div>
                        <h4 className="font-medium mb-1">✉️ Email</h4>
                        <p>Opens Gmail with pre-filled subject and doctor's email</p>
                    </div>
                    <div>
                        <h4 className="font-medium mb-1">🎥 Google Meet</h4>
                        <p>Video consultation through Google Meet</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

