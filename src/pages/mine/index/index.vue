<template>
    <div class="container main">
        <NavBar title="我的"></NavBar>
        <!--225rpx-->
        <a v-if="wechatUesrInfo.nickName" href="/pages/mine/info/main" class="top" hover-class="opacity">
            <img class="avatar" :src="wechatUesrInfo.avatarUrl" alt="" />
            <div class="user-info">
                <h1 class="name">{{ wechatUesrInfo.nickName }}</h1>
                <p class="org-name">{{ orgName }}</p>
            </div>
            <div class="info-details">
                <img class="right-icon" src="./img/back.png" alt="">
            </div>
        </a>
        <div class="top" v-else>
            <button  open-type="getUserInfo" lang="zh_CN" @getuserinfo="getInfo" class="">获取信息</button>
        </div>
        <div class="card">
            <div class="card-l">
                <p class="card-text">坚持天数</p>
                <div class="card-nub">{{ days }}</div>
            </div>
            <div class="card-line"></div>
            <div class="card-r">
                <p class="card-text">已学课程</p>
                <div class="card-nub">{{ courseSize }}</div>
            </div>
        </div>
        <ul class="ul">
            <a href="/pages/mine/collection/main" class="li" hover-class="opacity">
                <div >我的收藏</div>
                <img src="/static/images/common/right.png" alt="">
            </a>
            <a href="/pages/mine/message/main" class="li" hover-class="opacity">
                <div class="collection">
                    消息中心 {{ msgCount > 0 ? '('+msgCount+')' : '' }}
                    <div class="red-dot" v-if="msgCount > 0"></div>
                </div>
                <img src="/static/images/common/right.png" alt="">
            </a>
            <a href="/pages/mine/editPassword/main" class="li" hover-class="opacity">
                <div>修改密码</div>
                <img src="/static/images/common/right.png" alt="">
            </a>
            <li class="li" hover-class="opacity" @click="logout">
                <div>退出账号</div>
                <img src="/static/images/common/right.png" alt="">
            </li>
        </ul>
    </div>
</template>

<script>
    import TabBarPageMixin from '../../../utils/TabBarPageMixin'
    import {getUserStudyInfo,logOutApi} from '../../../api/mine/info'
    import {isLogin,getWechatUesrInfo,getMsgCount,removeToken,setWechatUesrInfo,removeOrgCode,getOrgInfo} from "../../../utils/dataStorage.js";
    export default {
        mixins: [TabBarPageMixin],
        data() {
            return {
                wechatUesrInfo:{},
                msgCount:0,
                courseSize:0,
                days:0,
                orgName:''
            };
        },

        components: {
            // NavBar
        },

        methods: {
            getInfo(e){
                let wxUserInfo = this.lodashGet(e,'mp.detail.userInfo',false);

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
                this.wechatUesrInfo = getWechatUesrInfo() || {};

            },
            logout(){
                wx.showModal({
                    title: '提示',
                    content: '确认退出当前账号吗？',
                    confirmColor:'#4D86F8',
                    success(res) {
                        if (res.confirm) {
                            logOutApi().then(r=>{
                                removeToken();
                                removeOrgCode();
                                wx.switchTab({ url: '/pages/index/main' })
                            }).catch(_=>{
                                removeToken();
                                removeOrgCode();
                                wx.switchTab({ url: '/pages/index/main' }) //token失效也要退出登录
                            });
                        } else if (res.cancel) {
                            // console.log('用户点击取消')
                        }
                    }
                })
            }
        },
        mounted(){

            this.wechatUesrInfo = getWechatUesrInfo() || {};
        },

        onShow(){
            if(!isLogin()){return;}
            this.orgName = getOrgInfo().orgName;
            this.msgCount = getMsgCount() || 0;
            getUserStudyInfo().then(r=>{
                this.days = r.days;
                this.courseSize = r.courseSize
            }).catch(_=>{})
        },
        onTabItemTap(item) {
            if(!isLogin()){
                wx.redirectTo({ url:"/pages/other/login/main" });
                return;
            }
        }
    };
</script>

<style scoped >
    .main{
        background-repeat: no-repeat;
        background-size: 100% auto;
        background-position: top;
        background-image: url("https://static.hulian120.com/learncenter/minipro/v201901/common/top_bg.png");
    }
    .top{
        width: 100%;
        height: 225rpx;
        display: flex;
        align-items: center;
    }
    .opacity{
        opacity: .6;
    }
    .avatar{
        margin-left: 50rpx;
        margin-right: 34rpx;
        width: 144rpx;
        height: 144rpx;
        border-radius: 50%;
        overflow: hidden;
    }
    .user-info{
        flex: 1;
    }
    .name{
        font-weight: bold;
        font-size: 36rpx;
        color: #fff;
    }
    .org-name{
        width: 400rpx;
        margin-top: 20rpx;
        display: block;
        font-size: 24rpx;
        color: #fff;
        overflow: hidden;
        white-space: nowrap;
        text-overflow:ellipsis;
    }
    .info-details{
        width: 76rpx;
        display: flex;
        align-items: center;
    }
    .right-icon{
        width: 20rpx;
        height: 35rpx;
        transform:rotate(180deg);
    }
    .card{
        width: 711rpx;
        height: 263rpx;
        background: #fff;
        border-radius: 6rpx;
        margin: 0 auto;
        display: flex;
        align-items: center;
    }
    .card-l,.card-r{
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .card-line{
        width: 1rpx;
        height: 105rpx;
        background: #BAC1D8;
    }
    .card-text{
        color: #969FA9;
        font-size: 26rpx;
        font-weight: bold;
    }
    .card-nub{
        color: #4D86F8;
        font-size: 72rpx;
        font-weight: bold;
    }
    .ul{
        margin: 20rpx auto;
        width: 711rpx;
        border-radius: 6rpx;
        background: #fff;
        padding: 0 10rpx;
    }
    .li{
        width: 100%;
        height: 118rpx;
        display: flex;
        align-items: center;
        color: #222;
        font-size: 32rpx;
        padding-left: 35rpx;
        border-bottom: 2rpx solid #f5f4f7;
    }

    .li>div{
        flex: 1;
    }
    .li>img{
        width: 16rpx;
        height: 27rpx;
        margin-right: 20rpx;
    }
    .collection{
        position: relative;
    }
    .collection .red-dot{
        width: 12rpx;
        height: 12rpx;
        border-radius: 50%;
        position: relative;
        top: -17rpx;
        left:-9rpx;
        display: inline-block;
        background: #FF5555;
    }
</style>
