import { boot } from "quasar/wrappers";
import axios from "axios";
import { useAuthStore } from "src/stores/auth";

// OneSignal.initialize({
//   appId: "10e058ce-fb92-47b0-b95c-a3b70144f31a",
//   // Other configuration options
// });
// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

const url = "https://api.etentnode.online/api/v1";
const api = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const auth = useAuthStore();
  config.headers.Authorization = `Bearer ${auth.token}`;
  return config;
});

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  // app.use(VueGoogleMaps, {
  //   load: {
  //     key: "AIzaSyBpxLJTQopsqBWynr1X4r7Sv0jNDnRnLeY",
  //   },
  //   autobindAllEvents: true,
  // });

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;

  app.config.globalProperties.$urlapi = url;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
