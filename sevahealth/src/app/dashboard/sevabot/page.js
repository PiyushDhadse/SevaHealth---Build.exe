"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  Bot,
  Activity,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle2,
  Stethoscope,
  ChevronRight,
  Loader2,
  Thermometer,
  HeartPulse,
  Pill,
  FileText,
  UserCircle,
} from "lucide-react";

// --- DYNAMIC IMPORT FOR MAP ---
const DoctorMap = dynamic(() => import("@/src/components/DoctorMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[250px] bg-slate-100 animate-pulse rounded-xl" />
  ),
});

// --- DOCTOR DATABASE ---
const DOCTOR_DATABASE = [
  {
    id: 1,
    name: "Dr. Anjali Desai",
    specialty: "Cardiologist",
    location: "Mumbai",
    experience: "15 years",
    hospital: "Seva Heart Institute",
    coords: [19.076, 72.8777],
  },
  {
    id: 2,
    name: "Dr. Rajesh Kumar",
    specialty: "General Physician",
    location: "Delhi",
    experience: "8 years",
    hospital: "City Care Clinic",
    coords: [28.6139, 77.209],
  },
  {
    id: 3,
    name: "Dr. Priya Sharma",
    specialty: "Dermatologist",
    location: "Bangalore",
    experience: "10 years",
    hospital: "Skin & Glow Center",
    coords: [12.9716, 77.5946],
  },
  {
    id: 4,
    name: "Dr. Vikram Singh",
    specialty: "Orthopedist",
    location: "Mumbai",
    experience: "20 years",
    hospital: "Bone & Joint Care",
    coords: [19.0596, 72.8295],
  },
  {
    id: 5,
    name: "Dr. Meera Reddy",
    specialty: "Pediatrician",
    location: "Chennai",
    experience: "12 years",
    hospital: "Little Stars Hospital",
    coords: [13.0827, 80.2707],
  },
  {
    id: 6,
    name: "Dr. Suresh Patil",
    specialty: "Neurologist",
    location: "Pune",
    experience: "18 years",
    hospital: "Brain Health Clinic",
    coords: [18.5204, 73.8567],
  },
  {
    id: 7,
    name: "Dr. Neha Gupta",
    specialty: "Gynecologist",
    location: "Delhi",
    experience: "9 years",
    hospital: "Women's Wellness Hub",
    coords: [28.5355, 77.391],
  },
];

