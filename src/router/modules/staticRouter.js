import { HOME_URL } from "@/config";

export const NOT_FOUND_ROUTE = {
  name: "NotFound",
  path: "/:pathMatch(.*)*",
  component: () => import("@/views/404.vue"),
//   hidden: true,
};

export const LOCAL_ROUTES = {
  path: HOME_URL,
  component: () => import("@/views/Home.vue"),
  children: [
    {
      name: "Home",
      path: "",
      component: () => import("@/components/Bg.vue"),
      meta: {
        title: "",
        icon: "",
        isLink: "",
        isHide: false,
        isFull: false,
        isKeepAlive: true,
      },
    },
    {
      // 当 /user/:id/profile 匹配成功
      // UserProfile 将被渲染到 User 的 <router-view> 内部
      name: "user-table",
      path: "userTable",
      component: () => import("@/components/UserTable.vue"),
      meta: {
        title: "",
        icon: "",
        isLink: "",
        isHide: false,
        isFull: false,
        isKeepAlive: true,
      },
    },
    {
      name: "role-table",
      path: "roleTable",
      component: () => import("@/components/RoleTable.vue"),
      meta: {
        title: "",
        icon: "",
        isLink: "",
        isHide: false,
        isFull: false,
        isKeepAlive: true,
      },
    },
    {
      name: "menu-table",
      path: "menuTable",
      component: () => import("@/components/MenuTable.vue"),
      meta: {
        title: "",
        icon: "",
        isLink: "",
        isHide: false,
        isFull: false,
        isKeepAlive: true,
      },
    },
    {
      name: "home-404",
      path: "test/:testId",
      component: () => import("@/views/404.vue"),
      meta: {
        title: "",
        icon: "",
        isLink: "",
        isHide: false,
        isFull: false,
        isKeepAlive: true,
      },
    },
    {
      name: "Test",
      path: "testall",
      component: () => import("@/components/Test.vue"),
      meta: {
        title: "",
        icon: "",
        isLink: "",
        isHide: false,
        isFull: false,
        isKeepAlive: true,
      },
    },
    {
      name: "ImgMgt",
      path: "imgmgt",
      component: () => import("@/components/ImgMgt.vue"),
      meta: {
        title: "",
        icon: "",
        isLink: "",
        isHide: false,
        isFull: false,
        isKeepAlive: true,
      },
    },
    {
      name: "RichText",
      path: "richText",
      component: () => import("@/components/RichText/index.vue"),
      meta: {
        title: "",
        icon: "",
        isLink: "",
        isHide: false,
        isFull: false,
        isKeepAlive: true,
      },
    },
  ],
};
