<template>
  <div>
    <div style="display: flex; align-items: center; justify-content: left">
      <h2>Internet Outage Log</h2>
      <button @click="clearOutages">Clear Outages</button>
    </div>
    <ul>
      <li v-for="(outage, index) in outageDurations" :key="index">
        Outage started at {{ formatTime(outage.start) }} and lasted for {{ formatDuration(outage.duration) }}
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
  duration: number;
}

export default defineComponent({
  mounted() {
    useEventListener(window, "outage", this.handleOutageEvent);
    useEventListener(window, "recovery", this.handleRecoveryEvent);

    // Load outages from localStorage
    const storedOutages = localStorage.getItem("outageDurations");
    if (storedOutages) {
      this.outageDurations = JSON.parse(storedOutages);
    }
  },
  data() {
    return {
      outageDurations: [] as OutageWithDuration[],
      lastOutageTime: null as number | null
    };
  },
  methods: {
    handleOutageEvent(event: OutageEvent) {
      const timestamp = event.detail;
      this.lastOutageTime = timestamp;
    },
    handleRecoveryEvent(event: RecoveryEvent) {
      const recoveryTime = event.detail;
      if (this.lastOutageTime !== null) {
        const duration = (recoveryTime - this.lastOutageTime) / 1000; // Convert milliseconds to seconds
        this.outageDurations.push({ start: this.lastOutageTime, duration });
        // Save outages to localStorage
        localStorage.setItem("outageDurations", JSON.stringify(this.outageDurations));
      }
      this.lastOutageTime = null;
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
        hour12: true
      });
    },
    formatDuration(duration: number) {
      // Round the duration to the nearest whole number
      duration = Math.round(duration);

      const hours = Math.floor(duration / 3600);
      const minutes = Math.floor((duration % 3600) / 60);
      const seconds = duration % 60;
      let formattedDuration = '';
      if (hours > 0) {
        formattedDuration += `${hours} hour${hours > 1 ? 's' : ''}`;
      }
      if (minutes > 0) {
        formattedDuration += `${formattedDuration.length > 0 ? ', ' : ''}${minutes} minute${minutes > 1 ? 's' : ''}`;
      }
      if (seconds > 0 || formattedDuration === '') {
        formattedDuration += `${formattedDuration.length > 0 ? ', ' : ''}${seconds} second${seconds > 1 ? 's' : ''}`;
      }
      return formattedDuration;
    },
    clearOutages() {
      this.outageDurations = [];
      // Clear outages from localStorage
      localStorage.removeItem("outageDurations");
    }
  },
  beforeUnmount() {
    // Save outages to localStorage before component is unmounted
    localStorage.setItem("outageDurations", JSON.stringify(this.outageDurations));
  }
});
</script>

