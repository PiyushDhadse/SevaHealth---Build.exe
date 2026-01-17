'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/src/lib/supabase/Client";
import { verifyPassword, hashPassword } from "@/src/lib/utils/passwordUtils";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Check for message from registration
  useEffect(() => {
    const message = searchParams?.get("message");
    if (message) {
      setError(message);
    }
  }, [searchParams]);

  // Function to log activity
  const logActivity = async (userId, action, details = {}) => {
    try {
      const { error: logError } = await supabase.from("activity_log").insert({
        user_id: userId,
        action: action,
        entity_type: "user",
        entity_id: userId,
        details: details,
        ip_address: "web_login",
        user_agent: navigator.userAgent,
        created_at: new Date().toISOString(),
      });

      if (logError) {
        console.warn("Activity log error:", logError.message);
      }
    } catch (err) {
      console.warn("Failed to log activity:", err.message);
    }
  };

  // Main login handler using custom authentication
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      console.log("1. Checking user in database...");

      // Step 1: Get user from database
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email.trim())
        .eq("is_active", true)
        .single();

      if (userError || !user) {
        console.error("User not found:", userError);
        throw new Error("Invalid email or password");
      }

      console.log("✅ User found:", user.id);

      // Step 2: Verify password
      console.log("2. Verifying password...");
      const isPasswordValid = await verifyPassword(
        password,
        user.password_hash
      );

      if (!isPasswordValid) {
        console.error("Invalid password");
        throw new Error("Invalid email or password");
      }

      console.log("✅ Password verified");

      // Step 3: Log activity (non-blocking)
      try {
        await logActivity(user.id, "USER_LOGIN", {
          email: email,
          login_method: "email_password",
          timestamp: new Date().toISOString(),
        });
      } catch (logErr) {
        console.warn("Activity logging failed (non-critical):", logErr);
      }

      console.log("✅ Login complete, storing session...");

      // Step 4: Store user info for dashboard
      const userInfo = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.user_type,
        user_type: user.user_type,
        logged_in: true,
        last_login: new Date().toISOString(),
      };

      localStorage.setItem("current_user", JSON.stringify(userInfo));
      localStorage.setItem("auth_user", JSON.stringify(userInfo));
      console.log("✅ User info stored:", userInfo);

      // Step 5: Redirect based on role
      const userRole = user.user_type || "doctor";
      switch (userRole) {
        case "doctor":
          router.push("/dashboard/doctor");
          break;
        case "asha_worker":
          router.push("/dashboard/asha");
          break;
        case "admin":
          router.push("/dashboard/admin");
          break;
        case "nurse":
          router.push("/dashboard/nurse");
          break;
        default:
          router.push("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Test login function using custom auth
  const testLogin = async (testEmail, testPassword, role = "doctor") => {
    try {
      setEmail(testEmail);
      setPassword(testPassword);

      // Try to login first
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("email", testEmail)
        .eq("is_active", true)
        .single();

      if (userError || !user) {
        // User doesn't exist, create test user
        console.log(`Creating test user: ${testEmail}`);

        const passwordHash = await hashPassword(testPassword);
        const name =
          role === "doctor"
            ? "Dr. Test User"
            : role === "asha_worker"
            ? "ASHA Test Worker"
            : "Test Supervisor";

        const { data: newUser, error: insertError } = await supabase
          .from("users")
          .insert({
            email: testEmail,
            password_hash: passwordHash,
            name: name,
            phone: "9876543210",
            city: "Test City",
            country: "India",
            pincode: "110001",
            gov_id: "TEST123",
            user_type: role,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (insertError) {
          throw new Error(`Failed to create test user: ${insertError.message}`);
        }

        console.log(`Test user created: ${testEmail}`);
        // Auto-submit form
        setTimeout(() => {
          const form = document.querySelector("form");
          if (form) {
            form.dispatchEvent(
              new Event("submit", { cancelable: true, bubbles: true })
            );
          }
        }, 100);
      } else {
        // User exists, verify password and login
        const isPasswordValid = await verifyPassword(
          testPassword,
          user.password_hash
        );
        if (!isPasswordValid) {
          throw new Error(
            "Test user password mismatch. Please update password in database."
          );
        }
        // Auto-submit form
        setTimeout(() => {
          const form = document.querySelector("form");
          if (form) {
            form.dispatchEvent(
              new Event("submit", { cancelable: true, bubbles: true })
            );
          }
        }, 100);
      }
    } catch (err) {
      console.error("Test login error:", err);
      setError(`Test login failed: ${err.message}`);
    }
  };

  // Create demo users using custom auth
  const createDemoUsers = async () => {
    setIsLoading(true);
    setError("");

    try {
      console.log("Creating demo users...");

      const demoUsers = [
        {
          email: "doctor@demo.com",
          password: "Demo@123",
          name: "Dr. Demo Doctor",
          role: "doctor",
        },
        {
          email: "asha@demo.com",
          password: "Demo@123",
          name: "Demo ASHA Worker",
          role: "asha_worker",
        },
        {
          email: "admin@demo.com",
          password: "Demo@123",
          name: "Demo Admin",
          role: "admin",
        },
      ];

      const createdUsers = [];

      for (const userData of demoUsers) {
        console.log(`Creating ${userData.email}...`);

        // Check if user already exists
        const { data: existingUser } = await supabase
          .from("users")
          .select("email")
          .eq("email", userData.email)
          .single();

        if (existingUser) {
          console.log(`User ${userData.email} already exists`);
          createdUsers.push(userData);
          continue;
        }

        // Hash password
        const passwordHash = await hashPassword(userData.password);

        // Create user in database
        const { data: newUser, error: insertError } = await supabase
          .from("users")
          .insert({
            email: userData.email,
            password_hash: passwordHash,
            name: userData.name,
            phone: "9876543210",
            city: "Demo City",
            country: "India",
            pincode: "110001",
            gov_id: "DEMO123",
            user_type: userData.role,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (insertError) {
          console.error(
            `Error creating ${userData.email}:`,
            insertError.message
          );
          continue;
        }

        console.log(`✅ User created: ${userData.email}`);
        createdUsers.push(userData);
      }

      if (createdUsers.length === 0) {
        setError(
          "All demo users already exist. You can login with: doctor@demo.com / Demo@123"
        );
        return;
      }

      // Auto-login with first user
      if (createdUsers.length > 0) {
        const firstUser = createdUsers[0];
        setEmail(firstUser.email);
        setPassword(firstUser.password);
        setError("Demo users created! Logging in...");

        // Auto-submit after short delay
        setTimeout(() => {
          const form = document.querySelector("form");
          if (form) {
            form.dispatchEvent(
              new Event("submit", { cancelable: true, bubbles: true })
            );
          }
        }, 500);
        return;
      }

      // Show success message
      const userList = createdUsers
        .map((u) => `${u.email} / ${u.password}`)
        .join("\n");
      setError(`Demo users created!\n\n${userList}`);
      console.log("=== Demo users ready ===");
      createdUsers.forEach((u) => {
        console.log(`${u.email} / ${u.password}`);
      });
    } catch (err) {
      console.error("Failed to create demo users:", err);
      setError("Failed to create demo users: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-white to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <span className="text-2xl font-bold text-slate-800">
              SevaHealth
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-500">Sign in to access your dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 whitespace-pre-line">
                <p>{error}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Create one
            </Link>
          </div>
        </div>

        {/* Demo Users Button */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <button
            onClick={createDemoUsers}
            disabled={isLoading}
            className="w-full bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600 transition disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Demo Users"}
          </button>
          <p className="text-xs text-slate-500 text-center mt-2">
            Creates 3 test users with password: Demo@123
          </p>
        </div>
      </div>
    </div>
  );
}
