import { VantComponent } from '../vant-weapp/common/component';
VantComponent({
    props: {
        // 这里定义了innerText属性，属性值可以在组件使用时指定
        newType:{
            type:Number,
            value:0,
        },
        index:{
            type:String,
            value:"0",
        },
        total:{
            type:Number,
            value:0,
        },
        topicList:{
            type:Array,
            value:[],
        },
        doIndex:{
            type:Array,
            value:[],
        }
    },
    data: {

    },

    methods: {

    }
});
