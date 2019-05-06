import request from '../../utils/request.js'

export function getOrgCodeByDomain(params) {
    return request({
        url: '/pc/getOrgCodeByDomain',
        method: 'get',
        data: params
    })
}

// 获取用户收藏页列表
export function getUserFavorList(params) {
    return request({
        url: '/pc/user/getUserFavorList',
        method: 'get',
        data: params,
        closeLoading:true,
    })
}
export function userfavor(params) {
    //
    // "type":"1", 0课程 1 习题
    // "courseId":"481",
    // "leveId":"18331",
    // "isVedio":"3",  0视频课程  1非视频
    // "chapterQuestionId":"37509", 章节或课程id
    // "packageId":"127",

    return request({
        url: '/pc/user/userfavor',
        method: 'post',
        data: params
    })
}

export function getAdvertising(params) {
    return request({
        url: '/pc/getAdvertising',
        method: 'get',
        data: params
    })
}

export function clickAdvertising(params) {
    return request({
        url: '/pc/report/clickAdvertising',
        method: 'get',
        data: params
    })
}
