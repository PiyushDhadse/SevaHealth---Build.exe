/**
 * Test Registration Script
 * Run this to test if registration is working and data is being stored
 */

import { supabase } from "./src/lib/supabase/Client.js";
import { hashPassword } from "./src/lib/utils/passwordUtils.js";

async function testRegistration() {
  console.log("🧪 Testing Registration...\n");

  const testUser = {
    name: "Test User",
    email: `test${Date.now()}@example.com`,
    password: "test123456",
    phone: "9876543210",
    city: "Mumbai",
    country: "India",
    pincode: "400001",
    governmentId: "TEST123",
    role: "doctor",
  };

  try {
    console.log("1️⃣ Checking if Supabase is configured...");
    if (!supabase) {
      throw new Error("Supabase client not initialized");
    }
    console.log("✅ Supabase client initialized\n");

    console.log("2️⃣ Checking if users table exists...");
    const { data: tableCheck, error: tableError } = await supabase
      .from("users")
      .select("count")
      .limit(1);

    if (tableError) {
      console.error("❌ Table check error:", tableError);
      console.log(
        "\n⚠️  Make sure to run supabase_schema.sql in Supabase SQL Editor first!\n"
      );
      throw tableError;
    }
    console.log("✅ Users table exists\n");

    console.log("3️⃣ Checking if user already exists...");
    const { data: existingUser } = await supabase
      .from("users")
      .select("email")
      .eq("email", testUser.email)
      .single();

    if (existingUser) {
      console.log("⚠️  User already exists, using different email...");
      testUser.email = `test${Date.now()}@example.com`;
    }
    console.log(`✅ Will create user: ${testUser.email}\n`);

    console.log("4️⃣ Hashing password...");
    const passwordHash = await hashPassword(testUser.password);
    console.log("✅ Password hashed\n");

    console.log("5️⃣ Inserting user into database...");
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({
        email: testUser.email,
        password_hash: passwordHash,
        name: testUser.name,
        phone: testUser.phone,
        city: testUser.city,
        country: testUser.country,
        pincode: testUser.pincode,
        gov_id: testUser.governmentId,
        user_type: testUser.role,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("❌ Insert error:", insertError);
      console.error("Error details:", {
        message: insertError.message,
        code: insertError.code,
        details: insertError.details,
        hint: insertError.hint,
      });
      throw insertError;
    }

    if (!newUser) {
      throw new Error("User creation failed - no data returned");
    }

    console.log("✅ User created successfully!");
    console.log("User ID:", newUser.id);
    console.log("User Email:", newUser.email);
    console.log("User Name:", newUser.name);
    console.log("User Type:", newUser.user_type);
    console.log("\n");

    console.log("6️⃣ Verifying user was stored...");
    const { data: verifyUser, error: verifyError } = await supabase
      .from("users")
      .select("*")
      .eq("id", newUser.id)
      .single();

    if (verifyError || !verifyUser) {
      console.error("❌ Verification error:", verifyError);
      throw new Error("User verification failed");
    }

    console.log("✅ User verified in database!");
    console.log("\n📊 User Data:");
    console.log(JSON.stringify(verifyUser, null, 2));
    console.log("\n");

    console.log("7️⃣ Testing password verification...");
    const { verifyPassword } = await import("./src/lib/utils/passwordUtils.js");
    const isPasswordValid = await verifyPassword(
      testUser.password,
      verifyUser.password_hash
    );

    if (isPasswordValid) {
      console.log("✅ Password verification successful!");
    } else {
      console.error("❌ Password verification failed!");
    }

    console.log("\n✅✅✅ ALL TESTS PASSED! ✅✅✅\n");
    console.log("📝 Test Credentials:");
    console.log(`   Email: ${testUser.email}`);
    console.log(`   Password: ${testUser.password}`);
    console.log(`   User ID: ${newUser.id}`);
    console.log("\n");

    return {
      success: true,
      user: newUser,
      credentials: {
        email: testUser.email,
        password: testUser.password,
      },
    };
  } catch (error) {
    console.error("\n❌❌❌ TEST FAILED ❌❌❌\n");
    console.error("Error:", error.message);
    console.error("Full error:", error);
    console.log("\n🔍 Troubleshooting:");
    console.log(
      "1. Check if supabase_schema.sql has been run in Supabase SQL Editor"
    );
    console.log(
      "2. Verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    );
    console.log(
      "3. Check Supabase Dashboard -> Table Editor to see if users table exists"
    );
    console.log("4. Verify RLS policies are disabled or allow inserts\n");

    return {
      success: false,
      error: error.message,
    };
  }
}

// Run test if executed directly
if (typeof window === "undefined") {
  // Server-side
  testRegistration().then((result) => {
    process.exit(result.success ? 0 : 1);
  });
} else {
  // Client-side - export for use
  window.testRegistration = testRegistration;
}

export default testRegistration;
