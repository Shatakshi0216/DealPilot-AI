// DealPilot AI - Chart.js Visualization Manager
import { currentTimelineData, currentParams } from './dataGenerator.js';

export let chartInstance = null;

export function initChart() {
  const ctx = document.getElementById("price-chart");
  if (!ctx) return;
  
  const drawCtx = ctx.getContext("2d");
  
  if (chartInstance) {
    chartInstance.destroy();
  }
  
  const temp = currentParams;
  const labels = Object.keys(currentTimelineData).map(day => `Day ${day}`);
  
  const amazonData = Object.keys(currentTimelineData).map(day => currentTimelineData[day].amazon);
  const flipkartData = Object.keys(currentTimelineData).map(day => currentTimelineData[day].flipkart);
  const relianceData = Object.keys(currentTimelineData).map(day => currentTimelineData[day].reliance);
  const budgetData = Array(labels.length).fill(temp.budget);
  
  chartInstance = new Chart(drawCtx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Amazon India',
          data: amazonData,
          borderColor: '#ff9900',
          borderWidth: 1.5,
          pointBackgroundColor: '#ff9900',
          tension: 0.1,
          fill: false
        },
        {
          label: 'Flipkart',
          data: flipkartData,
          borderColor: '#2874f0',
          borderWidth: 1.5,
          pointBackgroundColor: '#2874f0',
          tension: 0.1,
          fill: false
        },
        {
          label: 'Reliance Digital (Best)',
          data: relianceData,
          borderColor: '#ec4899',
          borderWidth: 2.5,
          pointBackgroundColor: '#ec4899',
          tension: 0.1,
          fill: false
        },
        {
          label: 'Budget Limit',
          data: budgetData,
          borderColor: '#ff3366',
          borderDash: [5, 5],
          borderWidth: 1.5,
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#94a3b8',
            font: { family: 'Outfit', size: 9 }
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.03)' },
          ticks: { color: '#94a3b8', font: { family: 'Outfit', size: 9 } }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.03)' },
          ticks: {
            color: '#94a3b8',
            font: { family: 'Outfit', size: 9 },
            callback: function(value) { return '₹' + value.toLocaleString(); }
          }
        }
      }
    }
  });
}

export function highlightChartPoint(day) {
  if (!chartInstance) return;
  chartInstance.update();
}
