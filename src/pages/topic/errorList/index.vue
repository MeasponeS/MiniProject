<template>
    <div class="container error-list">
        <div>
            <div class="tab">
                <ul>
                    <li @click="toggleTab('unLearn')" :class="{active:status == 'unLearn'}">未学会</li>
                    <li @click="toggleTab('learn')" :class="{active:status == 'learn'}">已学会</li>
                </ul>
            </div>
            <div class="content">
                <div class="un-learn" v-if="status == 'unLearn'">
                    <ul class="list">
                        <li v-for="item in unLearn.list" :key="item.questionId" @click="topicDetails(item)">
                            <span class="status">未学会</span>
                            <h3>第{{ item.index || item.indexs }}题</h3>
                        </li>
                    </ul>
                    <div style="padding: 0 20rpx 20rpx">
                        <van-button
                            @click="loadMore"
                            custom-class="main-bg"
                            type="primary"
                            :block="true"
                            size="large"
                            round
                            v-if="!unLearn.isAllList"
                        >加载更多</van-button>
                    </div>
                </div>
                <div class="learn" v-if="status == 'learn'">
                    <ul class="list">
                        <li v-for="item in learn.list" :key="item.questionId" @click="topicDetails(item)">
                            <span class="status learn">已学会</span>
                            <h3>第{{ item.index || item.indexs }}题</h3>
                        </li>
                    </ul>
                    <div style="padding: 0 20rpx 20rpx">
                        <van-button @click="loadMore"
                                    custom-class="main-bg"
                                    type="primary"
                                    :block="true"
                                    size="large"
                                    round
                                    v-if="!learn.isAllList"
                        >加载更多</van-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {getMyWrongQuestion} from '../../../api/topic/index'
    export default {
        data() {
            return {
                status:'unLearn',
                learn:{
                    isAllList:false,
                    wrongMinId:null,
                    list:[]
                },
                unLearn:{
                    isAllList:true,
                    wrongMinId:null,
                    list:[]
                },
                indexId:-1,     //  加载更多时接口返回的上一次最后一项的id
            };
        },

        components: {

        },

        methods: {
            topicDetails(item){
                let indexs;
                if(item.hasOwnProperty('indexs')){
                     indexs = item.indexs[0]
                } else {
                    indexs = item.index
                }
                let learnStatus = this.status =='unLearn' ? 2 : 1
                wx.navigateTo({
                    url:`/pages/topic/topicError/main?wrongId=${item.wrongId}&learnStatus=${learnStatus}&indexD=${indexs}`
                });
            },
            toggleTab(key){
                //v-if渲染列表数据提示
                if(this.status == key)return;
                wx.showLoading({
                    title: "加载中",
                    mask:true
                });
                this.status = key;
                setTimeout(function () {
                    wx.hideLoading()
                }, 500)
            },
            loadMore(){
                let query = this.$root.$mp.query;
                let wrongMinId = this.status == 'unLearn' ? this.unLearn.wrongMinId : this.learn.wrongMinId;

                getMyWrongQuestion({
                    type:this.status == 'unLearn' ? 2 : 1,
                    wrongMinId:wrongMinId,
                    coursePackId: query.packageId,
                    courseId: query.courseId,
                    index:this.indexId
                }).then(r => {
                    this.indexId = r.index;
                    if(this.status == 'unLearn'){
                        this.unLearn.list.push(...r.list);
                        this.unLearn.isAllList = r.isAllList == 1 ? true : false;
                        this.unLearn.wrongMinId = r.wrongMinId
                    }
                    if(this.status == 'learn'){
                        this.learn.list.push(...r.list);
                        this.learn.isAllList = r.isAllList == 1 ? true : false;
                        this.learn.wrongMinId = r.wrongMinId
                    }

                }).catch(_ => {})
            }
        },
        computed: {},
        onShow() {
            let query = this.$root.$mp.query;

            getMyWrongQuestion({
                type:2,
                coursePackId: query.packageId,
                courseId: query.courseId,
                index:-1
            }).then(r => {
                if(this.status == 'unLearn'){
                    this.indexId = r.index
                }
                this.unLearn.list = r.list;
                this.unLearn.isAllList = r.isAllList == 1 ? true : false;
                this.unLearn.wrongMinId = r.wrongMinId

                getMyWrongQuestion({
                    type:1,
                    coursePackId: query.packageId,
                    courseId: query.courseId,
                    index:-1
                }).then(r => {
                    if(this.status == 'learn'){
                        this.indexId = r.index
                    }
                    this.learn.list = r.list;
                    this.learn.isAllList = r.isAllList == 1 ? true : false;
                    this.learn.wrongMinId = r.wrongMinId
                }).catch(_ => {})
            }).catch(_ => {})
        }
    };
</script>
<style lang="less">
    @import "./css/index.less";
</style>
