"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase/Client";

const libraries = ["places"];

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    pincode: "",
    governmentId: "",
    role: "doctor",
    password: "",
    confirmPassword: ""
  });

  const [autoComplete, setAutoComplete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onPlaceChanged = () => {
    if (!autoComplete) return;

    const place = autoComplete.getPlace();
    let city = "", country = "", pincode = "";

    place.address_components?.forEach((component) => {
      if (component.types.includes("locality")) city = component.long_name;
      if (component.types.includes("country")) country = component.long_name;
      if (component.types.includes("postal_code")) pincode = component.long_name;
    });

    setFormData((prev) => ({
      ...prev,
      city,
      country,
      pincode
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const {
      name, email, phone, city, country, pincode,
      governmentId, role, password, confirmPassword
    } = formData;

    if (!name || !email || !phone || !city || !country || !pincode || !governmentId) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
            city,
            country,
            pincode,
            government_id: governmentId,
            role
          }
        }
      });

      if (error) throw error;

      setSuccess("Registration successful. Verify your email.");
      setTimeout(() => router.push("/login"), 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return ( 
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-white to-teal-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">

          <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-3">{success}</p>}

          <form onSubmit={handleRegister} className="space-y-4">

            <input name="name" placeholder="Full Name" onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl" required />

            <input name="email" type="email" placeholder="Email"
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl" required />

            <input name="phone" placeholder="Phone Number"
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl" required />

            <input name="city" placeholder="City"
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl bg-gray-100" required/>

            <input name="country" placeholder="Country"
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl bg-gray-100" required/>

            <input name="pincode" placeholder="Pincode"
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl bg-gray-100" required/>

            <input name="governmentId" placeholder="Government ID"  
              onChange={handleChange}  
              className="w-full px-4 py-3 border rounded-xl"  required/>

            <select name="role" onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl">
              <option value="doctor">Doctor</option>
              <option value="asha_worker">ASHA Worker</option>
              <option value="admin">Admin</option>
            </select>

            <input name="password" type="password" placeholder="Password"
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl" required />

            <input name="confirmPassword" type="password"
              placeholder="Confirm Password"
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl" required />

            <button
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold">
              {isLoading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            Already registered? <Link href="/login" className="text-blue-600">Login</Link>
          </p>

        </div>
      </div>
  );
}