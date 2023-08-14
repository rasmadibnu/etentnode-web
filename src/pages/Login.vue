<template>
  <div class="tw-grid tw-grid-cols-2 tw-h-screen tw-font-['Poppins']">
    <div class="bg-primary text-white tw-hidden md:tw-flex">
      <div class="tw-m-auto">
        <q-avatar size="400px" square>
          <q-img src="~assets/undraw_map.svg" />
        </q-avatar>
      </div>
    </div>
    <div class="tw-flex">
      <div class="tw-m-auto">
        <q-card class="tw-w-96" flat>
          <q-card-section class="tw-space-y-4">
            <div>
              <q-avatar class="tw-h-32" square size="220px">
                <q-img src="~assets/logo_panjang.png" />
              </q-avatar>
            </div>

            <div>
              <div class="tw-text-2xl tw-font-semibold">Selamat Datang 👋🏻</div>
              <div>Silahkan masuk dengan akun anda</div>
            </div>
            <q-form @submit.prevent="login" class="tw-space-y-2">
              <q-input
                filled
                label="Username"
                :rules="[(val) => !!val || 'Field ini harus diisi']"
                v-model="username"
              >
                <template v-slot:prepend>
                  <VsxIcon iconName="User" :size="22" />
                </template>
              </q-input>
              <q-input
                filled
                label="Password"
                :type="is_password ? 'password' : 'texe'"
                :rules="[(val) => !!val || 'Field ini harus diisi']"
                v-model="password"
              >
                <template v-slot:prepend>
                  <VsxIcon
                    class="tw-cursor-pointer"
                    @click="is_password = !is_password"
                    :iconName="is_password ? 'Eye' : 'EyeSlash'"
                    :size="22"
                  />
                </template>
              </q-input>
              <q-btn
                type="submit"
                unelevated
                color="secondary"
                label="Masuk"
                class="tw-w-full"
                no-caps
                :loading="loading"
              />
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref } from "vue";
import VsxIcon from "components/VxIcon.vue";
import { useAuthStore } from "src/stores/auth";

export default defineComponent({
  components: { VsxIcon },
  setup() {
    const auth = useAuthStore();

    return {
      auth,
      is_password: ref(true),
      username: ref(""),
      password: ref(""),
      loading: ref(false),
    };
  },
  mounted() {
    if (sessionStorage.getItem("access_token")) {
      this.$router.push({ name: "Home" });
    }
  },
  methods: {
    login() {
      let self = this;
      self.loading = true;
      let data = {
        username: this.username,
        password: this.password,
      };

      self.$api
        .post("/auth/login", data)
        .then(function (response) {
          sessionStorage.setItem("access_token", response.data.data.token);
          self.auth.token = response.data.data.token;
          self.$router.push({ name: "Event" });
          self.loading = false;
        })
        .catch((err) => {
          self.loading = false;
          self.$q.notify({
            type: "negative",
            message: err.response.data.message,
          });
        });
    },
  },
});
</script>
