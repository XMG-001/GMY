import request from "@/api/request"
import md5 from 'md5'
import cloneDeep from "lodash/cloneDeep";

export const loginFn = (data) => {
    if(data.password){
        data = cloneDeep(data);
        data.password = md5(data.password);
    }
    return request({
        url: '/user/login',
        method: 'post',
        data
    })
}

export const registerFn = (data) => {
    if(data.password){
        data = cloneDeep(data);
        data.password = md5(data.password);
    }
    return request({
        url: '/user/register',
        method: 'post',
        data
    })
}

export const logoutFn = () => {
    return request({
        url: '/user/logout',
        method: 'post',
    })
}

export const getUserInfoFn = () => {
    return request({
        url: '/user/userInfo',
        method: 'get'
    })
}

export const getUserRoleFn = () => {
    return request({
        url: '/user/userRole',
        method: 'get'
    })
}