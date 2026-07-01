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

          <!-- Designation -->
          <v-col cols="12">
            <label class="label">Designation</label>
            <v-text-field
              class="input mt-2"
              variant="outlined"
              v-model="form.designation"
              :rules="[required]"
              placeholder="Enter Designation (e.g. Software Engineer)"
              clearable
            />
          </v-col>

          <!-- Monthly Salary -->
          <v-col cols="12">
            <label class="label">Monthly Salary</label>
            <v-text-field
              class="input mt-2"
              variant="outlined"
              v-model="form.monthly_salary"
              :rules="[required, positiveNumber]"
              placeholder="Enter Monthly Salary"
              type="number"
              prefix="$"
              clearable
            />
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
              {{ isEditMode ? 'Update Employee' : 'Save Employee' }}
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
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

  emits: ["closeForm", "saved"],

  data() {
    return {
      isFormValid: false,
      showloader: false,

      form: {
        id: null,
        name: "",
        email: "",
        phone: "",
        designation: "",
        monthly_salary: null,
      },
    };
  },

  computed: {
    isEditMode() {
      return !!this.employee;
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

    resetForm() {
      this.form = {
        id: null,
        name: "",
        email: "",
        phone: "",
        designation: "",
        monthly_salary: null,
      };
    },

    async saveEmployee() {
      if (!this.isFormValid) return;

      this.showloader = true;

      try {
        // TODO: Call your API here
        // Example:
        // if (this.isEditMode) {
        //   await employeeApi.update(this.form.id, this.form);
        // } else {
        //   await employeeApi.create(this.form);
        // }

        this.$emit("saved", { ...this.form });
        this.$emit("closeForm");
      } catch (error) {
        console.error("Error saving employee:", error);
        // You can show a snackbar or alert here
      } finally {
        this.showloader = false;
      }
    },
  },
};
</script>