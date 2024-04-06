<template>
  <div>
    <h2>Internet Outage Log</h2>
    <ul>
      <li v-for="(outage, index) in outages" :key="index">
        {{ formatTime(outage) }}
      </li>
    </ul>
  </div>
</template>

<script>
import config from "@/config.js";

export default {
  data() {
    return {
      outages: JSON.parse(localStorage.getItem("outages")) || []
    };
  },
  methods: {
    addOutage(timestamp) {
      this.outages.push(timestamp);
      localStorage.setItem("outages", JSON.stringify(this.outages));
    },
    handleOutageEvent(event) {
      this.addOutage(event.detail);
    },
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleString(config.locale, {
        timeZone: config.timezone,
        year: "numeric",
        weekday: "short",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      });
    }
  },
  mounted() {
    window.addEventListener("outage", this.handleOutageEvent);
  },
  beforeDestroy() {
    localStorage.setItem("outages", JSON.stringify(this.outages));
    window.removeEventListener("outage", this.handleOutageEvent);
  }
};
</script>
