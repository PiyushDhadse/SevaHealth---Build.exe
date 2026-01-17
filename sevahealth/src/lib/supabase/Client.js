import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public'
  }
});

// Custom Auth Functions (since we're using our own users table)
export const auth = {
  // Register new user
  async register(userData) {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', userData.email)
        .single();

      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash password (you should use bcrypt in production)
      // For hackathon, we'll store plain text with a warning
      const passwordHash = `hashed_${userData.password}`; // Replace with actual hashing

      // Insert new user
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            email: userData.email,
            password_hash: passwordHash,
            name: userData.name,
            phone: userData.phone,
            city: userData.city,
            country: userData.country || 'India',
            pincode: userData.pincode,
            gov_id: userData.govId,
            user_type: userData.userType
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Log activity
      await supabase.from('activity_log').insert({
        user_id: data.id,
        action: 'register',
        entity_type: 'user',
        entity_id: data.id,
        details: { user_type: userData.userType }
      });

      return { success: true, user: data };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  },

  // Login user
  async login(email, password) {
    try {
      // Get user by email
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (error || !user) {
        throw new Error('Invalid credentials');
      }

      // Verify password (simplified for hackathon)
      // In production: bcrypt.compare(password, user.password_hash)
      const isValid = password === user.password_hash.replace('hashed_', '');
      
      if (!isValid) {
        throw new Error('Invalid credentials');
      }

      // Log activity
      await supabase.from('activity_log').insert({
        user_id: user.id,
        action: 'login',
        entity_type: 'user',
        entity_id: user.id
      });

      // Store user in localStorage for session management
      if (typeof window !== 'undefined') {
        localStorage.setItem('sevahealth_user', JSON.stringify({
          id: user.id,
          email: user.email,
          name: user.name,
          user_type: user.user_type,
          city: user.city
        }));
        localStorage.setItem('sevahealth_token', 'demo_token_' + Date.now());
      }

      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  },

  // Logout user
  async logout() {
    try {
      if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('sevahealth_user');
        if (userStr) {
          const user = JSON.parse(userStr);
          // Log activity
          await supabase.from('activity_log').insert({
            user_id: user.id,
            action: 'logout',
            entity_type: 'user',
            entity_id: user.id
          });
        }
        
        localStorage.removeItem('sevahealth_user');
        localStorage.removeItem('sevahealth_token');
      }
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  },

  // Get current user
  getCurrentUser() {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem('sevahealth_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated() {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('sevahealth_token');
    const user = localStorage.getItem('sevahealth_user');
    return !!(token && user);
  }
};

// Database Functions
export const db = {
  // Patients
  patients: {
    async getAll() {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },

    async getById(id) {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },

    async create(patientData) {
      const { data, error } = await supabase
        .from('patients')
        .insert([patientData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async update(id, updates) {
      const { data, error } = await supabase
        .from('patients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async delete(id) {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    }
  },

  // Visits
  visits: {
    async getByPatientId(patientId) {
      const { data, error } = await supabase
        .from('visits')
        .select('*')
        .eq('patient_id', patientId)
        .order('visit_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },

    async create(visitData) {
      const { data, error } = await supabase
        .from('visits')
        .insert([visitData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },

  // Alerts
  alerts: {
    async getUrgent() {
      const { data, error } = await supabase
        .from('alerts')
        .select(`
          *,
          patients (name, patient_code)
        `)
        .in('priority', ['high', 'critical'])
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },

    async create(alertData) {
      const { data, error } = await supabase
        .from('alerts')
        .insert([alertData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async updateStatus(id, status) {
      const { data, error } = await supabase
        .from('alerts')
        .update({ status, resolved_at: status === 'resolved' ? new Date().toISOString() : null })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },

  // Dashboard Stats
  async getDashboardStats() {
    // Get counts in parallel
    const [patients, visits, alerts, users] = await Promise.all([
      supabase.from('patients').select('count', { count: 'exact' }).eq('status', 'active'),
      supabase.from('visits').select('count', { count: 'exact' }).gte('visit_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
      supabase.from('alerts').select('count', { count: 'exact' }).eq('status', 'pending').in('priority', ['high', 'critical']),
      supabase.from('users').select('count', { count: 'exact' }).eq('user_type', 'asha_worker').eq('is_active', true)
    ]);

    // Get recent visits for chart
    const { data: recentVisits } = await supabase
      .from('visits')
      .select('visit_date')
      .gte('visit_date', new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('visit_date', { ascending: true });

    return {
      totalPatients: patients.count || 0,
      recentVisits: visits.count || 0,
      urgentAlerts: alerts.count || 0,
      ashaWorkers: users.count || 0,
      chartData: processVisitsForChart(recentVisits || [])
    };
  }
};

// Helper function to process visits for chart
function processVisitsForChart(visits) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    return {
      month: months[date.getMonth()],
      year: date.getFullYear(),
      monthIndex: date.getMonth(),
      visits: 0
    };
  });

  visits.forEach(visit => {
    const visitDate = new Date(visit.visit_date);
    const monthData = last6Months.find(m => 
      m.month === months[visitDate.getMonth()] && 
      m.year === visitDate.getFullYear()
    );
    if (monthData) {
      monthData.visits++;
    }
  });

  return last6Months.map(m => ({
    month: m.month,
    visits: m.visits
  }));
}

export default supabase;