<template>
  <Chart ref="primeChart" type="line" :data="chartData" :options="chartOptions" class="h-30rem"/>
</template>

<script setup>
import Chart from 'primevue/chart';
import {nextTick, onMounted, ref} from "vue";

function getGradient(chart) {
  const ctx = chart.ctx;
  const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
  gradient.addColorStop(0, 'rgba(255, 105, 180, 0.5)'); // Start color
  gradient.addColorStop(1, 'rgba(255, 192, 203, 0)'); // End color
  return gradient;
}

let chartData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'hmm',
      data: [65, 59, 80, 81, 56, 55, 40],
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
  }
};

const primeChart = ref();

const shiftData = () => {
  if (chartData.datasets[0].data.length > 0) {
    let dataArray = Array.from(chartData.datasets[0].data);
    dataArray.shift();
    chartData.datasets[0].data = dataArray;
  }

  setTimeout(shiftData, 5000);
};

const addData = (data) => {
  chartData.datasets[0].data.push(data);

  // update chart
  primeChart.value.refresh();

  setTimeout(() => {
    addData(Math.random() * 100);
  }, 5000);
};

onMounted(async () => {
  await nextTick();
  await shiftData();
  await addData(Math.random() * 100);
});
</script>
