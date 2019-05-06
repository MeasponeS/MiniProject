<template>
    <div class="do-topic">
        <div class="do-topic-top">
            <div class="l">【{{ topic.questionType }}】</div>
            <div class="r">
                <template v-if="topic.newType == 5">
                    <rich-text :nodes="topic.name"></rich-text>
                    <br/> <br/>
                    <span class="question-result" v-for="a in topic.questionResult">
                        {{ a.optionName.toLowerCase() }}.
                        <rich-text :nodes="a.optionContent"></rich-text>
                    </span>
                </template>
                <template v-else>
                    <rich-text nodes="topic.name"></rich-text>
                </template>
            </div>
        </div>
        <div v-if="topic.newType == 1">
            <div class="do-topic-content has-title">
                <!--如果没有标题则不显示边框 和上边距 及背景色-->
                <div class="l"></div>
                <div class="r">
                    <DoTopicOptions
                            :correctAnswer="isHistory ? topic.answer :[]"
                            :options="topic.questionResult"
                            :type="topic.typeB"
                            :value="topic.historyAnswer"
                            :questionId="topic.questionId"
                    >
                    </DoTopicOptions>
                </div>

            </div>
        </div>
        <div
                v-if="topic.newType == 3"
                v-for="item in topic.a3a4Questions"
                class="do-topic-content"
                :id="item.index"
        >
            <!--如果没有标题则不显示边框 和上边距 及背景色-->
            <div class="l"></div>
            <div class="r">
                <div class="title">
                    {{ item.index }}.
                    <rich-text :nodes="item.name"></rich-text>
                </div>
                <DoTopicOptions
                        :correctAnswer="isHistory ? item.answer :[]"
                        :options="item.questionResult"
                        :type="topic.typeB"
                        :value="item.historyAnswer"
                        :questionId="item.questionId"
                >
                </DoTopicOptions>
            </div>
        </div>
        <div
                v-if="topic.newType == 5"
                v-for="item in topic.questionArr"
                class="do-topic-content"
                :id="item.index"
        >
            <!--如果没有标题则不显示边框 和上边距 及背景色-->
            <div class="l"></div>
            <div class="r">
                <div class="title">
                    {{ item.index }}. <rich-text :nodes="item.name"></rich-text>
                </div>
                <DoTopicOptions
                        :correctAnswer="isHistory ? item.answer : []"
                        :options='topic.questionResult'
                        :type="topic.typeB"
                        :value="item.historyAnswer"
                        :questionId="item.questionId"
                >
                </DoTopicOptions>
            </div>
        </div>
    </div>
</template>

<script>
    import VueCard from "@/components/Card/VueCard.vue";
    export default {
        name: 'DoTopic',
        props: {
            topic: Object,
            isHistory:{
                type:Boolean,
                default:false,
            }
        },
        methods: {
        },
        components: {VueCard}
    }
</script>
<style lang="less">
    .do-topic {
        .do-topic-top{
            width: 100%;
            padding: 25px 16px 25px 0;
            background: #F5F7F9;
            align-items: center;
            display: flex;
            border:1px solid #eee;
            .l{
                text-align: center;
                width: 77px;
                font-size: 14px;
                color: #2B60FF;
                border-right: 1px solid #eee;
            }
            .r{
                font-size: 18px;
                color: #222;
                margin-left: 12px;
                flex: 1;
                .question-result{
                    min-width: 50%;
                    margin: 8px 0;
                    display: inline-block;
                    font-size: 16px;
                }
            }
        }
        .do-topic-content{
            margin-top: 14px;
            padding: 30px 0;
            display: flex;
            background: #FCFCFC;
            border:1px solid #eee;
            &.has-title{
                background: none;
                margin-top: 0;
                border: none;
            }
            .l{
                width: 77px;
                border-right: 1px solid #eee;
            }
            .r{
                flex: 1;
                .title{
                    font-size: 18px;
                    color: #000;
                    padding: 0 35px 40px 12px;
                }
            }
        }

    }
</style>
