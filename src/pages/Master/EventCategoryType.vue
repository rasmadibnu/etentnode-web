<template>
  <q-page class="tw-p-4 tw-space-y-6">
    <q-btn no-caps dense flat :to="{ name: 'EventCategory' }">
      <vx-icon iconName="ArrowLeft2" class="tw-mr-2" :size="24" />
      <div class="tw-text-xl tw-font-semibold">Tipe Kategori Kejadian</div>
    </q-btn>
    <q-card flat>
      <q-card-section>
        <div class="text-h6">Kategori</div>
      </q-card-section>
      <q-card-section class="q-pt-none tw-font-semibold">
        {{ category?.name }}
        <div class="tw-flex tw-gap-2 tw-mt-3">
          <q-badge
            v-for="role in category.roles"
            :key="role.id"
            :label="role.role.name"
            color="secondary"
          />
        </div>
      </q-card-section>
    </q-card>
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
    <q-card style="min-width: 400px">
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
        Anda yakin ingin menhapus data ini?
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Batal" no-caps v-close-popup />
        <q-btn flat label="Ya" color="negative" no-caps @click="deleteData" />
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

const initial_form = {
  name: null,
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
      category: ref({}),

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
        .get("/event-categories/" + this.$route.params.id)
        .then((res) => {
          this.category = res.data.data;
          this.rows = res.data.data.types;
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
          .post("/event-category-types", {
            ...this.form,
            created_by: this.user.id,
            event_category_id: parseInt(this.$route.params.id),
          })
          .then((res) => {
            this.$q.notify({
              message: "Tipe Kategori berhasil ditambah",
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
          .put("/event-category-types/" + this.id, {
            ...this.form,
            updated_by: this.user.id,
          })
          .then((res) => {
            this.$q.notify({
              message: "Tipe Kategori berhasil diubah",
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
        .delete("/event-category-types/" + this.id)
        .then((res) => {
          this.$q.notify({
            message: "Tipe Kategori berhasil dihapus",
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
