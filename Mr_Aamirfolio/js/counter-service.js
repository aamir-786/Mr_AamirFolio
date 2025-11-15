// Counter Service - Auto-increment counters based on time
// This service calculates and updates counters based on a start date

const CounterService = {
  // Configuration: Set your career start date
  // Change this to when you started your professional career
  careerStartDate: new Date('2021-06-01'), // Adjusted to show more experience (earlier start date)
  
  // Base values at start date (your initial values)
  baseValues: {
    worksCompleted: 10,     // Started with some initial projects
    yearsExperience: 0,     // Started with 0 years
    totalClients: 5,        // Started with some initial clients
    awardsWon: 1            // Started with some initial awards
  },
  
  // Growth rates (how much to add per year) - increased for faster growth
  growthRates: {
    worksCompleted: 20,     // ~20 projects per year (increased from 18)
    totalClients: 12,       // ~12 clients per year (increased from 10)
    awardsWon: 3            // ~3 awards per year (increased from 2.4)
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
        // Update counter text directly - counterUp will animate from 0 to this value
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

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    CounterService.init();
  });
} else {
  // DOM is already ready
  CounterService.init();
}

