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
export default {
  data() {
    return {
      outages: []
    };
  },
  methods: {
    addOutage(timestamp) {
      this.outages.push(timestamp);
    },
    handleOutageEvent(event) {
      this.addOutage(event.detail);
    },
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleString("en-US", {
        timeZone: "America/Los_Angeles",
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
    // Listen for the 'outage' event
    window.addEventListener("outage", this.handleOutageEvent);
  },
  beforeDestroy() {
    // Remove the event listener when the component is destroyed
    window.removeEventListener("outage", this.handleOutageEvent);
  }
};
</script>
