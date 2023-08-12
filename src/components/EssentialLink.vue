<template>
  <q-item
    clickable
    :to="{ name: link }"
    v-if="roles.includes(auth.user.role_id) && !is_header"
  >
    <q-item-section v-if="icon" avatar>
      <vx-icon :iconName="icon" :size="20" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
  <q-item-label header v-else-if="roles.includes(auth.user.role_id)">
    {{ title }}
  </q-item-label>
</template>

<script>
import { defineComponent } from "vue";
import VxIcon from "./VxIcon.vue";
import { useAuthStore } from "src/stores/auth";

export default defineComponent({
  components: { VxIcon },
  name: "EssentialLink",
  props: {
    title: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      default: "",
    },

    link: {
      type: String,
      default: "#",
    },

    icon: {
      type: String,
      default: "",
    },

    roles: {
      type: Array,
    },

    is_header: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const auth = useAuthStore();
    return {
      auth,
    };
  },
});
</script>
