<template>
    <cover-view data-mask="1" class="right" v-if="isShow" @click="closeMask($event)">
        <cover-view   class="content">
            <cover-view class="h1">一、{{obj.chapterName}}</cover-view>
            <cover-view class="ul">
                <cover-view :class="item.isWatch === 1 ? 'actived li' : 'li'" v-for="(item,index) in catalogMenu" :key="index" @click="toStudyDetail(item)">
                                    <!--[done|#969FA9]  [active|#4D86F8]  [un-done|#333]-->
                    <cover-view class="li-info">
                        <cover-image class="free" src="http://static.hulian120.com/yysc/yysc_free.png" v-if="item.vipType===0"></cover-image>
                        <cover-view class="span">1.{{index+1}}</cover-view>
                        <cover-view class="title span">{{item.chapterName}}</cover-view>
                    </cover-view>
                    <cover-image src="https://static.hulian120.com/yysc/yysc_fav.png" v-if="item.isCollection===1" alt="" class="collected"></cover-image>
                </cover-view>
            </cover-view>
        </cover-view>
    </cover-view>
</template>
<!--:class="isShow ? 'opacity right' : 'right' "-->
<!--:class="isShow ? 'animation content' : 'content'"-->

<script>
  export default {
    name: "Directory",
    props:{
        show:{
            type:Boolean,
            value:false
        },
        catalogMenu:{
            type:Array,
            value:[]
        },
        obj :{
           
        }
    },
    data(){
        return {
            isShow:false
        }
    },
      watch:{
            show(val){
                this.isShow=val
            }
      },
    methods:{
        closeMask (e) {
            if(e.target.dataset.mask){
              //  this.isShow=false
              this.$emit('closeMask',false)
                //do something
            }else{
                return
            }
        },
        //跳转详情
        toStudyDetail (item) {
          this.$emit('toDetail',item)
        }
    }
  };
</script>

<style scoped lang="less">
    .right{
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.6);
        position:fixed;
        left:0;
        top:0;
        overflow-y:scroll;
        z-index: 1;
        .content{
            width:564rpx;
            height:87vh;
            margin:0 24rpx 0 162rpx;
            padding:50rpx 0;
            border-radius:5rpx;
            position: fixed;
            z-index: 2;
            right:22rpx;
            background: #fff;
            overflow-y: scroll;
            top:18rpx;
            box-sizing: border-box;
            /*transition: right .9s;*/
        .h1{
            padding-bottom:40rpx;
            font-size:32rpx;
            font-family:PingFang-SC-Bold;
            font-weight:bold;
            color:rgba(51,51,51,1);
            padding: 0 40rpx 40rpx;
        }
            .ul{
                margin: 40rpx 0;
                .li{
                    height: 100rpx;
                    display: flex;
                    padding: 0 40rpx;
                    border-bottom: 1px solid #EAEAEA;
                    justify-content: flex-start;
                    align-items: center;
                    position: relative;
                    &:last-child{
                        border-bottom: none;
                    }
                    .li-info {
                        flex: 1;
                        display: flex;
                        overflow: hidden;
                        align-items: center;
                        font-size: 30rpx;
                        .title {
                            flex: 1;
                            margin-right: 24rpx;
                            margin-left: 24rpx;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        .free{
                            width: 63rpx;
                            height: 30rpx;
                            /*position: relative;*/
                            /*text-align: center;*/
                            /*color: #fff;*/
                            /*line-height: 30rpx;*/
                            /*height: 30rpx;*/
                            /*margin-right: 10rpx;*/
                        }
                    }
                    .collected{
                        width: 36rpx;
                        height: 36rpx;
                    }
                    &.actived{
                      color:rgba(150,159,169,1);
                    }
                }
            }
        }
    }

</style>
