<template>
  <router-view />
</template>

<script>
import { defineComponent } from "vue";
import { useAuthStore } from "./stores/auth";

export default defineComponent({
  name: "App",
  setup() {
    const auth = useAuthStore();
    return {
      auth,
    };
  },
  mounted() {
    if (this.auth.user == null) {
      this.auth.get_user();
    }
  },
});
</script>
