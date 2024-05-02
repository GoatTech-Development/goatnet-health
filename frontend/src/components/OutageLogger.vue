<template>
  <div>
    <div style="display: flex; align-items: center; justify-content: left">
      <h2>Internet Outage Log</h2>
      <button @click="clearOutages">Clear Outages</button>
    </div>
    <ul>
      <li v-for="(outage, index) in outagesWithDurations" :key="index">
        Outage started at {{ formatTime(outage.start) }} and lasted for {{ formatTime(outage.duration) }} seconds
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import config from "@/config.js";
import { defineComponent } from "vue";
import { useEventListener } from "@vueuse/core";

interface OutageEvent extends Event {
  detail: number;
}

interface RecoveryEvent extends Event {
  detail: number;
}

interface OutageWithDuration {
  start: number;
  end: number;
  duration: number;
}

export default defineComponent({
  mounted() {
    useEventListener(window, "outage", this.handleOutageEvent);
    useEventListener(window, "recovery", this.handleRecoveryEvent);
  },
  data() {
    return {
      outages: JSON.parse(localStorage.getItem("outages") || "[]"),
      outageDurations: [] as OutageWithDuration[],
      lastOutageTime: null as number | null
    };
  },
  methods: {
    handleOutageEvent(event: OutageEvent) {
      const timestamp = event.detail;
      this.outages.push(timestamp);
      localStorage.setItem("outages", JSON.stringify(this.outages));
      this.lastOutageTime = timestamp;
    },
    handleRecoveryEvent(event: RecoveryEvent) {
      const recoveryTime = event.detail;
      if (this.lastOutageTime !== null) {
        const duration = (recoveryTime - this.lastOutageTime) / 1000; // Convert milliseconds to seconds
        this.outageDurations.push({ start: this.lastOutageTime, end: recoveryTime, duration });
      }
      this.lastOutageTime = null;
      localStorage.setItem("outages", JSON.stringify(this.outages));
    },
    formatTime(timestamp: number) {
      return new Date(timestamp).toLocaleString(config.locale, {
        timeZone: config.timezone,
        year: "numeric",
        weekday: "short",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      });
    },
    clearOutages() {
      this.outages = [];
      localStorage.setItem("outages", JSON.stringify(this.outages));
    }
  },
  computed: {
    outagesWithDurations(): OutageWithDuration[] {
      return this.outageDurations;
    },
    totalOutageTime() {
      return this.outageDurations.reduce((total, outage) => total + outage.duration, 0);
    }
  },
  beforeUnmount() {
    localStorage.setItem("outages", JSON.stringify(this.outages));
  }
});
</script>
