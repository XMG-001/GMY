import { defineStore } from "pinia";

//最好用use开头
const usePagingInfoStore = defineStore("pagingInfo", {
    //数据
    state: () => ({
        total: 0,
        currentPage: 1,
        pageSize: 10
    }),
    //计算属性
    getters: {
    },
    //方法
    actions: {
        setTotal(val) {
            this.total = val;
        },
        setData(val1, val2) {
            this.currentPage = val1;
            this.pageSize = val2;
        }
    }


})

export default usePagingInfoStore;