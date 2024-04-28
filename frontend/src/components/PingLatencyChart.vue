<template>
  <canvas id="mycanvas" width="500" height="200"></canvas>
  <button @click="toggleOutage">Toggle Outage</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { onBeforeUnmount, onMounted, ref } from "vue";
import { SmoothieChart, TimeSeries } from "smoothie";
import { setupWebSocket } from "@/services/websocketService.ts";
import type { WebSocketObject } from "@/types/WebSocketObject";

export default defineComponent({
  setup() {
    const smoothie = ref<SmoothieChart | null>(null);
    const lineUp = ref<TimeSeries | null>(null);
    const lineOutage = ref<TimeSeries | null>(null);
    let interval: number | undefined = undefined;
    let ws: WebSocketObject | null = null;

    const toggleOutage = () => {
      if (ws && ws.ws) {
        ws.ws.send("toggleOutage");
      }
    };

    onMounted(() => {
      smoothie.value = new SmoothieChart({
        minValue: 0,
        maxValueScale: 1.1,
        grid: {
          borderVisible: false,
          strokeStyle: "rgb(0,46,125)",
          fillStyle: "rgb(0,10,59)",
          lineWidth: 1,
          millisPerLine: 250,
          verticalSections: 6,
        },
        labels: {
          fillStyle: "rgb(255,255,255)",
        },
      });

      lineUp.value = new TimeSeries();
      lineOutage.value = new TimeSeries();

      smoothie.value.addTimeSeries(lineUp.value, {
        strokeStyle: "rgb(0, 255, 0)",
        fillStyle: "rgba(0, 255, 0, 0.4)",
        lineWidth: 3,
      });
      smoothie.value.addTimeSeries(lineOutage.value, {
        strokeStyle: "rgb(255, 0, 0)",
        fillStyle: "rgba(255, 0, 0, 0.4)",
        lineWidth: 3,
      });

      smoothie.value.streamTo(
        document.getElementById("mycanvas") as HTMLCanvasElement,
        5000 /*delay*/,
      );
    });

    ws = setupWebSocket((latency: number, isInternetOut: boolean) => {
      if (isInternetOut) {
        if (lineOutage.value) {
          lineOutage.value.append(Date.now(), latency);
        }
      } else {
        if (lineUp.value) {
          lineUp.value.append(Date.now(), latency);
        }
      }
    });

    onBeforeUnmount(() => {
      clearInterval(interval);
      if (ws && ws.ws) {
        ws.ws.close();
      }
    });

    return { toggleOutage };
  },
});
</script>
