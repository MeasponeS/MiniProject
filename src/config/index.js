//const devApiUrl = 'https://wx20.hulian120.com';
//志峰 const devApiUrl = 'http://192.168.48.133:10086';
//正式环境变量,注意修改
// const proApiUrl = 'https://raxtapi.hulian120.com';
const devApiUrl = 'http://192.168.49.64:10086';
const proApiUrl = 'https://wx20.hulian120.com';

const nodeDevEnv = process.env.NODE_ENV == 'development' ? true : false;

export default {
    nodeDevEnv:nodeDevEnv,
    apiUrl : nodeDevEnv ? devApiUrl : proApiUrl,
    apiPrefix : "",
    timeout:5000,
    expires:7,
    countDown:60,
    shortLength:8,
    tokenKey:'ACCESS_TOKEN',
    wechatUesrKey:'WECHAT_USER_INFO',
    userInfoKey:'USER_INFO',
    orgCodeKey:'ORG_CODE',//扫码的code
    orgInfoKey:'ORG_INFO',
    msgCountKey:'MSG_COUNT'
}
