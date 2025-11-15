// Admin System - Authentication and Core Functions (Updated to use Supabase Auth)
const AdminSystem = {
  // Initialize admin system
  init: async function() {
    // Initialize auth service if available
    if (typeof AuthService !== 'undefined') {
      AuthService.init();
    }
  },

  // Login using Supabase Auth
  login: async function(email, password) {
    if (typeof AuthService === 'undefined') {
      console.error('AuthService not available');
      return { success: false, error: 'Authentication service not available' };
    }

    const result = await AuthService.signIn(email, password);
    return result;
  },

  // Logout
  logout: async function() {
    if (typeof AuthService !== 'undefined') {
      await AuthService.signOut();
    }
    // Clear any local storage
    sessionStorage.clear();
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminUser');
    window.location.href = 'admin.html';
  },

  // Check if authenticated
  isAuthenticated: async function() {
    if (typeof AuthService !== 'undefined') {
      return await AuthService.isAuthenticated();
    }
    // Fallback to session storage for backward compatibility
    return sessionStorage.getItem('adminAuthenticated') === 'true';
  },

  // Change password
  changePassword: async function(newPassword) {
    if (typeof AuthService === 'undefined') {
      return { success: false, error: 'Authentication service not available' };
    }

    const result = await AuthService.updatePassword(newPassword);
    return result;
  },

  // Get current user
  getCurrentUser: async function() {
    if (typeof AuthService !== 'undefined') {
      return await AuthService.getCurrentUser();
    }
    return null;
  },

  // Show section
  showSection: function(section) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(sec => {
      sec.classList.remove('active');
    });

    // Remove active from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });

    // Show selected section
    document.getElementById(section + '-section').classList.add('active');
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
  }
};

