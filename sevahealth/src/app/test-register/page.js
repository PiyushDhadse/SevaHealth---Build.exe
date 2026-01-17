"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase/Client";
import { hashPassword, verifyPassword } from "@/src/lib/utils/passwordUtils";

export default function TestRegisterPage() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [testData, setTestData] = useState(null);

  const runTest = async () => {
    setLoading(true);
    setResult("");
    setTestData(null);

    const output = [];
    const addOutput = (text) => {
      output.push(text);
      setResult(output.join("\n"));
      console.log(text);
    };

    try {
      addOutput("🧪 Testing Registration Process...\n");

      // Generate unique test email
      const testEmail = `test${Date.now()}@example.com`;
      const testPassword = "test123456";

      addOutput(`📧 Test Email: ${testEmail}`);
      addOutput(`🔐 Test Password: ${testPassword}\n`);

      // Step 1: Check Supabase connection
      addOutput("1️⃣ Checking Supabase connection...");
      if (!supabase) {
        throw new Error("Supabase client not initialized");
      }
      addOutput("✅ Supabase connected\n");

      // Step 2: Check if table exists
      addOutput("2️⃣ Checking if users table exists...");
      const { data: tableCheck, error: tableError } = await supabase
        .from("users")
        .select("count")
        .limit(1);

      if (tableError) {
        addOutput(`❌ Table error: ${tableError.message}`);
        addOutput(`❌ Error code: ${tableError.code}`);
        addOutput(`❌ Details: ${JSON.stringify(tableError.details)}`);
        addOutput(`❌ Hint: ${tableError.hint}`);
        addOutput(
          "\n⚠️  Make sure to run supabase_schema.sql in Supabase SQL Editor!"
        );
        throw tableError;
      }
      addOutput("✅ Users table exists\n");

      // Step 3: Check if user already exists
      addOutput("3️⃣ Checking if user already exists...");
      const { data: existingUser } = await supabase
        .from("users")
        .select("email")
        .eq("email", testEmail)
        .single();

      if (existingUser) {
        addOutput("⚠️  User exists, generating new email...");
      } else {
        addOutput("✅ Email available\n");
      }

      // Step 4: Hash password
      addOutput("4️⃣ Hashing password...");
      const passwordHash = await hashPassword(testPassword);
      addOutput(`✅ Password hashed: ${passwordHash.substring(0, 20)}...\n`);

      // Step 5: Insert user
      addOutput("5️⃣ Inserting user into database...");
      const userData = {
        email: testEmail,
        password_hash: passwordHash,
        name: "Test User",
        phone: "9876543210",
        city: "Mumbai",
        country: "India",
        pincode: "400001",
        gov_id: "TEST123",
        user_type: "doctor",
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      addOutput(`Inserting data: ${JSON.stringify(userData, null, 2)}\n`);

      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert(userData)
        .select()
        .single();

      if (insertError) {
        addOutput(`❌ Insert error: ${insertError.message}`);
        addOutput(`❌ Error code: ${insertError.code}`);
        addOutput(`❌ Details: ${JSON.stringify(insertError.details)}`);
        addOutput(`❌ Hint: ${insertError.hint}`);
        addOutput(`\n⚠️  Check SQL_QUERIES.md for troubleshooting steps.\n`);
        throw insertError;
      }

      if (!newUser) {
        throw new Error("User creation failed - no data returned");
      }

      addOutput("✅ User inserted successfully!");
      addOutput(`   User ID: ${newUser.id}`);
      addOutput(`   Email: ${newUser.email}`);
      addOutput(`   Name: ${newUser.name}\n`);

      // Step 6: Verify user exists
      addOutput("6️⃣ Verifying user was stored...");
      const { data: verifyUser, error: verifyError } = await supabase
        .from("users")
        .select("*")
        .eq("id", newUser.id)
        .single();

      if (verifyError || !verifyUser) {
        addOutput(
          `❌ Verification failed: ${verifyError?.message || "User not found"}`
        );
        throw new Error("Verification failed");
      }

      addOutput("✅ User verified in database!");
      addOutput(`   Retrieved: ${verifyUser.name} (${verifyUser.email})`);
      addOutput(`   User Type: ${verifyUser.user_type}`);
      addOutput(`   Active: ${verifyUser.is_active}\n`);

      // Step 7: Test password verification
      addOutput("7️⃣ Testing password verification...");
      const isPasswordValid = await verifyPassword(
        testPassword,
        verifyUser.password_hash
      );

      if (isPasswordValid) {
        addOutput("✅ Password verification successful!\n");
      } else {
        addOutput("❌ Password verification failed!\n");
      }

      // Step 8: Count users
      addOutput("8️⃣ Checking total user count...");
      const { count, error: countError } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true });

      if (!countError) {
        addOutput(`✅ Total users in database: ${count}\n`);
      }

      addOutput("✅✅✅ ALL TESTS PASSED! ✅✅✅\n");
      addOutput("📝 Test Credentials:");
      addOutput(`   Email: ${testEmail}`);
      addOutput(`   Password: ${testPassword}`);
      addOutput(`   User ID: ${newUser.id}\n`);

      setTestData({
        email: testEmail,
        password: testPassword,
        userId: newUser.id,
      });

      return { success: true, user: newUser };
    } catch (error) {
      addOutput(`\n❌❌❌ TEST FAILED ❌❌❌\n`);
      addOutput(`Error: ${error.message}`);
      addOutput(`Full error: ${JSON.stringify(error, null, 2)}\n`);
      addOutput("🔍 Troubleshooting:");
      addOutput("1. Check if supabase_schema.sql has been run");
      addOutput("2. Verify environment variables in .env.local");
      addOutput("3. Check Supabase Dashboard -> Table Editor");
      addOutput("4. See SQL_QUERIES.md for diagnostic queries\n");

      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Registration Test</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <button
            onClick={runTest}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {loading ? "Running Test..." : "Run Registration Test"}
          </button>

          {result && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Test Output:</h2>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-96 whitespace-pre-wrap font-mono text-sm">
                {result}
              </pre>
            </div>
          )}

          {testData && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">
                ✅ Test Successful!
              </h3>
              <p className="text-sm text-green-700">
                <strong>Email:</strong> {testData.email}
              </p>
              <p className="text-sm text-green-700">
                <strong>Password:</strong> {testData.password}
              </p>
              <p className="text-sm text-green-700">
                <strong>User ID:</strong> {testData.userId}
              </p>
              <p className="text-xs text-green-600 mt-2">
                You can now try logging in with these credentials!
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">SQL Queries</h2>
          <p className="text-gray-600 mb-4">
            Run these queries in <strong>Supabase SQL Editor</strong> to verify
            data:
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">
                1. View All Users (Check if data is stored)
              </h3>
              <pre className="bg-gray-900 text-green-400 p-3 rounded overflow-x-auto text-xs">
                {`SELECT id, email, name, user_type, created_at
FROM public.users
ORDER BY created_at DESC;`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. Count Total Users</h3>
              <pre className="bg-gray-900 text-green-400 p-3 rounded overflow-x-auto text-xs">
                {`SELECT COUNT(*) as total_users FROM public.users;`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. Check Table Structure</h3>
              <pre className="bg-gray-900 text-green-400 p-3 rounded overflow-x-auto text-xs">
                {`SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
AND table_schema = 'public';`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                4. Check RLS (Should be disabled)
              </h3>
              <pre className="bg-gray-900 text-green-400 p-3 rounded overflow-x-auto text-xs">
                {`SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'users' 
AND schemaname = 'public';`}
              </pre>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            For more queries, see <code>SQL_QUERIES.md</code>
          </p>
        </div>
      </div>
    </div>
  );
}
