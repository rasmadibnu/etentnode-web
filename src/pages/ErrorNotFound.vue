<template>
  <div
    class="fullscreen text-primary text-center q-pa-md tw-font-['Poppins'] flex column flex-center"
  >
    <q-avatar square size="400px">
      <q-img src="~assets/undraw_404.svg" />
    </q-avatar>
    <h1 class="tw-text-6xl">Page Not Found</h1>
    <q-btn
      no-caps
      label="Back to home"
      class="tw-mt-4"
      flat
      :to="{ name: 'Event' }"
      icon="arrow_back"
    />
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ErrorNotFound",
});
</script>
