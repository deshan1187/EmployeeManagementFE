<template>
  <div class="employee-table">
    <v-container fluid>
      <v-row class="mt-8 align-center" no-gutters>
        <!-- Search Field -->
        <v-col cols="12" md="5">
          <label class="form-label">Search</label>
          <div class="d-flex search-bar-wrapper">
            <v-text-field
              v-model="search"
              label="Enter Phone Number"
              variant="outlined"
              density="comfortable"
              clearable
              @click:clear="onSearchClear"
              @keyup.enter="searchEmployees"
              class="search-input"
              hide-details
            ></v-text-field>

            <v-btn
              class="search-button ml-3"
              color="success"
              variant="flat"
              size="large"
              :loading="searchLoader"
              @click="searchEmployees"
            >
              Search
            </v-btn>
          </div>
        </v-col>

        <v-col cols="12" md="1"></v-col>

        <!-- Add Employee Button -->
        <v-col
          cols="12"
          md="6"
          class="text-right"
        >
          <v-btn
            class="add-button"
            color="success"
            size="large"
            @click="openCreateForm"
          >
            Add Employee
          </v-btn>
        </v-col>
      </v-row>

      <!-- Table -->
      <v-card class="mt-6 employee-card" elevation="3">
        <v-data-table
          :items="items"
          :headers="headers"
          :loading="loading"
          item-key="id"
          :items-per-page="10"
          class="custom-table"
        >
          
          <template v-slot:[`item.monthly_salary_package`]="{ item }">
            {{ formatCurrency(item.monthly_salary_package) }}
          </template>

          <template v-slot:[`item.monthly_tax_value`]="{ item }">
            {{ formatCurrency(item.monthly_tax_value) }}
          </template>

          <template v-slot:[`item.yearly_increasing_bonus`]="{ item }">
            {{ formatCurrency(item.yearly_increasing_bonus) }}
          </template>

          <template v-slot:[`item.monthly_net_salary`]="{ item }">
            {{ formatCurrency(item.monthly_net_salary) }}
          </template>

          <template v-slot:[`item.yearly_net_salary`]="{ item }">
            {{ formatCurrency(item.yearly_net_salary) }}
          </template>

          <template v-slot:[`item.action`]="{ item }">
            <div class="action-buttons">
              <v-btn
                icon="mdi-pencil"
                variant="text"
                color="success"
                @click="editEmployee(item)"
              ></v-btn>
              <v-btn
                icon="mdi-trash-can-outline"
                variant="text"
                color="error"
                @click="confirmDelete(item)"
              ></v-btn>
              <v-btn
                icon="mdi-file-chart-outline"
                variant="text"
                color="success"
                @click="viewReport(item)"
              ></v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card>
    </v-container>

    <!-- Add Employee Dialog -->
    <v-dialog v-model="showForm" max-width="650" persistent>
      <v-card class="form-dialog">
        <v-card-title class="d-flex justify-space-between">
          <span class="dialog-title">Add New Employee</span>
          <v-btn icon @click="closeForm">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pt-0">
          <AddEmployeeForm
            @closeForm="closeForm"
            @refreshTable="fetchEmployees"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Edit Employee Dialog -->
    <v-dialog v-model="showEditForm" max-width="650" persistent>
      <v-card class="form-dialog">
        <v-card-title class="d-flex justify-space-between">
          <span class="dialog-title">Edit Employee</span>
          <v-btn icon @click="closeEditForm">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pt-0">
          <EditEmployeeForm
            :employee="editingEmployee"
            @closeForm="closeEditForm"
            @refreshTable="fetchEmployees"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- View Report Dialog -->
    <v-dialog v-model="showReport" max-width="700" persistent>
      <v-card class="form-dialog">
        <v-card-title class="d-flex justify-space-between">
          <span class="dialog-title">Employee Report</span>
          <v-btn icon @click="closeReport">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pt-0">
          <Report :employee="reportEmployee" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteConfirm" max-width="420" persistent>
      <v-card class="form-dialog">
        <v-card-title class="dialog-title">Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete
          <strong>{{ deletingEmployee?.name }}</strong
          >? This action cannot be undone.
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="cancelDelete">No</v-btn>
          <v-btn
            color="error"
            variant="flat"
            :loading="deleteLoader"
            @click="deleteEmployee"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import AddEmployeeForm from "@/components/AddEmployeeForm.vue";
import EditEmployeeForm from "@/components/EditEmployeeForm.vue";
import Report from "@/components/Report.vue";
import employeeApi from "@/Api/Modules/employee";

export default {
  components: {
    AddEmployeeForm,
    EditEmployeeForm,
    Report,
  },

  data() {
    return {
      search: "",
      loading: false,
      searchLoader: false,

      // Add form
      showForm: false,

      // Edit form
      showEditForm: false,
      editingEmployee: null,

      // Report
      showReport: false,
      reportEmployee: null,

      // Delete confirmation
      showDeleteConfirm: false,
      deletingEmployee: null,
      deleteLoader: false,

      headers: [
        { key: "name", title: "Name" },
        { key: "email", title: "Email" },
        { key: "phone", title: "Phone" },
        { key: "designation", title: "Designation" },
        { key: "monthly_salary_package", title: "Monthly Salary" },
        { key: "monthly_tax_value", title: "Monthly Tax Value" },
        { key: "yearly_increasing_bonus", title: "Yearly Increasing Bonus" },
        { key: "monthly_net_salary", title: "Monthly Net Salary" },
        { key: "yearly_net_salary", title: "Yearly Net Salary" },
        { key: "action", title: "Actions", sortable: false },
      ],

      items: [],
    };
  },

  mounted() {
    this.fetchEmployees();
  },

  methods: {

    async fetchEmployees() {
      this.loading = true;

      try {
        const res = await employeeApi.getAll();
        this.items = res.data.data;
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        this.loading = false;
      }
    },

    async searchEmployees() {

      if (!this.search) {
        this.fetchEmployees();
        return;
      }

      this.searchLoader = true;

      try {
        const res = await employeeApi.search(this.search);
        this.items = res.data.data;
      } catch (error) {
        console.error("Error searching employees:", error);
      } finally {
        this.searchLoader = false;
      }
    },

    onSearchClear() {
      this.search = "";
      this.fetchEmployees();
    },

    formatCurrency(value) {
      return `Rs.${Number(value || 0).toFixed(2)}`;
    },

    //Add
    openCreateForm() {
      this.showForm = true;
    },

    closeForm() {
      this.showForm = false;
    },

    //Edit
    editEmployee(employee) {
      this.editingEmployee = { ...employee };
      this.showEditForm = true;
    },

    closeEditForm() {
      this.showEditForm = false;
      this.editingEmployee = null;
    },

    //Report
    viewReport(employee) {
      this.reportEmployee = { ...employee };
      this.showReport = true;
    },

    closeReport() {
      this.showReport = false;
      this.reportEmployee = null;
    },

    //Delete
    confirmDelete(employee) {
      this.deletingEmployee = employee;
      this.showDeleteConfirm = true;
    },

    cancelDelete() {
      this.showDeleteConfirm = false;
      this.deletingEmployee = null;
    },

    async deleteEmployee() {
      if (!this.deletingEmployee) return;

      this.deleteLoader = true;

      try {
        await employeeApi.delete(this.deletingEmployee.id);
        await this.fetchEmployees();
      } catch (error) {
        console.error("Error deleting employee:", error);
      } finally {
        this.deleteLoader = false;
        this.showDeleteConfirm = false;
        this.deletingEmployee = null;
      }
    },
  },
};
</script>
