import { VantComponent } from '../vant-weapp/common/component';
VantComponent({
    props: {
        // 这里定义了innerText属性，属性值可以在组件使用时指定
        options: {
            type: Array,
            value: []
        },
        value: Array,
        correctAnswer:{
            type: Array,
            value:[]
        },
        type:{
            type: Number,
            value:1//1单选,其他为多选择
        }
    },
    data: {

    },

    methods: {
        clickOption(e){
            if((this.data.correctAnswer).length != 0 ){
                return
            }
            let optionName = e.currentTarget.id;
            if (1 == this.data.type){
                //this.setData({ value: [optionName] });
                this.$emit('clickOption',[optionName]);
            }else {

                let index = (this.data.value).indexOf(optionName);
                if(index != -1){
                    this.data.value.splice(index,1);
                    //this.setData({ value: [...this.data.value].sort() });
                    this.$emit('clickOption',[...this.data.value].sort());
                }else {
                    //this.setData({ value: [optionName,...this.data.value].sort() });
                    this.$emit('clickOption',[optionName,...this.data.value].sort());
                }
            }
        }
    }
});
