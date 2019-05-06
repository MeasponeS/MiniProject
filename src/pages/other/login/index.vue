<template>
    <div class="container main">
        <NavBar title="" textType="#000" hasReturn="true" :hasReturnEvent="true" @clickReturnBtn="clickReturnBtn"></NavBar>
        <div class="content">
            <ul class="tab">
                <li @click="type='msg'"  :class="{active:type=='msg'}">短信登录</li>
                <li @click="type='password'" :class="{active:type=='password'}">账号登录</li>
            </ul>
            <div class="msgLogin" v-if="type=='msg'">
                <div class="msg">
                    <input type="number" class="tel" placeholder="手机号" v-model="msgInfo.phone">
                    <div class="get-msg" @click="getCode" :style="{color:countDown != initCountDown ?'#69707F':'#5285F9'}">
                        <div class="line"></div>
                        {{ countDown != initCountDown ? countDown+'s' : '获取验证码' }}
                    </div>
                </div>
                <input type="number" class="code" placeholder="验证码" v-model="msgInfo.msg">
            </div>
            <div class="msgLogin passwordLogin" v-else>
                <div class="msg">
                    <input type="number" class="tel" placeholder="手机号" v-model="passwordInfo.phone">
                </div>
                <input type="password" class="password" v-model="passwordInfo.password" placeholder="密码">
                <span><a href="/pages/other/resetPassword/main">找回密码</a></span>
            </div>
            <!--<van-button custom-class="main-bg" type="primary" @click="checkLogin" :block="true" size="large">登录</van-button>-->
            <button open-type="getUserInfo" lang="zh_CN" @getuserinfo="checkLogin" class="main-bg login-btn">登录</button>

            <div class="protocol">
                <protocol class="agreement" :value="protocolActive" @changeProtocol="protocolActive = !protocolActive"></protocol>
                <span class="goLogin" @click="goRegister">前往注册</span>
            </div>
        </div>
    </div>
</template>

<script>
    import {login,sendSMS} from "../../../api/other";
    import Config from '../../../config/index'
    import {setWechatUesrInfo,setUesrInfo,setToken,setOrgInfo,setOrgCode,setMsgCount} from '../../../utils/dataStorage'
    export default {
        data() {
            return {
                protocolActive:true,
                countDown:Config.countDown,
                initCountDown:Config.countDown,
                passwordInfo:{
                    phone:'',
                    password:'',
                },
                msgInfo:{
                    phone:'',
                    msg:'',
                },
                type:'msg',
            };
        },
        components: {
        },
        methods: {
            getCode(){
                if((this.msgInfo.phone).length != 11) {
                    wx.showToast({
                        title: '手机号格式错误',
                        icon: 'none',
                        duration: 1800,
                        mask:true
                    });
                    return;
                }
                if(this.countDown < 60) return;
                sendSMS({phone:this.msgInfo.phone,type:1}).then(r=>{
                    console.log(r);
                    let SMS = setInterval(() => {
                        if(this.countDown <= 0) {
                            clearInterval(SMS);
                            this.countDown = this.initCountDown;
                            return;
                        }
                        this.countDown --
                    }, 1000)
                }).catch(_=>{});
            },
            goRegister(){
                wx.navigateTo({ url:"/pages/other/register/main" });
            },
            checkLogin(e){
                let self = this;
                let wxUserInfo = self.lodashGet(e,'mp.detail.userInfo',false);

                if(!wxUserInfo){
                    wx.showToast({
                        title: "微信授权失败",
                        icon: 'none',
                        duration: 1800,
                        mask:true
                    });
                    return;
                }
                setWechatUesrInfo(wxUserInfo);

                if(!self.protocolActive){
                    wx.showToast({
                        title: '请阅读并接受《用户协议》',
                        icon: 'none',
                        duration: 1800,
                        mask:true
                    });
                    return;
                }

                let loginInfo = {
                    type: 0,
                    phone: "",
                    code: "",
                    password: "",
                    openId:''
                };

                if('password' == self.type){
                    let phone = self.passwordInfo.phone;
                    let password = self.passwordInfo.password;
                    if(phone.length != 11) {
                        wx.showToast({
                            title: '手机号格式错误',
                            icon: 'none',
                            duration: 1800,
                            mask:true
                        });
                        return;
                    }
                    if(password.length < 6){
                        wx.showToast({
                            title: `密码长度必须不少于6位`,
                            icon: 'none',
                            duration: 1800,
                            mask:true
                        });
                        return
                    }

                    loginInfo.type = 1;
                    loginInfo.phone = phone;
                    loginInfo.password = password;

                }
                if('msg' == self.type){
                    let phone = self.msgInfo.phone;
                    let msg = self.msgInfo.msg;
                    if(phone.length != 11){
                        wx.showToast({
                            title: '请填写正确的手机号',
                            icon: 'none',
                            duration: 1800,
                            mask:true
                        });
                        return;
                    }
                    if(!msg){
                        wx.showToast({
                            title: '请填写验证码',
                            icon: 'none',
                            duration: 1800,
                            mask:true
                        });
                        return;
                    }

                    loginInfo.type = 0;
                    loginInfo.phone = phone;
                    loginInfo.msg = msg;

                }

                //微信相关，获取微信code和微信info
                wx.login({
                    success(res) {
                        if (res.code) {
                            loginInfo.openId = res.code;
                            self.handleLogin(loginInfo);
                        } else {
                            wx.showToast({
                                title: res.errMsg,
                                icon: 'none',
                                duration: 1800,
                                mask:true
                            });
                        }
                    }
                })
            },
            handleLogin(loginInfo){
                login({
                    type:loginInfo.type,
                    phone:loginInfo.phone,
                    code:loginInfo.msg,
                    password:loginInfo.password,
                    openId:loginInfo.openId,//传微信code
                }).then(r=>{
                    console.log(r)
                    //重要。这里必须重新设置机构信息
                    setUesrInfo(r.userInfo);
                    setToken(r.token);
                    setOrgInfo(r.orgInfo);
                    setOrgCode(r.orgInfo.code);
                    setMsgCount(r.msgUnReadCount);
                    wx.showToast({
                        title: '登陆成功',
                        icon: 'none',
                        duration: 1800,
                        mask:true
                    });
                    wx.switchTab({ url: '/pages/index/main' })
                }).catch(_=>{})
            },
            clickReturnBtn(){
                wx.switchTab({ url: '/pages/index/main' })
            }
        },
        mounted() {
            //调用应用实例的方法获取全局数据
            //this.getUserInfo()
        }
    };
</script>

<style>
    .login-btn{
        color: #fff;
        border-radius: 5rpx;
    }
</style>
