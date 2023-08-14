<template>
  <q-page class="tw-p-4 tw-pb-20">
    <div class="tw-text-xl tw-mb-4 tw-font-semibold">Profile</div>
    <q-card flat>
      <q-form @submit.prevent="update">
        <q-card-section
          class="tw-grid tw-grid-cols-1 md:tw-grid-cols-6 tw-gap-x-4 tw-gap-y-2"
        >
          <q-input
            v-model="user.nik"
            filled
            class="md:tw-col-span-6"
            label="NIK"
            hint=""
          />
          <q-input
            v-model="user.username"
            filled
            class="md:tw-col-span-3"
            label="Username"
            :rules="[(val) => !!val || 'Field ini wajib diisi']"
          />
          <q-input
            v-model="user.name"
            filled
            class="md:tw-col-span-3"
            label="Nama"
            :rules="[(val) => !!val || 'Field ini wajib diisi']"
          />
          <q-input
            v-model="user.email"
            filled
            label="E-Mail"
            class="md:tw-col-span-2"
            :rules="[
              (val) => !!val || 'Field harus diisi',
              (val) =>
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'E-Mail tidak valid',
            ]"
            lazy-rules
          />

          <q-input
            v-model="user.phone_number"
            filled
            class="md:tw-col-span-2"
            label="No Telp"
            mask="###################"
            :rules="[(val) => !!val || 'Field ini wajib diisi']"
          />
          <q-input
            :model-value="auth.user?.role?.name"
            filled
            class="md:tw-col-span-2"
            label="Role"
            readonly
          />
          <q-input
            v-model="user.password"
            type="password"
            filled
            class="md:tw-col-span-3"
            label="Password"
          />
          <q-input
            v-model="user.confirm_password"
            :disable="user.password == null"
            type="password"
            filled
            class="md:tw-col-span-3"
            label="Confirm Password"
            :rules="[
              (val) => val === user.password || 'Confirm password tidak sama',
            ]"
          />
        </q-card-section>

        <q-card-actions align="center">
          <q-btn
            label="Simpan"
            :loading="loading"
            type="submit"
            no-caps
            unelevated
            color="primary"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import { useAuthStore } from "src/stores/auth";
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const auth = useAuthStore();
    return {
      auth,
      user: ref({
        nik: null,
        name: null,
        username: null,
        email: null,
        phone_number: null,
        password: null,
        confirm_password: null,
      }),
      loading: ref(false),
      list_role: ref([]),
    };
  },
  mounted() {
    this.user = this.auth.user;
  },
  methods: {
    update() {
      this.loading = true;
      this.$api
        .put("/users/" + this.auth.user.id, {
          ...this.user,
        })
        .then((res) => {
          this.$q.notify({
            message: "Profile berhasil diubah",
            color: "positive",
          });
          this.auth.get_user();
          this.loading = false;
        })
        .catch((err) => {
          this.$q.notify({
            message: err.response.data.message,
            color: "negative",
          });
          this.loading = false;
        });
    },
  },
});
</script>
