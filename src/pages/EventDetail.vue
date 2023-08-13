<template>
  <q-page class="tw-p-4 tw-py-14">
    <div class="tw-grid tw-grid-cols-12 tw-gap-4">
      <div class="tw-col-span-8">
        <q-card flat class="tw-w-full">
          <q-card-section>
            <div class="text-h6 tw-font-semibold">Detail Kejadian</div>
          </q-card-section>
          <q-card-section>
            <div
              class="tw-cursor-zoom-in text-center"
              @click="openImageDialog(event?.image)"
            >
              <q-avatar size="400px" square>
                <q-img :src="event?.image" />
              </q-avatar>
            </div>
          </q-card-section>
          <q-card-section>
            <div class="tw-grid tw-grid-cols-3 tw-gap-4">
              <q-input
                borderless
                :model-value="event?.location"
                standout
                readonly
                label-slot
              >
                <q-tooltip> {{ event?.location }}</q-tooltip>
                <template #label>
                  <div class="tw-font-semibold tw-text-lg tw-text-black">
                    Lokasi
                  </div>
                </template>
                <template v-slot:append>
                  <q-btn
                    dense
                    flat
                    no-caps
                    unelevated
                    color="primary"
                    :href="`https://www.google.com/maps/search/${event?.lat},${event?.lng}`"
                    target="_blank"
                  >
                    <vx-icon iconName="Location" :size="22" />
                  </q-btn>
                </template>
              </q-input>
              <q-input
                borderless
                :model-value="event?.status?.name"
                standout
                readonly
                label-slot
              >
                <template #label>
                  <div class="tw-font-semibold tw-text-lg tw-text-black">
                    Status
                  </div>
                </template>
              </q-input>
              <q-input
                borderless
                :model-value="
                  moment(event?.created_at).format('YYYY-MM-DD HH:mm:ss')
                "
                standout
                readonly
                label-slot
              >
                <template #label>
                  <div class="tw-font-semibold tw-text-lg tw-text-black">
                    Dibuat Pada
                  </div>
                </template>
              </q-input>
              <q-input
                borderless
                :model-value="event?.event_category?.name"
                standout
                readonly
                label-slot
              >
                <template #label>
                  <div class="tw-font-semibold tw-text-lg tw-text-black">
                    Kategori
                  </div>
                </template>
              </q-input>
              <q-input
                borderless
                :model-value="
                  event?.event_category_type?.name
                    ? event?.event_category_type?.name
                    : '-'
                "
                standout
                readonly
                label-slot
              >
                <template #label>
                  <div class="tw-font-semibold tw-text-lg tw-text-black">
                    Tipe
                  </div>
                </template>
              </q-input>
              <q-input
                borderless
                :model-value="
                  moment(event?.updated_at).format('YYYY-MM-DD') != '0001-01-01'
                    ? moment(event?.updated_at).format('YYYY-MM-DD HH:mm:ss')
                    : '-'
                "
                standout
                readonly
                label-slot
              >
                <template #label>
                  <div class="tw-font-semibold tw-text-lg tw-text-black">
                    Diupdate Pada
                  </div>
                </template>
              </q-input>
            </div>
            <q-separator class="tw-my-4" />
            <div class="tw-space-y-3">
              <div v-if="event?.description">
                <div class="tw-font-semibold">Deskripsi</div>
                <div>
                  {{ event?.description }}
                </div>
              </div>
              <div v-if="event?.type_description">
                <div class="tw-font-semibold">Tipe Deskripsi</div>
                <div>{{ event?.type_description }}</div>
              </div>
              <div v-if="event?.other_description">
                <div class="tw-font-semibold">Deskripsi Lainnya</div>
                <div>{{ event?.other_description }}</div>
              </div>
              <div v-if="event?.type_vehicle_involved">
                <div class="tw-font-semibold">Jenis Kendaraan Terlibat</div>
                <div>{{ event?.type_vehicle_involved }}</div>
              </div>
              <div v-if="event?.victim_involved">
                <div class="tw-font-semibold">Korban Terlibat</div>
                <div>{{ event?.victim_involved }}</div>
              </div>
              <div v-if="event?.responsible">
                <div class="tw-font-semibold">Penanggung Jawab</div>
                <div>{{ event?.responsible }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="tw-col-span-4 tw-relative">
        <div class="tw-sticky tw-top-28">
          <q-card class="tw-mb-4" flat>
            <q-card-section>
              <div class="text-h6 tw-font-semibold">Pelapor</div>
            </q-card-section>
            <q-card-section class="q-py-none">
              <div class="tw-space-y-3 tw-pb-10">
                <div v-if="event?.user_create?.name">
                  <div class="tw-font-semibold">Nama</div>
                  <div>
                    {{ event?.user_create?.name }}
                  </div>
                </div>
                <div v-if="event?.user_create?.name">
                  <div class="tw-font-semibold">No Telp</div>
                  <div>
                    {{ event?.user_create?.phone_number }}
                  </div>
                </div>
                <div v-if="event?.user_create?.email">
                  <div class="tw-font-semibold">E-Mail</div>
                  <div>
                    {{ event?.user_create?.email }}
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
          <q-card flat v-if="event?.event_user_handling?.length > 0">
            <q-card-section>
              <div class="text-h6 tw-font-semibold">User Penangan</div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <div class="tw-grid tw-grid-cols-2 tw-gap-2">
                <q-input
                  borderless
                  :model-value="
                    event?.user_assign?.name ? event?.user_assign?.name : '-'
                  "
                  standout
                  readonly
                  label-slot
                >
                  <template #label>
                    <div class="tw-font-semibold tw-text-lg tw-text-black">
                      Assign Oleh
                    </div>
                  </template>
                </q-input>
                <q-input
                  borderless
                  :model-value="
                    moment(event?.assigned_at).format('YYYY-MM-DD') !=
                    '0001-01-01'
                      ? moment(event?.assigned_at).format('YYYY-MM-DD HH:mm:ss')
                      : '-'
                  "
                  standout
                  readonly
                  label-slot
                >
                  <template #label>
                    <div class="tw-font-semibold tw-text-lg tw-text-black">
                      Assign Pada
                    </div>
                  </template>
                </q-input>
              </div>
              <q-separator />
              <q-list separator>
                <q-item
                  v-for="(user, index) in event?.event_user_handling.slice(
                    0,
                    5
                  )"
                  :key="user.id"
                >
                  <q-item-section>
                    <q-item-label
                      >{{ index + 1 }}. {{ user?.user?.name }}</q-item-label
                    >
                    <q-item-label caption>{{
                      user?.user?.role?.name
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
            <q-card-actions align="center">
              <q-btn
                flat
                label="View All"
                class="tw-w-full"
                no-caps
                color="primary"
                @click="user_dialog = true"
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>
    <q-table
      class="tw-mt-4"
      flat
      :rows="event?.event_handling"
      :columns="columns"
      :filter="filter"
    >
      <template #top>
        <div class="tw-flex tw-justify-between tw-w-full tw-items-center">
          <div class="text-h6 tw-font-semibold">List Penanganan</div>
          <q-input filled placeholder="Cari..." dense v-model="filter">
            <template #prepend>
              <vx-icon iconName="SearchStatus" :size="20" />
            </template>
          </q-input>
        </div>
      </template>
      <template #body-cell-index="props">
        <q-td :props="props">
          {{ props.rowIndex + 1 }}
        </q-td>
      </template>
      <template #body-cell-Maps="props">
        <q-td :props="props">
          <q-btn
            dense
            size="sm"
            flat
            no-caps
            unelevated
            color="primary"
            :href="`https://www.google.com/maps/search/${props.row.lat},${props.row.lng}`"
            target="_blank"
          >
            <vx-icon iconName="Location" :size="18" />
          </q-btn>
        </q-td>
      </template>
      <template #body-cell-Image="props">
        <q-td :props="props">
          <q-btn
            dense
            size="sm"
            flat
            no-caps
            unelevated
            color="primary"
            target="_blank"
            @click="openImageDialog(props.row.image)"
          >
            <vx-icon iconName="Image" :size="18" />
          </q-btn>
        </q-td>
      </template>
      <template #body-cell-action="props">
        <q-td class="text-right" :props="props">
          <q-btn
            size="sm"
            color="primary"
            round
            dense
            unelevated
            icon="o_info"
            @click="openDetailDialog(props.row)"
          />
        </q-td>
      </template>
    </q-table>
    <q-page-sticky expand position="top">
      <q-toolbar class="tw-bg-gray-100 tw-py-4">
        <q-btn no-caps dense flat :to="{ name: 'Event' }">
          <vx-icon iconName="ArrowLeft2" class="tw-mr-2" :size="24" />
          <div class="tw-text-xl tw-font-semibold">Kejadian</div>
        </q-btn>
        <q-space />
        <template v-if="event?.status_id == 1">
          <div class="tw-space-x-2">
            <q-btn
              unelevated
              no-caps
              @click="openConfirmDialog('reject')"
              color="negative"
            >
              <vx-icon iconName="LocationCross" class="tw-mr-2" :size="20" />
              Tolak
            </q-btn>
            <q-btn unelevated no-caps color="primary" @click="openActionDialog">
              <vx-icon iconName="UserAdd" class="tw-mr-2" :size="20" />
              Ambil Tindakan
            </q-btn>
          </div>
        </template>
        <template v-else-if="event?.status_id == 2">
          <q-btn
            unelevated
            no-caps
            color="positive"
            @click="openConfirmDialog('finish')"
          >
            <vx-icon iconName="TickCircle" class="tw-mr-2" :size="20" />
            Selesai
          </q-btn>
        </template>
        <template v-else>
          <q-btn
            unelevated
            no-caps
            color="negative"
            @click="openConfirmDialog('delete')"
          >
            <vx-icon iconName="Trash" class="tw-mr-2" :size="20" />
            Hapus
          </q-btn>
        </template>
      </q-toolbar>
    </q-page-sticky>
  </q-page>
  <q-dialog v-model="dialog_image">
    <q-card class="tw-w-full">
      <q-img :src="image" class="tw-w-full" />
    </q-card>
  </q-dialog>
  <q-dialog v-model="confirm">
    <q-card>
      <q-card-section>
        <div class="text-h6 text-primary tw-flex tw-items-center">
          <VxIcon iconName="Warning2" class="tw-mr-2" :size="22" />
          Konfirmasi
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        Anda yakin ingin mengubah kejadian ini?
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" no-caps v-close-popup />
        <q-btn
          flat
          label="Ya"
          v-if="confirm_message == 'reject'"
          color="negative"
          no-caps
          @click="updateStatus(3)"
        />
        <q-btn
          flat
          label="Ya"
          v-else-if="confirm_message == 'finish'"
          color="primary"
          no-caps
          @click="updateStatus(4)"
        />
        <q-btn
          flat
          label="Ya"
          v-else-if="confirm_message == 'delete'"
          color="negative"
          no-caps
          @click="deleteEvent"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="action_dialog">
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section>
        <q-table
          flat
          :rows="users"
          :columns="columns_user"
          selection="multiple"
          row-key="id"
          v-model:selected="selected_users"
          title="User Penangan"
          :loading="loading_user"
          :filter="filter_user"
        >
          <template #top-right>
            <q-input placeholder="Cari..." v-model="filter_user" dense filled>
              <template #prepend>
                <vx-icon iconName="SearchStatus" :size="20" />
              </template>
            </q-input>
          </template>
          <template #body-cell-Status="props">
            <q-td :props="props">
              <q-badge
                v-if="props.row.is_active == 1"
                color="positive"
                label="Aktif"
              />
              <q-badge v-else color="negative" label="Tidak Aktif" />
            </q-td>
          </template>
          <template #body-cell-LokasiTerkini="props">
            <q-td :props="props">
              <q-btn
                dense
                flat
                no-caps
                :label="props.row.location"
                unelevated
                color="primary"
                :href="`https://www.google.com/maps/search/${props.row.lat},${props.row.lng}`"
                target="_blank"
              >
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="grey-0" flat dense label="Batal" v-close-popup no-caps />
        <q-btn
          color="primary"
          flat
          dense
          label="Assign"
          no-caps
          @click="assignUser"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="detail_dialog">
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section class="row items-center">
        <div class="text-h6">Detail Penananganan</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 70vh" class="scroll">
        <div
          class="q-pt-none text-center tw-cursor-zoom-in"
          @click="openImageDialog(event_handling?.image)"
        >
          <q-avatar size="200px" square>
            <q-img :src="event_handling?.image" />
          </q-avatar>
        </div>
        <div class="tw-space-y-3 tw-pb-10">
          <div v-if="event_handling?.description">
            <div class="tw-font-semibold">Deskripsi</div>
            <div>
              {{ event_handling?.description }}
            </div>
          </div>
          <div v-if="event_handling?.event_category_type_id != 0">
            <div class="tw-font-semibold">Tipe Insiden</div>
            <div>{{ event_handling?.event_category_type?.name }}</div>
          </div>
          <div v-if="event_handling?.victim_involved">
            <div class="tw-font-semibold">Korban Terlibat</div>
            <div>{{ event_handling?.victim_involved }}</div>
          </div>
          <div v-if="event_handling?.minor_injuries">
            <div class="tw-font-semibold">Luka Ringan</div>
            <div>{{ event_handling?.minor_injuries }}</div>
          </div>
          <div v-if="event_handling?.seriously_injuries">
            <div class="tw-font-semibold">Luka Berat</div>
            <div>{{ event_handling?.seriously_injuries }}</div>
          </div>
          <div v-if="event_handling?.die">
            <div class="tw-font-semibold">Meninggal</div>
            <div>{{ event_handling?.die }}</div>
          </div>
          <div v-if="event_handling?.identification">
            <div class="tw-font-semibold">Identifikasi</div>
            <div>{{ event_handling?.identification }}</div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
  <q-dialog v-model="user_dialog">
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section>
        <q-table
          flat
          :rows="event?.event_user_handling?.map((e) => e.user)"
          :columns="columns_user"
          row-key="id"
          title="User Penangan"
          :filter="filter_user_handling"
        >
          <template #top-right>
            <q-input
              placeholder="Cari..."
              v-model="filter_user_handling"
              dense
              filled
            >
              <template #prepend>
                <vx-icon iconName="SearchStatus" :size="20" />
              </template>
            </q-input>
          </template>
          <template #body-cell-Status="props">
            <q-td :props="props">
              <q-badge
                v-if="props.row.is_active == 1"
                color="positive"
                label="Aktif"
              />
              <q-badge v-else color="negative" label="Tidak Aktif" />
            </q-td>
          </template>
          <template #body-cell-LokasiTerkini="props">
            <q-td :props="props">
              <q-btn
                dense
                flat
                no-caps
                :label="props.row.location"
                unelevated
                color="primary"
                :href="`https://www.google.com/maps/search/${props.row.lat},${props.row.lng}`"
                target="_blank"
              >
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
import { defineComponent, ref } from "vue";
import VxIcon from "components/VxIcon.vue";
import moment from "moment";
import { event } from "quasar";

const columns = [
  {
    name: "index",
    label: "#",
    align: "center",
  },
  {
    name: "Location",
    label: "Lokasi",
    align: "left",
    field: "location",
    sortable: true,
  },
  {
    name: "Image",
    label: "Foto",
    align: "left",
    sortable: true,
  },
  {
    name: "Maps",
    label: "Map",
    align: "left",
    sortable: true,
  },
  {
    name: "HandledBy",
    label: "Ditangani Oleh",
    align: "left",
    field: (row) => row.user_create.name,
    sortable: true,
  },
  {
    name: "HandledAt",
    label: "Ditangani Pada",
    align: "left",
    field: (row) => moment(row.created_at).format("YYYY-MM-DD HH:mm:ss"),
    sortable: true,
  },
  {
    name: "action",
    label: "Aksi",
    align: "right",
  },
];

const columns_user = [
  {
    name: "Name",
    label: "Nama",
    align: "left",
    field: "name",
    sortable: true,
  },

  {
    name: "Role",
    label: "Role",
    align: "left",
    field: (row) => row.role.name,
    sortable: true,
  },

  {
    name: "Status",
    label: "Status",
    align: "left",
    field: "is_active",
    sortable: true,
  },

  {
    name: "LokasiTerkini",
    label: "Lokasi Terkini",
    align: "left",
    sortable: true,
  },
];

export default defineComponent({
  props: ["user"],
  components: {
    VxIcon,
  },
  setup() {
    return {
      columns,
      columns_user,
      moment,
      event: ref({}),

      image: ref(null),
      dialog_image: ref(false),

      confirm: ref(false),
      confirm_message: ref(""),

      detail_dialog: ref(false),
      event_handling: ref({}),

      action_dialog: ref(false),
      users: ref([]),
      loading_user: ref(false),
      filter_user: ref(""),
      selected_users: ref([]),
      filter: ref(""),

      user_dialog: ref(false),
      filter_user_handling: ref(""),
    };
  },
  mounted() {
    this.getData();
    this.updateNotification();
  },
  methods: {
    getData() {
      return this.$api
        .get("/events/" + this.$route.params.id)
        .then((res) => {
          this.event = res.data.data;
        })
        .catch((err) => {});
    },

    getUser(roles) {
      return this.$api
        .get("/users?" + roles)
        .then((res) => {
          this.users = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    openActionDialog() {
      this.selected_users = [];
      this.getUser(
        this.event.event_category.roles
          .map((role) => "role_id=" + role.role_id)
          .join("&")
      );
      this.action_dialog = true;
    },

    assignUser() {
      if (this.selected_users.length > 0) {
        return this.$api
          .post(
            "/events/assign",
            this.selected_users.map((user) => {
              return {
                event_id: parseInt(this.$route.params.id),
                user_id: user.id,
              };
            })
          )
          .then((res) => {
            this.$q.notify({
              message: "User Berhasil di assign",
              color: "positive",
            });
            this.sendNotification(
              this.selected_users.map((e) => e.id.toString()),
              this.event.event_category.name,
              "Ada kejadian di " + this.event.location
            );
            this.getData();
            this.detail_dialog = false;
            this.action_dialog = false;
          });
      } else {
        this.$q.notify({
          message: "Silahkan pilih user terlebih dahulu",
          color: "negative",
        });
      }
    },

    openImageDialog(image) {
      this.image = image;
      this.dialog_image = true;
    },

    openDetailDialog(data) {
      this.event_handling = data;
      this.detail_dialog = true;
    },

    openConfirmDialog(message) {
      this.confirm_message = message;
      this.confirm = true;
    },

    updateStatus(status_id) {
      this.loading = true;

      var fd = new FormData();
      fd.append("status_id", status_id);
      return this.$api
        .put("/events/" + this.$route.params.id, fd, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          this.$q.notify({
            message: "Kejadian berhasil diubah",
            color: "positive",
          });
          if (status_id == 4) {
            this.sendNotification(
              [this.event.created_by],
              "Laporan Selesai",
              "Laporan anda sudah berhasil ditangani"
            );
          }
          this.getData();
          this.$router.push({ name: "Event" });
        })
        .catch((err) => {
          console.log(err);
        });
    },

    deleteEvent() {
      return this.$api
        .delete("/events/" + this.$route.params.id)
        .then((res) => {
          this.$q.notify({
            message: "Kejadian berhasil diupdate",
            color: "positive",
          });
          this.$router.push({ name: "Event" });
        })
        .catch((err) => {
          connsole.log(err);
        });
    },

    updateNotification() {
      this.$api.put(
        "/notification/" + this.$route.params.id + "/" + this.user.role.name,
        { is_read: 1 }
      );
    },

    sendNotification(external_ids, title, message) {
      const payload = {
        title: title,
        message: message,
        external_ids: external_ids,
        channel_id: "e152bbd4-389a-46f2-af2e-fcd717b77b38",
      };
      this.$api.post("/send-notification", payload);
    },
  },
});
</script>
