<template>
  <div class="pl-5 pr-5 mt-1">
    <v-container class="form">
      <v-form v-model="isFormValid">
        <v-row>
          <!-- Employee Name -->
          <v-col cols="12">
            <label class="label">Employee Name</label>
            <v-text-field
              class="input mt-2"
              variant="outlined"
              v-model="form.name"
              :rules="[required]"
              placeholder="Enter Full Name"
              clearable
            />
          </v-col>

          <!-- Phone Number -->
          <v-col cols="12">
            <label class="label">Phone Number</label>
            <v-text-field
              class="input mt-2"
              variant="outlined"
              v-model="form.phone"
              :rules="[required]"
              placeholder="Enter Phone Number"
              type="tel"
              clearable
            />
          </v-col>

          <!-- Email -->
          <v-col cols="12">
            <label class="label">Email Address</label>
            <v-text-field
              class="input mt-2"
              variant="outlined"
              v-model="form.email"
              :rules="[required, emailRule]"
              placeholder="Enter Email Address"
              type="email"
              clearable
            />
          </v-col>

          <!-- Designation (Dropdown) -->
          <v-col cols="12">
            <label class="label">Designation</label>
            <v-select
              class="input mt-2"
              variant="outlined"
              v-model="form.designation"
              :items="designationOptions"
              :rules="[required]"
              placeholder="Select Designation"
              clearable
            />
          </v-col>

          <!-- Monthly Salary Package -->
          <v-col cols="12">
            <label class="label">Monthly Salary Package</label>
            <v-text-field
              class="input mt-2"
              variant="outlined"
              v-model="form.monthly_salary_package"
              :rules="[required, positiveNumber]"
              placeholder="Enter Monthly Salary Package"
              type="number"
              prefix="Rs."
              clearable
            />
          </v-col>

          <!-- Calculate Button -->
          <v-col cols="12">
            <v-btn
              block
              variant="outlined"
              color="primary"
              :loading="calcLoader"
              :disabled="!form.designation || !form.monthly_salary_package"
              @click="getCalculate"
            >
              Calculate
            </v-btn>
          </v-col>

          <!-- Calculated Values-->
          <v-col cols="12" v-if="showCalculation">
            <v-divider class="mb-4"></v-divider>

            <v-row>
              <v-col cols="6">
                <label class="label">Monthly Tax Value</label>
                <div class="calculated_value mt-1">
                  {{ formatCurrency(calculation.monthly_tax_value) }}
                </div>
              </v-col>

              <v-col cols="6">
                <label class="label">Monthly Net Salary</label>
                <div class="calculated_value mt-1">
                  {{ formatCurrency(calculation.monthly_net_salary) }}
                </div>
              </v-col>

              <v-col cols="6">
                <label class="label">Yearly Increasing Bonus</label>
                <div class="calculated_value mt-1">
                  {{ formatCurrency(calculation.yearly_increasing_bonus) }}
                </div>
              </v-col>

              <v-col cols="6">
                <label class="label">Yearly Net Salary</label>
                <div class="calculated_value mt-1">
                  {{ formatCurrency(calculation.yearly_net_salary) }}
                </div>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12" class="mt-4"></v-col>

          <!-- Submit Button -->
          <v-col cols="12">
            <v-btn
              block
              class="submit_button mt-2"
              @click="saveEmployee"
              :loading="showloader"
              :disabled="!isFormValid"
              color="primary"
            >
              {{ isEditMode ? "Update Employee" : "Save Employee" }}
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </div>
</template>

<script>
import employeeApi from "@/Api/Modules/employee";

export default {
  props: {
    employee: {
      type: Object,
      default: null,
    },
  },

  emits: ["closeForm", "saved", "refreshTable"],

  data() {
    return {
      isFormValid: false,
      showloader: false,
      calcLoader: false,

      calculated: false,

      designationOptions: ["Intern", "Associate", "Senior", "Manager"],

      form: {
        id: null,
        name: "",
        email: "",
        phone: "",
        designation: "",
        monthly_salary_package: null,
      },

      calculation: {
        monthly_tax_value: 0,
        monthly_net_salary: 0,
        yearly_increasing_bonus: 0,
        yearly_net_salary: 0,
      },
    };
  },

  computed: {
    isEditMode() {
      return !!this.employee;
    },

    showCalculation() {
      return this.calculated;
    },
  },

  watch: {
    employee: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.form = { ...newVal };
        } else {
          this.resetForm();
        }
      },
    },

    "form.designation"() {
      this.calculated = false;
    },
    "form.monthly_salary_package"() {
      this.calculated = false;
    },
  },

  methods: {
    required(v) {
      return !!v || "Field is required";
    },

    emailRule(v) {
      if (!v) return true;
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(v) || "Please enter a valid email";
    },

    positiveNumber(v) {
      if (!v) return true;
      return Number(v) > 0 || "Salary must be greater than 0";
    },

    formatCurrency(value) {
      return `Rs.${Number(value || 0).toFixed(2)}`;
    },

    resetForm() {
      this.form = {
        id: null,
        name: "",
        email: "",
        phone: "",
        designation: "",
        monthly_salary_package: null,
      };

      this.calculation = {
        monthly_tax_value: 0,
        monthly_net_salary: 0,
        yearly_increasing_bonus: 0,
        yearly_net_salary: 0,
      };

      this.calculated = false;
    },

    async getCalculate() {
      if (!this.form.designation || !this.form.monthly_salary_package) return;

      this.calcLoader = true;

      try {
        const payload = {
          designation: this.form.designation,
          monthly_salary_package: this.form.monthly_salary_package,
        };

        const res = await employeeApi.getCalculate(payload);

        this.calculation = {
          monthly_tax_value: res.data.data.monthly_tax_value,
          monthly_net_salary: res.data.data.monthly_net_salary,
          yearly_increasing_bonus: res.data.data.yearly_increasing_bonus,
          yearly_net_salary: res.data.data.yearly_net_salary,
        };

        this.calculated = true;
      } catch (error) {
        console.error("Error calculating employee details:", error);
      } finally {
        this.calcLoader = false;
      }
    },

    async saveEmployee() {
      if (!this.isFormValid) return;

      this.showloader = true;

      try {
        const payload = {
          name: this.form.name,
          email: this.form.email,
          phone: this.form.phone,
          designation: this.form.designation,
          monthly_salary_package: this.form.monthly_salary_package,
        };

          await employeeApi.create(payload);


        this.$emit("saved", { ...this.form, ...this.calculation });
        this.$emit("refreshTable");
        this.$emit("closeForm");
      } catch (error) {
        console.error("Error saving employee:", error);
      } finally {
        this.showloader = false;
      }
    },
  },
};
</script>

