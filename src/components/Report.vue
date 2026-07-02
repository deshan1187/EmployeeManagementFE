<template>
  <div class="pl-5 pr-5 mt-1">
    <v-container class="report">
      <v-row v-if="employee">
        <!-- Employee Name -->
        <v-col cols="12" md="6">
          <label class="label">Employee Name</label>
          <div class="report_value mt-1">{{ employee.name }}</div>
        </v-col>

        <!-- Email -->
        <v-col cols="12" md="6">
          <label class="label">Email Address</label>
          <div class="report_value mt-1">{{ employee.email }}</div>
        </v-col>

        <!-- Phone -->
        <v-col cols="12" md="6">
          <label class="label">Phone Number</label>
          <div class="report_value mt-1">{{ employee.phone }}</div>
        </v-col>

         <!-- Designation -->
        <v-col cols="12" md="6">
          <label class="label">Designation</label>
          <div class="report_value mt-1">{{ employee.designation }}</div>
        </v-col>

        <v-col cols="12" md="6">
          <label class="label">Monthly Salary Package</label>
          <div class="report_value mt-1">
            {{ formatCurrency(employee.monthly_salary_package) }}
          </div>
        </v-col>

        <v-col cols="12">
          <v-divider class="my-2"></v-divider>
        </v-col>

        <!-- Monthly Salary Package -->

        <!-- Monthly Tax Value -->
        <v-col cols="12" md="6">
          <label class="label">Monthly Tax Value</label>
          <div class="report_value mt-1 report_value--negative">
            {{ formatCurrency(employee.monthly_tax_value) }}
          </div>
        </v-col>

        <!-- Yearly Increasing Bonus -->
        <v-col cols="12" md="6">
          <label class="label">Yearly Increasing Bonus</label>
          <div class="report_value mt-1 report_value--positive">
            {{ formatCurrency(employee.yearly_increasing_bonus) }}
          </div>
        </v-col>

        <v-col cols="12">
          <v-divider class="my-2"></v-divider>
        </v-col>

        <!-- Yearly Net Salary (highlighted total) -->
<v-col cols="12" class="text-center">
  <v-card class="total_card pa-4" variant="tonal" color="primary">
    <v-row class="align-center justify-center">
      
      <!-- Monthly Net Salary -->
      <v-col cols="12" md="6" class="text-center">
        <label class="label">Monthly Net Salary</label>
        <div class="report_value report_value--total mt-1">
          {{ formatCurrency(employee.monthly_net_salary) }}
        </div>
      </v-col>

      <!-- Yearly Net Salary -->
      <v-col cols="12" md="6" class="text-center">
        <label class="label">Yearly Net Salary</label>
        <div class="report_value report_value--total mt-1">
          {{ formatCurrency(employee.yearly_net_salary) }}
        </div>
      </v-col>

    </v-row>
  </v-card>
</v-col>
      </v-row>

      <!-- Fallback when no employee is passed -->
      <v-row v-else>
        <v-col cols="12" class="text-center py-6">
          No employee data available.
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  props: {
    employee: {
      type: Object,
      default: null,
    },
  },

  methods: {
    // Formats a raw numeric/string value as currency (Rs.)
    formatCurrency(value) {
      return `Rs.${Number(value || 0).toFixed(2)}`;
    },
  },
};
</script>
