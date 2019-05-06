<template>
    <div class="container main">
        <div class="headerBox">
            <CircleProgress
                class="circle"
                :progress="55.55"
                text="全网通过率"
            ></CircleProgress>
            <div class="headerText">
                <h3>{{ isPass == 1 ? '恭喜你，通关成功':'很遗憾，你没有通过本关卡' }}</h3>
                <!--恭喜你，通关成功-->
                <span>正确: {{ trueNum }}</span>
                <span>错误: {{ errNum }}</span>
            </div>
        </div>
        <ul>
            <li v-for="item in topicList" :key="item.questionId" @click="seeAnswer(item)">
                <!--<span class="">正 确</span>-->
                <rect-progress :progress="item.errCount" :info="rectProgressValue"></rect-progress>
                <h3>第{{ item.index || item.indexs }}题</h3>
            </li>
        </ul>
        <div class="botBtn">
            <van-button
                custom-class="main-bg bottomBtn "
                type="primary"
                :block="true"
                size="large"
                round
                @click="againSubmit"
            >再次挑战</van-button>
        </div>

    </div>
</template>

<script>
    import {getLevelDetail} from '../../../api/topic/index.js'
    export default {
        data() {
            return {
                rectProgressValue:{
                    start:{text:'正确',bg:'#31B68F'},
                    end:{text:'错误',bg:'#FF6666'},
                },
                topicList:[],
                errNum:0,//错误题包括做错的和未做的
                trueNum:0,
                isPass:0,//是否通过
                passRate:0//通过率
            };
        },

        components: {

        },

        methods: {
            againSubmit(){
                let query = this.$root.$mp.query;
                //一定不可使用navigateTo，否则点击再答一次返回就会出现多个结果页面
                wx.redirectTo({url:`/pages/topic/topicDetails/main?packageId=${query.packageId}&courseId=${query.courseId}&levelId=${query.levelId}&displayUserAnswer=0`});
            },
            seeAnswer(item){
                let query = this.$root.$mp.query;

                wx.navigateTo({
                    url:`/pages/topic/topicDetails/main?packageId=${query.packageId}&courseId=${query.courseId}&levelId=${query.levelId}&displayUserAnswer=1&questionId=${item.questionId}`
                });
            }
        },
        onShow() {
            let query = this.$root.$mp.query;

            getLevelDetail({
                packageId:query.packageId,
                courseId:query.courseId,
                levelId:query.levelId,
                isHistory:1,
            }).then(r=>{
                wx.setNavigationBarTitle({ title: this.lodashGet(r,'levelName',"习题结果页")});
                this.topicList = this.lodashGet(r,'questions',[]);
                this.errNum = parseInt(this.lodashGet(r,'errNum',0)) + parseInt(this.lodashGet(r,'noNum',0));
                this.trueNum = this.lodashGet(r,'trueNum',0);

                this.isPass = this.lodashGet(r,'isPass',0);
                this.passRate = this.lodashGet(r,'passRate',0);
                this.topicList.forEach(t=>{
                    if(t.hasOwnProperty('indexs')){
                        t.indexs = t.indexs[0]+ '~'+t.indexs[t.indexs.length-1]
                    }
                })
            }).catch(_=>{})

        }
    };
</script>

