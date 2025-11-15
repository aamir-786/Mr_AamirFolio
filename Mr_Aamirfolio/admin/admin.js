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

// Category Manager - Load categories from JSON
const CategoryManager = {
  categories: [],

  // Load categories from JSON file
  loadCategories: async function() {
    try {
      const response = await fetch('data/categories.json');
      if (!response.ok) {
        throw new Error('Failed to load categories.json');
      }
      const data = await response.json();
      this.categories = data.categories || [];
      return this.categories;
    } catch (error) {
      console.error('Error loading categories:', error);
      // Fallback categories if JSON file doesn't exist
      this.categories = [
        'Web Design',
        'Software Engineering (Java)',
        'Web Design + Python',
        'Web Design + PHP',
        'Java Programming',
        'Software Engineering',
        'Web Development',
        'Responsive Design'
      ];
      return this.categories;
    }
  },

  // Populate category dropdown
  populateDropdown: function() {
    const dropdown = document.getElementById('projectCategory');
    if (!dropdown) return;

    dropdown.innerHTML = '<option value="">-- Select Category --</option>';
    this.categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      dropdown.appendChild(option);
    });
  }
};

// Image Upload Manager
const ImageUploadManager = {
  // Handle image file selection
  handleFileSelect: function(event) {
    const file = event.target.files[0];
    if (!file) {
      // Clear preview if no file selected
      const previewContainer = document.getElementById('imagePreviewContainer');
      if (previewContainer) {
        previewContainer.style.display = 'none';
      }
      const imageInput = document.getElementById('projectImage');
      if (imageInput && !imageInput.value) {
        imageInput.value = '';
      }
      // Clear file data
      if (imageInput) {
        imageInput.dataset.fileData = '';
        imageInput.dataset.fileName = '';
      }
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, GIF, etc.)');
      event.target.value = '';
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      event.target.value = '';
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = function(e) {
      const previewContainer = document.getElementById('imagePreviewContainer');
      const preview = document.getElementById('imagePreview');
      const imageUrlInput = document.getElementById('projectImage');
      
      if (preview) {
        preview.src = e.target.result;
      }
      if (previewContainer) {
        previewContainer.style.display = 'block';
      }
      
      // Store file object for upload to Supabase
      if (imageUrlInput) {
        imageUrlInput.dataset.fileData = e.target.result; // For preview
        imageUrlInput.dataset.uploadFile = file.name; // Store filename reference
        // Don't set the input value yet - it will be set after upload to Supabase
        imageUrlInput.value = ''; // Clear manual URL input
      }
    };
    reader.onerror = function() {
      alert('Error reading file. Please try again.');
    };
    reader.readAsDataURL(file);

    // Update file input label
    const label = document.querySelector('.custom-file-label');
    if (label) {
      label.textContent = file.name;
    }
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
          <img src="${project.image}" alt="${project.title}" onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Crect width=\'200\' height=\'200\' fill=\'%23f0f0f0\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\' fill=\'%23999\' font-family=\'Arial\' font-size=\'14\'%3ENo Image%3C/text%3E%3C/svg%3E'">
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
    
    // Reset image preview
    const previewContainer = document.getElementById('imagePreviewContainer');
    const preview = document.getElementById('imagePreview');
    if (previewContainer) previewContainer.style.display = 'none';
    if (preview) preview.src = '';
    
    // Clear file input
    const fileInput = document.getElementById('projectImageFile');
    if (fileInput) fileInput.value = '';
    const label = document.querySelector('.custom-file-label');
    if (label) label.textContent = 'Choose image file...';
    
    // Clear image URL data
    const imageInput = document.getElementById('projectImage');
    if (imageInput) {
      imageInput.dataset.fileData = '';
      imageInput.dataset.fileName = '';
      imageInput.dataset.uploadFile = '';
    }
    
    // Populate categories
    CategoryManager.populateDropdown();
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('projectDate');
    if (dateInput) dateInput.value = today;
    
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
    
    // Populate categories first, then set value
    CategoryManager.populateDropdown();
    const categorySelect = document.getElementById('projectCategory');
    if (categorySelect) {
      // Small delay to ensure dropdown is populated
      setTimeout(() => {
        categorySelect.value = project.category;
      }, 100);
    }
    
    // Convert date format if needed (handle both formats)
    let dateValue = project.date;
    if (dateValue && !dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // If it's in format like "August 2024", convert to date
      try {
        // Try to parse month name format
        const months = ['january', 'february', 'march', 'april', 'may', 'june', 
                       'july', 'august', 'september', 'october', 'november', 'december'];
        const parts = dateValue.toLowerCase().split(' ');
        if (parts.length >= 2) {
          const monthIndex = months.indexOf(parts[0]);
          const year = parseInt(parts[1]);
          if (monthIndex !== -1 && !isNaN(year)) {
            const date = new Date(year, monthIndex, 1);
            dateValue = date.toISOString().split('T')[0];
          }
        }
        
        // If still not valid, try direct Date parsing
        if (!dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
          const date = new Date(project.date);
          if (!isNaN(date.getTime())) {
            dateValue = date.toISOString().split('T')[0];
          }
        }
      } catch (e) {
        console.warn('Could not parse date:', project.date);
        // Use current date as fallback
        dateValue = new Date().toISOString().split('T')[0];
      }
    }
    
    const dateInput = document.getElementById('projectDate');
    if (dateInput) dateInput.value = dateValue || '';
    
    const imageInput = document.getElementById('projectImage');
    if (imageInput) {
      imageInput.value = project.image || '';
      // Show image preview if image exists
      if (project.image) {
        const previewContainer = document.getElementById('imagePreviewContainer');
        const preview = document.getElementById('imagePreview');
        if (preview) preview.src = project.image;
        if (previewContainer) previewContainer.style.display = 'block';
      }
    }
    
    document.getElementById('projectUrl').value = project.url || '';
    document.getElementById('projectDescription').value = project.description || '';
    
    // Clear file input
    const fileInput = document.getElementById('projectImageFile');
    if (fileInput) fileInput.value = '';
    const label = document.querySelector('.custom-file-label');
    if (label) label.textContent = 'Choose image file...';
    
    // Clear file data
    if (imageInput) {
      imageInput.dataset.fileData = '';
      imageInput.dataset.fileName = '';
      imageInput.dataset.uploadFile = '';
    }
    
    $('#projectModal').modal('show');
  },

  // Save project
  saveProject: async function() {
    const form = document.getElementById('projectForm');
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Handle date format conversion from date picker to display format
    const dateInput = document.getElementById('projectDate');
    let formattedDate = '';
    if (dateInput && dateInput.value) {
      const date = new Date(dateInput.value);
      if (!isNaN(date.getTime())) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
        formattedDate = `${months[date.getMonth()]} ${date.getFullYear()}`;
      } else {
        formattedDate = dateInput.value; // Fallback to raw value
      }
    }

    // Handle image upload
    const imageInput = document.getElementById('projectImage');
    const fileInput = document.getElementById('projectImageFile');
    let imagePath = imageInput ? imageInput.value.trim() : '';
    
    // If there's a file uploaded, upload it to Supabase Storage first
    if (fileInput && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      
      // Show loading state
      const saveButton = document.querySelector('#projectModal .btn-primary');
      const originalButtonText = saveButton ? saveButton.textContent : '';
      if (saveButton) {
        saveButton.disabled = true;
        saveButton.textContent = 'Uploading image...';
      }
      
      try {
        // Upload to Supabase Storage
        const uploadResult = await SupabaseService.uploadImage(file, 'project-images');
        
        if (uploadResult.success) {
          // Use the public URL from Supabase Storage
          imagePath = uploadResult.url;
          // Update the image input with the URL
          if (imageInput) {
            imageInput.value = imagePath;
          }
        } else {
          alert('Error uploading image: ' + (uploadResult.error || 'Unknown error'));
          if (saveButton) {
            saveButton.disabled = false;
            saveButton.textContent = originalButtonText;
          }
          return;
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading image: ' + (error.message || 'Unknown error'));
        if (saveButton) {
          saveButton.disabled = false;
          saveButton.textContent = originalButtonText;
        }
        return;
      }
      
      // Restore button state
      if (saveButton) {
        saveButton.disabled = false;
        saveButton.textContent = originalButtonText;
      }
    }

    // Validate that either file is uploaded or URL is provided
    if (!imagePath || imagePath.trim() === '') {
      alert('Please upload an image file or provide an image URL/path');
      return;
    }

    const project = {
      title: document.getElementById('projectTitle').value,
      category: document.getElementById('projectCategory').value,
      date: formattedDate,
      image: imagePath,
      url: document.getElementById('projectUrl').value || 'https://github.com/aamir-786',
      description: document.getElementById('projectDescription').value || null
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

