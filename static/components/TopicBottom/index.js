import { VantComponent } from '../vant-weapp/common/component';
VantComponent({
    props: {
        type:{
            type:String, //exam考试、examResult考试结果、error错题集、topic习题集、course课程详情页
            value:"",
        },
        collectState:{
            type:Boolean,
            value:false,
        },
        learnState:{
            type:Boolean,
            value:false,
        },
        directoryState:{
            type:Boolean,
            value:false,
        },
        seeAnswerState:{
            type:Boolean,
            value:false,
        },
        examTime:{
            type:Number,
            value:0,
        }
    },
    data: {

    },

    methods: {
        clickNext(){
            this.$emit('clickNext');
        },
        clickPrevioust(){
            this.$emit('clickPrevioust');
        },
        clickSubmitExam(){
            this.$emit('clickSubmitExam');
        },
        clickDirectory(){
            this.$emit('clickDirectory');
        },
        clickLearn(){
            this.$emit('clickLearn');
        },
        clickAnswer(){
            this.$emit('clickAnswer');
        },
        clickCollect(){
            this.$emit('clickCollect');
        }
    }
});