// Project Manager - Updated to use Supabase
const ProjectManager = {
  projects: [], // Cache projects

  // Load projects from Supabase
  loadProjects: async function() {
    const container = document.getElementById('projects-list');
    container.innerHTML = '<div class="text-center p-4"><i class="ion-loading-a"></i> Loading projects...</div>';

    try {
      this.projects = await SupabaseService.getProjects();
      
      if (this.projects.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <i class="ion-briefcase"></i>
            <h3>No Projects Yet</h3>
            <p>Click "Add New Project" to get started</p>
          </div>
        `;
        return;
      }

      container.innerHTML = this.projects.map((project, index) => `
        <div class="item-card">
          <img src="${project.image}" alt="${project.title}" onerror="this.src='img/placeholder.png'">
          <h4>${project.title}</h4>
          <div class="item-meta">
            <strong>Category:</strong> ${project.category}<br>
            <strong>Date:</strong> ${project.date}
          </div>
          <div class="item-actions">
            <button class="btn btn-sm btn-primary" onclick="ProjectManager.editProject(${project.id || index})">
              <i class="ion-edit"></i> Edit
            </button>
            <button class="btn btn-sm btn-danger" onclick="ProjectManager.deleteProject(${project.id || index})">
              <i class="ion-trash-a"></i> Delete
            </button>
          </div>
        </div>
      `).join('');
    } catch (error) {
      console.error('Error loading projects:', error);
      container.innerHTML = `
        <div class="alert alert-danger">
          <strong>Error loading projects:</strong> ${error.message || 'Unknown error'}
        </div>
      `;
    }
  },

  // Show add form
  showAddForm: function() {
    document.getElementById('projectId').value = '';
    document.getElementById('projectForm').reset();
    $('#projectModal').modal('show');
  },

  // Edit project
  editProject: function(id) {
    const project = this.projects.find(p => (p.id === id || p.id === parseInt(id)));
    if (!project) {
      alert('Project not found');
      return;
    }
    
    document.getElementById('projectId').value = project.id;
    document.getElementById('projectTitle').value = project.title;
    document.getElementById('projectCategory').value = project.category;
    document.getElementById('projectDate').value = project.date;
    document.getElementById('projectImage').value = project.image;
    document.getElementById('projectUrl').value = project.url || '';
    
    $('#projectModal').modal('show');
  },

  // Save project
  saveProject: async function() {
    const form = document.getElementById('projectForm');
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const project = {
      title: document.getElementById('projectTitle').value,
      category: document.getElementById('projectCategory').value,
      date: document.getElementById('projectDate').value,
      image: document.getElementById('projectImage').value,
      url: document.getElementById('projectUrl').value || 'https://github.com/aamir-786'
    };

    const id = document.getElementById('projectId').value;
    let result;

    if (id === '') {
      // Add new
      result = await SupabaseService.addProject(project);
    } else {
      // Update existing
      result = await SupabaseService.updateProject(id, project);
    }

    if (result.success) {
      this.loadProjects();
      $('#projectModal').modal('hide');
    } else {
      alert('Error saving project: ' + (result.error || 'Unknown error'));
    }
  },

  // Delete project
  deleteProject: async function(id) {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    const result = await SupabaseService.deleteProject(id);
    
    if (result.success) {
      this.loadProjects();
    } else {
      alert('Error deleting project: ' + (result.error || 'Unknown error'));
    }
  }
};

// Review Manager - Updated to use Supabase
const ReviewManager = {
  reviews: [], // Cache reviews

  // Load reviews from Supabase
  loadReviews: async function() {
    const container = document.getElementById('reviews-list');
    container.innerHTML = '<div class="text-center p-4"><i class="ion-loading-a"></i> Loading reviews...</div>';

    try {
      this.reviews = await SupabaseService.getReviews();
      
      if (this.reviews.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <i class="ion-star"></i>
            <h3>No Reviews Yet</h3>
            <p>Click "Add New Review" to get started</p>
          </div>
        `;
        return;
      }

      container.innerHTML = this.reviews.map((review, index) => `
        <div class="review-card">
          <div class="author-info">
            <img src="${review.image}" alt="${review.author}" onerror="this.src='img/testimonial-2.jpg'">
            <div>
              <div class="author-name">${review.author}</div>
            </div>
          </div>
          <div class="review-text">${review.text}</div>
          <div class="item-actions mt-3">
            <button class="btn btn-sm btn-primary" onclick="ReviewManager.editReview(${review.id || index})">
              <i class="ion-edit"></i> Edit
            </button>
            <button class="btn btn-sm btn-danger" onclick="ReviewManager.deleteReview(${review.id || index})">
              <i class="ion-trash-a"></i> Delete
            </button>
          </div>
        </div>
      `).join('');
    } catch (error) {
      console.error('Error loading reviews:', error);
      container.innerHTML = `
        <div class="alert alert-danger">
          <strong>Error loading reviews:</strong> ${error.message || 'Unknown error'}
        </div>
      `;
    }
  },

  // Show add form
  showAddForm: function() {
    document.getElementById('reviewId').value = '';
    document.getElementById('reviewForm').reset();
    $('#reviewModal').modal('show');
  },

  // Edit review
  editReview: function(id) {
    const review = this.reviews.find(r => (r.id === id || r.id === parseInt(id)));
    if (!review) {
      alert('Review not found');
      return;
    }
    
    document.getElementById('reviewId').value = review.id;
    document.getElementById('reviewAuthor').value = review.author;
    document.getElementById('reviewImage').value = review.image;
    document.getElementById('reviewText').value = review.text;
    
    $('#reviewModal').modal('show');
  },

  // Save review
  saveReview: async function() {
    const form = document.getElementById('reviewForm');
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const review = {
      author: document.getElementById('reviewAuthor').value,
      image: document.getElementById('reviewImage').value,
      text: document.getElementById('reviewText').value
    };

    const id = document.getElementById('reviewId').value;
    let result;

    if (id === '') {
      // Add new
      result = await SupabaseService.addReview(review);
    } else {
      // Update existing
      result = await SupabaseService.updateReview(id, review);
    }

    if (result.success) {
      this.loadReviews();
      $('#reviewModal').modal('hide');
    } else {
      alert('Error saving review: ' + (result.error || 'Unknown error'));
    }
  },

  // Delete review
  deleteReview: async function(id) {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    const result = await SupabaseService.deleteReview(id);
    
    if (result.success) {
      this.loadReviews();
    } else {
      alert('Error deleting review: ' + (result.error || 'Unknown error'));
    }
  }
};

// Initialize on page load
AdminSystem.init();

// Initialize Supabase client when available
if (typeof SupabaseService !== 'undefined') {
  // SupabaseService is loaded from supabase-service.js
}

