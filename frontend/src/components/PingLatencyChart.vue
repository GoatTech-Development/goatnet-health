<template>
  <canvas id="mycanvas" width="500" height="200"></canvas>
  <button @click="toggleOutage">Toggle Outage</button>
</template>

<script>
import {onBeforeUnmount, onMounted, ref} from 'vue';
import {SmoothieChart, TimeSeries} from 'smoothie';
import {setupWebSocket} from "@/services/websocketService.js";

export default {
  setup() {
    const smoothie = ref(null);
    const lineUp = ref(null);
    const lineOutage = ref(null);
    let interval = null;
    let ws = null;

    const toggleOutage = () => {
      if (ws && ws.ws) {
        ws.ws.send('toggleOutage');
      }
    };

    onMounted(() => {
      smoothie.value = new SmoothieChart({
        minValue: 0,
        maxValueScale: 1.1,
        grid: {
          borderVisible: false,
          strokeStyle: 'rgb(0,46,125)', fillStyle: 'rgb(0,10,59)',
          lineWidth: 1, millisPerLine: 250, verticalSections: 6,
        },
        labels: {
          fillStyle: 'rgb(255,255,255)'

        }
      });

      lineUp.value = new TimeSeries();
      lineOutage.value = new TimeSeries();

      smoothie.value.addTimeSeries(lineUp.value,
          {strokeStyle: 'rgb(0, 255, 0)', fillStyle: 'rgba(0, 255, 0, 0.4)', lineWidth: 3});
      smoothie.value.addTimeSeries(lineOutage.value,
          {strokeStyle: 'rgb(255, 0, 0)', fillStyle: 'rgba(255, 0, 0, 0.4)', lineWidth: 3});

      smoothie.value.streamTo(document.getElementById("mycanvas"), 5000 /*delay*/);
    });

    ws = setupWebSocket((latency, isInternetOut) => {
      if (isInternetOut) {
        // Append the special value to the new TimeSeries immediately
        lineOutage.value.append(Date.now(), latency);
      } else {
        // Append the latency value to the original TimeSeries
        lineUp.value.append(Date.now(), latency);
      }
    });

    onBeforeUnmount(() => {
      clearInterval(interval);
      if (ws && ws.ws) {
        ws.ws.close();
      }
    });

    return {toggleOutage};
  }
}
</script>
