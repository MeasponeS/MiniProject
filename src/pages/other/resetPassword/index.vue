<template>
    <div class="container main">
        <NavBar title="" textType="#000" hasReturn="true"></NavBar>
        <div class="content">
            <p class="register">找回密码</p>
            <div class="msg">
                <input type="number" class="tel" placeholder="手机号" v-model="msgInfo.phone">
                <div class="get-msg" @click="getCode" :style="{color:countDown != initCountDown ?'#69707F':'#5285F9'}">
                    <div class="line"></div>
                    {{ countDown != initCountDown ? countDown+'s' : '获取验证码' }}
                </div>
            </div>
            <input type="number" class="code" placeholder="验证码" v-model="msgInfo.msg">
            <input type="password" class="password" placeholder="设置密码不少于8位" v-model="msgInfo.password" style="margin-bottom: 48rpx;">
            <van-button custom-class="main-bg" type="primary" :block="true" size="large" @click="checkData">保存密码</van-button>
            <div class="protocol">
                <protocol class="agreement" :value="protocolActive" @changeProtocol="protocolActive = !protocolActive"></protocol>
            </div>
        </div>
    </div>
</template>

<script>
    import {forgotPassword,sendSMS} from "../../../api/other";
    import Config from '../../../config/index'
    export default {
        data() {
            return {
                protocolActive:true,
                countDown:Config.countDown,
                initCountDown:Config.countDown,
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
            getCode(){
                if((this.msgInfo.phone).length != 11) {
                    wx.showToast({
                        title: '手机号格式错误',
                        icon: 'loading',
                        duration: 1800,
                        mask:true
                    });
                    return;
                }
                if(this.countDown < 60) return;
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
            checkData(){
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
                this.handleData(phone,msg,password)
            },
            handleData(phone,code,password){
                forgotPassword({phone:phone,code:code,password:password}).then(r=>{
                    wx.showToast({
                        title: '密码设置成功',
                        icon: 'none',
                        duration: 1800,
                        mask:true
                    });
                    setTimeout(_=>{
                        wx.navigateTo({ url:"/pages/other/login/main" });
                    },1000)
                }).catch(_=>{})
            }
        },
        mounted() {
            // 调用应用实例的方法获取全局数据
            //this.getUserInfo()


        }
    };
</script>

<style scoped >

</style>
