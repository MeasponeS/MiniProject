import Config from "../config/index.js";
import {removeToken,getToken,getOrgCode} from './dataStorage.js'


const apiPrefix = Config.apiPrefix ? ("/" + Config.apiPrefix ) : "";
// url, method, data, closeLoading , closeIntercept
export default function(params) {
    if (!params.hasOwnProperty('closeLoading') || !params.closeLoading) {
        wx.showLoading({
            title: "加载中",
            mask:true
        });
    }

    let newUrl = Config.apiUrl + apiPrefix + params.url;
    let noParameters = newUrl.indexOf('?')  == -1;

    newUrl +=  (noParameters ? '?' : '&') + 'access_token='+getToken()+'&orgCode='+getOrgCode()+'&sourceType=wx' ;

    return new Promise((resolve, reject) => {
        wx.request({
            url: newUrl,
            method: params.method,
            data: params.data,
            header: {
                "content-type": "application/json"// 默认值
            },
            success: function(res) {

                if (!params.hasOwnProperty('closeLoading') || !params.closeLoading) {
                    wx.hideLoading();
                }
                if(params.hasOwnProperty('closeIntercept') && params.closeIntercept){
                    resolve(res.data)
                    return
                    // return res.data
                }
                if (res.statusCode !== 200) {
                    setTimeout(_=>{
                        wx.showModal({
                            title: '提示',
                            content: "请求未响应！",
                            showCancel: false,
                            confirmColor: '#6886fb',
                            success() {}
                        })
                    },300)
                }else {

                    let successData = res.data;

                    if(successData.resultCode != 200){
                        wx.showModal({
                            title: '提示',
                            content: successData.message,
                            showCancel: false,
                            confirmColor: '#6886fb',
                            success() {
                                if(successData.resultCode == 402){
                                    removeToken();
                                    wx.navigateTo({ url:"/pages/other/login/main" });
                                }else {
                                    reject(successData);
                                }
                            }
                        })

                    }else {
                        resolve(successData.data);
                    }
                }

            },
            fail: function(error) {

                setTimeout(_=>{
                    if (!params.hasOwnProperty('closeLoading') || !params.closeLoading) {
                        wx.hideLoading();
                    }
                    wx.showToast({
                        icon: 'none',
                        title: '当前网络不稳定，请尝试切换网络后重试~',
                        duration: 2500
                    });
                },300)
                //reject(error);
            },
            complete: function() {
                // if (!params.hasOwnProperty('closeLoading') || !params.closeLoading) {
                //     wx.hideLoading();
                // }
            }
        });
    });
}
