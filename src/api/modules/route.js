import request from "@/api/request"

export const getMyRouteFn = () => {
    return request({
        url: '/menu/getMyRoute',
        method: 'get',
    })
}