<template>
    <div class="container main">
        <NavBar title="" textType="#000" hasReturn="true"></NavBar>
        <div class="content">
            <p class="register">注册</p>
            <div class="msg">
                <input type="number" class="tel" placeholder="手机号" v-model="msgInfo.phone">
                <div class="get-msg" @click="getCode" :style="{color:countDown != initCountDown ?'#69707F':'#5285F9'}">
                    <div class="line"></div>
                    {{ countDown != initCountDown ? countDown+'s' : '获取验证码' }}
                </div>
            </div>
            <input type="number" class="code" placeholder="验证码" v-model="msgInfo.msg">
            <input type="password" class="password" v-model="msgInfo.password" placeholder='设置密码不少于8位' style="margin-bottom: 50rpx;">
            <!-- main-bg -->
            <van-button custom-class="main-bg" type="primary" :block="true" size="large" @click="checkRegister">注册</van-button>
            <div class="protocol">
                <protocol class="agreement" :value="protocolActive" @changeProtocol="protocolActive = !protocolActive"></protocol>
                <span class="goLogin" @click="goLogin">前往登录</span>
            </div>
        </div>
    </div>
</template>

<script>
    import {register,sendSMS} from "../../../api/other";
    import Config from '../../../config/index'
    export default {
        data() {
            return {
                countDown:Config.countDown,
                initCountDown:Config.countDown,
                protocolActive:true,
                msgInfo:{
                    phone:'',
                    msg:'',
                    password:''
                },
            };
        },

        components: {

        },
        methods: {
            goLogin(){
                wx.navigateTo({ url:"/pages/other/login/main" });
            },
            getCode(){
                if(this.countDown < 60) return;
                if((this.msgInfo.phone).length != 11) {
                    wx.showToast({
                        title: '手机号格式错误',
                        icon: 'none',
                        duration: 1800,
                        mask:true
                    });
                    return;
                }
                sendSMS({phone:this.msgInfo.phone,type:1}).then(r=>{

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
            checkRegister(){

                let phone = this.msgInfo.phone;
                let msg = this.msgInfo.msg;
                let password = this.msgInfo.password;
                if(!this.protocolActive){
                    wx.showToast({
                        title: '请阅读并接受《用户协议》',
                        icon: 'none',
                        duration: 1800,
                        mask:true
                    });
                    return;
                }
                if(phone.length != 11) {
                    wx.showToast({
                        title: '手机号格式错误',
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
                if(password.length < Config.shortLength){
                    wx.showToast({
                        title: `密码长度必须不少于${Config.shortLength}位`,
                        icon: 'none',
                        duration: 1800,
                        mask:true
                    });
                    return
                }
                this.handleRegister(phone,msg,password)
            },
            handleRegister(phone,code,password){
                wx.login({
                    success(res) {
                        if (res.code) {
                            register({
                                phone:phone,
                                code:code,
                                type:1,
                                password:password,
                                openId:res.code
                            }).then(r=>{
                                wx.showToast({
                                    title: '注册成功',
                                    icon: 'none',
                                    duration: 1800,
                                    mask:true
                                });
                                setTimeout(_=>{
                                    wx.navigateTo({ url:"/pages/other/login/main" });
                                },600)
                            }).catch(_=>{})
                        } else {
                            wx.showToast({
                                title: res.errMsg,
                                icon: 'none',
                                duration: 1800,
                                mask:true
                            });
                        }
                    }
                });

            }
        },
        mounted() {

        }
    };
</script>

<style>

</style>
