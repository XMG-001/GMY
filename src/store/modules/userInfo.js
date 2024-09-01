import { defineStore } from "pinia";
import { getUserInfoFn, getUserRoleFn } from "@/api/modules/login";
import { ElMessage } from 'element-plus';
import router from '@/router';
import { CODE_SUCCESS } from '@/api/helper/codeStatus';
import { set } from "nprogress";
import { useRetryRequest } from "@/hooks/useRetryRequest";
import { watchEffect } from 'vue';

//最好用use开头
const useUserInfoStore = defineStore("userInfo", {
    //数据
    state: () => ({
        isLogged: false,
        token: '',
        userInfo: {},//注意!这里不能用null，因为是一个对象，不然会有白屏错误
        roles:[],
    }),
    //计算属性
    getters: {
    },
    //方法
    actions: {
        async resetAll() {
            this.$reset();
        },
        setIsLogged(val) {
            this.isLogged = val;
        },
        setToken(val) {
            this.token = val;
        },
        setUserInfo(val) {
            this.userInfo = val;
        },
        async fetchUserInfo() {
            try {
                const { res, error, loading } = await useRetryRequest(getUserInfoFn, {}, 3, 1000);
                const response = await getUserRoleFn()
                if (res.value.code === CODE_SUCCESS && response.code === CODE_SUCCESS) {
                    this.userInfo = res.value.data;
                    this.roles = response.data;
                    console.log("userInfo",this.userInfo,this.roles)
                    if (Object.keys(this.userInfo).length === 0 || this.roles.length === 0) {
                        ElMessage({
                            type: 'error',
                            message: '获取个人信息失败',
                        })
                        return false;
                    }
                } else {
                    return false;
                }
            } catch (err) {
                console.log(err);
                return false;
            }
            this.isLogged = true;
            return true; // 成功获取用户信息
        }
    },
    persist: {
        afterRestore: async (context) => {
            // context包含以下属性：
            // - key: 存储状态的键
            // - storage: 用于存储状态的存储对象（例如localStorage或sessionStorage）
            // - state: 从存储中检索到的状态
            // - store: Pinia store 实例

            // 你可以在这里修改即将恢复的状态
            const userInfoStore = context.store
            console.log('从本地获取:',userInfoStore.$state)
            if (userInfoStore.isLogged === true) {
                // 重新获取用户信息
                const success = await userInfoStore.fetchUserInfo();
                if (!success) {
                    console.log('test')
                    userInfoStore.resetAll();
                }
            }
            return userInfoStore.$state // 返回修改后的状态
        },
        key: 'gmy-userInfo', //存储名称
        // storage: sessionStorage, // 存储方式
        paths: ['isLogged', 'token', 'userInfo'], //指定 state 中哪些数据需要被持久化。[] 表示不持久化任何状态，undefined 或 null 表示持久化整个 state
    },


})

export default useUserInfoStore;