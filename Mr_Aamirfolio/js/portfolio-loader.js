// Portfolio Data Loader - Loads projects and reviews dynamically
(function() {
  'use strict';

  // Store all projects globally for filtering
  let allProjects = [];
  let currentFilter = 'all';
  let displayedCount = 6; // Initial number of projects to show
  const PROJECTS_PER_PAGE = 6; // Projects to show per "See More" click

  // Get projects from Supabase
  async function getProjects() {
    if (typeof SupabaseService !== 'undefined') {
      try {
        return await SupabaseService.getProjects();
      } catch (error) {
        console.error('Error fetching projects from Supabase:', error);
        return SupabaseService.getDefaultProjects();
      }
    }
    // Fallback to defaults if Supabase not available
    return SupabaseService ? SupabaseService.getDefaultProjects() : [];
  }

  // Get reviews from Supabase
  async function getReviews() {
    if (typeof SupabaseService !== 'undefined') {
      try {
        return await SupabaseService.getReviews();
      } catch (error) {
        console.error('Error fetching reviews from Supabase:', error);
        return SupabaseService.getDefaultReviews();
      }
    }
    // Fallback to defaults if Supabase not available
    return SupabaseService ? SupabaseService.getDefaultReviews() : [];
  }

  // Normalize categories - merge similar/duplicate categories
  function normalizeCategory(category) {
    if (!category) return category;
    
    const normalized = category.trim();
    
    // Category mapping: map similar categories to unified names
    const categoryMap = {
      // Web + Python variations
      'Web Design + Python': 'Web + Python',
      'web design + python': 'Web + Python',
      'Web + Python': 'Web + Python',
      'web + python': 'Web + Python',
      'Python Web': 'Web + Python',
      'python web': 'Web + Python',
      
      // Web + PHP variations
      'Web Design + PHP': 'Web + PHP',
      'web design + php': 'Web + PHP',
      'Web + PHP': 'Web + PHP',
      'web + php': 'Web + PHP',
      'PHP Web': 'Web + PHP',
      'php web': 'Web + PHP',
      
      // Web Development variations
      'Web Design': 'Web Development',
      'web design': 'Web Development',
      'Web Development': 'Web Development',
      'web development': 'Web Development',
      'Frontend Development': 'Web Development',
      'frontend development': 'Web Development',
      'Responsive Design': 'Web Development',
      'responsive design': 'Web Development',
      
      // Java Development variations
      'Full Stack Development (MERN Stack)': 'Java Development',
      'full stack development (mern stack)': 'Java Development',
      'Full Stack Development': 'Java Development',
      'full stack development': 'Java Development',
      'MERN Stack': 'Java Development',
      'mern stack': 'Java Development',
      'Full Stack': 'Java Development',
      'full stack': 'Java Development',
      'Software Engineering': 'Java Development',
      'software engineering': 'Java Development',
      'Software Engineering (Java)': 'Java Development',
      'Software Engineering(Java)': 'Java Development',
      'Software Engineering(java)': 'Java Development',
      'Java Programming': 'Java Development',
      'java programming': 'Java Development',
      'Java Development': 'Java Development',
      'java development': 'Java Development',
      'Java Project': 'Java Development',
      'java project': 'Java Development',
      'Java': 'Java Development',
      'java': 'Java Development',
      
      // AI variations - map to Java Development
      'AI': 'Java Development',
      'ai': 'Java Development',
      'Artificial Intelligence': 'Java Development',
      'artificial intelligence': 'Java Development',
      'Machine Learning': 'Java Development',
      'machine learning': 'Java Development',
      'ML': 'Java Development',
      'ml': 'Java Development',
    };
    
    // Check if category should be mapped
    if (categoryMap[normalized]) {
      return categoryMap[normalized];
    }
    
    // Case-insensitive check for common variations
    // Order matters - check most specific first
    const lowerNormalized = normalized.toLowerCase();
    
    // Check for Web + Python (must check before Web Development)
    if (lowerNormalized.includes('python') && (lowerNormalized.includes('web') || lowerNormalized.includes('design'))) {
      return 'Web + Python';
    }
    
    // Check for Web + PHP (must check before Web Development)
    if (lowerNormalized.includes('php') && (lowerNormalized.includes('web') || lowerNormalized.includes('design'))) {
      return 'Web + PHP';
    }
    
    // Check for Java Development / MERN Stack / AI (must check before general web categories)
    if (lowerNormalized.includes('mern') || 
        (lowerNormalized.includes('full stack') && !lowerNormalized.includes('web')) ||
        (lowerNormalized.includes('software engineering')) ||
        (lowerNormalized.includes('java')) ||
        lowerNormalized === 'java' ||
        lowerNormalized.includes('artificial intelligence') || 
        lowerNormalized.includes('machine learning') ||
        lowerNormalized === 'ai' ||
        lowerNormalized === 'ml') {
      return 'Java Development';
    }
    
    // Check for Web Development (general web categories - check last)
    if (lowerNormalized.includes('web development') || 
        lowerNormalized.includes('web design') ||
        lowerNormalized.includes('frontend') ||
        lowerNormalized.includes('responsive design') ||
        (lowerNormalized.includes('web') && !lowerNormalized.includes('python') && !lowerNormalized.includes('php'))) {
      return 'Web Development';
    }
    
    return normalized;
  }

  // Load categories for filter
  async function loadCategories() {
    try {
      const response = await fetch('data/categories.json');
      if (response.ok) {
        const data = await response.json();
        const categories = data.categories || [];
        
        // Normalize and deduplicate categories
        const normalizedCategories = categories
          .map(cat => normalizeCategory(cat))
          .filter((cat, index, self) => self.indexOf(cat) === index && cat); // Remove duplicates and empty
        
        // Sort and return unique categories
        return normalizedCategories.sort();
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
    // Fallback categories (normalized)
    return [
      'Web Development',
      'Java Development',
      'Web + PHP',
      'Web + Python'
    ];
  }

  // Normalize project categories when loading
  function normalizeProjectCategories(projects) {
    return projects.map(project => ({
      ...project,
      category: normalizeCategory(project.category),
      originalCategory: project.category // Keep original for display if needed
    }));
  }

  // Render category filter buttons
  async function renderCategoryFilters() {
    const filterContainer = document.getElementById('portfolio-filter');
    if (!filterContainer) return;

    // Clear ALL existing filter buttons first (we'll recreate them)
    filterContainer.innerHTML = '<button class="filter-btn active" data-filter="all">All</button>';
    
    // Load categories from JSON - these are our definitive 4 categories
    const jsonCategories = await loadCategories();
    
    // Ensure no duplicates and sort
    const uniqueCategories = [...new Set(jsonCategories)].sort();
    
    // Add filter buttons for each category
    uniqueCategories.forEach(category => {
      const button = document.createElement('button');
      button.className = 'filter-btn';
      button.setAttribute('data-filter', category);
      button.textContent = category;
      filterContainer.appendChild(button);
    });
    
    // Add click handlers to all filter buttons (including "All")
    filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
      // Remove existing listeners by cloning (prevents duplicate listeners)
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      
      // Add new event listener
      newBtn.addEventListener('click', function() {
        // Update active state
        filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Apply filter
        currentFilter = this.getAttribute('data-filter');
        displayedCount = 6; // Reset to initial count
        displayProjects();
      });
    });
  }

  // Filter projects by category (using normalized categories)
  function getFilteredProjects() {
    if (currentFilter === 'all') {
      return allProjects;
    }
    // allProjects is already normalized when loaded, so we can filter directly
    return allProjects.filter(project => project.category === currentFilter);
  }

  // Render a single project card
  function renderProjectCard(project) {
    // Truncate title if too long
    const maxTitleLength = 50;
    const displayTitle = project.title.length > maxTitleLength 
      ? project.title.substring(0, maxTitleLength) + '...' 
      : project.title;
    
    // Truncate category if too long
    const maxCategoryLength = 30;
    const displayCategory = project.category.length > maxCategoryLength 
      ? project.category.substring(0, maxCategoryLength) + '...' 
      : project.category;
    
    // Get description (if exists) or use category as description
    const description = project.description || project.category || '';
    const maxDescLength = 100;
    const shortDescription = description.length > maxDescLength 
      ? description.substring(0, maxDescLength) + '...' 
      : description;
    const hasMore = description.length > maxDescLength;
    
    return `
      <div class="col-md-4 project-item" data-category="${project.category}">
        <div class="work-box">
          <a href="${project.image}" data-lightbox="gallery-mf" data-title="${project.title}">
            <div class="work-img">
              <img src="${project.image}" alt="${project.title}" class="img-fluid" onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Crect width=\'200\' height=\'200\' fill=\'%23f0f0f0\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\' fill=\'%23999\' font-family=\'Arial\' font-size=\'14\'%3ENo Image%3C/text%3E%3C/svg%3E'">
            </div>
          </a>
          <div class="work-content">
            <div class="row">
              <div class="col-sm-8">
                <h2 class="w-title" title="${project.title}">${displayTitle}</h2>
                <div class="w-more">
                  <span class="w-ctegory" title="${project.category}">${displayCategory}</span> / <span class="w-date">${project.date}</span>
                </div>
              </div>
              <div class="col-sm-4">
                <div class="w-like">
                  <span class="ion-ios-plus-outline"></span>
                </div>
              </div>
            </div>
            ${description ? `
            <div class="row">
              <div class="col-12">
                <p class="w-description">${shortDescription}</p>
                ${hasMore ? `<a href="project-details.html?id=${project.id}" class="read-more-link">Read More</a>` : ''}
              </div>
            </div>
            ` : ''}
            <div class="row">
              <div class="col-12">
                <a href="${project.url || 'https://github.com/aamir-786'}" target="_blank" class="btn-go-live">Go Live</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Display projects with filtering and pagination
  function displayProjects() {
    const container = document.getElementById('projects-container');
    const seeMoreContainer = document.getElementById('see-more-container');
    const seeMoreBtn = document.getElementById('see-more-btn');
    
    if (!container) return;

    // Get filtered projects
    const filteredProjects = getFilteredProjects();
    
    if (filteredProjects.length === 0) {
      container.innerHTML = '<div class="col-12 text-center"><p>No projects found in this category.</p></div>';
      if (seeMoreContainer) seeMoreContainer.style.display = 'none';
      return;
    }

    // Get projects to display (limited by displayedCount)
    const projectsToShow = filteredProjects.slice(0, displayedCount);
    
    // Render project cards
    container.innerHTML = projectsToShow.map(project => renderProjectCard(project)).join('');

    // Show/hide "See More" button
    if (seeMoreContainer && seeMoreBtn) {
      if (displayedCount < filteredProjects.length) {
        seeMoreContainer.style.display = 'block';
        seeMoreBtn.textContent = `See More`;
      } else {
        seeMoreContainer.style.display = 'none';
      }
    }

    // Reinitialize lightbox for new images
    if (typeof lightbox !== 'undefined') {
      lightbox.option({
        'resizeDuration': 200,
        'wrapAround': true
      });
    }
  }

  // Load projects into the page
  async function loadProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    // Show loading state
    container.innerHTML = '<div class="col-12 text-center p-4"><i class="ion-loading-a"></i> Loading projects...</div>';

    try {
      const rawProjects = await getProjects();
      
      if (rawProjects.length === 0) {
        container.innerHTML = '<div class="col-12 text-center"><p>No projects available at the moment.</p></div>';
        return;
      }

      // Normalize project categories to merge similar ones
      allProjects = normalizeProjectCategories(rawProjects);
      
      // Render category filters (after normalizing)
      await renderCategoryFilters();
      
      // Display initial projects (6 projects)
      displayedCount = 6;
      displayProjects();
      
      // Setup "See More" button handler
      const seeMoreBtn = document.getElementById('see-more-btn');
      if (seeMoreBtn) {
        seeMoreBtn.addEventListener('click', function() {
          displayedCount += PROJECTS_PER_PAGE;
          displayProjects();
          
          // Scroll to see more button after adding projects
          setTimeout(() => {
            seeMoreBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 100);
        });
      }
      
    } catch (error) {
      console.error('Error loading projects:', error);
      container.innerHTML = '<div class="col-12 text-center"><p class="text-danger">Error loading projects. Please try again later.</p></div>';
    }
  }

  // Load reviews into the page
  async function loadReviews() {
    const container = document.getElementById('testimonial-mf');
    if (!container) return;

    // Show loading state
    container.innerHTML = '<div class="testimonial-box"><p><i class="ion-loading-a"></i> Loading reviews...</p></div>';

    try {
      const reviews = await getReviews();
      
      if (reviews.length === 0) {
        container.innerHTML = '<div class="testimonial-box"><p>No reviews available at the moment.</p></div>';
        return;
      }

      container.innerHTML = reviews.map(review => `
        <div class="testimonial-box">
          <div class="author-test">
            <img src="${review.image}" alt="${review.author}" class="rounded-circle b-shadow-a" onerror="this.src='img/testimonial-2.jpg'">
            <span class="author">${review.author}</span>
          </div>
          <div class="content-test">
            <p class="description lead">
              ${review.text}
            </p>
            <span class="comit"><i class="fa fa-quote-right"></i></span>
          </div>
        </div>
      `).join('');

      // Reinitialize owl carousel if it exists
      if (typeof jQuery !== 'undefined' && jQuery('#testimonial-mf').length) {
        // Destroy existing carousel if it exists
        const carousel = jQuery('#testimonial-mf');
        if (carousel.data('owl.carousel')) {
          carousel.trigger('destroy.owl.carousel');
        }
        // Reinitialize
        carousel.owlCarousel({
          margin: 20,
          autoplay: true,
          autoplayTimeout: 4000,
          autoplayHoverPause: true,
          responsive: {
            0: {
              items: 1,
            }
          }
        });
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      container.innerHTML = '<div class="testimonial-box"><p class="text-danger">Error loading reviews. Please try again later.</p></div>';
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      loadProjects();
      loadReviews();
    });
  } else {
    loadProjects();
    loadReviews();
  }

  // Also load after a short delay to ensure all scripts are loaded
  setTimeout(function() {
    loadProjects();
    loadReviews();
  }, 500);

})();

