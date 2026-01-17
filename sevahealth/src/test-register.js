"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase/Client";

export default function TestRegister() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const testRegistration = async () => {
    setLoading(true);
    setResult("Starting test...\n");

    try {
      // Generate random email for testing
      const randomEmail = `test${Date.now()}@test.com`;

      setResult((prev) => prev + `1. Creating auth user: ${randomEmail}\n`);

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: randomEmail,
        password: "test123456",
        options: {
          data: {
            name: "Test User",
            phone: "1234567890",
            city: "Test City",
            country: "Test Country",
            pincode: "123456",
            government_id: "TEST123",
            role: "doctor",
          },
        },
      });

      if (authError) {
        setResult((prev) => prev + `❌ Auth error: ${authError.message}\n`);
        return;
      }

      setResult(
        (prev) => prev + `✅ Auth user created. ID: ${authData.user?.id}\n`,
      );

      // Wait 2 seconds for trigger
      setResult((prev) => prev + "2. Waiting for trigger (2 seconds)...\n");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Check if user exists in public.users
      setResult((prev) => prev + "3. Checking public.users table...\n");
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user?.id)
        .single();

      if (userError) {
        setResult(
          (prev) =>
            prev + `❌ User not found in public.users: ${userError.message}\n`,
        );
      } else {
        setResult((prev) => prev + `✅ User found in public.users:\n`);
        setResult((prev) => prev + `   Email: ${userData.email}\n`);
        setResult((prev) => prev + `   Name: ${userData.name}\n`);
        setResult((prev) => prev + `   Role: ${userData.user_type}\n`);
      }

      // Check activity_log
      setResult((prev) => prev + "4. Checking activity_log...\n");
      const { data: activityData, error: activityError } = await supabase
        .from("activity_log")
        .select("action, details")
        .eq("user_id", authData.user?.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (activityError) {
        setResult(
          (prev) => prev + `⚠ Activity log error: ${activityError.message}\n`,
        );
      } else if (activityData && activityData.length > 0) {
        setResult(
          (prev) => prev + `✅ Activity logged: ${activityData[0].action}\n`,
        );
      } else {
        setResult((prev) => prev + `❌ No activity log found\n`);
      }

      // Direct database check via REST API
      setResult((prev) => prev + "5. Testing direct insert...\n");
      const testId = authData.user?.id || "test-id";

      const { error: directError } = await supabase.from("users").insert({
        id: testId,
        email: randomEmail,
        name: "Direct Test",
        phone: "0000000000",
        city: "Direct City",
        country: "Direct Country",
        pincode: "000000",
        gov_id: "DIRECT123",
        user_type: "doctor",
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (directError) {
        setResult(
          (prev) => prev + `❌ Direct insert failed: ${directError.message}\n`,
        );
      } else {
        setResult((prev) => prev + `✅ Direct insert succeeded\n`);
      }

      setResult((prev) => prev + "\n=== Test Complete ===\n");
    } catch (error) {
      setResult((prev) => prev + `❌ Unexpected error: ${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Trigger Test Page</h1>

      <button
        onClick={testRegistration}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg mb-6 disabled:bg-gray-400"
      >
        {loading ? "Testing..." : "Run Trigger Test"}
      </button>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
        <pre className="bg-gray-50 p-4 rounded whitespace-pre-wrap font-mono text-sm">
          {result || "Click 'Run Trigger Test' to start..."}
        </pre>
      </div>
    </div>
  );
}
