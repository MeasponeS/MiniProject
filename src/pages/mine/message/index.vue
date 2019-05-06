<template>
    <div class="container main">
        <EmptyDisplay v-if="list.length == 0" type="msg" text="暂无任何消息"></EmptyDisplay>
        <div>
            <div
               class="item"
               v-for="(item,i) in list"
               :key="item.id"
               @click="readMsg(item.isReceive,item.id)">
                <div class="item-text">{{ item.noticeTitle }}</div>
                <div class="read" v-if="item.isReceive == 1">已读</div>
                <div class="unread" v-else>未读</div>
            </div>
        </div>

    </div>
</template>

<script>
    import {getNotices,readMag as readMsgApi} from "../../../api/mine/message.js"
    import {setMsgCount,decrMsg} from '../../../utils/dataStorage'
    export default {
        data() {
            return {
                list:[]
            };
        },

        components: {

        },

        methods: {
            readMsg(isReceive,id){
                if(isReceive != 1){//未阅读。
                    readMsgApi({id:id}).then(r=>{
                        let count = decrMsg();
                        if(count>0){
                            wx.showTabBarRedDot({
                                index:4,
                                success:function() {},
                                fail:function(e) {
                                    console.log(e)
                                }
                            });
                        }else {
                            wx.hideTabBarRedDot({
                                index:4,
                                success:function() {},
                                fail:function(e) {
                                    console.log(e)
                                }
                            });
                        }
                        //
                    }).catch(_=>{});
                }
                wx.navigateTo({url:`/pages/mine/messageDetails/main?msgId=${id}`});
            },
        },
        onShow() {
            getNotices().then(r=>{
                setMsgCount(r.unReadCount || 0);
                this.list = r.list || [];
            }).catch(_=>{})
        }
    };
</script>

<style scoped lang="less">
    .main{
        padding: 20rpx;
    }
    .item{
        width:100%;
        height:100rpx;
        background:#fff;
        border-radius:5rpx;
        display: flex;
        align-items: center;
        padding: 0 24rpx;
        margin-bottom: 20rpx;
        .item-text{
            flex: 1;
            font-size: 30rpx;
            color: #000;
        }

        .read{
            width: 80rpx;
            font-size: 26rpx;
            color: #969FA9;
            position: relative;
            &:after{
                content: '';
                position: absolute;
                right: 0;
                width: 16rpx;
                height: 16rpx;
                border-radius: 50%;
                background: #969FA9;
                top: 10rpx;
            }
        }
        .unread{
            width: 80rpx;
            font-size: 26rpx;
            color: #FF5555;
            position: relative;
            &:after{
                content: '';
                position: absolute;
                right: 0;
                width: 16rpx;
                height: 16rpx;
                border-radius: 50%;
                background: #FF5555;
                top: 10rpx;
            }
        }
    }

</style>