export default function SevaBotPage() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");

  // --- ENHANCED STATE FOR COMPREHENSIVE MEDICAL DATA ---
  const [formData, setFormData] = useState({
    // Basic Bio
    age: "",
    gender: "Male",
    location: "",

    // Clinical Signs
    symptoms: "",
    duration: "",
    severity: "Moderate",

    // Vitals (Optional but helpful)
    temperature: "", // e.g. 101 F
    bp: "", // e.g. 120/80

    // History
    allergies: "", // e.g. Penicillin, Peanuts
    medications: "", // e.g. Metformin, Aspirin
    history: "", // e.g. Diabetic, Previous Surgery
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!formData.symptoms || !formData.location) return;

    setLoading(true);
    setResponse(null);
    setError("");

    // --- PROMPT WITH ENHANCED CONTEXT ---
    const prompt = `
      You are SevaBot, a highly advanced medical triage AI.
      
      CONTEXT:
      You are analyzing a patient to recommend a specialist from a fixed database. 
      Consider allergies and vitals deeply in your analysis (e.g., High fever + neck pain = meningitis risk?).

      PATIENT CLINICAL PROFILE:
      1. BIO: Age ${formData.age}, ${formData.gender}, Location: ${formData.location}
      2. SYMPTOMS: ${formData.symptoms} (Duration: ${formData.duration}, Severity: ${formData.severity})
      3. VITALS: Temp: ${formData.temperature || "Not measured"}, BP: ${formData.bp || "Not measured"}
      4. HISTORY: 
         - Existing Conditions: ${formData.history || "None"}
         - Current Meds: ${formData.medications || "None"}
         - Allergies: ${formData.allergies || "None"}

      STRICT DATABASE (Select Doctor ONLY from here):
      ${JSON.stringify(DOCTOR_DATABASE)}

      TASK:
      1. ANALYZE: Provide a clinical assessment considering the vitals and history.
      2. TRIAGE: Is this an emergency? (Yes/No).
      3. MATCH: Select the best doctor from the list.
      4. ADVISE: Provide 3 home care tips (Warning about allergies if relevant).

      OUTPUT FORMAT (JSON ONLY):
      {
        "analysis": "string",
        "is_emergency": boolean,
        "recommended_doctor_id": number, 
        "doctor_match_reason": "string",
        "home_care": ["string", "string", "string"]
      }
    `;

    try {
      const res = await fetch("/api/sevabot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch response");

      let jsonText = data.candidates[0].content.parts[0].text;
      jsonText = jsonText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      const parsedData = JSON.parse(jsonText);

      // Merge with local DB
      const fullDoctorDetails =
        DOCTOR_DATABASE.find(
          (d) => d.id === parsedData.recommended_doctor_id,
        ) || DOCTOR_DATABASE[0];

      setResponse({
        ...parsedData,
        doctor_details: fullDoctorDetails,
      });
    } catch (err) {
      console.error("SevaBot Error:", err);
      setError(err.message || "Connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
          <Bot className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">SevaBot AI</h1>
          <p className="text-slate-500 font-medium">
            Advanced Clinical Triage & Map Locator
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* --- LEFT: COMPREHENSIVE INPUT FORM (Span 7 cols) --- */}
        {/* --- LEFT: COMPREHENSIVE INPUT FORM (Span 7 cols) --- */}
        <div className="lg:col-span-7 bg-white rounded-3xl shadow-xl border border-slate-100 h-fit overflow-hidden">
          <div className="p-6 bg-slate-50 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
              <Activity size={20} className="text-indigo-600" /> Patient Intake
              Form
            </h2>
          </div>

          <form onSubmit={handleAnalyze} className="p-6 md:p-8 space-y-8">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 text-sm rounded-xl flex items-center gap-2">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {/* SECTION 1: BIO & LOCATION */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <UserCircle size={14} /> Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="number"
                  name="age"
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Age"
                  required
                />
                <select
                  name="gender"
                  onChange={handleChange}
                  className="input-field"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  name="location"
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="City (e.g. Mumbai)"
                  required
                />
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* SECTION 2: CLINICAL SYMPTOMS & VITALS */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Thermometer size={14} /> Vitals & Symptoms
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Thermometer
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="temperature"
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="Body Temp (e.g. 101°F)"
                  />
                </div>
                <div className="relative">
                  <HeartPulse
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="bp"
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="BP (e.g. 120/80)"
                  />
                </div>
              </div>

              <textarea
                name="symptoms"
                onChange={handleChange}
                className="input-field min-h-[100px]"
                placeholder="Describe main symptoms clearly..."
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="duration"
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Duration (e.g. 2 days)"
                />
                <select
                  name="severity"
                  onChange={handleChange}
                  className="input-field"
                >
                  <option>Mild Pain</option>
                  <option>Moderate Pain</option>
                  <option>Severe Pain</option>
                  <option>Unbearable</option>
                </select>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* SECTION 3: MEDICAL HISTORY */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <FileText size={14} /> Medical Background
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <AlertCircle
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500"
                    size={18}
                  />
                  <input
                    type="text"
                    name="allergies"
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="Allergies (e.g. Penicillin)"
                  />
                </div>
                <div className="relative">
                  <Pill
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500"
                    size={18}
                  />
                  <input
                    type="text"
                    name="medications"
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="Current Meds"
                  />
                </div>
              </div>
              <textarea
                name="history"
                onChange={handleChange}
                className="input-field min-h-[80px]"
                placeholder="Relevant history (Diabetes, recent surgery, etc.)"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-70 transition-all text-lg mt-4"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Bot size={22} /> Run Diagnosis
                </>
              )}
            </button>
          </form>
        </div>

        {/* --- RIGHT: RESULTS (Span 5 cols) --- */}
        <div className="lg:col-span-5 space-y-6">
          {!response && !loading && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 p-8 text-center">
              <Bot size={48} className="mb-4 text-slate-300" />
              <p className="font-medium text-lg text-slate-500">
                Waiting for Clinical Data
              </p>
              <p className="text-sm mt-2">
                Fill in the comprehensive intake form for an accurate AI
                diagnosis.
              </p>
            </div>
          )}

          {loading && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white rounded-3xl shadow-xl p-8 space-y-6 animate-pulse border border-slate-100">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-200 rounded-full animate-ping opacity-20"></div>
                <Loader2
                  size={48}
                  className="animate-spin text-indigo-600 relative z-10"
                />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-slate-800 text-lg">
                  Analyzing Clinical Profile...
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  Checking drug interactions & vital signs
                </p>
              </div>
            </div>
          )}

          {response && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              {/* Emergency Alert */}
              {response.is_emergency && (
                <div className="bg-rose-600 text-white p-4 rounded-2xl flex gap-3 items-center shadow-lg shadow-rose-200">
                  <AlertCircle className="shrink-0 w-8 h-8" />
                  <div>
                    <h3 className="font-bold text-lg">Emergency Detected</h3>
                    <p className="text-rose-100 text-sm">
                      Vital signs or symptoms indicate immediate care is needed.
                    </p>
                  </div>
                </div>
              )}

              {/* Analysis Card */}
              <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100">
                <h3 className="text-indigo-600 font-bold uppercase text-xs mb-3 flex items-center gap-2">
                  <Activity size={14} /> Clinical Assessment
                </h3>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {response.analysis}
                </p>

                <div className="mt-5 pt-5 border-t border-slate-100">
                  <h4 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500" />{" "}
                    Recommended Action
                  </h4>
                  <ul className="space-y-2">
                    {response.home_care.map((tip, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100"
                      >
                        • {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Doctor & Map Card */}
              <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="p-5 bg-slate-900 text-white">
                  <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                    Top Match Specialist
                  </h3>
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold">
                        {response.doctor_details.name}
                      </h2>
                      <p className="text-indigo-400 text-sm">
                        {response.doctor_details.specialty}
                      </p>
                    </div>
                    <Stethoscope className="text-indigo-400" />
                  </div>
                </div>

                <div className="h-[250px] w-full relative z-0">
                  <DoctorMap
                    coords={response.doctor_details.coords}
                    doctorName={response.doctor_details.name}
                    hospital={response.doctor_details.hospital}
                  />
                </div>

                <div className="p-4 bg-slate-50">
                  <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg">
                    Book Appointment <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .input-field {
          @apply w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium text-slate-700;
        }
      `}</style>
    </div>
  );
}
