<template>
  <div class="employee-table">
    <v-container fluid>
      <v-row class="mt-8">
        <!-- Search -->
        <v-col cols="12" md="5">
          <label class="form-label">Search</label>
          <v-text-field
            v-model="search"
            label="Enter Name, Email, Phone or Designation"
            variant="outlined"
            density="comfortable"
            clearable
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="3"></v-col>

        <!-- Add Button -->
        <v-col cols="12" md="4" class="text-right d-flex align-end">
          <v-btn 
            class="add-button" 
            color="primary"
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
          :search="search"
          :loading="loading"
          item-key="id"
          :items-per-page="10"
          class="custom-table"
        >
          <template v-slot:[`item.action`]="{ item }">
            <div class="action-buttons">
              <v-btn icon="mdi-pencil" variant="text" color="success" @click="editEmployee(item)"></v-btn>
              <v-btn icon="mdi-trash-can-outline" variant="text" color="error" @click="deleteEmployee(item)"></v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card>
    </v-container>

    <!-- Dialog -->
    <v-dialog v-model="showForm" max-width="650" persistent>
      <v-card class="form-dialog">
        <v-card-title class="d-flex justify-space-between">
          <span class="dialog-title">{{ editMode ? 'Edit Employee' : 'Add New Employee' }}</span>
          <v-btn icon @click="closeForm">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pt-0">
          <AddEmployeeForm
            :employee="editingEmployee"
            @closeForm="closeForm"
            @saved="onEmployeeSaved"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import AddEmployeeForm from "@/components/AddEmployeeForm.vue";

export default {
  components: {
    AddEmployeeForm,
  },

  data() {
    return {
      search: "",
      loading: false,
      showForm: false,
      editMode: false,
      editingEmployee: null,

      headers: [
        { key: "name",                  title: "Name" },
        { key: "email",                 title: "Email" },
        { key: "phone",                 title: "Phone" },
        { key: "designation",           title: "Designation" },
        { key: "monthly_salary",        title: "Monthly Salary" },
        { key: "monthly_tax_value",     title: "Monthly Tax Value" },
        { key: "yearly_increasing_bonus", title: "Yearly Increasing Bonus" },
        { key: "monthly_net_salary",    title: "Monthly Net Salary" },
        { key: "yearly_net_salary",     title: "Yearly Net Salary" },
        { key: "action",                title: "Actions", sortable: false },
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
        // Replace with your actual API call
        // const res = await employeeApi.getAll();
        // this.items = res.data.data;
        
        // Dummy data for now
        this.items = [
          {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            phone: "1234567890",
            designation: "Software Engineer",
            monthly_salary: 5000,
            monthly_tax_value: 500,
            yearly_increasing_bonus: 2000,
            monthly_net_salary: 4500,
            yearly_net_salary: 54000,
          },
        ];
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    openCreateForm() {
      this.editMode = false;
      this.editingEmployee = null;
      this.showForm = true;
    },

    editEmployee(employee) {
      this.editMode = true;
      this.editingEmployee = { ...employee };
      this.showForm = true;
    },

    deleteEmployee(employee) {
      if (confirm(`Delete ${employee.name}?`)) {
        this.items = this.items.filter((item) => item.id !== employee.id);
      }
    },

    closeForm() {
      this.showForm = false;
      this.editingEmployee = null;
      this.editMode = false;
    },

    onEmployeeSaved(employee) {
      if (this.editMode) {
        const index = this.items.findIndex((item) => item.id === employee.id);
        if (index !== -1) this.items.splice(index, 1, employee);
      } else {
        if (!employee.id) employee.id = Date.now();
        this.items.push(employee);
      }
      this.closeForm();
    },
  },
};
</script>