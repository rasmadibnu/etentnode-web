<template>
  <q-page class="tw-p-4 tw-space-y-6">
    <div class="tw-text-xl tw-font-semibold">User</div>
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
            <vx-icon iconName="AddCircle" class="tw-mr-2" :size="20" />
            Tambah
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
  <q-dialog v-model="form_dialog">
    <q-card style="width: 600px">
      <q-card-section class="row items-center">
        <div class="text-h6">{{ !is_edit ? "Tambah" : "Ubah" }} User</div>
        <q-space />
        <q-btn flat round dense v-close-popup>
          <vx-icon iconName="CloseCircle" :size="20" />
        </q-btn>
      </q-card-section>

      <q-form @submit.prevent="submit">
        <q-card-section
          class="tw-grid tw-grid-cols-1 md:tw-grid-cols-6 tw-gap-x-4 tw-gap-y-2"
        >
          <q-input
            v-model="form.username"
            filled
            class="md:tw-col-span-3"
            label="Username"
            :rules="[(val) => !!val || 'Field ini wajib diisi']"
          />
          <q-input
            v-model="form.name"
            filled
            class="md:tw-col-span-3"
            label="Nama"
            :rules="[(val) => !!val || 'Field ini wajib diisi']"
          />
          <q-input
            v-model="form.email"
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
            v-model="form.phone_number"
            filled
            class="md:tw-col-span-2"
            label="No Telp"
            mask="###################"
            :rules="[(val) => !!val || 'Field ini wajib diisi']"
          />
          <q-select
            v-model="form.role_id"
            filled
            class="md:tw-col-span-2"
            label="Role"
            :options="list_role"
            :rules="[(val) => !!val || 'Field ini wajib diisi']"
            map-options
            emit-value
          />
          <q-input
            v-if="!is_edit"
            v-model="form.password"
            type="password"
            filled
            class="md:tw-col-span-3"
            label="Password"
            :rules="[(val) => !!val || 'Field ini wajib diisi']"
          />
          <q-input
            v-else
            v-model="form.password"
            type="password"
            filled
            class="md:tw-col-span-3"
            label="Password"
          />
          <q-input
            v-model="form.confirm_password"
            :disable="form.password == null"
            type="password"
            filled
            class="md:tw-col-span-3"
            label="Confirm Password"
            :rules="[
              (val) => val === form.password || 'Confirm password tidak sama',
            ]"
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
        <q-btn flat label="Cancel" no-caps v-close-popup />
        <q-btn flat label="Yes" color="negative" no-caps @click="deleteData" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { defineComponent, ref } from "vue";
import VxIcon from "components/VxIcon.vue";
import moment from "moment";
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
    name: "Username",
    label: "Username",
    align: "left",
    field: "username",
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
    name: "email",
    label: "E-Mail",
    align: "left",
    field: "email",
    sortable: true,
  },
  {
    name: "PhoneNumber",
    label: "No Telp",
    align: "left",
    field: "phone_number",
    sortable: true,
  },
  {
    name: "Updated",
    label: "Diubah Pada",
    align: "left",
    field: (row) => moment(row.updated_at).format("YYYY-MM-DD hh:mm:ss"),
    sortable: true,
  },
  {
    name: "action",
    label: "Aksi",
    align: "right",
  },
];

const initial_form = {
  username: null,
  name: null,
  role_id: null,
  email: null,
  phone_number: null,
  password: null,
  confirm_password: null,
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
      list_role: ref([]),
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
        .get("/users")
        .then((res) => {
          this.rows = res.data.data;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getRole() {
      this.loading = true;
      this.$api
        .get("/roles")
        .then((res) => {
          this.list_role = res.data.data.map((e) => {
            return { label: e.name, value: e.id };
          });
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
        delete data.password;
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
          .post("/users", { ...this.form, created_by: this.user.id })
          .then((res) => {
            this.$q.notify({
              message: "User berhasil ditambah",
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
          .put("/users/" + this.id, {
            ...this.form,
            updated_by: this.user.id,
          })
          .then((res) => {
            this.$q.notify({
              message: "User berhasil diubah",
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
        .delete("/users/" + this.id)
        .then((res) => {
          this.$q.notify({
            message: "User berhasil dihapus",
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
