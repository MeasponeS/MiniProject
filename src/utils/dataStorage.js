
import Config from '../config/index'


export function setWechatUesrInfo(val) {
    wx.setStorageSync(Config.wechatUesrKey,val);
}

export function getWechatUesrInfo() {
    return wx.getStorageSync(Config.wechatUesrKey);
}

export function setUesrInfo(val) {
    wx.setStorageSync(Config.userInfoKey,val);
}

export function getUesrInfo() {
    return wx.getStorageSync(Config.userInfoKey);
}

export function setOrgCode(val) {
    wx.setStorageSync(Config.orgCodeKey,val);
}
export function getOrgCode() {
    return wx.getStorageSync(Config.orgCodeKey);
}
export function removeOrgCode() {
    wx.removeStorageSync(Config.orgCodeKey);
}


export function setMsgCount(val) {
    wx.setStorageSync(Config.msgCountKey,val);
}
export function getMsgCount() {
    return wx.getStorageSync(Config.msgCountKey);
}
export function decrMsg() {
    let count = wx.getStorageSync(Config.msgCountKey);
    if(count <= 0){
        wx.setStorageSync(Config.msgCountKey,0);
        return 0;
    }
    count --;
    wx.setStorageSync(Config.msgCountKey,count);
    return count;
}


export function setOrgInfo(val) {
    wx.setStorageSync(Config.orgInfoKey,val);
}
export function getOrgInfo() {
    return wx.getStorageSync(Config.orgInfoKey);
}


export function setToken(token) {

    return wx.setStorageSync(Config.tokenKey,token);
}
export function getToken() {
    return wx.getStorageSync(Config.tokenKey);
}

export function removeToken() {
    wx.removeStorageSync(Config.tokenKey);
}


export function isLogin() {
    let token =  wx.getStorageSync(Config.tokenKey);
    return token.length > 5
}


