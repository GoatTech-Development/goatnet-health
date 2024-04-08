export default {
  locale: import.meta.env.VUE_APP_LOCALE || "en-US",
  timezone: import.meta.env.VUE_APP_TIMEZONE || "America/Los_Angeles",
  wsUrl: import.meta.env.VUE_APP_WS_URL || "ws://localhost:3000/ws",
};
