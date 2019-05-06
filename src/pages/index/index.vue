<template>
    <div class="container">
        <img class="index-img" style="height:537rpx" src="https://static.hulian120.com/learncenter/minipro/v201901/index/index_01.jpg" alt="">
        <img class="index-img" style="height:396rpx" src="https://static.hulian120.com/learncenter/minipro/v201901/index/index_02.jpg" alt="">
        <img class="index-img" style="height:676rpx" src="https://static.hulian120.com/learncenter/minipro/v201901/index/index_03.jpg" alt="">
        <img class="index-img" style="height:1012rpx" src="https://static.hulian120.com/learncenter/minipro/v201901/index/index_04.jpg" alt="">
        <img class="index-img" style="height:835rpx" src="https://static.hulian120.com/learncenter/minipro/v201901/index/index_05.jpg" alt="">
        <img class="index-img" style="height:584rpx" src="https://static.hulian120.com/learncenter/minipro/v201901/index/index_06.jpg" alt="">
        <div class="phone-btn" @click="callPhone">
            <span>电话</span>
            <span>咨询</span>
        </div>
    </div>
</template>

<script>
    import Config from '../../config/index'
    import {automaticLogin} from '../../api/index/index'
    import {setOrgCode,setOrgInfo,getOrgInfo,setUesrInfo,setToken,setMsgCount} from '../../utils/dataStorage'
    import TabBarPageMixin from '../../utils/TabBarPageMixin'
    export default {
        mixins: [TabBarPageMixin],
        data() {
            return {};
        },

        components: {

        },

        methods: {
            callPhone(){
                let phone = getOrgInfo().phone;
                wx.makePhoneCall({
                    phoneNumber:phone
                })
            }
        },
        mounted() {
            let query = this.$root.$mp.appOptions.query;
            let code = this.lodashGet(query,'code',"");
            let self = this;
            setOrgCode(code);//即使是空也要设置。
            wx.login({
                success(res) {
                    if (res.code) {
                        automaticLogin({orgCode:code,code:res.code}).then(r=>{
                            setUesrInfo(self.lodashGet(r,'userInfo',""));
                            setToken(self.lodashGet(r,'token',''));
                            setOrgInfo(self.lodashGet(r,'orgInfo',''));
                            setOrgCode(self.lodashGet(r,'orgInfo.code',''));
                            let unReadCount = self.lodashGet(r,'unReadCount',0)
                            setMsgCount(unReadCount);
                            if(unReadCount >0){
                                wx.showTabBarRedDot({
                                    index:4,
                                    success:function() {},
                                    fail:function(e) {
                                        console.log(e)
                                    }
                                });
                            }
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
            })

        },
        onShow(){
            // let code = getOrgCode() || '';
            // if(code.length<5){
            //     let org = getOrgInfo() || {}
            //     if(org.hasOwnProperty('code')){
            //         setOrgCode(org.code)
            //     }
            // }
        }
    };
</script>

<style scoped >
    .index-img{
        width: 100%;
    }
    .phone-btn{
        position: fixed;
        right: 18rpx;
        bottom: 30rpx;
        width:120rpx;
        height:120rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size:28rpx;
        color: #fff;
        box-shadow:0 0 8rpx rgba(0,0,0,.6);
        background:linear-gradient(0deg,rgba(43,96,255,1),rgba(77,134,248,1));
        border-radius:50%;
    }
</style>
