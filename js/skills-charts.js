/**
 * Skills Visualization with Chart.js
 * This file creates and manages interactive radar charts for skills visualization
 * on the About page.
 */

// Colors configuration (compatible with dark/light theme)
const getChartColors = () => {
  const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    primaryColor: isDarkMode ? 'rgba(232, 74, 39, 0.7)' : 'rgba(19, 41, 75, 0.7)',  // UIUC Blue/Orange
    secondaryColor: isDarkMode ? 'rgba(232, 74, 39, 0.2)' : 'rgba(19, 41, 75, 0.2)',
    gridColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    textColor: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)'
  };
};

// Chart instances for later reference (for theme toggle updates)
const chartInstances = {};

// Skills data for radar charts
const skillsData = {
  development: {
    labels: ['Python & Flask', 'Java', 'Full-Stack', 'APIs & Microservices', 'Cybersecurity'],
    values: [90, 85, 90, 85, 90]
  },
  database: {
    labels: ['SQL & PostgreSQL', 'AWS & Cloud', 'Big Data', 'Machine Learning', 'Data Visualization'],
    values: [95, 85, 80, 80, 90]
  },
  softSkills: {
    labels: ['Project Management', 'Leadership', 'Tech Strategy', 'Negotiation', 'Communication'],
    values: [95, 90, 90, 85, 95]
  }
};

// Initialize radar charts
function initSkillCharts() {
  const colors = getChartColors();
  
  // Development Skills Chart
  if (document.getElementById('development-chart')) {
    const devCtx = document.getElementById('development-chart').getContext('2d');
    chartInstances.development = new Chart(devCtx, createChartConfig(
      skillsData.development.labels,
      skillsData.development.values,
      colors
    ));
  }
  
  // Database Skills Chart
  if (document.getElementById('database-chart')) {
    const dbCtx = document.getElementById('database-chart').getContext('2d');
    chartInstances.database = new Chart(dbCtx, createChartConfig(
      skillsData.database.labels,
      skillsData.database.values,
      colors
    ));
  }
  
  // Soft Skills Chart
  if (document.getElementById('soft-skills-chart')) {
    const softCtx = document.getElementById('soft-skills-chart').getContext('2d');
    chartInstances.softSkills = new Chart(softCtx, createChartConfig(
      skillsData.softSkills.labels,
      skillsData.softSkills.values,
      colors
    ));
  }
}

// Create radar chart configuration
function createChartConfig(labels, data, colors) {
  return {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Skill Level',
        data: data,
        backgroundColor: colors.secondaryColor,
        borderColor: colors.primaryColor,
        borderWidth: 2,
        pointBackgroundColor: colors.primaryColor,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: colors.primaryColor
      }]
    },
    options: {
      maintainAspectRatio: true,
      scales: {
        r: {
          angleLines: {
            color: colors.gridColor
          },
          grid: {
            color: colors.gridColor
          },
          pointLabels: {
            font: {
              size: 12,
              family: "'Inter', sans-serif"
            },
            color: colors.textColor
          },
          suggestedMin: 0,
          suggestedMax: 100,
          ticks: {
            stepSize: 20,
            backdropColor: 'transparent',
            color: colors.textColor
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          titleFont: {
            family: "'Inter', sans-serif",
            size: 14
          },
          bodyFont: {
            family: "'Inter', sans-serif",
            size: 13
          },
          callbacks: {
            label: function(context) {
              return `Proficiency: ${context.raw}%`;
            }
          }
        }
      }
    }
  };
}

// Update charts when theme changes
function updateChartsForTheme() {
  const colors = getChartColors();
  
  // Update each chart with new theme colors
  Object.values(chartInstances).forEach(chart => {
    if (chart && chart.data && chart.data.datasets && chart.data.datasets.length > 0) {
      const dataset = chart.data.datasets[0];
      dataset.backgroundColor = colors.secondaryColor;
      dataset.borderColor = colors.primaryColor;
      dataset.pointBackgroundColor = colors.primaryColor;
      dataset.pointHoverBorderColor = colors.primaryColor;
      
      // Update scale colors
      if (chart.options && chart.options.scales && chart.options.scales.r) {
        chart.options.scales.r.angleLines.color = colors.gridColor;
        chart.options.scales.r.grid.color = colors.gridColor;
        chart.options.scales.r.pointLabels.color = colors.textColor;
        chart.options.scales.r.ticks.color = colors.textColor;
      }
      
      chart.update();
    }
  });
}

// Initialize skill tab functionality
function initSkillTabs() {
  const tabButtons = document.querySelectorAll('.skill-tab-btn');
  const tabContents = document.querySelectorAll('.skills-tab-content');
  
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      
      // Update active tab button
      tabButtons.forEach(button => {
        button.classList.remove('active');
        button.style.backgroundColor = 'transparent';
        button.style.color = 'var(--text-color)';
        button.style.border = '1px solid var(--uiuc-blue)';
      });
      
      btn.classList.add('active');
      btn.style.backgroundColor = 'var(--uiuc-blue)';
      btn.style.color = 'white';
      btn.style.border = 'none';
      
      // Show the target tab content, hide others
      tabContents.forEach(content => {
        if (content.id === target) {
          content.style.display = 'block';
          
          // If switching to radar view, force chart redraw after display change
          if (target === 'radar-view') {
            setTimeout(() => {
              Object.values(chartInstances).forEach(chart => chart && chart.update());
            }, 50);
          }
        } else {
          content.style.display = 'none';
        }
      });
    });
  });
}

// Initialize both charts and tabs when document is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize skill charts
  initSkillCharts();
  
  // Initialize skill tabs
  initSkillTabs();
  
  // Listen for theme changes to update charts
  const themeToggleBtn = document.querySelector('.theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      // Wait for theme change to complete
      setTimeout(updateChartsForTheme, 100);
    });
  }
  
  // Trigger skill progress animation when in progress view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const percentage = entry.target.getAttribute('data-percentage');
        entry.target.style.width = `${percentage}%`;
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  
  const skillProgressElements = document.querySelectorAll('.skill-progress-fill');
  skillProgressElements.forEach(element => {
    observer.observe(element);
  });
});