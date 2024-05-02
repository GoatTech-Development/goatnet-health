<template>
  <canvas id="mycanvas" width="500" height="200"></canvas>
  <button @click="toggleOutage">Toggle Outage</button>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { SmoothieChart, TimeSeries } from "smoothie";
import { setupWebSocket } from "@/services/websocketService.ts";
import type { WebSocketObject } from "@/types/WebSocketObject";
import { useEventListener } from "@vueuse/core";

// todo: fix options api here
export default defineComponent({
  mounted() {
    useEventListener(window, "outage", this.handleOutageEvent);
    useEventListener(window, "recovery", this.handleRecoveryEvent);
  },
  setup() {
    const smoothie = ref<SmoothieChart | null>(null);
    const lineUp = ref<TimeSeries | null>(null);
    const lineOutage = ref<TimeSeries | null>(null);
    let interval: number | undefined = undefined;
    let ws: WebSocketObject | null = null;

    const isInternetDown = ref<boolean>(false);
    const lastLatency = ref<number | null>(null);

    watch(lastLatency, (newLatency) => {
      if (newLatency !== null) {
        document.title = isInternetDown.value ? "DOWN" : `Latency: ${newLatency} ms`;
      }
    });
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
          verticalSections: 6
        },
        labels: {
          fillStyle: "rgb(255,255,255)"
        }
      });

      lineUp.value = new TimeSeries();
      lineOutage.value = new TimeSeries();

      smoothie.value.addTimeSeries(lineUp.value, {
        strokeStyle: "rgb(0, 255, 0)",
        fillStyle: "rgba(0, 255, 0, 0.4)",
        lineWidth: 3
      });
      smoothie.value.addTimeSeries(lineOutage.value, {
        strokeStyle: "rgb(255, 0, 0)",
        fillStyle: "rgba(255, 0, 0, 0.4)",
        lineWidth: 3
      });

      smoothie.value.streamTo(
        document.getElementById("mycanvas") as HTMLCanvasElement,
        5000 /*delay*/
      );
    });

    ws = setupWebSocket((latency: number, internetDown: boolean) => {
      if (internetDown) {
        if (lineOutage.value) {
          lineOutage.value.append(Date.now(), latency);
        }
        isInternetDown.value = true;
      } else {
        if (lineUp.value) {
          lineUp.value.append(Date.now(), latency);
        }
        isInternetDown.value = false;
      }
      lastLatency.value = latency;
    });

    onBeforeUnmount(() => {
      clearInterval(interval);
      if (ws && ws.ws) {
        ws.ws.close();
      }
    });

    return { toggleOutage };
  },
  handleOutageEvent() {
    // Handle outage event
    isInternetDown.value = true;
  }
});
</script>
