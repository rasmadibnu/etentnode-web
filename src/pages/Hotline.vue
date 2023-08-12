<template>
  <q-page class="tw-p-4 tw-space-y-6">
    <div class="tw-text-xl tw-font-semibold">Hotline</div>
    <q-table
      color="primary"
      :columns="columns"
      :rows="rows"
      :loading="loading"
      :filter="search"
      :pagination="{ rowsPerPage: 10 }"
      flat
    >
      <template #top>
        <div class="tw-flex tw-justify-end tw-w-full">
          <q-input dense placeholder="Cari..." v-model="search" filled>
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
      <template #body-cell-action="props">
        <q-td :props="props">
          <q-btn
            flat
            dense
            size="sm"
            color="primary"
            @click="openDialog(props.row)"
          >
            <vx-icon iconName="Edit" :size="18" />
          </q-btn>
        </q-td>
      </template>
      <template #body-cell-service="props">
        <q-td :props="props">
          <q-badge
            color="secondary"
            v-if="props.row.is_service == 1"
            label="Service"
          />
          <q-badge color="negative" v-else label="Not Service" />
        </q-td>
      </template>
    </q-table>
  </q-page>
  <q-dialog v-model="form_dialog">
    <q-card style="width: 400px">
      <q-card-section class="row items-center">
        <div class="text-h6">{{ !is_edit ? "Create" : "Edit" }} Hotline</div>
        <q-space />
        <q-btn flat round dense v-close-popup>
          <vx-icon iconName="CloseCircle" :size="20" />
        </q-btn>
      </q-card-section>

      <q-form @submit.prevent="submit">
        <q-card-section class="tw-space-y-2">
          <q-input v-model="form.hotline" filled label="Hotline" hint="" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            label="Cancel"
            no-caps
            flat
            @click="closeDialog"
            color="negative"
          />
          <q-btn
            label="Submit"
            :loading="loading"
            type="submit"
            no-caps
            flat
            color="primary"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
  <q-dialog v-model="confirm">
    <q-card>
      <q-card-section>
        <div class="text-h6 text-negative tw-flex tw-items-center">
          <VxIcon iconName="Warning2" class="tw-mr-2" :size="22" />
          Confirmation
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        Are you sure want to delete this data?
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" no-caps v-close-popup />
        <q-btn flat label="Yes" color="negative" no-caps @click="deleteData" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { defineComponent, ref } from "vue";
import VxIcon from "components/VxIcon.vue";

const columns = [
  {
    name: "index",
    label: "#",
    align: "center",
  },
  {
    name: "Name",
    label: "Name",
    align: "left",
    field: "name",
    sortable: true,
  },

  {
    name: "hotline",
    label: "Hotilne",
    align: "left",
    field: "hotline",
    sortable: true,
  },
  {
    name: "action",
    label: "Action",
    align: "right",
  },
];

const initial_form = {
  name: null,
  is_service: 0,
  hotline: null,
};

export default defineComponent({
  props: ["user"],
  components: { VxIcon },
  setup() {
    return {
      columns,
      rows: ref([]),
      loading: ref(false),
      search: ref(""),
      is_edit: ref(false),
      confirm: ref(false),

      form_dialog: ref(false),
      id: ref(""),
      form: ref(structuredClone(initial_form)),
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.loading = true;
      this.$api
        .get("/roles?is_service=1")
        .then((res) => {
          this.rows = res.data.data;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    openDialog(data) {
      if (!data) {
        this.form = { ...initial_form };
        this.is_edit = false;
      } else {
        this.is_edit = true;
        this.id = data.id;
        this.form = {
          ...data,
        };
      }
      this.form_dialog = true;
    },
    closeDialog() {
      this.form = { ...initial_form };
      this.form_dialog = false;
      this.loading = false;
    },
    submit() {
      this.loading = true;
      if (!this.is_edit) {
        this.$api
          .post("/roles", { ...this.form, created_by: this.user.id })
          .then((res) => {
            this.$q.notify({
              message: "Hotline successfully created",
              color: "positive",
            });
            this.closeDialog();
            this.getData();
          })
          .catch((err) => {
            this.closeDialog();
            console.log(err);
          });
      } else {
        this.$api
          .put("/roles/" + this.id, {
            ...this.form,
            updated_by: this.user.id,
          })
          .then((res) => {
            this.$q.notify({
              message: "Hotline successfully updated",
              color: "positive",
            });
            this.closeDialog();
            this.getData();
          })
          .catch((err) => {
            this.closeDialog();
            console.log(err);
          });
      }
    },
    confirmDelete(id) {
      this.id = id;
      this.confirm = true;
    },
    deleteData() {
      this.$api
        .delete("/roles/" + this.id)
        .then((res) => {
          this.$q.notify({
            message: "Hotline successfully deleted",
            color: "positive",
          });
          this.getData();
          this.confirm = false;
        })
        .catch((err) => {
          console.log(err);
          this.confirm = false;
        });
    },
  },
});
</script>
