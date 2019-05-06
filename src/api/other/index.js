import request from '../../utils/request.js'

export function register(params) {
    return request({
        url: '/pc/user/register',
        method: 'post',
        data: params
    })
}

export function login(params) {
    return request({
        url: '/pc/wechat/user/login',
        method: 'post',
        data: params
    })
}

export function sendSMS(params) {
    return request({
        url: '/pc/sendsms',
        method: 'get',
        data: params
    })
}

export function forgotPassword(params) {
    return request({
        url: '/pc/user/forgotPassword',
        method: 'post',
        data: params
    })
}
export function authCourse(params) { //判断课程权限
    return request({
        closeLoading:true,
        url: '/pc/authCourse',
        method: 'get',
        data: params
    })
}
