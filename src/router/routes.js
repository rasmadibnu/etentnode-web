const requireAuth = (to, from, next) => {
  var token =
    sessionStorage.getItem("access_token") == null
      ? null
      : JSON.parse(atob(sessionStorage.getItem("access_token").split(".")[1]));
  if (token === null) {
    next("/login");
  }
  next();
};

const routes = [
  {
    path: "/",
    beforeEnter: requireAuth,
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/event",
        component: () => import("pages/Event.vue"),
        name: "Event",
      },

      {
        path: "/event/:id",
        component: () => import("pages/EventDetail.vue"),
        name: "EventDetail",
      },

      {
        path: "/hotline",
        component: () => import("pages/Hotline.vue"),
        name: "Hotline",
      },

      {
        path: "/role",
        component: () => import("pages/Master/Role.vue"),
        name: "Role",
      },
      {
        path: "/status",
        component: () => import("pages/Master/Status.vue"),
        name: "Status",
      },
      {
        path: "/event-categories",
        component: () => import("pages/Master/EventCategory.vue"),
        name: "EventCategory",
      },
      {
        path: "/event-categories/:id/type",
        component: () => import("pages/Master/EventCategoryType.vue"),
        name: "EventCategoryType",
      },
      {
        path: "/user",
        component: () => import("pages/Master/User.vue"),
        name: "User",
      },
    ],
  },

  {
    path: "/login",
    component: () => import("pages/Login.vue"),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
