<template>
  <q-page class="tw-p-4 tw-pb-20">
    <div class="tw-text-xl tw-mb-4 tw-font-semibold">Kejadian</div>
    <q-table
      flat
      :rows="event.events"
      :loading="loading"
      :filter="filter"
      :columns="columns"
      :pagination="{ rowsPerPage: 10 }"
      class="right-sticky-column-table"
    >
      <template #top>
        <div class="tw-flex tw-justify-between tw-w-full tw-items-center">
          <div>
            <q-btn outline no-caps color="primary" @click="getData">
              <vx-icon iconName="Refresh" class="md:tw-mr-2" :size="20" />
              <span class="tw-hidden md:tw-block">Refersh</span>
            </q-btn>
          </div>
          <div>
            <q-input filled placeholder="Cari..." dense v-model="filter">
              <template #prepend>
                <vx-icon iconName="SearchStatus" :size="20" />
              </template>
            </q-input>
          </div>
        </div>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td @click="props.expand = !props.expand" class="tw-cursor-pointer">
            {{ props.rowIndex + 1 }}
          </q-td>
          <q-td>
            <div class="tw-line-clamp-1">
              {{ props.row.location }}
            </div>
          </q-td>
          <q-td class="text-center">
            <q-badge
              :label="props.row.status.name"
              :style="{ backgroundColor: '#' + props.row.status.color }"
            />
          </q-td>
          <q-td>
            <q-btn
              dense
              size="sm"
              flat
              no-caps
              unelevated
              color="primary"
              @click="openImageDialog(props.row.image)"
            >
              <vx-icon iconName="Image" :size="18" />
            </q-btn>
          </q-td>
          <q-td>
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
          <q-td>
            {{ props.row.user_create.name }}
          </q-td>
          <q-td>
            {{ props.row.event_category.name }}
          </q-td>
          <q-td>
            {{ props.row.event_category_type?.name }}
          </q-td>
          <q-td>
            {{ moment(props.row.created_at).format("YYYY-MM-DD hh:mm:ss") }}
          </q-td>
          <q-td class="text-right">
            <q-btn
              size="sm"
              color="primary"
              round
              dense
              unelevated
              :to="{ name: 'EventDetail', params: { id: props.row.id } }"
              icon="o_info"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>

  <q-dialog v-model="dialog_image">
    <q-card class="tw-w-full">
      <q-img :src="image" class="tw-w-full" />
    </q-card>
  </q-dialog>
</template>
<script>
import moment from "moment";
import { defineComponent, ref } from "vue";
import VxIcon from "components/VxIcon.vue";
import { useEventStore } from "src/stores/event";

export default defineComponent({
  components: { VxIcon },
  setup() {
    const event = useEventStore();
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
        name: "Status",
        label: "Status",
        align: "center",
        field: (row) => row.status.name,
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
        name: "IssuedBy",
        label: "Pelapor",
        align: "left",
        field: (row) => row.user_create.name,
        sortable: true,
      },
      {
        name: "Category",
        label: "Kateogri",
        align: "left",
        field: (row) => row.event_category.name,
        sortable: true,
      },
      {
        name: "Type",
        label: "Tipe",
        align: "left",
        field: (row) => row.event_category_type?.name,
        sortable: true,
      },
      {
        name: "created_at",
        label: "Di Buat Pada",
        field: "created_at",
        sortable: true,
      },

      {
        name: "action",
        label: "Aksi",
        align: "right",
      },
    ];

    return {
      moment,
      columns,
      event,
      loading: ref(false),
      filter: ref(""),

      dialog_image: ref(false),
      image: ref(null),
    };
  },

  mounted() {
    this.getData();
  },

  methods: {
    getData() {
      this.loading = true;
      this.event.get_event().then((res) => {
        this.loading = false;
      });
    },

    openImageDialog(image) {
      this.image = image;
      this.dialog_image = true;
    },
  },
});
</script>
