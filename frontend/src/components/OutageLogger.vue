<template>
  <div>
    <div style="display: flex; align-items: center; justify-content: left">
      <h2>Internet Outage Log</h2>
      <button @click="clearOutages">Clear Outages</button>
    </div>
    <ul>
      <li v-for="(outage, index) in outages" :key="index">
        {{ formatTime(outage) }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import config from "@/config.js";
import { defineComponent } from "vue";

interface OutageEvent extends Event {
  detail: number;
}

export default defineComponent({
  data() {
    return {
      outages: JSON.parse(localStorage.getItem("outages") || "[]"),
    };
  },
  methods: {
    addOutage(timestamp: number) {
      this.outages.push(timestamp);
      localStorage.setItem("outages", JSON.stringify(this.outages));
    },
    handleOutageEvent(event: OutageEvent) {
      this.addOutage(event.detail);
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
        hour12: true,
      });
    },
    clearOutages() {
      this.outages = [];
      localStorage.setItem("outages", JSON.stringify(this.outages));
    },
  },
  mounted() {
    window.addEventListener("outage", this.handleOutageEvent);
  },
  beforeUnmount() {
    localStorage.setItem("outages", JSON.stringify(this.outages));
    window.removeEventListener("outage", this.handleOutageEvent);
  },
};
</script>
