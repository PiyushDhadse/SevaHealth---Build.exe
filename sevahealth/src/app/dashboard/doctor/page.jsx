'use client';
import { useState } from 'react';
import { 
  Stethoscope, Search, Filter, Phone, Mail, Video, 
  MapPin, Clock, CalendarCheck, Star, Plus, X, Save
} from 'lucide-react';
import { ProtectedRoute, useRolePermissions } from '@/src/lib/rbac';
import { ROLES } from '@/src/lib/rbac/permissions';

// --- INITIAL MOCK DATA ---
const initialDoctorsData = [
    {
        id: 1,
        name: "Dr. Rohan Sharma",
        hospital: "Apollo Hospital, Delhi",
        specialization: "Cardiologist",
        phone: "+91 98765 43210",
        email: "stparate@gmail.com",
        availability: "Mon-Fri, 9 AM - 5 PM",
        nextAvailable: "Today, 3:00 PM",
        meetLink: "https://meet.google.com/ffe-sibr-akq",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan&backgroundColor=b6e3f4",
        experience: "12 Yrs",
        rating: 4.8
    },
    {
        id: 2,
        name: "Dr. Priya Patel",
        hospital: "Fortis Hospital, Mumbai",
        specialization: "Neurologist",
        phone: "+91 87654 32109",
        email: "stparate@gmail.com",
        availability: "Mon-Sat, 10 AM - 6 PM",
        nextAvailable: "Tomorrow, 11:00 AM",
        meetLink: "https://meet.google.com/ffe-sibr-akq",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya&backgroundColor=ffdfbf",
        experience: "8 Yrs",
        rating: 4.9
    },
    {
        id: 3,
        name: "Dr. Anil Gupta",
        hospital: "Max Super Speciality, Delhi",
        specialization: "Orthopedic Surgeon",
        phone: "+91 76543 21098",
        email: "stparate@gmail.com",
        availability: "Mon-Fri, 8 AM - 4 PM",
        nextAvailable: "Today, 4:30 PM",
        meetLink: "https://meet.google.com/ffe-sibr-akq",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anil&backgroundColor=c0aede",
        experience: "15 Yrs",
        rating: 4.7
    },
    // ... Keeping previous data for variety
    {
        id: 4,
        name: "Dr. Sunita Reddy",
        hospital: "AIIMS Delhi",
        specialization: "Pediatrician",
        phone: "+91 65432 10987",
        email: "stparate@gmail.com",
        availability: "24/7 Emergency",
        nextAvailable: "Available Now",
        meetLink: "https://meet.google.com/ffe-sibr-akq",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sunita&backgroundColor=ffdfbf",
        experience: "10 Yrs",
        rating: 5.0
    }
];

