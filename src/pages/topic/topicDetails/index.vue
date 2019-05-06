<template>
    <div class="container topic-details" @touchstart="touchStart"  @touchend="touchEnd">
        <div v-if="topicList.length != 0 && topicList[activeIndex]">
            <TopicTop
                :index="currentIndex"
                :total="topicTotal"
                :newType="topicList[activeIndex].newType"
                :topicList="childrenTopic"
                :doIndex="childrenTopicDo"
            ></TopicTop>
            <div>
                <DoTopic :topic="topicList[activeIndex]" :isHistory="isHistory" @clickOption="clickOption"></DoTopic>
            </div>
            <TopicBottom
                type="topic"
                :directoryState="directoryState"
                :collectState="topicList[activeIndex].favor == 0"
                :seeAnswerState="topicAnswerState"
                @clickNext="clickNext"
                @clickDirectory="topicAnswerState=false,directoryState = !directoryState"
                @clickPrevioust="clickPrevioust"
                @clickCollect="clickCollect"
                @clickAnswer="directoryState= false,topicAnswerState = !topicAnswerState"
            ></TopicBottom>
            <TopicDirectory
                :activeIndex="activeIndex"
                :topics="topicList"
                @clickClose="directoryState = false"
                @clickItem="clickDirectoryItem"
                v-if="directoryState"
            ></TopicDirectory>
            <TopicAnswer
                @clickClose="topicAnswerState = false"
                :topic="topicList[activeIndex]"
                v-if="topicAnswerState"
            >
            </TopicAnswer>
        </div>
        <div class="commit-btn" @click="submitAnswerBefore" v-if="!isHistory">
            提交
        </div>
    </div>
</template>


<script>
    import {getLevelDetail,commitQuestionAnswer} from '../../../api/topic/index.js'
    import {userfavor} from '../../../api/common/index'

    import DoTopic from "@/components/DoTopic/DoTopic.vue";
    import DoTopicMixin from '../../../utils/DoTopicMixin'
    export default {
        mixins: [DoTopicMixin],
        data() {
            return {
                takeTime:0,
                directoryState:false,
                topicAnswerState:false, //查看答案
                isHistory:false,//表示是否显示标准答案(answer)，有用户答案(historyAnswer)还是会显示
            };
        },
        components: {
            DoTopic
        },

        methods: {
            clickDirectoryItem(info){
                this.activeIndex = parseInt(info.mp.detail) || 0;
                this.directoryState = false
            },
            submitAnswerBefore(){
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
                });
            },
            submitAnswer(){
                let topics = this.topicList;
                let query = this.$root.$mp.query;

                let answer = {
                    "levelId": query.levelId,
                    "takeTime": this.takeTime,
                    "coursePackId": query.packageId,
                    "courseId":query.courseId,
                    "answers": {}
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
                commitQuestionAnswer(answer).then(r=>{

                    wx.showToast({
                        title: '习题提交成功！',
                        icon: 'none',
                        duration: 2000
                    });
                    wx.redirectTo({url:`/pages/topic/topicResults/main?packageId=${query.packageId}&courseId=${query.courseId}&levelId=${query.levelId}`});
                }).catch(_=>{})

            },
            clickCollect(){

                let thisTopic = this.topicList[this.activeIndex];
                let query = this.$root.$mp.query;
                userfavor({
                    type:1,
                    courseId:query.courseId,
                    leveId:query.levelId,
                    isVedio:1,
                    packageId:query.packageId,
                    chapterQuestionId:thisTopic.questionId
                }).then(r=>{
                    thisTopic.favor = r;
                }).catch(_=>{})
            }
        },
        onShow() {

            this.activeIndex = 0;
            this.takeTime=0;


            this.directoryState=false;
            this.topicAnswerState=false;
            this.isHistory=false;


            let query = this.$root.$mp.query;

            if(query.hasOwnProperty('displayUserAnswer') && query.displayUserAnswer == 1){
                this.isHistory = true;
            }else {
                this.isHistory = false;
            }

            getLevelDetail({
                packageId:query.packageId,
                courseId:query.courseId,
                levelId:query.levelId,
                isHistory:1,
            }).then(r=>{
                if(this.isHistory){
                    this.topicList = r.questions;
                }else {
                    this.topicList = this.clearAllAnswer(r.questions);
                }
                wx.setNavigationBarTitle({ title: r.levelName});


                if(query.hasOwnProperty('questionId')){
                    this.topicList.forEach((r,i)=>{
                        if(r.questionId == query.questionId){
                            this.activeIndex = i;
                        }
                    })
                }
            }).catch(_=>{})


            setInterval(_=>{
                this.takeTime += 5;
            },5000);



        }
    };
</script>

<style scoped lang="less">
    @import "main.less";
</style>
