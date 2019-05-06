/*
* progress 当前圆环百分比
* text     圆环百分比描述标题(圆环内)
* */
import { VantComponent } from '../vant-weapp/common/component';
VantComponent({
    props: {
        progress:{
            type:String,
            value:0
        },
        text:{
            type:String,
            value:''
        },
        type:{
            type:Number,
            value:1
        }
    },
    data: {

    },
    methods: {}
});
