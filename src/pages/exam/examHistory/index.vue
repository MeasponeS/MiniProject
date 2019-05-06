<template>
    <div class="container exam-details" @touchstart="touchStart"  @touchend="touchEnd">
        <div v-if="topicList.length != 0 && topicList[activeIndex]">
            <TopicTop
                :index="currentIndex"
                :total="topicTotal"
                :newType="topicList[activeIndex].newType"
                :topicList="childrenTopic"
                :doIndex="childrenTopicDo"
            ></TopicTop>
            <div>
                <DoTopic
                    :topic="topicList[activeIndex]"
                    @clickOption="clickOption"
                    :isHistory="true"
                ></DoTopic>
            </div>
            <TopicBottom
                type="examResult"
                :directoryState="directoryState"
                :seeAnswerState="topicAnswerState"
                @clickNext="clickNext"
                @clickDirectory="topicAnswerState=false,directoryState = !directoryState"
                @clickPrevioust="clickPrevioust"
                @clickAnswer="directoryState= false,topicAnswerState = !topicAnswerState"
            ></TopicBottom>

            <TopicDirectory
                :activeIndex="activeIndex"
                :topics="topicList"
                @clickClose="directoryState = false"
                @clickItem="clickItem"
                v-if="directoryState"
            ></TopicDirectory>
            <TopicAnswer
                @clickClose="topicAnswerState = false"
                :topic="topicList[activeIndex]"
                v-if="topicAnswerState"
            >
            </TopicAnswer>
        </div>
    </div>
</template>


<script>
    import {getEvaluationList} from '../../../api/exam/index.js'
    import DoTopic from "@/components/DoTopic/DoTopic.vue";
    import DoTopicMixin from '../../../utils/DoTopicMixin'

    export default {
        mixins: [DoTopicMixin],
        data() {
            return {
                topicAnswerState:false,
                directoryState:false,
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

        },
        onShow() {

            let item = this.$root.$mp.query;

            this.topicAnswerState = false;
            this.directoryState = false;

            wx.setNavigationBarTitle({ title: item.name });

            getEvaluationList({
                paperId:item.paperId,
                testingId:item.testingId,
                isGetHistory:1,
            }).then(info=>{

                this.topicList = info.questions;

                if(item.hasOwnProperty('index')){

                   this.activeIndex = item.index || 0;

                }

            }).catch(_=>{})
        }
    };
</script>

<style scoped lang="less">
    @import "main.less";
</style>
