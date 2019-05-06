<template>
    <div class="container exam-details" @touchstart="touchStart"  @touchend="touchEnd">
        <div v-if="topicList.length != 0 && topicList[activeIndex]">
            <TopicTop :index="activeIndex + 1" :total="topicList.length" :newType="topicList[activeIndex].newType" :topicList="childrenTopic" :doIndex="childrenTopicDo"></TopicTop>
            <div>
                <DoTopic :topic="topicList[activeIndex]" @clickOption="clickOption"></DoTopic>
            </div>
            <TopicBottom
                type="exam"
                :directoryState="directoryState"
                :examTime="examTime"
                @clickNext="clickNext"
                @clickDirectory="directoryState = !directoryState"
                @clickPrevioust="clickPrevioust"
                @clickSubmitExam="clickSubmitExam"
            ></TopicBottom>

            <TopicDirectory
                :activeIndex="activeIndex"
                :topics="topicList"
                @clickClose="directoryState = false"
                @clickItem="clickItem"
                v-if="directoryState"
            ></TopicDirectory>
        </div>
    </div>
</template>


<script>
    import {getEvaluationList,commitEvaluationAnswer} from '../../../api/exam/index.js'
    import DoTopic from "@/components/DoTopic/DoTopic.vue";
    import DoTopicMixin from '../../../utils/DoTopicMixin'
    export default {
        mixins: [DoTopicMixin],
        data() {
            return {
                examInfo:{},
                directoryState:false,
                examTime:0
            };
        },
        components: {
            DoTopic
        },
        computed: {


        },
        methods: {


            clickItem(info){
                this.activeIndex = parseInt(info.mp.detail) || 0;
                this.directoryState = false
            },
            clickSubmitExam(){
                let self = this;
                wx.showModal({
                    title: '提示',
                    content: "确认提交答案？",
                    showCancel: true,
                    confirmColor: '#4D86F8',
                    success(res) {
                        if (res.confirm) {
                            self.submitAnswer();
                        }

                    }
                })
            },
            submitAnswer(){
                let topics = this.topicList;
                let answer = {
                    testingId:parseInt(this.examInfo.testingId),
                    paperId:parseInt(this.examInfo.paperId),
                    utpId:parseInt(this.examInfo.utpId),
                    takeTime: this.examTime,
                    answers: {}
                };
                topics.forEach(r=>{
                    if(1 == r.newType){
                        answer.answers[r.questionId] = r.historyAnswer.join('');
                        return;
                    }
                    if(3 == r.newType){
                        r.a3a4Questions.forEach(q=>{
                            answer.answers[q.questionId] = q.historyAnswer.join('');
                            return;
                        })
                        return;
                    }

                    if(5 == r.newType){
                        r.questionArr.forEach(q=>{
                            answer.answers[q.questionId] = q.historyAnswer.join('');
                            return;
                        })
                        return;
                    }
                })
                commitEvaluationAnswer(answer).then(r=>{

                    wx.showToast({
                        title: '试卷提交成功！',
                        icon: 'none',
                        duration: 2000
                    })
                    setTimeout(_=>{
                        wx.switchTab({
                            url: '/pages/exam/index/main'
                        })
                    },1000);

                }).catch(_=>{})
            },
            initCountDown(examTime){
                let self = this;
                this.examTime = examTime;

                let countDownInterval = setInterval(() => {
                    if(examTime <= 0) {
                        clearInterval(countDownInterval)
                        wx.showModal({
                            title: '提示',
                            content: "考试已结束，确认提交答案？否则本次考试成绩作废！",
                            showCancel: true,
                            confirmColor: '#4D86F8',
                            success(res) {
                                if (res.confirm) {
                                    self.submitAnswer();
                                }else {
                                    wx.switchTab({
                                        url: '/pages/exam/index/main'
                                    })
                                }
                            }
                        })
                        return;
                    }
                    this.examTime --;
                }, 1000)

            },
        },
        mounted() {

            this.examInfo = wx.getStorageSync('examInfo');

            wx.setNavigationBarTitle({ title: this.examInfo.testingName });

            this.initCountDown(this.examInfo.timeLength);
            // let examTopic = wx.getStorageSync('examTopic');
            //
            // this.topicList = examTopic.questions
            getEvaluationList({
                paperId:this.examInfo.paperId,
                testingId:this.examInfo.testingId,
                isGetHistory:-1,
            }).then(info=>{

                this.topicList = info.questions;
            }).catch(_=>{})
        }
    };
</script>

<style scoped lang="less">
    @import "main.less";
</style>
