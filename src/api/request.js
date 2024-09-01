import axios from "axios";
import { configProviderContextKey } from "element-plus";
import {
  changeGlobalNodesTarget,
  ensureOnlyChild,
} from "element-plus/es/utils/index.mjs";
import router from "@/router";
import useUserInfoStore from "@/store/modules/userInfo";
import { checkStatus } from "@/api/helper/checkStatus";
import { ElMessage } from "element-plus";
import { CODE_AUTH_ERROR } from "@/api/helper/codeStatus";
import { API_URL, LOGIN_URL, HOME_URL } from "@/config";

const request = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 30000,
});

//request拦截器
//可以自请求发送前对请求做一些处理
//比如统一加token，对请求参数统一加密
request.interceptors.request.use(
  (config) => {
    config.headers["Content-Type"] = "application/json;charset=utf-8";
    // let token = localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null;
    const userInfoStore = useUserInfoStore(); //非setup要写在函数里
    let token = userInfoStore.token || null;
    console.log("请求拦截");
    config.headers["token"] = token; //设置请求头
    return config;
  },
  (error) => {
    console.error("request error: " + error); //for debug
    return Promise.reject(error);
  }
);

//response拦截器
//可以在接口响应后统一处理结果
request.interceptors.response.use(
  (response) => {
    let res = response.data;

    //兼容服务端返回的字符串数据
    if (typeof res === "string") {
      res = res ? JSON.parse(res) : res;
    }
    if (res.code === CODE_AUTH_ERROR) {
      console.log("拦截器", res);
      const userInfoStore = useUserInfoStore(); //先清空token，避免路由守卫禁止跳转
      userInfoStore.resetAll();
      router.replace(LOGIN_URL); //后期肯定要改
    }
    return res;
  },
  async (error) => {
    const { response } = error;
    // tryHideFullScreenLoading();
    // 请求超时 && 网络错误单独判断，没有 response
    if (error.message.indexOf("timeout") !== -1)
      ElMessage.error("请求超时！请您稍后重试");
    if (error.message.indexOf("Network Error") !== -1)
      ElMessage.error("网络错误！请您稍后重试");
    // 根据服务器响应的错误状态码，做不同的处理
    if (response) checkStatus(response.status);
    // 服务器结果都没有返回(可能服务器错误可能客户端断网)，断网处理:可以跳转到断网页面
    if (!window.navigator.onLine) {
      const userInfoStore = useUserInfoStore();
      userInfoStore.resetAll();
      router.replace(LOGIN_URL);
    }
    return Promise.reject(error);
  }
);

export default request;
