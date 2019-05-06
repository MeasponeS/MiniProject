
import request from '../../utils/request.js'

export function automaticLogin(params) {
    return request({
        url: '/pc/user/automaticLogin',
        method: 'post',
        data: params
    })
}
