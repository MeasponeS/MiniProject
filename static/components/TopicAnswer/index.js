import { VantComponent } from '../vant-weapp/common/component';
VantComponent({
    props: {
        topic:{
            type:Object,
            value:{},
            observer(newVal, oldVal, changedPath) {
                // 属性被改变时执行的函数（可选），通常 newVal 就是新设置的数据， oldVal 是旧数
                // 新版本基础库不推荐使用这个字段，而是使用 Component 构造器的 observer 字段代替（这样会有更强的功能和更好的性能）
                if(newVal.questionId != oldVal.questionId) {
                    this.setData({ activeIndex: 0 });
                }
            }
        },

    },
    data: {
        activeIndex:0
    },
    methods: {
        clickClose(){

            this.$emit('clickClose')
        },
        clickIndex(e){
            this.setData({activeIndex:parseInt(e.currentTarget.id) || 0})
        }
    }
});
