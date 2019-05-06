<template>
    <div class="rolling-tab">
        <div class="tab">
            <ul class="tab-ul">
                <li :class="{active:activeIndex == 0}" @click="clickTab(0)">全部</li>
                <li :class="{active:activeIndex == index+1}" v-for="(item, index) in list" :key="item.id" @click="clickTab(index+1)">{{ item.name }}</li>
            </ul>
            <div class="all" v-if="list.length >= 2" @click="dropDown = !dropDown">
                <img src="./img/all.png" alt="">
            </div>
        </div>
        <ul class="dow" v-if="dropDown">
            <li :class="{active:activeIndex == index+1}" v-for="(item, index) in list" :key="item.id" @click="clickTab(index+1)">{{ item.name }}</li>
        </ul>
    </div>

</template>

<script>
    export default {
        props: {
            list: {
                type:Array,
                default:[],
            },

        },
        data() {
            return {
                activeIndex : 0,
                dropDown:false,
            };
        },
        onPageScroll:function(){
            if(this.dropDown){
                this.dropDown = false;
            }
        },
        methods: {
            clickTab(index){
                this.$emit('clickTab',index,_=>{
                    this.activeIndex = index;
                    this.dropDown = false;
                })
            },
            ResetIndex(){
                this.activeIndex = 0;
                this.dropDown = false;
            }
        },
        mounted() {
        }
    };
</script>
<>
<style scoped lang="less">
    .rolling-tab{
        position: relative;
        .dow{
            width: 100%;
            border-top: 1rpx solid #EDEDED;
            position: absolute;
            background: #fff;
            top:100rpx;
            padding: 0 30rpx 30rpx;
            box-shadow: 0 6rpx 10rpx rgba(0,0,0,.1);
            li{
                font-size: 26rpx;
                color: #969FA9;
                border: 1rpx solid #969FA9;
                border-radius: 30rpx;
                padding: 0 20rpx;
                margin-top: 22rpx;
                margin-right: 22rpx;
                height: 60rpx;
                line-height: 60rpx;
                display: inline-block;
                &.active{

                    border-color: #6886FB;;
                }
            }
        }
    }
    .tab{

        background: #fff;
        width: 100%;
        height: 100rpx;
        display: flex;
        align-items: center;

    }
    .tab-ul{
        flex: 1;
        height: 100rpx;
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
        &::-webkit-scrollbar {
            display:none
        }
    }
    .all{
        width: 74rpx;
        height: 58rpx;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .all img{
        width: 86rpx;
        height: 76rpx;
    }
    .tab-ul li{
        display: inline-block;
        height: 74rpx;
        font-size: 30rpx;
        color: #333;
        position: relative;
        margin:32rpx 20rpx 0;
    }
    .tab-ul .active{
        color:  #2B60FF;
    }
    .tab-ul .active::after{
        content: '';
        position: absolute;
        bottom: 18rpx;
        left: calc(50% - 15rpx);
        width:30rpx;
        height:4rpx;
        background: #6886FB;
        border-radius: 2rpx;
    }

</style>
