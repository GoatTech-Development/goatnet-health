<template>
  <button @click="simulateError">Simulate Error</button>
  <button @click="simulateClose">Simulate Close</button>
  <Chart ref="primeChart" type="line" :data="chartData" :options="chartOptions" class="h-30rem"/>
</template>

<script setup>
import 'chartjs-adapter-date-fns';
import Chart from 'primevue/chart';
import {nextTick, onMounted, ref} from "vue";
import {setupWebSocket} from "@/services/websocketService.js";

// Setup websocket connection
const ws = ref(null);

onMounted(async () => {
  await nextTick();
  // await shiftData();
  ws.value = setupWebSocket(updateChartData);
});

const simulateError = () => {
  ws.value.handleError(new Error('Simulated error'));
};

const simulateClose = () => {
  ws.value.handleClose();
};

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
    duration: 2500, // Duration of the animation in milliseconds
    easing: 'easeInOutQuad', // Easing function to use
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

const updateChartData = (latency) => {
  // Handle special values
  if (latency === -1) {
    // Add a special data point to the chart to indicate an error or disconnection
    chartData.datasets[0].data.push(null);
    chartData.labels.push('DEDGE');
  } else {
    // Shift the old data
    if (chartData.datasets[0].data.length > 7) {
      let dataArray = Array.from(chartData.datasets[0].data);
      dataArray.shift();
      chartData.datasets[0].data = dataArray;

      let labelArray = Array.from(chartData.labels);
      labelArray.shift();
      chartData.labels = labelArray;
    }

    // Add the new latency value
    chartData.datasets[0].data.push(latency);

    // Add the current time as a label
    let now = new Date();
    chartData.labels.push(now);
  }

  // Update the chart
  if (primeChart.value !== null && primeChart.value !== undefined) {
    primeChart.value.refresh();
  }
};
</script>