function DoctorsPageContent() {
    const { isAshaWorker } = useRolePermissions();
    const [doctors, setDoctors] = useState(initialDoctorsData); // State for doctors list
    const [searchTerm, setSearchTerm] = useState("");
    const [specialtyFilter, setSpecialtyFilter] = useState("All");
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal State

    // --- FILTER LOGIC ---
    const filteredDoctors = doctors.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              doc.hospital.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpecialty = specialtyFilter === "All" || doc.specialization === specialtyFilter;
        return matchesSearch && matchesSpecialty;
    });

    const specialties = ["All", ...new Set(doctors.map(d => d.specialization))];

    // --- ADD DOCTOR HANDLER ---
    const handleAddDoctor = (newDoctorData) => {
        const newDoctor = {
            id: doctors.length + 1,
            ...newDoctorData,
            image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newDoctorData.name.split(' ')[0]}&backgroundColor=e5e7eb`, // Auto-generate avatar
            rating: "New", // Default rating
            experience: newDoctorData.experience || "1 Yr"
        };
        setDoctors([newDoctor, ...doctors]);
        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans text-slate-900">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        Specialist Directory
                        <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider">
                            {filteredDoctors.length} Available
                        </span>
                    </h1>
                    <p className="text-slate-500 mt-1">
                        {isAshaWorker 
                            ? 'Connect with specialist doctors for patient consultations and medical guidance.'
                            : 'Direct access to medical specialists via secure channels.'}
                    </p>
                </div>
                
                {/* ADD DOCTOR BUTTON */}
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all active:scale-95"
                >
                    <Plus size={20} />
                    <span>Add Specialist</span>
                </button>
            </div>

            {/* --- ASHA BANNER (Conditionally Rendered) --- */}
            {isAshaWorker && (
                <div className="mb-8 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
                    <Stethoscope className="absolute right-4 bottom-4 text-white opacity-10 w-32 h-32" />
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                            <Stethoscope className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold mb-1">ASHA Priority Access Enabled</h3>
                            <p className="text-indigo-100 text-sm max-w-2xl">
                                You have priority access to consult with specialists for your patients. 
                                Use the &quot;Emergency Connect&quot; options for urgent cases requiring immediate attention.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* --- FILTERS --- */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search doctors by name or hospital..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative min-w-[200px]">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <select
                        className="w-full pl-10 pr-8 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:border-indigo-500 outline-none appearance-none cursor-pointer shadow-sm"
                        value={specialtyFilter}
                        onChange={(e) => setSpecialtyFilter(e.target.value)}
                    >
                        {specialties.map(spec => (
                            <option key={spec} value={spec}>{spec}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* --- DOCTORS GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map((doctor) => (
                    <DoctorCardV2 key={doctor.id} doctor={doctor} />
                ))}
            </div>

            {/* --- FOOTER INSTRUCTIONS --- */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <InstructionCard 
                    icon={<Phone size={20} />} 
                    title="Phone Consultation" 
                    desc="Direct line for urgent discussions." 
                    color="emerald"
                />
                <InstructionCard 
                    icon={<Mail size={20} />} 
                    title="Email Records" 
                    desc="Send patient history securely." 
                    color="blue"
                />
                <InstructionCard 
                    icon={<Video size={20} />} 
                    title="Video Consult" 
                    desc="Google Meet for visual diagnosis." 
                    color="rose"
                />
            </div>

            {/* --- ADD DOCTOR MODAL --- */}
            {isModalOpen && (
                <AddDoctorModal onClose={() => setIsModalOpen(false)} onSave={handleAddDoctor} />
            )}
        </div>
    );
}

// --- SUB COMPONENTS ---

// 1. DOCTOR CARD
function DoctorCardV2({ doctor }) {
    const handleEmail = () => {
        window.open(`mailto:${doctor.email}?subject=Consultation Request - [Patient Name]`, '_blank');
    };

    const handleMeet = () => {
        window.open(doctor.meetLink, '_blank');
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full group">
            {/* Top Section */}
            <div className="p-6 pb-4 border-b border-slate-50 flex gap-4">
                <img 
                    src={doctor.image} 
                    alt={doctor.name} 
                    className="w-16 h-16 rounded-2xl bg-slate-100 object-cover border border-slate-100 shadow-sm"
                />
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 truncate">{doctor.name}</h3>
                            <p className="text-sm font-medium text-slate-500 truncate flex items-center gap-1">
                                <MapPin size={12} /> {doctor.hospital}
                            </p>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded text-xs font-bold">
                            <Star size={10} fill="currentColor" /> {doctor.rating}
                        </div>
                    </div>
                    
                    <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wide">
                            {doctor.specialization}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                            • {doctor.experience} Exp
                        </span>
                    </div>
                </div>
            </div>

            {/* Details Section */}
            <div className="p-6 py-4 flex-1 space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                    <Clock size={16} className="text-slate-400 shrink-0" />
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Availability</p>
                        <p className="font-semibold">{doctor.availability}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3 text-sm text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                    <CalendarCheck size={16} className="text-emerald-500 shrink-0" />
                    <div>
                        <p className="text-[10px] font-bold text-emerald-500 uppercase">Next Slot</p>
                        <p className="font-bold">{doctor.nextAvailable}</p>
                    </div>
                </div>
            </div>

            {/* Actions Section */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-3 gap-2">
                <a 
                    href={`tel:${doctor.phone}`}
                    className="flex flex-col items-center justify-center gap-1 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-bold hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors group/btn"
                >
                    <Phone size={18} className="text-slate-400 group-hover/btn:text-emerald-500" />
                    Call
                </a>

                <button 
                    onClick={handleEmail}
                    className="flex flex-col items-center justify-center gap-1 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-bold hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors group/btn"
                >
                    <Mail size={18} className="text-slate-400 group-hover/btn:text-blue-500" />
                    Email
                </button>

                <button 
                    onClick={handleMeet}
                    className="flex flex-col items-center justify-center gap-1 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-bold hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors group/btn"
                >
                    <Video size={18} className="text-slate-400 group-hover/btn:text-rose-500" />
                    Meet
                </button>
            </div>
        </div>
    );
}

// 2. INSTRUCTION CARD
function InstructionCard({ icon, title, desc, color }) {
    const colors = {
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
        blue: "text-blue-600 bg-blue-50 border-blue-100",
        rose: "text-rose-600 bg-rose-50 border-rose-100",
    };

    return (
        <div className={`p-4 rounded-xl border flex items-center gap-3 ${colors[color]}`}>
            <div className="p-2 bg-white/60 rounded-lg backdrop-blur-sm">
                {icon}
            </div>
            <div>
                <h4 className="font-bold text-sm">{title}</h4>
                <p className="text-xs opacity-80">{desc}</p>
            </div>
        </div>
    );
}

// 3. ADD DOCTOR MODAL FORM
function AddDoctorModal({ onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: "",
        hospital: "",
        specialization: "General Physician",
        phone: "",
        email: "",
        availability: "Mon-Fri, 9 AM - 5 PM",
        nextAvailable: "Tomorrow, 10:00 AM",
        meetLink: "https://meet.google.com/new", // Default
        experience: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-lg text-slate-800">Add New Specialist</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Doctor Name</label>
                            <input required name="name" onChange={handleChange} placeholder="e.g. Dr. Jane Doe" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Specialization</label>
                            <select name="specialization" onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
                                <option>General Physician</option>
                                <option>Cardiologist</option>
                                <option>Neurologist</option>
                                <option>Dermatologist</option>
                                <option>Pediatrician</option>
                                <option>Orthopedic</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Hospital / Clinic</label>
                        <input required name="hospital" onChange={handleChange} placeholder="e.g. City General Hospital" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Phone</label>
                            <input required name="phone" onChange={handleChange} placeholder="+91 987..." className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                            <input required type="email" name="email" onChange={handleChange} placeholder="doctor@hospital.com" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Availability</label>
                            <input name="availability" onChange={handleChange} defaultValue="Mon-Fri, 9 AM - 5 PM" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Experience</label>
                            <input name="experience" onChange={handleChange} placeholder="e.g. 5 Yrs" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                        </div>
                    </div>

                    <div className="space-y-1">
                         <label className="text-xs font-bold text-slate-500 uppercase">Google Meet Link</label>
                         <input name="meetLink" onChange={handleChange} defaultValue="https://meet.google.com/new" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-600" />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition">Cancel</button>
                        <button type="submit" className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition flex items-center justify-center gap-2">
                            <Save size={18} /> Save Doctor
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function DoctorsPage() {
    return (
        <ProtectedRoute allowedRoles={[ROLES.DOCTOR, ROLES.ASHA_WORKER, ROLES.SUPERVISOR]}>
            <DoctorsPageContent />
        </ProtectedRoute>
    );
}