import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useEventStore = defineStore("event", {
  state: () => ({
    events: [],
  }),
  actions: {
    get_event() {
      return api
        .get("/events")
        .then((res) => {
          this.events = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
});
