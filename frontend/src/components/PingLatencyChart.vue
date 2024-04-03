<template>
  <canvas id="mycanvas" width="500" height="200"></canvas>
</template>

<script>
import {onBeforeUnmount, onMounted, ref} from 'vue';
import {SmoothieChart, TimeSeries} from 'smoothie';
import {setupWebSocket} from "@/services/websocketService.js";

export default {
  setup() {
    const smoothie = ref(null);
    const line1 = ref(null);
    const line2 = ref(null);
    let interval = null;
    let ws = null;

    onMounted(() => {
      smoothie.value = new SmoothieChart({
        minValueScale: 1.1,
        maxValueScale: 1.1,
        grid: {
          strokeStyle: 'rgb(125, 0, 0)', fillStyle: 'rgb(60, 0, 0)',
          lineWidth: 1, millisPerLine: 250, verticalSections: 6,
        },
        labels: {fillStyle: 'rgb(60, 0, 0)'}
      });

      line1.value = new TimeSeries();
      // line2.value = new TimeSeries();

      // interval = setInterval(function () {
      //   line2.value.append(Date.now(), Math.random());
      // }, 1000);

      ws = setupWebSocket((latency) => {
        line1.value.append(Date.now(), latency);
      });

      smoothie.value.addTimeSeries(line1.value,
          {strokeStyle: 'rgb(0, 255, 0)', fillStyle: 'rgba(0, 255, 0, 0.4)', lineWidth: 3});
      // smoothie.value.addTimeSeries(line2.value,
      //     {strokeStyle: 'rgb(255, 0, 255)', fillStyle: 'rgba(255, 0, 255, 0.3)', lineWidth: 3});

      smoothie.value.streamTo(document.getElementById("mycanvas"), 5000 /*delay*/);
    });

    onBeforeUnmount(() => {
      clearInterval(interval);
      if (ws && ws.ws) {
        ws.ws.close();
      }
    });
  }
}
</script>
