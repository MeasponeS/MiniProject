<template>
    <div class="container main">
       <ul class="tab">
            <li @click="toggleTab('opening')" :class="{active:status =='opening'}">开放中</li>
            <li @click="toggleTab('notOpened')" :class="{active:status =='notOpened'}">未开放</li>
            <li @click="toggleTab('exceed')" :class="{active:status =='exceed'}" >已过期({{ exceed.list.length }})</li>
       </ul>
        <ul class="exam opening" v-if="status =='opening'">
            <EmptyDisplay v-if="opening.list.length == 0" type="exam" text="暂无开放中的考试"></EmptyDisplay>
            <li v-for="(item,i) in opening.list" :key="item.id">
                <div class="top">
                        <h2 class="exam-title">{{ item.name }}</h2>
                        <van-tag color="#31B68F">进行中</van-tag>
                    <div class="exam-info">开放时间：<br>{{item.testStart}}-{{item.testEnd }}</div>
                    <div class="exam-info">试题数量：{{item.paperSum}}道</div>
                </div>
                <div class="bottom">
                    <div class="time">考试时长：{{item.testTime}}分钟</div>
                    <div v-if="item.userTestStartTime" @click="examDetails(item)" class="start-exam">查看详情</div>
                    <div v-else @click="enterExam(item)" class="start-exam">进入考场</div>
                </div>
            </li>
        </ul>
        <ul class="exam notOpened" v-if="status =='notOpened'">
            <EmptyDisplay v-if="notOpened.list.length == 0" type="exam" text="暂无未开放的考试"></EmptyDisplay>
            <li v-for="(item,i) in notOpened.list" :key="item.id">
                <div class="top">
                    <h2 class="exam-title">{{ item.name }}</h2>
                    <van-tag color="#31B68F">未开放</van-tag>
                    <div class="exam-info">开放时间：<br>{{item.testStart}}-{{item.testEnd }}</div>
                    <div class="exam-info">试题数量：{{item.paperSum}}道</div>
                </div>
                <div class="bottom">
                    <div class="time">考试时长：{{item.testTime}}分钟</div>
                    <div @click="clickNotOpened" class="start-exam gray">未开放</div>
                </div>
            </li>
        </ul>
        <ul class="exam exceed" v-if="status =='exceed'">
            <EmptyDisplay v-if="exceed.list.length == 0" type="exam" text="暂无已过期的考试"></EmptyDisplay>
            <li v-for="(item,i) in exceed.list" :key="item.id">
                <div class="top">
                    <h2 class="exam-title">{{ item.name }}</h2>
                    <van-tag color="#969FA9">已结束</van-tag>

                    <div class="exam-info">开放时间：<br>{{item.testStart}}-{{item.testEnd }}</div>
                    <div class="exam-info">试题数量：{{item.paperSum}}道</div>
                </div>
                <div class="bottom">
                    <div class="time">考试时长：{{item.testTime}}分钟</div>
                    <div v-if="item.userTestStartTime" @click="examDetails(item)" class="start-exam">查看成绩</div>
                    <div v-else class="start-exam gray">您没有参加这场考试</div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    import {getRoomListByType} from '../../../api/exam/index.js'
    import {isLogin} from "../../../utils/dataStorage.js";
    import TabBarPageMixin from '../../../utils/TabBarPageMixin'
    export default {
        mixins: [TabBarPageMixin],
        data() {
            return {
                status:'opening',

                opening:{
                    isAllList:false,
                    maxExamId:null,
                    list:[]
                },
                notOpened:{
                    isAllList:false,
                    maxExamId:null,
                    list:[]
                },
                exceed:{
                    isAllList:false,
                    maxExamId:null,
                    list:[]
                },

                statusTypeVal:{
                    exceed:1,
                    opening:2,
                    notOpened:3,
                },
            };
        },

        components: {
        },
        onReachBottom(){

            if(this[this.status].isAllList){
                return;
            }
            this.getList(this.status,this[this.status].maxExamId);
        },
        onPullDownRefresh: function () {
            // 显示顶部刷新图标
            wx.showNavigationBarLoading();

            getRoomListByType({type:this.statusTypeVal[this.status]}).then(r=>{
                this[this.status].maxExamId = r.maxExamId;
                this[this.status].isAllList = r.isAllList == 1? true : false;
                this[this.status].list = r.testList;
                setTimeout(_=>{
                    wx.hideNavigationBarLoading();
                    wx.stopPullDownRefresh();
                },400)
            }).catch(_=>{
                wx.hideNavigationBarLoading();
                wx.stopPullDownRefresh();
            })

        },
        methods: {
            enterExam(item){
                wx.navigateTo({ url:"/pages/exam/examDiscipline/main?testingId="+item.id+"&paperId="+ item.paperId });
            },
            examDetails(item){
                if(item.openScore != 1){
                    wx.showToast({
                        title: '成绩未开放',
                        icon: 'none',
                        duration: 2000
                    })
                    return;
                }
                wx.navigateTo({ url:"/pages/exam/examResult/main?testingId="+item.id+"&paperId="+ item.paperId+'&name='+item.name });
            },
            clickNotOpened(){
                wx.showToast({
                    title: '考试时间未到',
                    icon: 'none',
                    duration: 2000
                })
            },
            toggleTab(key){
                this.status = key;
                // GoodStorage.session.set(storageExamTabStatusKey,key);
                // if(
                //     this.examInfo[key].list.length == 0 &&
                //     this.examInfo[key].isAllList == false
                // ){//当这个选项卡的列表长度为零并且从来没有请求过就拿一次数据
                //     this.getList();
                // }
            },
            getList(type,maxExamId = null){

                let p = {
                    type:this.statusTypeVal[type],
                };
                if(maxExamId){
                    p.maxExamId = maxExamId;
                }

                getRoomListByType(p).then(r=>{
                    this[type].maxExamId = r.maxExamId;
                    this[type].isAllList = r.isAllList == 1? true : false;

                    this[type].list.push(...r.testList);
                }).catch(_=>{})
            }
        },
        onShow() {//使用onShow  考完试回来要更新
            if(!isLogin()){return;}
            getRoomListByType({type:this.statusTypeVal.opening}).then(r=>{
                this.opening.maxExamId = r.maxExamId;
                this.opening.isAllList = r.isAllList == 1 ? true : false;

                this.opening.list = r.testList;
            }).catch(_=>{})

            setTimeout(_=>{
                getRoomListByType({type:this.statusTypeVal.notOpened}).then(r=>{
                    this.notOpened.maxExamId = r.maxExamId;
                    this.notOpened.isAllList = r.isAllList == 1 ? true : false;

                    this.notOpened.list = r.testList;
                }).catch(_=>{})
                getRoomListByType({type:this.statusTypeVal.exceed}).then(r=>{
                    this.exceed.maxExamId = r.maxExamId;
                    this.exceed.isAllList = r.isAllList == 1 ? true : false;
                    this.exceed.list = r.testList;
                }).catch(_=>{})
            },200)
        },
        onTabItemTap(item) {
            if(!isLogin()){
                wx.redirectTo({ url:"/pages/other/login/main" });
                return;
            }
        }
    };
