<template>
  <Table />
</template>

<script>

import Table from "@/components/Table.vue";

export default {
  components: {
    Table,
  },

  data() {
    return {
      showForm: false,
    };
  },

  methods: {
    openCreateForm() {
      this.showForm = true;
    },
    closeAddForm() {
      this.showForm = false;
      this.$refs.submissionTable.getSubmissions();
    },
  },
};
</script>