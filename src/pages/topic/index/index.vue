<template>
    <div class="container topics">
        <img class="ad" src="https://static.hulian120.com/learncenter/minipro/v201901/topic.jpg" alt="">
        <div class="tab-box">
            <div :class="{'rolling-tab-fixed':RollingTabFixed}">
                <VueRollingTab @clickTab="clickTab" :list="list"></VueRollingTab>
            </div>
        </div>
        <div class="list">
            <div v-for="(item,i) in displayList" :key="item.id">
                <li @click="goResults(subItem,item.parenPacktId,item.subId)" v-for="(subItem,m) in item.courseVoList" :key="subItem.id">
                    <img class="left" :src="subItem.coverPicUrlPc" alt="">
                    <div class="list-text">
                        <div class="topic-title">{{ subItem.name }}</div>
                        <div class="topic-info">您已通过：暂无字段</div>
                        <div class="topic-info">关卡数：{{ subItem.levelNum }}</div>
                    </div>
                    <div class="list-right">
                        <img class="list-right-icon" src="/static/images/common/right.png" alt="">
                    </div>
                </li>
            </div>
        </div>
        <NoLearningCard
            :show="NoLearningCard"
            @clickClose="NoLearningCard = false"
        ></NoLearningCard>
        <SelectSubMajor
            :show="selectSubMajor.show"
            :packId="selectSubMajor.packId"
            @onClose="closeSelectSubMajor"
        ></SelectSubMajor>
    </div>
</template>

<script>

    import VueRollingTab from "@/components/RollingTab/VueRollingTab.vue";
    import SelectSubMajor from "@/components/SelectSubMajor/SubMajor.vue";
    import NoLearningCard from "@/components/NoLearningCard/NoLearningCard.vue";
    import {getTopicList} from '../../../api/topic/index'
    import {checkDistribute} from '../../../api/study/index'
    import {authCourse} from '../../../api/other/index'
    import {isLogin} from '../../../utils/dataStorage'
    import TabBarPageMixin from '../../../utils/TabBarPageMixin'
    export default {
        mixins: [TabBarPageMixin],
        data() {
            return {
                list:[],
                activeIndex:0,
                iSelect:false,
                selectSubMajor:{
                    show:false,
                    packId:0
                },
                NoLearningCard:false,
                RollingTabFixed:false,
            };
        },
        components: {
            VueRollingTab,SelectSubMajor,NoLearningCard
        },
        onPageScroll:function(e){
            if( e.scrollTop >= 153 ){
                this.RollingTabFixed = true;
            }else {
                this.RollingTabFixed = false;
            }
        },
        computed: {
            displayList:function(){
                if(0 == this.activeIndex){
                    return this.list;
                }else {
                    return [this.list[this.activeIndex - 1]];//因为要获取子元素的父元素信息，在添加一层循环
                }
            }
        },
        methods: {
            clickTab(index,done){
                this.activeIndex = index;
                done();
            },
            goResults(item,parenPacktId,subId = null){
                let self = this;
                //逻辑梳理
                //1.没有登录直接去登录
                //window.location.href = './topicList.html?packageId=' + item.packageId +'&courseId=' + item.id
                if(!isLogin()){
                    wx.navigateTo({url:"/pages/other/login/main"});
                    return;
                }

                //2.用户是否有课程有权限，
                authCourse({courseId:item.id}).then(r=>{
                    if(0 == r){//没有权限
                        //判断用户是否已经分配卡
                        checkDistribute({packId:parenPacktId ? parenPacktId : item.packageId}).then(ka=>{
                            if(0 == ka || '0' == ka){//未分配
                                self.NoLearningCard = true;
                                return;
                            }
                            if(1==ka || '1' ==ka){//已经分配

                                wx.navigateTo({url:'/pages/other/openLearningCard/main'});
                                //这里去开卡界面;
                                return;
                            }
                        }).catch(_=>{});
                    }else {//有权限的情况在看是否有亚专业
                        if(parenPacktId && !self.iSelect){//有亚专业 ，并且没有选择
                            self.selectSubMajor.packId = parenPacktId;
                            self.selectSubMajor.show = true;
                        }else {//没有亚专业 或者已经选择了压专业
                            wx.navigateTo({url:'/pages/topic/topicLevel/main?packageId=' + (subId ? subId : item.packageId) + '&courseId=' + item.id})
                        }
                    }
                }).catch(_=>{})

            },
            closeSelectSubMajor(){
                this.initList();
                self.selectSubMajor.show = false;
            },
            initList(){
                getTopicList().then(r=>{
                    this.list = r.list;
                    this.iSelect = r.iSelect;
                });
            }
        },
        mounted() {//不使用onShow  有下拉刷新  //登录之前和登录之后不一样
            this.initList();
        },
        onPullDownRefresh: function () {
            // 显示顶部刷新图标
            wx.showNavigationBarLoading();
            getTopicList().then(r=>{
                this.list = r.list;
                this.iSelect = r.iSelect;
                setTimeout(_=>{
                    wx.hideNavigationBarLoading();
                    wx.stopPullDownRefresh();
                },400)
            }).catch(_=>{
                wx.hideNavigationBarLoading();
                wx.stopPullDownRefresh();
            })
        },
    };
