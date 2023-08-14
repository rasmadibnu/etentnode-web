<template>
  <q-layout view="lHh Lpr lFf" class="tw-bg-gray-100 tw-font-['Poppins']">
    <q-header class="bg-white text-primary">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="tw-font-medium"> EtentNode </q-toolbar-title>
        <q-space />
        <div class="tw-space-x-2">
          <q-btn flat round dense>
            <vx-icon iconName="NotificationBing" :size="22" />
            <q-badge
              color="red"
              floating
              v-if="notification.filter((notif) => notif.is_read == 0).length"
              >{{
                notification.filter((notif) => notif.is_read == 0).length
              }}</q-badge
            >
            <q-menu>
              <q-list separator>
                <template v-if="notification.length > 0">
                  <q-item
                    clickable
                    v-ripple
                    v-for="(notif, index) in notification"
                    :key="notif.id"
                    :to="{
                      name: 'EventDetail',
                      params: { id: notif.event_id },
                    }"
                    active-class=""
                    @click="notification[index].is_read = 1"
                  >
                    <q-item-section avatar class="text-primary">
                      <vx-icon iconName="Warning2" :size="35" />
                    </q-item-section>
                    <q-item-section
                      :class="notif.is_read == 1 ? '' : 'tw-font-bold'"
                    >
                      <q-item-label>{{ notif.title }}</q-item-label>
                      <q-item-label caption class="tw-line-clamp-1">{{
                        notif.message
                      }}</q-item-label>
                    </q-item-section>

                    <q-item-section side top>
                      <q-item-label caption>{{
                        moment(notif.created_at).fromNow()
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
                <template v-else>
                  <q-item active-class="">
                    <q-item-section avatar class="text-primary">
                      <vx-icon iconName="DirectboxNotif" :size="35" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="tw-font-bold"
                        >Notifikasi anda kosong</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                </template>
              </q-list>
            </q-menu>
          </q-btn>
          <q-btn flat round dense>
            <vx-icon iconName="ProfileCircle" :size="22" />
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item clickable v-close-popup :to="{ name: 'Profile' }">
                  <q-item-section avatar>
                    <vx-icon iconName="User" :size="22" />
                  </q-item-section>
                  <q-item-section>Profile</q-item-section>
                </q-item>
                <q-separator />
                <q-item
                  clickable
                  v-close-popup
                  class="text-negative"
                  @click="alert = true"
                >
                  <q-item-section avatar>
                    <vx-icon iconName="Logout" :size="22" />
                  </q-item-section>
                  <q-item-section>Keluar</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
          <!-- <q-btn flat no-caps
            >{{ auth.user.name }}
            <VxIcon class="tw-ml-2" :size="18" iconName="ArrowDown2" />

            <q-menu class="tw-shadow-none tw-border">
              <q-list dense style="min-width: 100px">
                <q-item clickable v-close-popup>
                  <q-item-section>
                    <VxIcon :size="18" iconName="User" />
                  </q-item-section>
                  <q-item-section class="tw-mr-4">Profile</q-item-section>
                </q-item>
                <q-separator />
                <q-item
                  clickable
                  v-close-popup
                  class="text-negative"
                  @click="alert = true"
                >
                  <q-item-section>
                    <VxIcon :size="18" iconName="Logout" />
                  </q-item-section>
                  <q-item-section class="tw-mr-4">Logout</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn> -->
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above>
      <div class="tw-px-4 tw-flex tw-items-center tw-gap-4">
        <q-avatar class="tw-h-20" size="40px" square>
          <q-img src="~assets/logo.png" />
        </q-avatar>
        <div>
          <div class="text-h6 tw-font-semibold tw-line-clamp-1">
            {{ auth.user?.name }}
          </div>
          <div class="tw-text-sm">{{ auth.user?.role?.name }}</div>
        </div>
      </div>
      <q-list>
        <!-- <q-item-label header> Menu </q-item-label> -->

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view :user="auth.user" />
    </q-page-container>
  </q-layout>
  <q-dialog v-model="alert">
    <q-card>
      <q-card-section>
        <div class="text-h6 text-negative tw-flex tw-items-center">
          <VxIcon iconName="Logout" class="tw-mr-2" :size="22" />
          Logout
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        Are you sure want to logout this time?
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="No" no-caps color="grey-8" @click="alert = false" />

        <q-btn flat label="Yes" no-caps color="negative" @click="logout" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { useAuthStore } from "src/stores/auth";
import VxIcon from "components/VxIcon.vue";
import { api } from "src/boot/axios";
import { Notify } from "quasar";
import moment from "moment";
import { useEventStore } from "src/stores/event";

const linksList = [
  {
    title: "Kejadian",
    icon: "Warning2",
    link: "Event",
    roles: [2, 3, 4, 5, 6, 7, 8],
  },

  {
    title: "Kategori Kejadian",
    icon: "Category",
    link: "EventCategory",
    roles: [3],
  },

  {
    title: "Hotline",
    icon: "CallCalling",
    link: "Hotline",
    roles: [2, 3, 4, 5, 6, 7, 8],
  },

  {
    title: "Mangement",
    is_header: true,
    roles: [2, 3],
  },
  {
    title: "User",
    icon: "Profile2User",
    link: "User",
    roles: [2, 3],
  },
  {
    title: "Role",
    icon: "UserOctagon",
    link: "Role",
    roles: [2, 3],
  },

  {
    title: "Status",
    icon: "Bookmark",
    link: "Status",
    roles: [3],
  },
];

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
    VxIcon,
  },

  setup() {
    const events = useEventStore();
    const socket = new WebSocket("ws://localhost:7800/ws");

    socket.addEventListener("message", function (event) {
      const jsonData = JSON.parse(event.data);
      if (jsonData.segments.includes(auth?.user?.role?.name)) {
        Notify.create({
          message: jsonData.title,
          caption: jsonData.message,
          iconSize: "46px",
          icon: "o_report",
          position: "top-right",
          color: "primary",
          actions: [
            {
              round: true,
              icon: "close",
              color: "white",
              noCaps: true,
              handler: () => {
                /* ... */
              },
            },
          ],
        });
        getNotification();
        events.get_event();
      }
    });

    const auth = useAuthStore();
    const leftDrawerOpen = ref(false);

    const notification = ref([]);
    const badge = ref(0);

    function getNotification() {
      api.get("/notification/" + auth?.user?.role?.name).then((res) => {
        notification.value = res.data.data;
      });
    }

    onMounted(async () => {
      getNotification();
    });

    return {
      auth,
      essentialLinks: linksList,
      leftDrawerOpen,
      alert: ref(false),
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      notification,
      moment,
      events,
    };
  },
  methods: {
    logout() {
      sessionStorage.removeItem("access_token");
      this.$router.push("/login");
    },
  },
});
</script>
