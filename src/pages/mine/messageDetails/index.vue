<template>
    <div class="container main">
        <div class="msg-top">
            <div class="title">{{ msg.noticeTitle }}</div>
            <div class="time">
                {{ msg.sendTime }}
            </div>
        </div>
        <rich-text class="msg-content" :nodes="msg.noticeContent"></rich-text>
    </div>
</template>

<script>
    import {getNoticesById} from '../../../api/mine/info'
    export default {
        data() {
            return {
                msg:{}
            };
        },

        components: {

        },

        methods: {

        },
        onShow() {

            let query = this.$root.$mp.query;

            getNoticesById({id:query.msgId}).then(r=>{
                this.msg = r.noticeInfo;
                wx.setNavigationBarTitle({
                    title: r.noticeInfo.noticeTitle
                })
            }).catch(_=>{})

        }
    };
</script>

<style scoped lang="less">
    .main{
        padding: 68rpx 44rpx;
        .msg-top{
            display: flex;
            align-items: center;
            justify-content: space-between;
            overflow: hidden;
        }
        .title{
            flex: 1;
            color: #222;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            font-size: 36rpx;
            margin-bottom: 50rpx;
        }
        .time{
            flex: 1;
            color:#969FA9;
            white-space: nowrap;
            text-align: right;
            text-overflow: ellipsis;
            overflow: hidden;
            font-size: 26rpx;
        }
        .msg-content{
            margin: 50rpx 0;
            overflow: hidden;
            font-size: 30rpx;
            color: #333;
        }
    }
</style>
