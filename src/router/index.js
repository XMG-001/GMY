import { createRouter, createWebHistory } from "vue-router";
import { LOGIN_URL, HOME_URL } from "@/config";
import { initDynamicRouter} from '@/router/modules/handleRouter'


// 创建vue-router实例
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: "Login",
      component: () => import("@/views/Login.vue"),
      path: LOGIN_URL,
    },
    {
      name: "Gmy",
      path: "/",
      redirect: HOME_URL,
    },
    // {
    //   name: "404",
    //   path: '/:pathMatch(.*)*',
    //   component: () => import('@/views/404.vue'),
    //   hidden:true
    // },
    // {
    //   name: "NotFound",
    //   path: "/:pathMatch(.*)*",
    //   redirect: "/404",
    //   hidden:true
    // },
    // 动态路由将在应用启动后添加
  ],
});



export default router;
