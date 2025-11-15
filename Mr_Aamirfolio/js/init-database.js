// Database Initialization Script
// Run this once to populate your Supabase database with default data
// You can call this from the browser console or add a button in admin panel

const DatabaseInitializer = {
  // Initialize database with default data
  initialize: async function() {
    console.log('Starting database initialization...');
    
    if (typeof SupabaseService === 'undefined') {
      console.error('SupabaseService not loaded. Make sure all scripts are loaded.');
      return { success: false, error: 'SupabaseService not available' };
    }

    try {
      const result = await SupabaseService.initializeDatabase();
      
      if (result.success) {
        console.log('Database initialized successfully!');
        alert('Database initialized successfully! Your default projects and reviews have been added.');
        return result;
      } else {
        console.error('Database initialization failed:', result.error);
        alert('Database initialization failed: ' + result.error);
        return result;
      }
    } catch (error) {
      console.error('Error initializing database:', error);
      alert('Error initializing database: ' + error.message);
      return { success: false, error: error.message };
    }
  }
};

// Make it available globally
window.DatabaseInitializer = DatabaseInitializer;

// Auto-initialize if flag is set
if (window.AUTO_INIT_DB === true) {
  document.addEventListener('DOMContentLoaded', function() {
    DatabaseInitializer.initialize();
  });
}

