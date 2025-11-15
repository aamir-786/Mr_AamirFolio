// Secure Authentication Service - Hardcoded Admin User
const AuthService = {
  client: null,
  
  // Hardcoded Admin Credentials (Change these to your preferred credentials)
  ADMIN_EMAIL: 'admin@aamirfolio.com',
  ADMIN_PASSWORD: 'Admin@2024', // Change this to your secure password
  
  // Initialize auth service
  init: function() {
    if (this.client) return; // Already initialized
    
    // Get client from SupabaseConfig or create new one
    if (window.SupabaseConfig && window.SupabaseConfig.getClient) {
      this.client = window.SupabaseConfig.getClient();
    } else if (typeof SupabaseService !== 'undefined') {
      this.client = SupabaseService.getClient();
    } else if (typeof supabase !== 'undefined') {
      const url = (window.CONFIG && window.CONFIG.SUPABASE_URL) || 'https://ruafgiyldwlctfldhtoe.supabase.co';
      const key = (window.CONFIG && window.CONFIG.SUPABASE_ANON_KEY) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1YWZnaXlsZHdsY3RmbGRodG9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxODk2MjMsImV4cCI6MjA3ODc2NTYyM30.w8DciDV8BwkJDtwPBP2qgn9E6Kr6s4iich5gfAQx6XM';
      this.client = supabase.createClient(url, key);
    }
    
    // Set up auth state change listener
    if (this.client) {
      this.client.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT') {
          // Clear any local storage on sign out
          sessionStorage.clear();
        }
      });
    }
  },

  // Get current session
  getSession: async function() {
    // Check hardcoded admin session first
    if (sessionStorage.getItem('adminAuthenticated') === 'true' && 
        sessionStorage.getItem('adminType') === 'hardcoded') {
      return {
        user: {
          email: this.ADMIN_EMAIL,
          id: 'admin-001'
        }
      };
    }
    
    // Otherwise check Supabase session
    if (!this.client) {
      this.init();
    }
    if (!this.client) return null;
    
    try {
      const { data: { session } } = await this.client.auth.getSession();
      return session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: async function() {
    // Check hardcoded admin first
    if (sessionStorage.getItem('adminAuthenticated') === 'true' && 
        sessionStorage.getItem('adminType') === 'hardcoded') {
      return true;
    }
    
    // Check Supabase session
    const session = await this.getSession();
    return session !== null;
  },

  // Sign up - Disabled (using hardcoded admin only)
  signUp: async function(email, password) {
    return { 
      success: false, 
      error: 'Registration is disabled. Use the hardcoded admin account only.' 
    };
  },

  // Sign in - Hardcoded admin check
  signIn: async function(email, password) {
    // Check hardcoded admin credentials first
    if (email === this.ADMIN_EMAIL && password === this.ADMIN_PASSWORD) {
      // Initialize client if needed
      if (!this.client) {
        this.init();
      }
      
      // Try to authenticate with Supabase using the same credentials
      // This ensures RLS policies work correctly
      if (this.client) {
        try {
          // First, try to sign in with Supabase
          const { data: signInData, error: signInError } = await this.client.auth.signInWithPassword({
            email: this.ADMIN_EMAIL,
            password: this.ADMIN_PASSWORD
          });

          if (!signInError && signInData) {
            // Successfully authenticated with Supabase
            sessionStorage.setItem('adminAuthenticated', 'true');
            sessionStorage.setItem('adminUser', this.ADMIN_EMAIL);
            sessionStorage.setItem('adminType', 'supabase');
            
            return { 
              success: true, 
              data: signInData
            };
          }

          // If sign in fails, try to create the user (first time setup)
          if (signInError && signInError.message.includes('Invalid login')) {
            const { data: signUpData, error: signUpError } = await this.client.auth.signUp({
              email: this.ADMIN_EMAIL,
              password: this.ADMIN_PASSWORD,
              options: {
                emailRedirectTo: window.location.origin + '/admin-dashboard.html'
              }
            });

            if (!signUpError && signUpData) {
              // User created, now sign in
              const { data: newSignInData, error: newSignInError } = await this.client.auth.signInWithPassword({
                email: this.ADMIN_EMAIL,
                password: this.ADMIN_PASSWORD
              });

              if (!newSignInError && newSignInData) {
                sessionStorage.setItem('adminAuthenticated', 'true');
                sessionStorage.setItem('adminUser', this.ADMIN_EMAIL);
                sessionStorage.setItem('adminType', 'supabase');
                
                return { 
                  success: true, 
                  data: newSignInData
                };
              }
            }
          }
        } catch (error) {
          console.warn('Supabase auth failed, using hardcoded session:', error);
        }
      }
      
      // Fallback: Set session for hardcoded admin (but RLS might not work)
      sessionStorage.setItem('adminAuthenticated', 'true');
      sessionStorage.setItem('adminUser', this.ADMIN_EMAIL);
      sessionStorage.setItem('adminType', 'hardcoded');
      
      return { 
        success: true, 
        data: { 
          user: { 
            email: this.ADMIN_EMAIL,
            id: 'admin-001'
          } 
        },
        warning: 'Using hardcoded session. Database operations may require Supabase authentication.'
      };
    }
    
    // If not hardcoded admin, try Supabase Auth (for backward compatibility)
    if (!this.client) {
      this.init();
    }
    if (!this.client) {
      return { success: false, error: 'Invalid email or password' };
    }

    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (error) {
        return { success: false, error: 'Invalid email or password' };
      }

      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: 'Invalid email or password' };
    }
  },

  // Sign out
  signOut: async function() {
    if (!this.client) {
      this.init();
    }
    if (!this.client) {
      return { success: false, error: 'Supabase client not available' };
    }

    try {
      const { error } = await this.client.auth.signOut();
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get current user
  getCurrentUser: async function() {
    // Check hardcoded admin first
    if (sessionStorage.getItem('adminAuthenticated') === 'true' && 
        sessionStorage.getItem('adminType') === 'hardcoded') {
      return {
        email: this.ADMIN_EMAIL,
        id: 'admin-001'
      };
    }
    
    // Otherwise get from Supabase session
    const session = await this.getSession();
    if (session && session.user) {
      return session.user;
    }
    return null;
  },

  // Update password
  updatePassword: async function(newPassword) {
    if (!this.client) {
      this.init();
    }
    if (!this.client) {
      return { success: false, error: 'Supabase client not available' };
    }

    try {
      const { data, error } = await this.client.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Reset password (send reset email)
  resetPassword: async function(email) {
    if (!this.client) {
      this.init();
    }
    if (!this.client) {
      return { success: false, error: 'Supabase client not available' };
    }

    try {
      const { data, error } = await this.client.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/admin-reset-password.html'
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Initialize on load
if (typeof SupabaseService !== 'undefined') {
  AuthService.init();
}

