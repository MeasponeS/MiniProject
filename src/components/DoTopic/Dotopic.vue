<template>
    <div class="do-topic">
        <div class="title">
            <TopicCard
                :title="'【'+(topic.typeB == 1 ? '单选题':'多选题')+'】'+topic.name"
                :options="topic.newType == 5 ? topic.questionResult : []"
            ></TopicCard>
        </div>
        <div class="content">
            <div v-if="topic.newType == 1">
                <DoTopicOptions
                    :id="0"
                    :correctAnswer="isHistory ? topic.answer :[]"
                    :options="topic.questionResult"
                    :type="topic.typeB"
                    :value="topic.historyAnswer"
                    @clickOption="clickOption"
                ></DoTopicOptions>
            </div>
            <ul v-else-if="topic.newType == 3">
                <li v-for="(item3,i) in topic.a3a4Questions" :key="item3.questionId">
                    <div class="content-title">
                        {{item3.index}}.{{ item3.name }}
                    </div>
                    <DoTopicOptions
                        :id="i"
                        :correctAnswer="isHistory ? item3.answer :[]"
                        :options="item3.questionResult"
                        :type="item3.typeB"
                        :value="item3.historyAnswer"
                        @clickOption="clickOption"
                    ></DoTopicOptions>
                </li>
            </ul>
            <ul v-else-if="topic.newType == 5">
                <li v-for="(item5,i) in topic.questionArr" :key="item5.questionId">
                    <div class="content-title">
                        {{item5.index}}.{{ item5.name }}
                    </div>
                    <DoTopicOptions
                        :id="i"
                        :correctAnswer="isHistory ? item5.answer :[]"
                        :options="topic.questionResult"
                        :type="item5.typeB"
                        :value="item5.historyAnswer"
                        @clickOption="clickOption"
                    ></DoTopicOptions>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'DoTopic',
        props: {
            topic: Object,
            isHistory:{
                type:Boolean,
                default:false,//表示是否显示标准答案(answer)，有用户答案(historyAnswer)还是会显示
            }
        },
        methods: {
            clickOption(e){

                let option = e.mp.detail;
                let index = e.target.id;

                this.$emit('clickOption',option,index)
            }
        },
        components: {}
    }
</script>
<style lang="less">
    @import "main.less";
</style>
