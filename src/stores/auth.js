import { defineStore } from "pinia";
import { api } from "src/boot/axios";
export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: sessionStorage.getItem("access_token"),
    user: null,
  }),
  getters: {
    user_token() {
      const base64Url = this.token ? this.token.split(".")[1] : " ";
      const base64 = base64Url
        ? base64Url.replace(/-/g, "+").replace(/_/g, "/")
        : "";
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      return jsonPayload ? JSON.parse(jsonPayload) : "";
    },
  },
  actions: {
    get_user() {
      return api.get("/users/" + this.user_token.id).then((res) => {
        this.user = res.data.data;
      });
    },
  },
});
