<template>
  <q-page class="tw-p-4 tw-space-y-6">
    <div class="tw-text-xl tw-font-semibold">Kategori Kejadian</div>
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
        <div class="tw-flex tw-justify-between tw-w-full">
          <q-btn outline no-caps color="primary" @click="openDialog(null)">
            <vx-icon iconName="AddCircle" class="md:tw-mr-2" :size="20" />
            <span class="tw-hidden md:tw-block">Tambah</span>
          </q-btn>
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
          <q-btn flat dense size="sm" color="primary">
            <vx-icon iconName="More" :size="18" />
            <q-menu auto-close class="tw-shadow-none tw-border">
              <q-list style="min-width: 100px">
                <q-item
                  clickable
                  v-ripple
                  class="text-secondary"
                  :to="{
                    name: 'EventCategoryType',
                    params: { id: props.row.id },
                  }"
                >
                  <q-item-section avatar>
                    <vx-icon iconName="HambergerMenu" :size="20" />
                  </q-item-section>

                  <q-item-section>Type</q-item-section>
                </q-item>
                <q-separator />
                <q-item
                  clickable
                  v-ripple
                  class="text-primary"
                  @click="openRoleDialog(props.row)"
                >
                  <q-item-section avatar>
                    <vx-icon iconName="UserOctagon" :size="20" />
                  </q-item-section>

                  <q-item-section>Roles</q-item-section>
                </q-item>
                <q-separator />
                <q-item
                  clickable
                  v-ripple
                  class="text-primary"
                  @click="openDialog(props.row)"
                >
                  <q-item-section avatar>
                    <vx-icon iconName="Edit" :size="20" />
                  </q-item-section>

                  <q-item-section>Ubah</q-item-section>
                </q-item>
                <q-separator />
                <q-item
                  clickable
                  v-ripple
                  class="text-negative"
                  @click="confirmDelete(props.row.id)"
                >
                  <q-item-section avatar>
                    <vx-icon iconName="Trash" :size="20" />
                  </q-item-section>

                  <q-item-section>Hapus</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-td>
      </template>
    </q-table>
  </q-page>
  <q-dialog v-model="role_dialog">
    <q-card style="width: 600px">
      <q-card-section class="row items-center">
        <div class="text-h6">Role</div>
        <q-space />
        <q-btn flat round dense v-close-popup>
          <vx-icon iconName="CloseCircle" :size="20" />
        </q-btn>
      </q-card-section>
      <q-card-section class="q-py-none">
        <div class="tw-text-lg tw-mb-4">
          Kategori Kejadian:
          <span class="tw-font-semibold">{{ form?.name }}</span>
        </div>
        <q-table
          flat
          :rows="roles"
          :columns="columns_roles"
          v-model:selected="role_selected"
          row-key="id"
          selection="multiple"
        >
        </q-table>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Batal" color="negative" no-caps v-close-popup />
        <q-btn flat label="Tambah" no-caps @click="assignRole" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="form_dialog">
    <q-card>
      <q-card-section class="row items-center">
        <div class="text-h6">
          {{ !is_edit ? "Tambah" : "Ubah" }} Kategori Kejadian
        </div>
        <q-space />
        <q-btn flat round dense v-close-popup>
          <vx-icon iconName="CloseCircle" :size="20" />
        </q-btn>
      </q-card-section>

      <q-form @submit.prevent="submit">
        <q-card-section class="tw-space-y-2">
          <q-input
            v-model="form.name"
            filled
            label="Nama"
            :rules="[(val) => !!val || 'Field ini wajib diisi']"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            label="Batal"
            no-caps
            flat
            @click="closeDialog"
            color="negative"
          />
          <q-btn
            label="Simpan"
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
          Konfirmasi
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        Anda yakin ingin menghapus data ini?
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Batal" no-caps v-close-popup />
        <q-btn
          flat
          label="Ya"
          color="primary"
          no-caps
          @click="deleteData"
          :loading="loading"
        />
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
    label: "Nama",
    align: "left",
    field: "name",
    sortable: true,
  },

  {
    name: "action",
    label: "Aksi",
    align: "right",
  },
];

const columns_roles = [
  {
    name: "Name",
    label: "Role",
    align: "left",
    field: "name",
    sortable: true,
  },
];

const initial_form = {
  name: null,
};

export default defineComponent({
  props: ["user"],
  components: { VxIcon },
  setup() {
    return {
      columns,
      columns_roles,
      rows: ref([]),
      loading: ref(false),
      search: ref(""),
      is_edit: ref(false),
      confirm: ref(false),

      form_dialog: ref(false),
      id: ref(""),
      form: ref(structuredClone(initial_form)),

      roles: ref([]),
      role_selected: ref([]),
      role_dialog: ref(false),
    };
  },
  mounted() {
    this.getData();
    this.getRole();
  },
  methods: {
    getData() {
      this.loading = true;
      this.$api
        .get("/event-categories")
        .then((res) => {
          this.rows = res.data.data;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getRole() {
      return this.$api
        .get("/roles")
        .then((res) => {
          this.roles = res.data.data;
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
        this.form = { ...data };
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
          .post("/event-categories", { ...this.form, created_by: this.user.id })
          .then((res) => {
            this.$q.notify({
              message: "Kejadian Berhasil ditambah",
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
          .put("/event-categories/" + this.id, {
            ...this.form,
            updated_by: this.user.id,
          })
          .then((res) => {
            this.$q.notify({
              message: "Kejadian Berhasil diubah",
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
      this.loading = true;
      this.$api
        .delete("/event-categories/" + this.id)
        .then((res) => {
          this.$q.notify({
            message: "Kejadian Berhasil dihapus",
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

    openRoleDialog(data) {
      this.id = data.id;
      delete data.Password;
      this.form = { ...data };
      this.role_selected = [];
      this.role_selected = data.roles.map((role) => role.role);
      this.role_dialog = true;
    },

    assignRole() {
      this.loading = true;
      this.$api
        .post(
          "/event-categories/assign",
          this.role_selected.map((e) => {
            return { event_category_id: this.id, role_id: e.id };
          })
        )
        .then((res) => {
          this.$q.notify({
            message: "Role berhasil diassign",
            color: "positive",
          });
          this.loading = true;
          this.role_dialog = false;
        });
    },
  },
});
</script>
