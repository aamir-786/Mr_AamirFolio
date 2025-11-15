// Data Migration Script
// This script migrates existing portfolio data to Supabase

const DataMigrator = {
  // Migrate all existing data to Supabase
  migrateAll: async function() {
    console.log('Starting data migration...');
    
    const results = {
      projects: { success: false, count: 0, error: null },
      reviews: { success: false, count: 0, error: null }
    };

    try {
      // Migrate projects
      const projectsResult = await this.migrateProjects();
      results.projects = projectsResult;

      // Migrate reviews
      const reviewsResult = await this.migrateReviews();
      results.reviews = reviewsResult;

      return results;
    } catch (error) {
      console.error('Migration error:', error);
      return results;
    }
  },

  // Migrate projects
  migrateProjects: async function() {
    try {
      const client = SupabaseService.getClient();
      if (!client) {
        return { success: false, count: 0, error: 'Supabase client not available' };
      }

      // Get default projects (remove id field for insert)
      const defaultProjects = SupabaseService.getDefaultProjects().map(p => ({
        title: p.title,
        category: p.category,
        date: p.date,
        image: p.image,
        url: p.url || 'https://github.com/aamir-786'
      }));

      // Check existing projects
      const { data: existingProjects } = await client
        .from('projects')
        .select('id, title');

      if (existingProjects && existingProjects.length > 0) {
        console.log(`Found ${existingProjects.length} existing projects. Skipping migration.`);
        return { 
          success: true, 
          count: existingProjects.length, 
          message: 'Projects already exist' 
        };
      }

      // Insert projects
      const { data, error } = await client
        .from('projects')
        .insert(defaultProjects)
        .select();

      if (error) {
        return { success: false, count: 0, error: error.message };
      }

      console.log(`Successfully migrated ${data.length} projects`);
      return { success: true, count: data.length };
    } catch (error) {
      return { success: false, count: 0, error: error.message };
    }
  },

  // Migrate reviews
  migrateReviews: async function() {
    try {
      const client = SupabaseService.getClient();
      if (!client) {
        return { success: false, count: 0, error: 'Supabase client not available' };
      }

      // Get default reviews
      const defaultReviews = SupabaseService.getDefaultReviews();

      // Check existing reviews
      const { data: existingReviews } = await client
        .from('reviews')
        .select('id, author');

      if (existingReviews && existingReviews.length > 0) {
        console.log(`Found ${existingReviews.length} existing reviews. Skipping migration.`);
        return { 
          success: true, 
          count: existingReviews.length, 
          message: 'Reviews already exist' 
        };
      }

      // Insert reviews
      const { data, error } = await client
        .from('reviews')
        .insert(defaultReviews)
        .select();

      if (error) {
        return { success: false, count: 0, error: error.message };
      }

      console.log(`Successfully migrated ${data.length} reviews`);
      return { success: true, count: data.length };
    } catch (error) {
      return { success: false, count: 0, error: error.message };
    }
  },

  // Create admin user
  createAdmin: async function(email, password) {
    try {
      if (typeof AuthService === 'undefined') {
        return { success: false, error: 'AuthService not available' };
      }

      const result = await AuthService.signUp(email, password);
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Make available globally
window.DataMigrator = DataMigrator;

