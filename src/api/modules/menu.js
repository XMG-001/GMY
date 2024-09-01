import request from "@/api/request"

export const getAllMenuByPageFn = (params) => {
    return request({
        url: '/menu/list',
        method: 'post',
        data: params
    })
}

export const getAllMenuFn = () => {
    return request({
        url: '/menu/getAllMenu',
        method: 'get',
    })
}

export const getMyMenuFn = () => {
    return request({
        url: '/menu/getMyMenu',
        method: 'get',
    })
}

export const deleteMenuByIdFn = (data) => {
    return request({
        url: '/menu/remove',
        method: 'delete',
        data
    })
}