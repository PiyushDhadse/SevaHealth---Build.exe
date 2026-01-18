import { supabase } from "../../lib/supabase/Client";

/**
 * Test if registration flow works
 */
export const testRegistrationFlow = async () => {
  console.log("=== Testing Registration Flow ===");

  // Test 1: Check if activity_log table is accessible
  console.log("Test 1: Checking activity_log table...");
  try {
    const { data, error } = await supabase
      .from("activity_log")
      .select("count")
      .limit(1);

    if (error) throw error;
    console.log("✓ activity_log table accessible");
  } catch (error) {
    console.error("✗ activity_log table error:", error.message);
    return false;
  }

  // Test 2: Check if users table is accessible
  console.log("Test 2: Checking users table...");
  try {
    const { data, error } = await supabase
      .from("users")
      .select("count")
      .limit(1);

    if (error) throw error;
    console.log("✓ users table accessible");
  } catch (error) {
    console.error("✗ users table error:", error.message);
    return false;
  }

  // Test 3: Test IP service
  console.log("Test 3: Testing IP service...");
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    console.log(`✓ IP service working. Your IP: ${data.ip}`);
  } catch (error) {
    console.warn(
      "⚠ IP service failed (this might affect activity logging):",
      error.message,
    );
  }

  console.log("=== All tests completed ===");
  return true;
};