</script>

<style>
    .topics{
        padding: 20rpx;
    }
    .ad{
        width: 100%;
        height: 263rpx;
        border-radius: 5rpx;
        overflow: hidden;
    }
    .tab-box{
        display: block;
        width: 100%;
        margin: 22rpx 0;
        height: 100rpx;
    }
    .rolling-tab-fixed{
        padding: 0 20rpx;
        display: block;
        width: 100%;
        position: fixed;
        margin: 0;
        top: 0;
        left: 0;
        z-index: 5;
        border-bottom: 1rpx solid #F3F5F7;
        background:#fff;
    }
    /*.tab{*/
        /*margin: 22rpx 0;*/
        /*background: #fff;*/
        /*width: 100%;*/
        /*height: 100rpx;*/
        /*border-radius:5rpx;*/
        /*display: flex;*/
        /*align-items: center;*/
    /*}*/
    /*.tab-ul{*/
        /*flex: 1;*/
        /*height: 100rpx;*/
        /*overflow-x: auto;*/
        /*overflow-y: hidden;*/
        /*white-space: nowrap;*/
    /*}*/
    /*.all{*/
        /*width: 74rpx;*/
        /*height: 58rpx;*/
        /*display: flex;*/
        /*align-items: center;*/
        /*justify-content: center;*/
    /*}*/
    /*.all img{*/
        /*width: 86rpx;*/
        /*height: 76rpx;*/
    /*}*/
    /*.tab-ul li{*/
        /*display: inline-block;*/
        /*height: 74rpx;*/
        /*font-size: 30rpx;*/
        /*color: #333;*/
        /*position: relative;*/
        /*margin:32rpx 20rpx 0;*/
    /*}*/
    /*.tab-ul .active{*/
        /*color: #000;*/
    /*}*/
    /*.tab-ul .active::after{*/
        /*content: '';*/
        /*position: absolute;*/
        /*bottom: 18rpx;*/
        /*left: calc(50% - 15rpx);*/
        /*width:30rpx;*/
        /*height:4rpx;*/
        /*background: #6886FB;*/
        /*border-radius: 2rpx;*/
    /*}*/
    .list li{
        margin-bottom: 20rpx;
        width: 100%;
        height: 176rpx;
        display: flex;
        padding: 20rpx;
        background: #fff;
    }
    .list li .left{
        height: 100%;
        width: 244rpx;
        border-radius: 5rpx;
        overflow: hidden;
    }
    .list-text{
        overflow: hidden;
        flex: 1;
        margin-left: 20rpx;
    }
    .topic-title{
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 30rpx;
        margin-bottom: 30rpx;
    }
    .topic-info{
        margin-top: 6rpx;
        font-size: 24rpx;
        color: #999999;
    }
    .list-right{
        width: 52rpx;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .list-right-icon{
        width: 16rpx;
        height: 27rpx;
    }
</style>
