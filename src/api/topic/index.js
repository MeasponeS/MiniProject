import request from '../../utils/request.js'


export function getTopicList(params) {
    return request({
        closeLoading:true,
        url: '/pc/exercise/getList',
        method: 'get',
        data: params
    })
}
export function getLevelList(params) {
    return request({
        url: '/pc/exercise/getLevelList',
        method: 'get',
        data: params
    })
}
export function getLevelDetail(params) {
    return request({
        url: '/pc/exercise/getLevelDetail',
        method: 'get',
        data: params
    })
}

export function commitQuestionAnswer(params) {
    return request({
        url: '/pc/exercise/commitQuestionAnswer',
        method: 'post',
        data: params
    })
}

export function getMyWrongQuestion(params) {
    return request({
        url: '/pc/exercise/getMyWrongQuestion',
        method: 'get',
        data: params
    })
}
export function wrongQuestionLearnd(params) {//学会和未学会
    return request({
        url: '/pc/exercise/MyWrongQuestionLearnd',
        method: 'get',
        data: params
    })
}

export function getCourseStaticInfo(params) {
    return request({
        url: 'pc/exercise/getCourseStaticInfo',
        method: 'get',
        data: params
    })
}

export function getQuestionDetail(params) {
    return request({
        url: '/pc/exercise/getMyWrongQuestionDetail',
        method: 'get',
        data: params
    })
}
