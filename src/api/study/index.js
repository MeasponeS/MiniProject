import request from '../../utils/request.js'

export function courses(params) {
    return request({
        closeLoading:true,
        url: '/pc/study/list/courses',
        method: 'get',
        data: params
    })
}
//详情
export function chapterContent(params) {
    return request({
        url: '/pc/study/list/chapterContent',
        method: 'get',
        data: params
    })
}

export function courseList(params) {
    return request({
        url: '/pc/study/list/courseList',
        method: 'get',
        data: params
    })
}

export function chapterList(params) {
    return request({
        closeIntercept:true,
        url: '/pc/study/list/chapterList',
        method: 'get',
        data: params,

    })
}


export function getCoursePlay(params) {
    return request({
        url: '/pc/study/list/getCoursePlay',
        method: 'get',
        data: params
    })
}

export function checkDistribute(params) {
    return request({
        closeLoading:true,
        url: '/pc/study/list/checkDistribute',
        method: 'get',
        data: params
    })
}
//打开学习卡
export function openStudyCard(params) {
    return request({
        url: '/pc/study/list/openStudyCard',
        method: 'get',
        data: params
    })
}
//获取亚专业的列表数据
export function subMajor(params) {
    return request({
        url: '/pc/study/list/subMajor',
        method: 'get',
        data: params,
        closeLoading:true
    })
}
//设置亚专业
export function submajor(params) {
    return request({
        url: '/pc/study/select/submajor',
        method: 'post',
        data: params,
        closeLoading:true
    })
}

export function reportRecord(params) {
    return request({
        closeLoading:true,
        url: '/pc/report/courseRecord',
        method: 'post',
        data: params
    })
}
export function report(params) {
    return request({
        closeLoading:true,
        url: '/pc/report/course',
        method: 'post',
        data: params
    })
}

export function getCourseHtml(params) {
    return request({
        url: '/pc/report/course',
        method: 'get',
        data: params
    })
}
//获取子章节列表
export function chapterChildList (params) {
     return request ({
         closeLoading:true,
         url:"/pc/study/list/chapterChildList",
         method:'get',
         data:params
     })
}
