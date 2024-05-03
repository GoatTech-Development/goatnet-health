<template>
  <canvas ref="mycanvas" width="500" height="200"></canvas>
  <button @click="toggleOutage">Toggle Outage</button>
  <p v-if="isInternetDown">Internet is down!</p>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { SmoothieChart, TimeSeries } from "smoothie";
import { setupWebSocket } from "@/services/websocketService.ts";
import type { WebSocketObject } from "@/types/WebSocketObject";
import { useEventListener } from "@vueuse/core";

export default defineComponent({
  data() {
    return {
      smoothie: null as SmoothieChart | null,
      lineUp: null as TimeSeries | null,
      lineOutage: null as TimeSeries | null,
      interval: undefined as number | undefined,
      ws: null as WebSocketObject | null,
      isInternetDown: false,
      lastLatency: null as number | null
    };
  },
  mounted() {
    useEventListener(window, "outage", this.handleOutageEvent);
    useEventListener(window, "recovery", this.handleRecoveryEvent);

    this.smoothie = new SmoothieChart({
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

    this.lineUp = new TimeSeries();
    this.lineOutage = new TimeSeries();

    this.smoothie.addTimeSeries(this.lineUp, {
      strokeStyle: "rgb(0, 255, 0)",
      fillStyle: "rgba(0, 255, 0, 0.4)",
      lineWidth: 3
    });
    this.smoothie.addTimeSeries(this.lineOutage, {
      strokeStyle: "rgb(255, 0, 0)",
      fillStyle: "rgba(255, 0, 0, 0.4)",
      lineWidth: 3
    });

    this.smoothie.streamTo(
      (this.$refs.mycanvas as HTMLCanvasElement),
      5000 /*delay*/
    );

    this.ws = setupWebSocket((latency: number, internetDown: boolean) => {
      if (internetDown) {
        if (this.lineOutage) {
          this.lineOutage.append(Date.now(), latency);
        }
        this.isInternetDown = true;
        document.title = "DOWN";
      } else {
        if (this.lineUp) {
          this.lineUp.append(Date.now(), latency);
        }
        this.isInternetDown = false;
        document.title = "Latency: " + latency + " ms";
      }
      this.lastLatency = latency;
    });
  },
  methods: {
    toggleOutage() {
      if (this.ws && this.ws.ws) {
        this.ws.ws.send("toggleOutage");
      }
    }
  },
  beforeUnmount() {
    clearInterval(this.interval);
    if (this.ws && this.ws.ws) {
      this.ws.ws.close();
    }
  },
  watch: {
    lastLatency(newLatency) {
      if (newLatency !== null) {
        document.title = this.isInternetDown ? "DOWN" : `Latency: ${newLatency} ms`;
      }
    }
  }
});
</script>
