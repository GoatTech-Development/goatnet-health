<template>
  <div>
    <h2>Internet Outage Log</h2>
    <ul>
      <li v-for="(outage, index) in outages" :key="index">
        {{ outage }}
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
