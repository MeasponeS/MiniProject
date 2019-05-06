<template>
    <van-popup
        :show="show"
        custom-class="main-popup-card"
        custom-style="width:80%;border-radius:10rpx"
        overlay-style="opacity:0.6"
        :close-on-click-overlay="false"
    >
        <img src="./img/img.png" alt="">
        <h3>您还没有获得学习卡</h3>
        <span>请联系客服进行购买</span>
        <span>联系电话:{{ phone }}</span>
        <van-button
            custom-class="main-bg introduceBtn"
            round
            style="width: 80%"
            type="primary"
            @click="clickClose"
            :block="true"
            size="large"
        >完成</van-button>
        <em @click="openCard">已购买学习卡？点此激活</em>
    </van-popup>
</template>

<script>
    import {getOrgInfo} from '../../utils/dataStorage'
    export default {
        name: 'noLearningCard',
        props: {
            show:Boolean,
        },
        data:function(){
            return {
                phone:''
            }
        },
        methods:{
            clickClose(){
                this.$emit('clickClose');
            },
            openCard(){
                wx.navigateTo({url:'/pages/other/openLearningCard/main'});
            }
        },

        onShow(){
            //登陆之前和登陆之后的
            this.phone = getOrgInfo().phone
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
    .main-popup-card{
        width: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
        img{
            width: 310rpx;
            height: 190rpx;
            margin-top: 50rpx;
        }
        h3{
            font-size: 34rpx;
            color: #222;
            margin: 40rpx 0;
        }
        span{
            font-size: 32rpx;
            line-height: 52rpx;
            color: #222;
        }
        em{
            font-style: normal;
            font-size: 28rpx;
            color: #4D86F8;
            text-decoration: underline;
            margin-bottom: 40rpx;
        }
        .main-bg{
            margin: 60rpx 0 38rpx 0;
        }
    }
</style>
