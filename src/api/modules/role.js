import request from "@/api/request"

export const getAllRoleFn = (params) => {
    return request({
        url: '/role/getAllList',
        method: 'get'
    })
}

export const getAllRoleMenuByPageFn = (params) => {
    return request({
        url: '/role/list',
        method: 'post',
        data: params
    })
}

export const saveOrUpdateRoleFn = (data) => {
    return request({
        url: '/role/saveOrUpdate',
        method: 'post',
        data
    })
}

export const deleteRoleByIdFn = (data) => {
    return request({
        url: '/role/remove',
        method: 'delete',
        data
    })
}
