<template>
    <div class="container main">
        <VueTabBar @clickTab="clickTab"></VueTabBar>
        <div class="content">
            <div style="margin-bottom: 20rpx">
                <VueRollingTab ref="rollingTab" @clickTab="clickRollingTab" :list="rollingTabVal"></VueRollingTab>
            </div>
            <ul class="list">
                <li v-for="(item,index) in list" :key="item.id">
                    <div class="text" @click="positioning(item)">
                        {{item.name||item.courseName}}
                    </div>
                    <div class="action" @click="cancelCollection(item)">
                        取消收藏
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import VueTabBar from "@/components/TabBar/VueTabBar.vue";
    import VueRollingTab from "@/components/RollingTab/VueRollingTab.vue";
    import { userfavor,getUserFavorList } from '../../../api/common/index'
    export default {
        data() {
            return {
                activeTab:0,
                courses:[],
                topics:[],
                activeRollingTab:0,
            };
        },
        components: {
            VueTabBar,VueRollingTab
        },
        computed: {
            rollingTabVal(){
                if(0 == this.activeTab){
                    let val = []
                    this.courses.forEach(r=>{
                        val.push({
                            id:r.id,
                            name:r.name
                        })
                    })
                    return val;
                }
                if(1 == this.activeTab){
                    let val = [];
                    this.topics.forEach(r=>{
                        val.push({
                            id:r.id,
                            name:r.name
                        })
                    })
                    return val;
                }
            },
            list(){
                if(0 == this.activeTab){//课程
                    if(0 == this.activeRollingTab){
                        let newList = [];
                        this.courses.forEach(r=>{
                            newList.push(...r.userFavorList)
                        })
                        return newList;
                    }else {
                        return this.courses[this.activeRollingTab-1].userFavorList
                    }
                }
                if(1 == this.activeTab){//习题
                    if(0 == this.activeRollingTab){
                        let newList = [];
                        this.topics.forEach(r=>{
                            newList.push(...r.userFavorList)
                        })
                        return newList;
                    }else {
                        return this.topics[this.activeRollingTab-1].userFavorList
                    }
                }
            }
        },
        methods: {
            positioning(query){
                if(1 == this.activeTab){//习题
                    wx.navigateTo({
                        url:`/pages/topic/topicDetails/main?packageId=${query.packageId}&courseId=${query.courseId}&levelId=${query.leveId}&displayUserAnswer=1&questionId=${query.chapterQuestionId}`
                    });
                }else {
                    wx.navigateTo({
                        url:`/pages/study/studyDetails/main?coursePackId=${query.packageId}&courseId=${query.courseId}&chapterId=${query.chapterQuestionId || -1}&chapterPid=${query.pChapterId || -1}`
                    })
                }
            },
            changeCol(data){
                userfavor(data).then(r=>{
                    if(r === 1){
                        wx.showToast({
                            title: '操作成功',
                            icon: 'none',
                            duration: 2000
                        })
                        this.initFn();
                    }
                }).catch(_=>{})
            },
            cancelCollection(item){
                let data = {
                    "type":item.type,
                    "courseId":item.courseId,
                    "leveId":item.leveId || 0,
                    "isVedio":item.isVedio,
                    "chapterQuestionId":item.chapterQuestionId,
                    "packageId":item.packageId,
                }
                this.changeCol(data)
            },
            clickRollingTab(index,done){
                this.activeRollingTab = index;
                done()
            },
            clickTab(index,done){
                this.activeRollingTab = 0;
                this.$refs.rollingTab.ResetIndex();
                wx.showLoading({
                    title: "加载中",
                    mask:true,
                });
                this.activeTab = index;
                done()
                setTimeout(_=>{
                    wx.hideLoading();
                },500)
            },
            initFn(){
                getUserFavorList({type:0}).then(r=>{
                    this.courses = r.packageType || [];
                }).catch(_=>{})
                getUserFavorList({type:1}).then(r=>{
                    this.topics = r.packageType || [];
                }).catch(_=>{});
            },
        },
        onShow() {
            this.initFn();
        }
    };
</script>

<style lang="less">
    .content{
        padding: 20rpx;
        .list{
            background: #fff;
            height: calc(100vh - 260rpx);
            overflow-y: auto;
            li{
                width:100%;
                height: 116rpx;
                border-bottom: 1rpx solid #F5F4F7;
                display: flex;
                align-items: center;
                overflow: hidden;
                padding: 0 32rpx;
                .text{
                    flex: 1;
                    color: #333;
                    font-size: 31rpx;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    height: 100%;
                    line-height: 116rpx;
                    margin-right: 32rpx;
                }
                .action{
                    font-size: 26rpx;
                    color: #969FA9;
                }
            }
        }
    }
</style>
