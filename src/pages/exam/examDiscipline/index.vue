<template>
    <div class="container">
        <div class="main">
            <div class="content-item">
                <p class="title">考场纪律</p>
                <p>1.考试期间请保持安静，将手机调至静音，不得大声喧哗，不得交头接耳；</p>
                <p>2.不得携带考题，答案以及任何形式的小抄；</p>
                <p>3.不得使用手机上网查阅资料、答案等；</p>
            </div>
            <div class="content-item">
                <p class="title">注意事项</p>
                <p>1.点击下方开始考试按钮，系统即开始倒计时（点击后即开始计时，退出再登录不重新计时，请等待监考老师发出开始考试指令后点击开始）；</p>
                <p>3.请严格按照格式输入姓名、考场号、医院、科室等信息；</p>
                <p>4.考场号由医院统一提供，如忘记考场号，请联系监考老师咨询；</p>
                <p>5.请注意考试时间，超过考试时间将会自动交卷；</p>
                <p>6.考试期间，如因操作不当导致退出（退出到登录页），可重新进入，继续答题；</p>
                <p>7.答题完成后，请务必点击上方“交卷”完成考试，否则成绩将无法统计；</p>
                <p>8.如遇网络不稳定，点击“交卷”异常时，再次“交卷”即可；</p>
            </div>
            <div class="content-item">
                <p class="title">考试相关信息</p>
                <p>1.考试时间在屏幕下方显示；</p>
                <p>2.点击右上角数字，可查看当前做题进度；</p>
            </div>
        </div>
        <div class="start-exam-btn">
            <van-button @click="startExam" custom-class="main-bg" type="primary" :block="true" size="large">开始考试</van-button>
        </div>
    </div>
</template>

<script>
    import {getExam} from '../../../api/exam/index.js'
    export default {
        data() {
            return {

            };
        },

        components: {
        },

        methods: {
            startExam(){
                let item = this.$root.$mp.query;

                getExam({testingId:item.testingId}).then(r=>{

                    wx.setStorageSync('examInfo', {
                        testingId:item.testingId,
                        paperId:item.paperId,
                        testingName:r.hospitalPaper.paperName ,
                        paperSum:r.hospitalPaper.paperSum,
                        utpId:r.id,
                        timeLength:parseInt(r.hospitalPaper.timeLength) * 60,
                    });

                    wx.navigateTo({ url:"/pages/exam/examDetails/main" });
                }).catch(_=>{})
            }
        },
        mounted() {
            // 调用应用实例的方法获取全局数据
            //this.getUserInfo()


        }
    };
</script>

<style lang="less" >
    .main{
        padding: 20rpx 20rpx 140rpx 20rpx;
        .content-item {
            margin-top: 30rpx;
            p {
                color: #333;
                font-size: 32rpx;
                margin-top: 32rpx;
                line-height: 1.5;
            }
            .title {
                font-size: 36rpx;
                font-weight: 700;
                line-height: 1;
            }
        }
    }
    .start-exam-btn{
        padding: 20rpx 20rpx 30rpx 20rpx;
        background: #F3F5F7;
        width: 100%;
        position: fixed;
        bottom: 0;
    }
</style>
