import useMenuInfoStore from "@/store/modules/menuInfo";
import useUserInfoStore from "@/store/modules/userInfo";
import router from "..";
import { LOGIN_URL, HOME_URL } from "@/config";
import { LOCAL_ROUTES, NOT_FOUND_ROUTE } from "./staticRouter";
import { el } from "element-plus/es/locale/index.mjs";

// 引入 views 文件夹下所有 vue 文件
const modules = import.meta.glob("@/views/**/*.vue");

/**
 * @description 初始化动态路由
 */
export const initDynamicRouter = async () => {
  const menuInfoStore = useMenuInfoStore();
  const userInfoStore = useUserInfoStore();

  try {
    // 1.获取菜单列表 && 按钮权限列表
    const ok = await menuInfoStore.fetchRouteList();

    // 2.判断当前用户有没有菜单权限
    if (!ok) {
      userInfoStore.resetAll();
      router.replace(LOGIN_URL);
      return Promise.reject("No permission");
    }

    // 3.添加动态路由

    let activeRoutes = LOCAL_ROUTES;
    let activeRoutesChildren = [];
    let activeRouteList = [...menuInfoStore.routeList]; // 复制一份菜单数据，避免直接操作原数据

    // 帮助函数：替换路径中的动态参数
    function normalizePath(path) {
      return path.includes("/:") ? path.replace(/\/:[^\/]+/g, "/") : path;
    }

    // 处理路由和菜单项
    activeRoutes.children.forEach((routeItem) => {
      let fullPath;
      if (routeItem.path) {
        fullPath = `${activeRoutes.path}/${routeItem.path}`;
      } else {
        fullPath = `${activeRoutes.path}`;
      }
      let normalizedPath = normalizePath(fullPath);

      for (let i = 0; i < activeRouteList.length; i++) {
        let menuPath = activeRouteList[i].path;
        let isMatch =
          normalizedPath === normalizePath(menuPath) ||
          menuPath.includes(normalizedPath);
        // console.log(
        //   normalizedPath,
        //   activeRouteList[i].id,
        //   activeRouteList[i].path,
        //   isMatch
        // );

        if (isMatch) {
          // 处理匹配的路由项
          if (fullPath.includes("/:")) {
            routeItem.meta.title = routeItem.name || "";
            routeItem.meta.icon = "Menu" || "";
          } else {
            routeItem.meta.title = activeRouteList[i].menuName || "";
            routeItem.meta.icon = activeRouteList[i].icon || "";
          }
          activeRoutesChildren.push(routeItem);
          // 从 activeRouteList 中移除匹配项
          activeRouteList.splice(i, 1);
          break; // 跳出循环处理下一个路由项
        }
      }
    });

    // 将 activeRoutesChildren 加入到 activeRoutes 中
    activeRoutes.children = activeRoutesChildren;
    menuInfoStore.setActiveRoutes(activeRoutes);
    console.log([NOT_FOUND_ROUTE, activeRoutes]);
    //将404和动态路由存进
    router.addRoute(activeRoutes);
    router.addRoute(NOT_FOUND_ROUTE);
  } catch (error) {
    // 当按钮 || 菜单请求出错时，重定向到登陆页
    userInfoStore.resetAll();
    router.replace(LOGIN_URL);
    return Promise.reject(error);
  }
};
