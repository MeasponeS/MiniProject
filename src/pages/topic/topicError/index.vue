<template>
    <div class="container topic-error">
        <div v-if="topic.newType">
            <TopicTop
                :index="currentIndex"
                :total="topicTotal"
                :newType="topic.newType"
                :topicList="childrenTopic"
                :doIndex="childrenTopicDo"
            ></TopicTop>
            <div>
                <DoTopic :topic="topic" :isHistory="true"></DoTopic>
                <!--isHistory是true不会触发 clickOption事件-->
            </div>
            <TopicBottom
                type="error"
                :learnState="topic.learnStatus == 1"
                :collectState="topic.favor == 0"
                :seeAnswerState="topicAnswerState"
                @clickNext="clickNext"
                @clickPrevioust="clickPrevioust"
                @clickCollect="clickCollect"
                @clickLearn="clickLearn"
                @clickAnswer="topicAnswerState = !topicAnswerState"
            ></TopicBottom>

            <TopicAnswer
                @clickClose="topicAnswerState = false"
                :topic="topic"
                v-if="topicAnswerState"
            >
            </TopicAnswer>
        </div>

    </div>
</template>


<script>
    import {userfavor} from '../../../api/common/index'
    import {getQuestionDetail,wrongQuestionLearnd} from '../../../api/topic/index.js'
    import DoTopic from "@/components/DoTopic/DoTopic.vue";
    export default {

        data() {
            return {
                directoryState:false,
                topicAnswerState:false, //查看答案
                topic: {},
                clientX:0,
                preId:0,//上一题的id
                nextId:0,//下一题的id
                topicTotal:0,//错题的总数
            };
        },
        components: {
            DoTopic
        },

        methods: {
            clickCollect(){
                let thisTopic = this.topic;
                userfavor({
                    type:1,
                    courseId:thisTopic.courseId,
                    leveId:thisTopic.levelId,
                    isVedio:1,
                    packageId:thisTopic.packageId,
                    chapterQuestionId:thisTopic.questionId
                }).then(r=>{
                    thisTopic.favor = r;
                }).catch(_=>{})
            },
            clickLearn(){
                wrongQuestionLearnd({wrongId:this.topic.wrongId}).then(r=>{
                    this.topic.learnStatus = r;
                }).catch(_=>{})
            },
            clickPrevioust(){
                if(0 == this.preId|| '0' == this.preId){
                    wx.showToast({
                        title: '已经是第一题了！',
                        icon: 'none',
                        duration: 2000
                    })
                    return;
                }
                if(this.topic.newType == '1' || this.topic.newType == '2'){
                    this.getTopic(this.preId,true)
                } else {
                    this.getTopic(this.preId - this.topic.indexs.length+1,true)
                }
            },
            clickNext(){

                if(0 == this.nextId|| '0' == this.nextId){
                    wx.showToast({
                        title: '已经是最后一题了！',
                        icon: 'none',
                        duration: 2000
                    })
                    return;
                }
                if(this.topic.newType == '1' || this.topic.newType == '2'){
                    this.getTopic(this.nextId,true)
                } else {
                    this.getTopic(this.nextId + this.topic.indexs.length-1,true)
                }

            },
            getTopic(id,flag){
                let query = this.$root.$mp.query;
                //flag 用于区分是上一题下一题还是从列表页进来 false为列表页进来
                let indexs;
                if(flag){
                    if(this.topic.newType == '3'||this.topic.newType == '4'||this.topic.newType == '5') {
                        indexs = this.topic.nowIndex + this.topic.indexs.length
                    } else {
                        indexs = this.topic.nowIndex + 1
                    }

                } else {
                    indexs = query.indexD
                }
                console.log(indexs);
                getQuestionDetail({
                    wrongId:id,
                    learnStatus:query.learnStatus,
                    index:indexs,
                }).then(r=>{
                    this.topic = r;

                    this.topicTotal = r.total;
                    this.preId= this.lodashGet(r,'prevId',0)//上一题的id
                    this.nextId= this.lodashGet(r,'nextId',0)//下一题的id

                }).catch(_=>{})
            }
        },
        onShow() {

            let query = this.$root.$mp.query;

            this.getTopic(query.wrongId);
        },
        computed: {
            currentIndex() {
                let topic = this.topic;
                if (topic.hasOwnProperty('index')) {
                    return topic.index
                }
                if (topic.hasOwnProperty('indexs')) {
                    return topic.indexs[0] + '~' + topic.indexs[topic.indexs.length - 1]
                }
                return null;
            },
            childrenTopic(){
                let arrDone = [];
                let topic = this.topic;
                if(!topic)return [];
                if(1 == topic.newType){
                    return []
                }
                let allTopic = []
                if(3 == topic.newType){
                    allTopic = topic.a3a4Questions;
                }
                if(5 == topic.newType){
                    allTopic = topic.questionArr;
                }

                allTopic.forEach(r=>{
                    arrDone.push(r.index);
                });
                return arrDone
            },
            childrenTopicDo() {
                let arrDone = [];
                //已经完成的题目
                let topic = this.topic;
                if(!topic)return [];
                if(1 == topic.newType){
                    return []
                }
                let allTopic = []
                if(3 == topic.newType){
                    allTopic = topic.a3a4Questions;
                }
                if(5 == topic.newType){
                    allTopic = topic.questionArr;
                }

                allTopic.forEach(r=>{
                    if(r.historyAnswer.length != 0){
                        arrDone.push(r.index);
                    }
                });
                return arrDone

            }
        }
    };
</script>

<style scoped lang="less">
    @import "main.less";
</style>
