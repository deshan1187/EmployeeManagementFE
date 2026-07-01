import { createRouter, createWebHistory } from "vue-router";

const routes = [
  // common layout
  {
    path: "/",
    name: "default",
    component: () => import("@/views/default.vue"),

  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router