</script>

<style>
    .main{
        padding-top: 102rpx;
    }
    .tab{
        position: fixed;
        top: 0;
        z-index: 5;
        background: #F3F5F7;
        width: 100%;
        height: 100rpx;
        padding: 0 20rpx;
        display: flex;
        align-items: center;
    }
    .tab li{
        height: 100%;
        font-size: 30rpx;
        color: #333;
        position: relative;
        margin: 0 25rpx;
        display: flex;
        align-items: center;
    }
    .tab .active{
        color: #000;
    }
    .tab .active::after{
        content: '';
        position: absolute;
        bottom: 18rpx;
        left: calc(50% - 15rpx);
        width:30rpx;
        height:4rpx;
        background: #6886FB;
        border-radius: 2rpx;
    }
    .exam{
        width: 100%;
        padding: 0 20rpx 10rpx;
    }
    .exam li{
        width: 100%;
        background: #fff;
        /*height: 340rpx;*/
        display: flex;
        flex-direction: column;
        margin-bottom: 20rpx;
        border-radius: 5rpx;
        position: relative;
    }
    .top{
        flex: 1;
        width: 100%;
        padding: 43rpx 24rpx 0;
    }

    .exam-title{
        display: inline-block;
        font-size: 32rpx;
        position: relative;
        top: 5rpx;
        margin-right: 12rpx;
        line-height:normal;
    }

    .bottom{
        margin-top: 10rpx;
        background: #FCFCFC;
        padding: 0 24rpx;
        width: 100%;
        height: 99rpx;
        display: flex;
        align-items: center;
    }
    .bottom .time{
        color:#222;
        font-size: 30rpx;
        flex: 1;
    }
    .bottom .start-exam{
        color:#fff;
        font-size: 28rpx;
        padding: 0 26rpx;
        height: 70rpx;
        background: #4D86F8;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 35rpx;
    }
    .bottom .gray{
        color:#969FA9;
        background: none;
        border: 1rpx solid #969FA9;
    }
    .exam-info{
        color: #222;
        font-size: 30rpx;
        margin-top: 30rpx;
    }
    .exceed .exam-title,.exceed .exam-info,.exceed .time{
        color: #969FA9;
    }
</style>
