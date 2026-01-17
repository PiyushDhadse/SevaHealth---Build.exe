import { supabase } from "@/src/lib/supabase/Client";

/**
 * Get client IP address using free services (with fallbacks)
 */
/**
 * Get client IP address - simplified for hackathon
 */
export const getClientIP = async () => {
  // For hackathon, we'll use multiple approaches
  try {
    // Approach 1: Try to get from browser (if available)
    if (window.RTCPeerConnection) {
      const pc = new RTCPeerConnection({ iceServers: [] });
      pc.createDataChannel("");
      pc.createOffer().then((offer) => pc.setLocalDescription(offer));

      return new Promise((resolve) => {
        pc.onicecandidate = (ice) => {
          if (ice && ice.candidate && ice.candidate.candidate) {
            const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
            const ipMatch = ipRegex.exec(ice.candidate.candidate);
            if (ipMatch) {
              resolve(ipMatch[1]);
              pc.close();
            }
          }
        };

        // Fallback if no IP found
        setTimeout(() => {
          resolve("local-network");
          pc.close();
        }, 1000);
      });
    }
  } catch (e) {
    // Continue to fallback
  }

  // Approach 2: Use a CORS-friendly service
  try {
    // This service supports CORS
    const response = await fetch("https://api.db-ip.com/v2/free/self", {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.ipAddress || "api-fallback";
    }
  } catch (e) {
    console.log("IP API failed, using fallback");
  }

  // Final fallback
  return "unknown-ip";
};

/**
 * Log activity to the database
 */
export const logActivity = async (
  userId,
  action,
  entityType,
  entityId,
  details = {},
) => {
  try {
    const ipAddress = await getClientIP();

    const { error } = await supabase.from("activity_log").insert({
      user_id: userId,
      action: action,
      entity_type: entityType,
      entity_id: entityId,
      details: details,
      ip_address: ipAddress,
      user_agent: navigator.userAgent,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Activity log error:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to log activity:", error);
    return { success: false, error };
  }
};

/**
 * Common activity types for consistent logging
 */
export const ActivityTypes = {
  // User activities
  USER_REGISTER: "USER_REGISTER",
  USER_LOGIN: "USER_LOGIN",
  USER_LOGOUT: "USER_LOGOUT",
  USER_PROFILE_UPDATE: "USER_PROFILE_UPDATE",
  USER_PASSWORD_CHANGE: "USER_PASSWORD_CHANGE",

  // Patient activities
  PATIENT_CREATE: "PATIENT_CREATE",
  PATIENT_UPDATE: "PATIENT_UPDATE",
  PATIENT_DELETE: "PATIENT_DELETE",
  PATIENT_VIEW: "PATIENT_VIEW",

  // Visit activities
  VISIT_CREATE: "VISIT_CREATE",
  VISIT_UPDATE: "VISIT_UPDATE",
  VISIT_COMPLETE: "VISIT_COMPLETE",

  // Alert activities
  ALERT_CREATE: "ALERT_CREATE",
  ALERT_ASSIGN: "ALERT_ASSIGN",
  ALERT_RESOLVE: "ALERT_RESOLVE",
  ALERT_ESCALATE: "ALERT_ESCALATE",

  // System activities
  SYNC_START: "SYNC_START",
  SYNC_COMPLETE: "SYNC_COMPLETE",
  SYNC_FAILED: "SYNC_FAILED",
};

/**
 * Quick log function for common operations
 */
export const quickLog = {
  userRegister: (userId, email, role) =>
    logActivity(userId, ActivityTypes.USER_REGISTER, "user", userId, {
      email,
      role,
    }),

  userLogin: (userId, email) =>
    logActivity(userId, ActivityTypes.USER_LOGIN, "user", userId, { email }),

  patientCreate: (userId, patientId, patientName) =>
    logActivity(userId, ActivityTypes.PATIENT_CREATE, "patient", patientId, {
      patientName,
    }),

  visitCreate: (userId, visitId, patientId) =>
    logActivity(userId, ActivityTypes.VISIT_CREATE, "visit", visitId, {
      patientId,
    }),
};
