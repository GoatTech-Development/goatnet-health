<template>
  <Chart ref="primeChart" type="line" :data="chartData" :options="chartOptions" class="h-30rem"/>
</template>

<script setup>
import 'chartjs-adapter-date-fns';
import Chart from 'primevue/chart';
import {onMounted, ref} from "vue";
import {setupWebSocket} from "@/services/websocketService.js";

// Setup websocket connection
const ws = ref(null);

onMounted(async () => {
  ws.value = setupWebSocket(updateChartData);
});

function getGradient(chart) {
  const ctx = chart.ctx;
  const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
  gradient.addColorStop(0, 'rgba(255, 105, 180, 0.5)'); // Start color
  gradient.addColorStop(1, 'rgba(255, 192, 203, 0)'); // End color
  return gradient;
}

let chartData = {
  labels: [], // Empty array for labels
  datasets: [
    {
      label: 'Latency',
      data: [], // Empty array for data
      fill: true,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.4,
      backgroundColor: (context) => getGradient(context.chart)
    }
  ]
};

const chartOptions = {
  responsive: true,
  animation: {
    duration: 100, // Duration of the animation in milliseconds
    easing: 'linear', // Easing function to use
  },
  legend: {
    display: true,
    position: 'bottom',
    labels: {
      fontColor: '#3300CC'
    }
  },
  tooltips: {
    enabled: true,
    backgroundColor: '#FFFFFF',
    titleFontColor: '#000000',
    bodyFontColor: '#000000'
  },
  elements: {
    point: {
      // Hide points on chart unless mouse-over
      radius: 0,
      hitRadius: 100,
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Time',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      type: 'time',
      time: {
        unit: 'second'
      },
      ticks: {
        source: 'data',
        color: '#FFFFFF'
      },
      animation: {
        duration: 1000, // new duration for the x-axis transition
      },
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Latency (ms)',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      ticks: {
        color: '#FFFFFF'
      }
    },
  },
};

const primeChart = ref();

const windowSize = 8; // Size of the sliding window

let latencies = []; // Array to store the last N latencies

const updateChartData = (latency) => {
  // Add the new latency to the end of the array
  latencies.push(latency);

  // If the array size exceeds the window size, remove the oldest latency from the start of the array
  if (latencies.length > windowSize) {
    latencies.shift();
  }

  // Update the chart data and labels
  chartData.datasets[0].data = [...latencies];
  chartData.labels = latencies.map((_, i) => new Date(Date.now() - (windowSize - i - 1) * 1000));
};

// Update the chart data at a set interval
setInterval(() => {
  if (primeChart.value !== null && primeChart.value !== undefined) {
    primeChart.value.refresh();
  }
}, 1000); // Adjust the interval as needed// Adjust the interval as needed
</script>
