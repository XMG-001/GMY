import request from "@/api/request"
import md5 from 'md5'
import cloneDeep from "lodash/cloneDeep";

export const getUserByPageFn = (params) => {
    return request({
        url: '/user/list',
        method: 'post',
        data: params
    })
}

export const deleteUserByIdFn = (data) => {
    return request({
        url: '/user/remove',
        method: 'delete',
        data
    })
}

export const resetPwdByIdFn = (data) => {
    if(data.newPwd){
        data = cloneDeep(data);
        data.newPwd = md5(data.newPwd);
    }
    return request({
        url: '/user/resetPwd',
        method: 'put',
        data
    })
}
