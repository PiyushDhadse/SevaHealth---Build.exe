"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase/Client";
import { hashPassword, validatePassword } from "@/src/lib/utils/passwordUtils";

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
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const {
      name,
      email,
      phone,
      city,
      country,
      pincode,
      governmentId,
      role,
      password,
      confirmPassword,
    } = formData;

    // Validation
    if (!name || !email || !password) {
      setError("Name, email and password are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      // Validate password
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        setError(passwordValidation.error);
        return;
      }

      console.log("1. Checking if user already exists...");

      // Step 1: Check if user already exists
      const { data: existingUser } = await supabase
        .from("users")
        .select("email")
        .eq("email", email.trim())
        .single();

      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      console.log("2. Hashing password...");

      // Step 2: Hash password
      const passwordHash = await hashPassword(password);

      console.log("3. Creating user in database...");

      // Step 3: Insert user directly into database
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({
          email: email.trim(),
          password_hash: passwordHash,
          name: name,
          phone: phone || null,
          city: city || null,
          country: country || "India",
          pincode: pincode || null,
          gov_id: governmentId || null,
          user_type: role,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) {
        console.error("Insert error:", insertError);
        console.error("Error details:", {
          message: insertError.message,
          code: insertError.code,
          details: insertError.details,
          hint: insertError.hint,
        });

        // Provide helpful error messages
        let errorMessage = insertError.message || "Failed to create account";
        if (insertError.code === "42501") {
          errorMessage =
            "Permission denied. Check RLS policies or grant permissions.";
        } else if (insertError.code === "42P01") {
          errorMessage =
            "Table 'users' does not exist. Run supabase_schema.sql first!";
        } else if (insertError.code === "23505") {
          errorMessage = "User with this email already exists.";
        } else if (
          insertError.message?.includes("column") &&
          insertError.message?.includes("does not exist")
        ) {
          errorMessage = `Database column error: ${insertError.message}. Check schema!`;
        }

        throw new Error(errorMessage);
      }

      if (!newUser) {
        throw new Error(
          "User creation failed. No data returned from database."
        );
      }

      console.log("✅ User created successfully:", newUser.id);
      console.log("✅ User data:", JSON.stringify(newUser, null, 2));

      // Step 4: Verify user was actually created (double check)
      console.log("4. Verifying user in database...");
      const { data: verifyUser, error: verifyError } = await supabase
        .from("users")
        .select("*")
        .eq("id", newUser.id)
        .single();

      if (verifyError || !verifyUser) {
        console.error("Verification error:", verifyError);
        throw new Error(
          "User was created but verification failed. Please check database."
        );
      }

      console.log("✅ User verified:", verifyUser.email);

      // Step 5: Log activity (non-blocking)
      try {
        await supabase.from("activity_log").insert({
          user_id: newUser.id,
          action: "USER_REGISTER",
          entity_type: "user",
          entity_id: newUser.id,
          details: {
            email: email,
            role: role,
            name: name,
            method: "custom_auth",
          },
          ip_address: "web_registration",
          user_agent: navigator.userAgent,
          created_at: new Date().toISOString(),
        });
        console.log("✅ Activity logged");
      } catch (logErr) {
        console.warn("Activity logging failed (non-critical):", logErr);
      }

      // Step 5: Store user info in localStorage
      const userInfo = {
        id: newUser.id,
        email: email,
        name: name,
        role: role,
        user_type: role,
        logged_in: true,
      };

      localStorage.setItem("current_user", JSON.stringify(userInfo));
      localStorage.setItem("auth_user", JSON.stringify(userInfo));

      console.log("✅ Registration complete, redirecting...");
      setSuccess("Registration successful! Redirecting to dashboard...");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
      setSuccess("");
    } finally {
      setIsLoading(false);
    }
  };

  // Fill demo data for testing
  const fillDemoData = () => {
    setFormData({
      name: "Demo User",
      email: `demo${Date.now()}@test.com`,
      phone: "9876543210",
      city: "Mumbai",
      country: "India",
      pincode: "400001",
      governmentId: "DEMO123",
      role: "doctor",
      password: "demo123",
      confirmPassword: "demo123",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-white to-teal-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 text-sm">{success}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">

  {/* Full Name */}
  <input
    name="name"
    placeholder="Full Name"
    onChange={handleChange}
    className="w-full px-4 py-3 border rounded-xl"
    required
  />

  {/* Email */}
  <input
    name="email"
    type="email"
    placeholder="Email"
    onChange={handleChange}
    className="w-full px-4 py-3 border rounded-xl"
    required
  />

  {/* Phone */}
  <input
    name="phone"
    placeholder="Phone Number"
    onChange={handleChange}
    className="w-full px-4 py-3 border rounded-xl"
    required
  />

  {/* City & Country */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    <input
      name="city"
      placeholder="City"
      onChange={handleChange}
      className="w-full px-4 py-3 border rounded-xl bg-gray-100"
      required
    />

    <input
      name="country"
      placeholder="Country"
      onChange={handleChange}
      className="w-full px-4 py-3 border rounded-xl bg-gray-100"
      required
    />
  </div>

  {/* Pincode & Government ID */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    <input
      name="pincode"
      placeholder="Pincode"
      onChange={handleChange}
      className="w-full px-4 py-3 border rounded-xl bg-gray-100"
      required
    />

    <input
      name="governmentId"
      placeholder="Government ID"
      onChange={handleChange}
      className="w-full px-4 py-3 border rounded-xl"
      required
    />
  </div>

  {/* Role */}
  <select
    name="role"
    onChange={handleChange}
    className="w-full px-4 py-3 border rounded-xl"
  >
    <option value="doctor">Doctor</option>
    <option value="asha_worker">ASHA Worker</option>
    <option value="admin">Admin</option>
  </select>

  {/* Passwords */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    <input
      name="password"
      type="password"
      placeholder="Password"
      onChange={handleChange}
      className="w-full px-4 py-3 border rounded-xl"
      required
    />

    <input
      name="confirmPassword"
      type="password"
      placeholder="Confirm Password"
      onChange={handleChange}
      className="w-full px-4 py-3 border rounded-xl"
      required
    />
  </div>

  {/* Submit */}
  <button
    disabled={isLoading}
    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold"
  >
    {isLoading ? "Registering..." : "Register"}
  </button>

</form>


        <div className="mt-6 space-y-4">
          <button
            onClick={fillDemoData}
            className="w-full p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
            disabled={isLoading}
          >
            Fill Demo Data
          </button>

          <p className="text-center text-sm">
            Already registered?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>

        {/* Info box */}
        <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs text-blue-800">
            <strong>Direct Registration:</strong> No email confirmation needed.
            Instant access.
          </p>
        </div>
      </div>
    </div>
  );
}
