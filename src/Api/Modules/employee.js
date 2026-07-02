import { api } from "../index";

export default {
  //calculate salary
  async getCalculate(payload) {
    return await api.post("/employee/calculate", payload);
  },
  //store employee details
  async create(payload) {
    return api.post("/employee/store", payload);
  },
  //get all employees
  async getAll() {
    return api.get("/employee/getall");
  },
  //update employee details
  async update(payload) {
    return api.put(`/employee/update`, payload);
  },
  //search employee using phone
  async search(phone) {
    return api.get(`/employee/search`, {
      params: { phone },
    });
  },
  //delete employee
  async delete(id) {
    return api.delete(`/employee/delete`, {
      params: { id },
    });
  },
};
