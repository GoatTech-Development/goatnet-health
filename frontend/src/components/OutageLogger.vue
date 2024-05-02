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
import { defineComponent, onBeforeUnmount, onMounted } from "vue";
import { useEventListener } from '@vueuse/core'

interface OutageEvent extends Event {
  detail: number;
}

export default defineComponent({
  data() {
    return {
      outages: JSON.parse(localStorage.getItem("outages") || "[]")
    };
  },
  methods: {
    handleOutageEvent(event: OutageEvent) {
      this.outages.push(event.detail);
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
  mounted() {
    onMounted(() => {
      useEventListener(window, 'outage', this.handleOutageEvent);
    });
  },
  beforeUnmount() {
    onBeforeUnmount(() => {
      useEventListener(window, 'outage', this.handleOutageEvent);
    });
    localStorage.setItem("outages", JSON.stringify(this.outages));
  }
});
</script>
