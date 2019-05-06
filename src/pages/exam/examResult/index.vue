<template>
    <div class="container main">
        <div class="headerBox">
            <CircleProgress
                class="circle"
                :progress="info.rightPer"
                :type="2"
                text="分"
            ></CircleProgress>
            <div class="headerText">
                <h3>
                    {{ info.rightPer >= info.passedScore ?
                    '恭喜，你通过了本场考试！':'很遗憾，你没有通过本场考试' }}
                </h3>
                <span>正确: {{info.rightCount || 0}}</span>
                <span>错误: {{info.erroCount || 0}}</span>
                <span class="tag">本场及格线:{{ info.passedScore || 0 }}分</span>
            </div>
        </div>
        <ul class="result-list">
            <li v-for="(t,i) in list" :key="t.questionId" @click="seeHistory(i)">
                <rect-progress :progress="t.erroCount" :info="rectText"></rect-progress>
                <h3>第{{ t.index || t.indexs }}题</h3>
            </li>
        </ul>
        <div class="botBtn">
            <van-button
                custom-class="main-bg bottomBtn "
                type="primary"
                :block="true"
                @click="examList"
                size="large"
                round
            >完成</van-button>
        </div>
    </div>
</template>

<script>
    import {getEvaluationList} from '../../../api/exam/index.js'
    export default {
        data() {
            return {
                rectText:{
                    start:{text:'正确',bg:'#31B68F'},
                    end:{text:'错误',bg:'#FF6666'},
                },
                list:[],
                info:{
                    erroCount:'',
                    rightCount:'',
                    rightPer:'',
                    passedScore:'',
                    isOpenAnswer:false
                },
            };
        },

        components: {
        },

        methods: {
            seeHistory(index){
                let item = this.$root.$mp.query;

                if(!this.info.isOpenAnswer){
                    wx.showToast({
                        title: '答案未开放',
                        icon: 'none',
                        duration: 2000
                    })
                    return;
                }

                wx.navigateTo({
                    url:`/pages/exam/examHistory/main?testingId=${item.testingId}&paperId=${item.paperId}&name=${item.name}&index=${index}`
                });
            },
            examList(){
                wx.switchTab({
                    url: '/pages/exam/index/main'
                });
            }
        },
        onShow() {
            let item = this.$root.$mp.query;

            wx.setNavigationBarTitle({ title: item.name });

            getEvaluationList({
                paperId:item.paperId,
                testingId:item.testingId,
                isGetHistory:1,
            }).then(r=>{
                this.list = r.questions;

                this.info.erroCount = r.erroCount
                this.info.rightCount = r.rightCount
                this.info.rightPer = r.rightPer
                this.info.passedScore = r.passedScore
                this.info.isOpenAnswer = r.isOpenAnswer == 1 ? true : false
                this.list.forEach(t=>{
                    if(t.hasOwnProperty('indexs')){
                        t.indexs = t.indexs[0]+ '~'+t.indexs[t.indexs.length-1]
                    }
                })
            }).catch(_=>{})
        }
    };
</script>

