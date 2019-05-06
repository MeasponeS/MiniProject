import request from '../../utils/request.js'

export function getUserInfo(params) {
    return request({
        url: '/pc/user/getUserInfo',
        method: 'get',
        data: params
    })
}
export function getUserStudyInfo(params) {
    return request({
        closeLoading:true,
        url: '/pc/user/getUserStudyInfo',
        method: 'get',
        data: params
    })
}

export function getDictionaryList(params) {
    return request({
        url: '/pc/getDictionaryList',
        method: 'get',
        data: params
    })
}
export function updateUserInfo(params) {
    return request({
        url: '/pc/user/updateUserInfo',
        method: 'post',
        data: params
    })
}

export function getNotices(params) {
    return request({
        url: 'pc/user/getNotices',
        method: 'get',
        data: params
    })
}

export function readMag(params) {
    return request({
        url: '/pc/report/notice',
        method: 'get',
        data: params
    })
}
export function getNoticesById(params) {
    return request({
        url: '/pc/user/getNoticesById',
        method: 'post',
        data: params
    })
}

export function logOutApi(params) {
    return request({
        url: '/pc/wechat/user/logOut',
        method: 'get',
        data: params
    })
}

