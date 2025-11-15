// Supabase Service - Database operations for portfolio
const SupabaseService = {
  // Get Supabase client (uses authenticated session if available)
  getClient: function() {
    // Priority 1: Use AuthService client if available (has authenticated session)
    if (typeof AuthService !== 'undefined' && AuthService.client) {
      return AuthService.client;
    }
    
    // Priority 2: Use SupabaseConfig client
    if (window.SupabaseConfig && window.SupabaseConfig.getClient) {
      return window.SupabaseConfig.getClient();
    }
    
    // Priority 3: Create client directly using config
    if (typeof supabase !== 'undefined') {
      const url = (window.CONFIG && window.CONFIG.SUPABASE_URL) || 'https://ruafgiyldwlctfldhtoe.supabase.co';
      const key = (window.CONFIG && window.CONFIG.SUPABASE_ANON_KEY) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1YWZnaXlsZHdsY3RmbGRodG9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxODk2MjMsImV4cCI6MjA3ODc2NTYyM30.w8DciDV8BwkJDtwPBP2qgn9E6Kr6s4iich5gfAQx6XM';
      return supabase.createClient(url, key);
    }
    return null;
  },

  // ============ PROJECTS ============
  
  // Get all projects
  getProjects: async function() {
    const client = this.getClient();
    if (!client) {
      console.error('Supabase client not available');
      return this.getDefaultProjects();
    }

    try {
      const { data, error } = await client
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        return this.getDefaultProjects();
      }

      return data || [];
    } catch (error) {
      console.error('Error in getProjects:', error);
      return this.getDefaultProjects();
    }
  },

  // Add a new project
  addProject: async function(project) {
    const client = this.getClient();
    if (!client) {
      console.error('Supabase client not available');
      return { success: false, error: 'Supabase client not available' };
    }

    try {
      // Check if we have an authenticated session
      const { data: { session } } = await client.auth.getSession();
      
      if (!session) {
        // Try to use authenticated client from AuthService if available
        if (typeof AuthService !== 'undefined' && AuthService.client) {
          const authClient = AuthService.client;
          const { data, error } = await authClient
            .from('projects')
            .insert([{
              title: project.title,
              category: project.category,
              date: project.date,
              image: project.image,
              url: project.url || 'https://github.com/aamir-786',
              description: project.description || null
            }])
            .select();

          if (error) {
            console.error('Error adding project:', error);
            return { success: false, error: error.message };
          }

          return { success: true, data: data[0] };
        }
        
        return { 
          success: false, 
          error: 'Not authenticated. Please login first. If using hardcoded admin, create a Supabase user with the same credentials.' 
        };
      }

      const { data, error } = await client
        .from('projects')
        .insert([{
          title: project.title,
          category: project.category,
          date: project.date,
          image: project.image,
          url: project.url || 'https://github.com/aamir-786',
          description: project.description || null
        }])
        .select();

      if (error) {
        console.error('Error adding project:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error in addProject:', error);
      return { success: false, error: error.message };
    }
  },

  // Update a project
  updateProject: async function(id, project) {
    const client = this.getClient();
    if (!client) {
      console.error('Supabase client not available');
      return { success: false, error: 'Supabase client not available' };
    }

    try {
      // Check if we have an authenticated session
      const { data: { session } } = await client.auth.getSession();
      
      if (!session) {
        // Try to use authenticated client from AuthService if available
        if (typeof AuthService !== 'undefined' && AuthService.client) {
          const authClient = AuthService.client;
          const { data, error } = await authClient
            .from('projects')
            .update({
              title: project.title,
              category: project.category,
              date: project.date,
              image: project.image,
              url: project.url || 'https://github.com/aamir-786',
              description: project.description || null
            })
            .eq('id', id)
            .select();

          if (error) {
            console.error('Error updating project:', error);
            return { success: false, error: error.message };
          }

          return { success: true, data: data[0] };
        }
        
        return { 
          success: false, 
          error: 'Not authenticated. Please login first. If using hardcoded admin, create a Supabase user with the same credentials.' 
        };
      }

      const { data, error } = await client
        .from('projects')
        .update({
          title: project.title,
          category: project.category,
          date: project.date,
          image: project.image,
          url: project.url || 'https://github.com/aamir-786',
          description: project.description || null
        })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error updating project:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error in updateProject:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete a project
  deleteProject: async function(id) {
    const client = this.getClient();
    if (!client) {
      console.error('Supabase client not available');
      return { success: false, error: 'Supabase client not available' };
    }

    try {
      // Check if we have an authenticated session
      const { data: { session } } = await client.auth.getSession();
      
      if (!session) {
        // Try to use authenticated client from AuthService if available
        if (typeof AuthService !== 'undefined' && AuthService.client) {
          const authClient = AuthService.client;
          const { error } = await authClient
            .from('projects')
            .delete()
            .eq('id', id);

          if (error) {
            console.error('Error deleting project:', error);
            return { success: false, error: error.message };
          }

          return { success: true };
        }
        
        return { 
          success: false, 
          error: 'Not authenticated. Please login first. If using hardcoded admin, create a Supabase user with the same credentials.' 
        };
      }

      const { error } = await client
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting project:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in deleteProject:', error);
      return { success: false, error: error.message };
    }
  },

  // Get default projects (fallback)
  getDefaultProjects: function() {
    return [
      {
        id: 1,
        title: 'Tennis League Information System',
        category: 'Software Engineering(Java)',
        date: 'August 2024',
        image: 'img/tenis.png',
        url: 'https://github.com/aamir-786'
      },
      {
        id: 2,
        title: 'Shoes Ecommerce Website',
        category: 'Web Design',
        date: 'March 2024',
        image: 'img/shoes.png',
        url: 'https://github.com/aamir-786'
      },
      {
        id: 3,
        title: 'AI Chatbot Integration in Website',
        category: 'Web Design + Python',
        date: 'June 2024',
        image: 'img/chatbot1.png',
        url: 'https://github.com/aamir-786'
      },
      {
        id: 4,
        title: 'Courier Management System',
        category: 'Web Design + PHP',
        date: 'Nov. 2023',
        image: 'img/courier.png',
        url: 'https://github.com/aamir-786'
      },
      {
        id: 5,
        title: 'Simple Chess Game',
        category: 'Java Programming',
        date: 'Sep. 2023',
        image: 'img/chess.png',
        url: 'https://github.com/aamir-786'
      },
      {
        id: 6,
        title: 'Bank Management System',
        category: 'Java Programming',
        date: 'June 2023',
        image: 'img/bank1.png',
        url: 'https://github.com/aamir-786'
      }
    ];
  },

  // ============ REVIEWS ============

  // Get all reviews
  getReviews: async function() {
    const client = this.getClient();
    if (!client) {
      console.error('Supabase client not available');
      return this.getDefaultReviews();
    }

    try {
      const { data, error } = await client
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
        return this.getDefaultReviews();
      }

      return data || [];
    } catch (error) {
      console.error('Error in getReviews:', error);
      return this.getDefaultReviews();
    }
  },

  // Add a new review
  addReview: async function(review) {
    const client = this.getClient();
    if (!client) {
      console.error('Supabase client not available');
      return { success: false, error: 'Supabase client not available' };
    }

    try {
      // Check if we have an authenticated session
      const { data: { session } } = await client.auth.getSession();
      
      if (!session) {
        // Try to use authenticated client from AuthService if available
        if (typeof AuthService !== 'undefined' && AuthService.client) {
          const authClient = AuthService.client;
          const { data, error } = await authClient
            .from('reviews')
            .insert([{
              author: review.author,
              image: review.image,
              text: review.text
            }])
            .select();

          if (error) {
            console.error('Error adding review:', error);
            return { success: false, error: error.message };
          }

          return { success: true, data: data[0] };
        }
        
        return { 
          success: false, 
          error: 'Not authenticated. Please login first. If using hardcoded admin, create a Supabase user with the same credentials.' 
        };
      }

      const { data, error } = await client
        .from('reviews')
        .insert([{
          author: review.author,
          image: review.image,
          text: review.text
        }])
        .select();

      if (error) {
        console.error('Error adding review:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error in addReview:', error);
      return { success: false, error: error.message };
    }
  },

  // Update a review
  updateReview: async function(id, review) {
    const client = this.getClient();
    if (!client) {
      console.error('Supabase client not available');
      return { success: false, error: 'Supabase client not available' };
    }

    try {
      // Check if we have an authenticated session
      const { data: { session } } = await client.auth.getSession();
      
      if (!session) {
        // Try to use authenticated client from AuthService if available
        if (typeof AuthService !== 'undefined' && AuthService.client) {
          const authClient = AuthService.client;
          const { data, error } = await authClient
            .from('reviews')
            .update({
              author: review.author,
              image: review.image,
              text: review.text
            })
            .eq('id', id)
            .select();

          if (error) {
            console.error('Error updating review:', error);
            return { success: false, error: error.message };
          }

          return { success: true, data: data[0] };
        }
        
        return { 
          success: false, 
          error: 'Not authenticated. Please login first. If using hardcoded admin, create a Supabase user with the same credentials.' 
        };
      }

      const { data, error } = await client
        .from('reviews')
        .update({
          author: review.author,
          image: review.image,
          text: review.text
        })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error updating review:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error in updateReview:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete a review
  deleteReview: async function(id) {
    const client = this.getClient();
    if (!client) {
      console.error('Supabase client not available');
      return { success: false, error: 'Supabase client not available' };
    }

    try {
      // Check if we have an authenticated session
      const { data: { session } } = await client.auth.getSession();
      
      if (!session) {
        // Try to use authenticated client from AuthService if available
        if (typeof AuthService !== 'undefined' && AuthService.client) {
          const authClient = AuthService.client;
          const { error } = await authClient
            .from('reviews')
            .delete()
            .eq('id', id);

          if (error) {
            console.error('Error deleting review:', error);
            return { success: false, error: error.message };
          }

          return { success: true };
        }
        
        return { 
          success: false, 
          error: 'Not authenticated. Please login first. If using hardcoded admin, create a Supabase user with the same credentials.' 
        };
      }

      const { error } = await client
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting review:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in deleteReview:', error);
      return { success: false, error: error.message };
    }
  },

  // Get default reviews (fallback)
  getDefaultReviews: function() {
    return [
      {
        id: 1,
        author: 'Felixy2009, Fiverr',
        image: 'img/testimonial-2.jpg',
        text: 'Aamir was an absolute pleasure to work with in Software development. PROFESSIONALISM and attention to detail were exceptional, and his quick responsiveness and cooperation made the entire process smooth. Highly recommended; he went ABOVE and beyond! 👏'
      },
      {
        id: 2,
        author: 'Marhaja, Fiverr',
        image: 'img/testimonial-4.jpg',
        text: 'Working with Aamir on web development was a fantastic experience. His professionalism and meticulous attention to detail truly stood out. He was incredibly responsive and cooperative, making the entire process seamless. Aamir exceeded expectations at every turn. Highly recommended! 👏'
      }
    ];
  },

  // ============ INITIALIZE DATA ============
  
  // Initialize default data in database (run once)
  initializeDatabase: async function() {
    const client = this.getClient();
    if (!client) {
      console.error('Supabase client not available');
      return { success: false, error: 'Supabase client not available' };
    }

    try {
      // Check if projects exist
      const { data: existingProjects } = await client.from('projects').select('id').limit(1);
      
      if (!existingProjects || existingProjects.length === 0) {
        // Insert default projects
        const defaultProjects = this.getDefaultProjects();
        const { error: projectsError } = await client
          .from('projects')
          .insert(defaultProjects);

        if (projectsError) {
          console.error('Error initializing projects:', projectsError);
        } else {
          console.log('Default projects initialized');
        }
      }

      // Check if reviews exist
      const { data: existingReviews } = await client.from('reviews').select('id').limit(1);
      
      if (!existingReviews || existingReviews.length === 0) {
        // Insert default reviews
        const defaultReviews = this.getDefaultReviews();
        const { error: reviewsError } = await client
          .from('reviews')
          .insert(defaultReviews);

        if (reviewsError) {
          console.error('Error initializing reviews:', reviewsError);
        } else {
          console.log('Default reviews initialized');
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error initializing database:', error);
      return { success: false, error: error.message };
    }
  },

  // ============ STORAGE ============

  // Check if storage bucket exists, create if it doesn't
  ensureBucketExists: async function(bucketName = 'portfolio-images') {
    const client = this.getClient();
    if (!client) {
      return { success: false, error: 'Supabase client not available' };
    }

    try {
      // Try to list buckets to check if it exists
      const { data: buckets, error: listError } = await client.storage.listBuckets();
      
      if (listError) {
        console.error('Error listing buckets:', listError);
        // If we can't list buckets, try to create it anyway
      } else {
        // Check if bucket already exists
        const bucketExists = buckets && buckets.some(b => b.name === bucketName);
        if (bucketExists) {
          return { success: true, exists: true };
        }
      }

      // Try to create the bucket if it doesn't exist
      const { data: bucket, error: createError } = await client.storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: ['image/*'],
        fileSizeLimit: 5242880 // 5MB
      });

      if (createError) {
        // If bucket creation fails, it might already exist or we don't have permissions
        // Try to continue anyway - the upload will fail with a better error
        console.warn('Could not create bucket (might already exist or insufficient permissions):', createError.message);
        return { success: false, error: createError.message, shouldTryAnyway: true };
      }

      return { success: true, created: true };
    } catch (error) {
      console.error('Error in ensureBucketExists:', error);
      return { success: false, error: error.message, shouldTryAnyway: true };
    }
  },

  // Upload image to Supabase Storage
  uploadImage: async function(file, folder = 'project-images', bucketName = 'portfolio-images') {
    const client = this.getClient();
    if (!client) {
      console.error('Supabase client not available');
      return { success: false, error: 'Supabase client not available' };
    }

    try {
      // Check if we have an authenticated session
      const { data: { session } } = await client.auth.getSession();
      
      if (!session) {
        return { 
          success: false, 
          error: 'Not authenticated. Please login first.' 
        };
      }

      // Try to ensure bucket exists (will create if it doesn't)
      const bucketCheck = await this.ensureBucketExists(bucketName);
      if (!bucketCheck.success && !bucketCheck.shouldTryAnyway) {
        return { 
          success: false, 
          error: `Storage bucket '${bucketName}' is not available. Please create it in Supabase Dashboard: Storage → Create Bucket → Name: "${bucketName}" → Public: ON` 
        };
      }

      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      // Upload file to Supabase Storage
      const { data, error } = await client.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading image:', error);
        
        // Provide helpful error messages
        if (error.message && error.message.includes('Bucket not found')) {
          return { 
            success: false, 
            error: `Storage bucket '${bucketName}' not found. Please create it in Supabase Dashboard:\n\n1. Go to Storage\n2. Click "Create Bucket"\n3. Name: "${bucketName}"\n4. Set to Public\n5. Save` 
          };
        }
        
        return { success: false, error: error.message };
      }

      // Get public URL
      const { data: urlData } = client.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return { 
        success: true, 
        path: filePath,
        url: urlData.publicUrl
      };
    } catch (error) {
      console.error('Error in uploadImage:', error);
      return { success: false, error: error.message };
    }
  }
};

