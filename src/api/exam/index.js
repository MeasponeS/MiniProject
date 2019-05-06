import request from '../../utils/request.js'

export function getRoomListByType(params) {
    return request({
        closeLoading:true,
        url: '/pc/evaluation/getRoomListByType',
        method: 'get',
        data: params,
    })
}

export function getExam(params) {
    return request({
        url: '/pc/evaluation/getExam',
        method: 'get',
        data: params
    })
}

export function getEvaluationList(params) {
    return request({
        url: '/pc/evaluation/getEvaluationList',
        method: 'get',
        data: params
    })
}
export function commitEvaluationAnswer(params) {
    return request({
        url: '/pc/evaluation/commitEvaluationAnswer',
        method: 'post',
        data: params
    })
}
