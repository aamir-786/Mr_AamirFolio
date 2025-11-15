// Portfolio Data Loader - Loads projects and reviews dynamically
(function() {
  'use strict';

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

  // Load projects into the page
  async function loadProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    // Show loading state
    container.innerHTML = '<div class="col-12 text-center p-4"><i class="ion-loading-a"></i> Loading projects...</div>';

    try {
      const projects = await getProjects();
      
      if (projects.length === 0) {
        container.innerHTML = '<div class="col-12 text-center"><p>No projects available at the moment.</p></div>';
        return;
      }

      container.innerHTML = projects.map(project => {
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
        <div class="col-md-4">
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
      }).join('');

      // Reinitialize lightbox for new images
      if (typeof lightbox !== 'undefined') {
        lightbox.option({
          'resizeDuration': 200,
          'wrapAround': true
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

