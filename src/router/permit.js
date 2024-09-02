import router from ".";
import useUserInfoStore from "../store/modules/userInfo";
import useSettingStore from "../store/modules/setting";
import useMenuInfoStore from "../store/modules/menuInfo";
import NProgress from "nprogress";
import {
  useRoute,
  NavigationFailureType,
  isNavigationFailure,
} from "vue-router";
import { ElMessage } from "element-plus";
import { initDynamicRouter } from "@/router/modules/handleRouter";

NProgress.configure({
  showSpinner: false, // 是否显示加载ico
  // easing: 'ease',  // 动画方式
  // speed: 1000,  // 递增进度条的速度
  // trickleSpeed: 100, // 自动递增间隔
  // minimum: 0.3 // 初始化时的最小百分比
});

let load = 0;
router.beforeEach(async (to, from, next) => {
  NProgress.start();
  load++;
  console.log("load", load);
  const userInfoStore = useUserInfoStore();
  const menuInfoStore = useMenuInfoStore();

  // await againRouter()
  if (userInfoStore.isLogged !== true && to.name !== "Login") {
    // 这里可以处理 fetchUserInfo 失败的情况，例如重定向到登录页或显示错误消息
    console.log("守卫1");
    next({ name: "Login" });
    return; // 确保在发生错误时不继续导航
  }
  if (userInfoStore.isLogged !== true && to.name === "Login") {
    console.log("守卫2");
    return next();
  }
  if (userInfoStore.isLogged === true && to.name === "Login") {
    console.log("守卫3");
    return next({ path: from.path || "/home" });
  }
  if (userInfoStore.isLogged === true && to.name !== "Login") {
    if (load === 1) {
      console.log("守卫4");
      await initDynamicRouter();
      await menuInfoStore.fetchMenuList();
      return next({ ...to, replace: true });
    }
    return next();
  }
  next(); // 确保在所有异步操作完成后调用 next()
});

router.afterEach((to, from, failure) => {
  const settingStore = useSettingStore();
  settingStore.setCurrentPath(to);
  // const route = useRoute();
  // const matched = route.matched;
  // console.log("守卫after", matched);
  NProgress.done();
  if (failure) {
    console.log("路由跳转失败", failure);
    // sendToAnalytics(to, from, failure)
  }
});

router.onError((error) => {
  console.error("路由错误:", error);
  // 在这里处理路由错误
});
