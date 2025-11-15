// Counter Service - Auto-increment counters based on time
// This service calculates and updates counters based on a start date

const CounterService = {
  // Configuration: Set your career start date
  // Change this to when you started your professional career
  // Set to approximately 3 years ago to show 3.0 years of experience currently
  careerStartDate: new Date('2022-11-01'), // Adjusted to show 3.0 years currently
  
  // Base values at start date (your initial values)
  baseValues: {
    worksCompleted: 0,      // Started with 0 projects
    yearsExperience: 0,     // Started with 0 years
    totalClients: 0,        // Started with 0 clients
    awardsWon: 0            // Started with 0 awards
  },
  
  // Growth rates (how much to add per year)
  // Calibrated to show: 69 works, 3.0 years, 13 clients, 11 awards currently
  growthRates: {
    worksCompleted: 22.97,  // ~22.97 projects per year (69 total at 3.0 years)
    totalClients: 4.33,     // ~4.33 clients per year (13 total at 3.0 years)
    awardsWon: 3.67         // ~3.67 awards per year (11 total at 3.0 years)
  },
  
  // Initialize and calculate current values
  init: function() {
    const currentValues = this.calculateCurrentValues();
    this.updateCounters(currentValues);
  },
  
  // Calculate current values based on time elapsed
  calculateCurrentValues: function() {
    const now = new Date();
    const startDate = this.careerStartDate;
    
    // Calculate years of experience
    const yearsDiff = (now - startDate) / (1000 * 60 * 60 * 24 * 365.25);
    const yearsExperience = Math.max(0, yearsDiff);
    
    // Calculate other values based on years
    const worksCompleted = Math.round(
      this.baseValues.worksCompleted + (yearsExperience * this.growthRates.worksCompleted)
    );
    
    const totalClients = Math.round(
      this.baseValues.totalClients + (yearsExperience * this.growthRates.totalClients)
    );
    
    const awardsWon = Math.round(
      this.baseValues.awardsWon + (yearsExperience * this.growthRates.awardsWon)
    );
    
    return {
      worksCompleted: worksCompleted,
      yearsExperience: yearsExperience.toFixed(1), // One decimal place for years
      totalClients: totalClients,
      awardsWon: awardsWon
    };
  },
  
  // Update the counter elements on the page
  updateCounters: function(values) {
    // Find all counter elements by data-counter attribute or label
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
      const dataCounter = counter.getAttribute('data-counter');
      const parent = counter.closest('.counter-box');
      const labelElement = parent ? parent.querySelector('.counter-text') : null;
      const label = labelElement ? labelElement.textContent.trim() : '';
      
      let newValue = null;
      
      // Match counter by data attribute or label
      if (dataCounter === 'works' || label.includes('WORKS COMPLETED') || label.includes('WORKS')) {
        newValue = values.worksCompleted;
      } else if (dataCounter === 'experience' || label.includes('YEARS OF EXPERIENCE') || label.includes('EXPERIENCE')) {
        newValue = values.yearsExperience;
      } else if (dataCounter === 'clients' || label.includes('TOTAL CLIENTS') || label.includes('CLIENTS')) {
        newValue = values.totalClients;
      } else if (dataCounter === 'awards' || label.includes('AWARD WON') || label.includes('AWARD')) {
        newValue = values.awardsWon;
      }
      
      if (newValue !== null) {
        // counterUp checks data-num first, then falls back to text content
        // Set both to ensure counterUp reads the correct value
        counter.setAttribute('data-num', newValue);
        counter.textContent = newValue;
        // Store the value for reference
        counter.setAttribute('data-value', newValue);
        // Mark as updated by CounterService
        counter.dataset.updated = 'true';
      }
    });
  },
  
  // Get current calculated values (for external use)
  getCurrentValues: function() {
    return this.calculateCurrentValues();
  },
  
  // Update configuration (useful for admin panel)
  updateConfig: function(startDate, baseValues, growthRates) {
    if (startDate) this.careerStartDate = new Date(startDate);
    if (baseValues) this.baseValues = { ...this.baseValues, ...baseValues };
    if (growthRates) this.growthRates = { ...this.growthRates, ...growthRates };
    this.init(); // Recalculate and update
  }
};

// Auto-initialize immediately to update values before counterUp runs
// Run immediately if DOM is ready, otherwise wait for DOMContentLoaded
(function initializeCounterService() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      // Use setTimeout to ensure all scripts are loaded
      setTimeout(function() {
        CounterService.init();
      }, 100);
    });
  } else {
    // DOM is already ready - run immediately
    setTimeout(function() {
      CounterService.init();
    }, 100);
  }
})();

// Also ensure values are updated when window loads (after all resources)
window.addEventListener('load', function() {
  // Re-update counters to ensure they have the latest values
  if (typeof CounterService !== 'undefined') {
    CounterService.init();
  }
});

