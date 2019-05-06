<template>
    <div class="container main">
        <NavBar title="修改密码" hasReturn="true"></NavBar>
        <div style="padding: 20rpx">
            <div class="content">
                <div class="msg">
                    <input type="number" placeholder-class='placeholder' class="tel" placeholder="手机号" v-model="msgInfo.phone">
                    <div class="get-msg" @click="getCode" :style="{color:countDown != initCountDown ?'#69707F':'#5285F9'}">
                        <div class="line"></div>
                        {{ countDown != initCountDown ? countDown+'s' : '获取验证码' }}
                    </div>
                </div>
                <input placeholder-class='placeholder' type="number" class="code" placeholder="验证码" v-model="msgInfo.msg">
                <input placeholder-class='placeholder' type="password" class="password" placeholder="设置密码">
            </div>
            <van-button custom-class="main-bg" type="primary" :block="true" size="large" @click="checkPassword">保存密码</van-button>
        </div>
    </div>
</template>

<script>
    import Config from '../../../config/index'
    import {sendSMS,forgotPassword} from '../../../api/other/index'
    import {removeToken} from '../../../utils/dataStorage'
    export default {
        data() {
            return {
                countDown:60,
                initCountDown:60,
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
                if(this.countDown < 60) return;
                if((this.msgInfo.phone).length != 11) {
                    wx.showToast({
                        title: '手机号格式错误',
                        icon: 'none',
                        duration: 1800,
                        mask:true
                    })
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
                }).catch(_=>{})




            },
            checkPassword(){

                if(this.msgInfo.phone.length != 11){
                    wx.showToast({
                        title: '请填写正确的手机号',
                        icon: 'none',
                        duration: 1800,
                        mask:true
                    })
                    return;
                }
                if(this.msgInfo.password.length < Config.shortLength){
                    wx.showToast({
                        title: `密码长度必须不少于${Config.shortLength}位`,
                        icon: 'none',
                        duration: 1800,
                        mask:true
                    });
                    return;
                }
                if(this.msgInfo.msg.length < 3 ){
                    wx.showToast({
                        title: '请填写正确的验证码',
                        icon: 'none',
                        duration: 1800,
                        mask:true
                    });

                    return;
                }
                this.savePassword()
            },
            savePassword(){
                let info = this.msgInfo;
                forgotPassword({phone:info.phone,password:info.password,code:info.msg}).then(r=>{
                    wx.showToast({
                        title: '密码设置成功,请重新登录',
                        icon: 'none',
                        duration: 1800,
                        mask:true
                    })

                    removeToken();

                    wx.redirectTo({url:`/pages/other/login/main`});

                }).catch(_=>{})
            },
        },
        mounted() {



        }
    };
</script>

<style scoped >

</style>
